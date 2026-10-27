"""Local API integration checks. Creates only named test records and cleans them up."""
import base64
import http.cookiejar
import json
import pathlib
import sys
import urllib.error
import urllib.request
import uuid

root = pathlib.Path(__file__).resolve().parents[1]
base = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:5080'
credentials = dict(line.split(': ', 1) for line in (root / 'backend/Osos.Api/.local/admin-access.txt').read_text().splitlines() if ': ' in line)
cookies = http.cookiejar.CookieJar()
client = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookies))

def request(method, path, payload=None, csrf=True, raw=None, content_type=None):
    headers = {}
    if payload is not None:
        raw = json.dumps(payload).encode()
        headers['Content-Type'] = 'application/json'
    if content_type:
        headers['Content-Type'] = content_type
    if csrf:
        token = next((c.value for c in cookies if c.name == 'XSRF-TOKEN'), None)
        if token:
            headers['X-XSRF-TOKEN'] = token
    try:
        response = client.open(urllib.request.Request(base+path, data=raw, headers=headers, method=method), timeout=20)
        body = response.read()
        return response.status, json.loads(body) if body and 'application/json' in response.headers.get('Content-Type', '') else body
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode(errors='replace')

def expect(status, result, label):
    assert result[0] == status, f'{label}: expected {status}, got {result[0]}: {str(result[1])[:300]}'
    print('PASS', label)
    return result[1]

expect(401, request('GET','/api/admin/projects'), 'anonymous admin access denied')
expect(400, request('POST','/api/auth/login',{'username':'x','password':'x'},csrf=False), 'CSRF enforced')
expect(204, request('GET','/api/auth/csrf'), 'CSRF token issued')
expect(200, request('POST','/api/auth/login',{'username':credentials['Username'],'password':credentials['Password']}), 'administrator login')
expect(204, request('GET','/api/auth/csrf'), 'authenticated CSRF refreshed')
expect(200, request('GET','/api/auth/me'), 'session identity')
project = auction = None
snapshot = None
uploaded = None
try:
    item={'titleAr':'اختبار تكامل مؤقت','titleEn':'API integration test','descAr':'اختبار','descEn':'test','published':False,'image':'','pdfUrl':'','featured':True,'sortOrder':99}
    project=expect(200, request('POST','/api/admin/projects',item),'create project draft')
    public=expect(200,request('GET','/api/public/projects'),'read published projects')
    assert all(x['id']!=project['id'] for x in public), 'draft leaked to public'
    print('PASS unpublished project hidden')
    old=project.copy(); project['published']=True
    project=expect(200,request('PUT',f"/api/admin/projects/{project['id']}",project),'publish project')
    expect(409,request('PUT',f"/api/admin/projects/{project['id']}",old),'stale project save rejected')
    assert any(x['id']==project['id'] for x in request('GET','/api/public/projects')[1])
    print('PASS published project visible')
    expect(400,request('POST','/api/admin/projects',{**item,'image':'javascript:alert(1)'}),'unsafe URL rejected')
    data={'name':'اختبار مزاد مؤقت','start':'2030-01-01T10:00:00+03:00','end':'2030-01-02T10:00:00+03:00','published':False,'openingPrice':100}
    expect(400,request('POST','/api/admin/auctions',{**data,'end':data['start']}),'invalid auction dates rejected')
    auction=expect(200,request('POST','/api/admin/auctions',data),'create auction draft')
    assert all(x['id']!=auction['id'] for x in request('GET','/api/public/auctions')[1])
    auction['published']=True
    auction=expect(200,request('PUT',f"/api/admin/auctions/{auction['id']}",auction),'update auction')
    assert any(x['id']==auction['id'] for x in request('GET','/api/public/auctions')[1])
    print('PASS published auction visible')
    snapshot=expect(200,request('GET','/api/public/content'),'read content revision')
    draft={**snapshot['values'],'/:ar:integration-test.text':'مسودة تجريبية'}
    assert request('GET','/api/public/content')[1]==snapshot
    print('PASS unsaved draft not published')
    saved=expect(200,request('PUT','/api/admin/content',{'version':snapshot['version'],'values':draft}),'explicit content save')
    assert request('GET','/api/public/content')[1]['values']==draft
    expect(409,request('PUT','/api/admin/content',snapshot),'stale content save rejected')
    expect(400,request('PUT','/api/admin/content',{'version':saved['version'],'values':{'/:ar:x.image.001':'javascript:alert(1)'}}),'unsafe CMS image URL rejected')
    def upload(data,filename):
        boundary='test'+uuid.uuid4().hex
        body=(f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="{filename}"\r\nContent-Type: application/octet-stream\r\n\r\n'.encode()+data+f'\r\n--{boundary}--\r\n'.encode())
        return request('POST','/api/admin/uploads',raw=body,content_type='multipart/form-data; boundary='+boundary)
    expect(400,upload(b'<script>alert(1)</script>','fake.png'),'fake image upload rejected')
    png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')
    uploaded=expect(200,upload(png,'pixel.png'),'image upload')['url']
    assert request('GET',uploaded)[1]==png
    print('PASS uploaded image served unchanged')
finally:
    if snapshot:
        version=request('GET','/api/public/content')[1]['version']
        expect(200,request('PUT','/api/admin/content',{'version':version,'values':snapshot['values']}),'restore original content')
    if auction: expect(200,request('DELETE',f"/api/admin/auctions/{auction['id']}?version={auction['version']}"),'delete test auction')
    if project: expect(200,request('DELETE',f"/api/admin/projects/{project['id']}?version={project['version']}"),'delete test project')
    if uploaded:
        folder=(root/'backend/Osos.Api/wwwroot/uploads').resolve()
        target=(folder/pathlib.Path(uploaded).name).resolve()
        assert target.parent==folder
        target.unlink(missing_ok=True)
expect(204,request('POST','/api/auth/logout',{}),'logout')
expect(401,request('GET','/api/admin/projects'),'session invalid after logout')
print('ALL API INTEGRATION CHECKS PASSED')
