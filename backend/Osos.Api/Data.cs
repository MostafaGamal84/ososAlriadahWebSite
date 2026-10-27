using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Osos.Api;

public sealed class SiteDb(DbContextOptions<SiteDb> options) : DbContext(options)
{
    public DbSet<AdminUser> Admins => Set<AdminUser>();
    public DbSet<Auction> Auctions => Set<Auction>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<SiteContent> Content => Set<SiteContent>();
    protected override void OnModelCreating(ModelBuilder model)
    {
        model.Entity<AdminUser>().HasIndex(x => x.Username).IsUnique();
        model.Entity<Auction>().Property(x => x.OpeningPrice).HasPrecision(18, 2);
        model.Entity<Auction>().Property(x => x.Version).IsConcurrencyToken();
        model.Entity<Project>().Property(x => x.Version).IsConcurrencyToken();
        model.Entity<SiteContent>().Property(x => x.Version).IsConcurrencyToken();
    }
}
public sealed class AdminUser
{
    public int Id { get; set; }
    [MaxLength(120)] public string Username { get; set; } = "";
    public string PasswordHash { get; set; } = "";
}
public sealed class Auction
{
    public int Id { get; set; }
    [Required, MaxLength(240)] public string Name { get; set; } = "";
    [MaxLength(240)] public string NameEn { get; set; } = "";
    [MaxLength(12000)] public string Content { get; set; } = "";
    [MaxLength(12000)] public string ContentEn { get; set; } = "";
    public DateTimeOffset Start { get; set; }
    public DateTimeOffset End { get; set; }
    [MaxLength(1000)] public string ImagePath { get; set; } = "";
    [MaxLength(1000)] public string PdfPath { get; set; } = "";
    [MaxLength(1000)] public string Url { get; set; } = "";
    public decimal OpeningPrice { get; set; }
    [MaxLength(200)] public string AgentName { get; set; } = "";
    [MaxLength(200)] public string City { get; set; } = "";
    [MaxLength(200)] public string District { get; set; } = "";
    public bool Published { get; set; } = true;
    public int Version { get; set; } = 1;
}
public sealed class Project
{
    public int Id { get; set; }
    [Required, MaxLength(240)] public string TitleAr { get; set; } = "";
    [Required, MaxLength(240)] public string TitleEn { get; set; } = "";
    [MaxLength(12000)] public string DescAr { get; set; } = "";
    [MaxLength(12000)] public string DescEn { get; set; } = "";
    [MaxLength(1000)] public string Image { get; set; } = "";
    [MaxLength(1000)] public string PdfUrl { get; set; } = "";
    public bool Published { get; set; } = true;
    public bool Featured { get; set; }
    public int SortOrder { get; set; }
    public int Version { get; set; } = 1;
}
public sealed class SiteContent
{
    public int Id { get; set; }
    public string ValuesJson { get; set; } = "{}";
    public int Version { get; set; } = 1;
}
public record LoginRequest(string Username, string Password);
public record ContentRequest(int Version, Dictionary<string, string> Values);
