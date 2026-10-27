using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Osos.Api;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true);
builder.Services.AddDbContext<SiteDb>(o => o.UseSqlServer(builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Set ConnectionStrings__Default for SQL Server.")));
builder.Services.AddSingleton<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(o =>
{
    o.Cookie.Name = "Osos.Admin";
    o.Cookie.HttpOnly = true;
    o.Cookie.SameSite = SameSiteMode.Strict;
    o.Cookie.SecurePolicy = builder.Environment.IsDevelopment() ? CookieSecurePolicy.SameAsRequest : CookieSecurePolicy.Always;
    o.ExpireTimeSpan = TimeSpan.FromHours(4);
    o.SlidingExpiration = true;
    o.Events.OnRedirectToLogin = c => { c.Response.StatusCode = 401; return Task.CompletedTask; };
    o.Events.OnRedirectToAccessDenied = c => { c.Response.StatusCode = 403; return Task.CompletedTask; };
});
builder.Services.AddAuthorization(o => o.AddPolicy("Admin", p => p.RequireRole("Admin")));
builder.Services.AddAntiforgery(o => o.HeaderName = "X-XSRF-TOKEN");
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = 429;
    o.AddPolicy("login", c => RateLimitPartition.GetFixedWindowLimiter(c.Connection.RemoteIpAddress?.ToString() ?? "local",
        _ => new FixedWindowRateLimiterOptions { PermitLimit = 8, Window = TimeSpan.FromMinutes(5), QueueLimit = 0 }));
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(o => o.MultipartBodyLengthLimit = 21 * 1024 * 1024);
builder.Services.AddProblemDetails();
var app = builder.Build();
app.UseExceptionHandler();

// Only the dedicated application database is initialized; no existing tables are deleted.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<SiteDb>();
    await db.Database.EnsureCreatedAsync();
    if (!await db.Content.AnyAsync()) { db.Content.Add(new SiteContent()); await db.SaveChangesAsync(); }
    if (args.Contains("--init-admin"))
    {
        if (await db.Admins.AnyAsync()) { Console.WriteLine("Administrator already exists; no credentials changed."); return; }
        var username = "admin";
        var password = Convert.ToBase64String(RandomNumberGenerator.GetBytes(24));
        var user = new AdminUser { Username = username };
        user.PasswordHash = scope.ServiceProvider.GetRequiredService<IPasswordHasher<AdminUser>>().HashPassword(user, password);
        db.Admins.Add(user);
        await db.SaveChangesAsync();
        Directory.CreateDirectory(".local");
        await File.WriteAllTextAsync(".local/admin-access.txt", $"Username: {username}\nPassword: {password}\nAdmin URL: http://127.0.0.1:4300/#/admin\n");
        Console.WriteLine("Administrator created. Credentials saved to .local/admin-access.txt (git-ignored).");
        return;
    }
    if (args.Contains("--seed-projects"))
    {
        if (!await db.Projects.AnyAsync())
        {
            var json = await File.ReadAllTextAsync("seed-projects.json");
            var projects = JsonSerializer.Deserialize<List<Project>>(json, new JsonSerializerOptions(JsonSerializerDefaults.Web))!;
            foreach (var p in projects) p.Id = 0;
            db.Projects.AddRange(projects);
            await db.SaveChangesAsync();
        }
        Console.WriteLine("Project seed complete (existing records preserved).");
        return;
    }
}

app.Use(async (c, next) =>
{
    c.Response.Headers["X-Content-Type-Options"] = "nosniff";
    if (c.Request.Path.StartsWithSegments("/api/admin") || c.Request.Path.StartsWithSegments("/api/auth"))
        c.Response.Headers.CacheControl = "no-store";
    await next();
});
Directory.CreateDirectory(Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads"));
app.UseStaticFiles(new StaticFileOptions {
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads")),
    RequestPath = "/uploads"
});
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (c, next) =>
{
    if (c.Request.Path.StartsWithSegments("/api") && !HttpMethods.IsGet(c.Request.Method) && !HttpMethods.IsHead(c.Request.Method))
    {
        try { await c.RequestServices.GetRequiredService<IAntiforgery>().ValidateRequestAsync(c); }
        catch (AntiforgeryValidationException) { c.Response.StatusCode = 400; await c.Response.WriteAsJsonAsync(new { message = "انتهت صلاحية جلسة الحماية. أعد تحميل الصفحة." }); return; }
    }
    await next();
});
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));
app.MapGet("/api/auth/csrf", (HttpContext c, IAntiforgery csrf) =>
{
    var tokens = csrf.GetAndStoreTokens(c);
    c.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
    { HttpOnly = false, SameSite = SameSiteMode.Strict, Secure = c.Request.IsHttps, Path = "/" });
    return Results.NoContent();
});
app.MapPost("/api/auth/login", async (LoginRequest request, SiteDb db, IPasswordHasher<AdminUser> hasher, HttpContext c) =>
{
    if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrEmpty(request.Password) || request.Password.Length > 256) return Results.Unauthorized();
    var user = await db.Admins.SingleOrDefaultAsync(x => x.Username == request.Username);
    if (user == null || hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) == PasswordVerificationResult.Failed)
        return Results.Unauthorized();
    var identity = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), new Claim(ClaimTypes.Name, user.Username), new Claim(ClaimTypes.Role, "Admin")], CookieAuthenticationDefaults.AuthenticationScheme);
    await c.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
    return Results.Ok(new { username = user.Username });
}).RequireRateLimiting("login");
app.MapGet("/api/auth/me", (HttpContext c) => Results.Ok(new { username = c.User.Identity!.Name })).RequireAuthorization("Admin");
app.MapPost("/api/auth/logout", async (HttpContext c) => { await c.SignOutAsync(); return Results.NoContent(); }).RequireAuthorization("Admin");
app.MapGet("/api/public/auctions", async (SiteDb db) => await db.Auctions.AsNoTracking().Where(x => x.Published).OrderByDescending(x => x.Start).ToListAsync());
app.MapGet("/api/public/projects", async (SiteDb db) => await db.Projects.AsNoTracking().Where(x => x.Published).OrderBy(x => x.SortOrder).ThenBy(x => x.Id).ToListAsync());
app.MapGet("/api/public/content", async (SiteDb db) => ContentResponse(await db.Content.AsNoTracking().SingleAsync()));

var admin = app.MapGroup("/api/admin").RequireAuthorization("Admin");
admin.MapGet("/auctions", async (SiteDb db) => await db.Auctions.AsNoTracking().OrderByDescending(x => x.Id).ToListAsync());
admin.MapGet("/auctions/{id:int}", async (int id, SiteDb db) => await db.Auctions.AsNoTracking().SingleOrDefaultAsync(x => x.Id == id) is { } value ? Results.Ok(value) : Results.NotFound());
admin.MapGet("/projects", async (SiteDb db) => await db.Projects.AsNoTracking().OrderBy(x => x.SortOrder).ThenBy(x => x.Id).ToListAsync());
admin.MapPost("/auctions", async (Auction value, SiteDb db) =>
{
    var error = ValidateAuction(value); if (error != null) return Results.BadRequest(new { message = error });
    value.Id = 0; value.Version = 1; db.Auctions.Add(value); await db.SaveChangesAsync(); return Results.Ok(value);
});
admin.MapPut("/auctions/{id:int}", async (int id, Auction value, SiteDb db) =>
{
    var error = ValidateAuction(value); if (error != null) return Results.BadRequest(new { message = error });
    var existing = await db.Auctions.FindAsync(id); if (existing == null) return Results.NotFound();
    if (existing.Version != value.Version) return Conflict();
    value.Id = id; value.Version++; db.Entry(existing).CurrentValues.SetValues(value);
    return await Save(db, value);
});
admin.MapDelete("/auctions/{id:int}", async (int id, int version, SiteDb db) =>
{
    var value = await db.Auctions.FindAsync(id); if (value == null) return Results.NotFound();
    if (value.Version != version) return Conflict(); db.Auctions.Remove(value); return await Save(db, new { deleted = true });
});
admin.MapPost("/projects", async (Project value, SiteDb db) =>
{
    var error = ValidateProject(value); if (error != null) return Results.BadRequest(new { message = error });
    value.Id = 0; value.Version = 1; db.Projects.Add(value); await db.SaveChangesAsync(); return Results.Ok(value);
});
admin.MapPut("/projects/{id:int}", async (int id, Project value, SiteDb db) =>
{
    var error = ValidateProject(value); if (error != null) return Results.BadRequest(new { message = error });
    var existing = await db.Projects.FindAsync(id); if (existing == null) return Results.NotFound();
    if (existing.Version != value.Version) return Conflict();
    value.Id = id; value.Version++; db.Entry(existing).CurrentValues.SetValues(value); return await Save(db, value);
});
admin.MapDelete("/projects/{id:int}", async (int id, int version, SiteDb db) =>
{
    var value = await db.Projects.FindAsync(id); if (value == null) return Results.NotFound();
    if (value.Version != version) return Conflict(); db.Projects.Remove(value); return await Save(db, new { deleted = true });
});
admin.MapPut("/content", async (ContentRequest request, SiteDb db) =>
{
    if (request.Values == null || request.Values.Count > 6000 || request.Values.Any(x => string.IsNullOrWhiteSpace(x.Key) || x.Key.Length > 350 || x.Value == null || x.Value.Length > 16000))
        return Results.BadRequest(new { message = "المحتوى أكبر من الحد المسموح أو غير صالح." });
    foreach (var pair in request.Values.Where(x => x.Key.Contains(".image.")))
        if (!SafeUrl(pair.Value)) return Results.BadRequest(new { message = "رابط الصورة غير صالح." });
    var content = await db.Content.SingleAsync(); if (request.Version != content.Version) return Conflict();
    content.ValuesJson = JsonSerializer.Serialize(request.Values); content.Version++;
    return await Save(db, ContentResponse(content));
});
admin.MapPost("/uploads", async (HttpRequest request, IWebHostEnvironment env) =>
{
    if (!request.HasFormContentType) return Results.BadRequest(new { message = "اختر ملفًا." });
    var form = await request.ReadFormAsync(); var file = form.Files.GetFile("file");
    if (file == null || file.Length < 8 || file.Length > 20 * 1024 * 1024) return Results.BadRequest(new { message = "حجم الملف يجب ألا يتجاوز 20 ميجابايت." });
    using var stream = file.OpenReadStream(); var header = new byte[12]; var count = await stream.ReadAsync(header);
    string? extension = count >= 8 && header.AsSpan(0, 8).SequenceEqual(new byte[] {137,80,78,71,13,10,26,10}) ? ".png"
        : header[0] == 255 && header[1] == 216 && header[2] == 255 ? ".jpg"
        : count >= 12 && System.Text.Encoding.ASCII.GetString(header, 0, 4) == "RIFF" && System.Text.Encoding.ASCII.GetString(header, 8, 4) == "WEBP" ? ".webp"
        : System.Text.Encoding.ASCII.GetString(header, 0, 5) == "%PDF-" ? ".pdf" : null;
    if (extension == null) return Results.BadRequest(new { message = "الأنواع المسموحة: JPG، PNG، WEBP، PDF." });
    var name = Guid.NewGuid().ToString("N") + extension;
    await using var output = File.Create(Path.Combine(env.ContentRootPath, "wwwroot", "uploads", name));
    await output.WriteAsync(header.AsMemory(0, count)); await stream.CopyToAsync(output);
    return Results.Ok(new { url = "/uploads/" + name });
});
app.Run();

static object ContentResponse(SiteContent value) => new { version = value.Version, values = JsonSerializer.Deserialize<Dictionary<string, string>>(value.ValuesJson) };
static IResult Conflict() => Results.Conflict(new { message = "تم تعديل البيانات في جلسة أخرى. أعد تحميلها قبل الحفظ." });
static async Task<IResult> Save<T>(SiteDb db, T value)
{ try { await db.SaveChangesAsync(); return Results.Ok(value); } catch (DbUpdateConcurrencyException) { return Conflict(); } }
static bool SafeUrl(string? value) => string.IsNullOrEmpty(value) ||
    (!value.Contains('\\') && !value.Contains("..") && (value.StartsWith("/uploads/") || value.StartsWith("/assets/") || value.StartsWith("images/"))) ||
    (Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme == "https" && string.IsNullOrEmpty(uri.UserInfo));
static string? ValidateObject(object value)
{
    var errors = new List<ValidationResult>();
    return Validator.TryValidateObject(value, new ValidationContext(value), errors, true) ? null : "أكمل الحقول المطلوبة وتأكد من طول النصوص.";
}
static string? ValidateAuction(Auction x) => ValidateObject(x) ??
    (string.IsNullOrWhiteSpace(x.Name) || x.End <= x.Start || x.Start.Year < 2000 || x.OpeningPrice < 0 || x.OpeningPrice > 9999999999999999m ? "راجع اسم المزاد والتواريخ والسعر؛ النهاية يجب أن تكون بعد البداية." :
    !SafeUrl(x.ImagePath) || !SafeUrl(x.PdfPath) || !SafeUrl(x.Url) ? "استخدم رابط HTTPS أو ملفًا مرفوعًا." : null);
static string? ValidateProject(Project x) => ValidateObject(x) ??
    (string.IsNullOrWhiteSpace(x.TitleAr) || string.IsNullOrWhiteSpace(x.TitleEn) ? "اكتب عنوان المشروع بالعربية والإنجليزية." : !SafeUrl(x.Image) || !SafeUrl(x.PdfUrl) ? "استخدم رابط HTTPS أو ملفًا مرفوعًا." : null);
