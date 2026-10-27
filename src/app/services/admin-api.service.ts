import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ProjectRecord {
  id: number; titleAr: string; titleEn: string; descAr: string; descEn: string;
  image: string; pdfUrl: string; published: boolean; featured: boolean; sortOrder: number; version: number;
}
export interface AuctionRecord {
  id: number; name: string; nameEn: string; content: string; contentEn: string;
  start: string; end: string; imagePath: string; pdfPath: string; url: string;
  openingPrice: number; agentName: string; city: string; district: string; published: boolean; version: number;
}
@Injectable({ providedIn: 'root' })
export class AdminApi {
  private http = inject(HttpClient);
  csrf() { return firstValueFrom(this.http.get('/api/auth/csrf')); }
  me() { return firstValueFrom(this.http.get<{ username: string }>('/api/auth/me')); }
  async login(username: string, password: string) {
    await this.csrf();
    await firstValueFrom(this.http.post('/api/auth/login', { username, password }));
    await this.csrf();
  }
  async logout() { await firstValueFrom(this.http.post('/api/auth/logout', {})); }
  list<T>(type: string) { return firstValueFrom(this.http.get<T[]>('/api/admin/' + type)); }
  save<T extends { id: number }>(type: string, value: T) {
    return firstValueFrom(value.id ? this.http.put<T>(`/api/admin/${type}/${value.id}`, value) : this.http.post<T>(`/api/admin/${type}`, value));
  }
  remove(type: string, id: number, version: number) { return firstValueFrom(this.http.delete(`/api/admin/${type}/${id}?version=${version}`)); }
  upload(file: File) { const data = new FormData(); data.append('file', file); return firstValueFrom(this.http.post<{url:string}>('/api/admin/uploads', data)); }
}
export function apiError(error: any): string {
  if (error.status === 401) return 'انتهت الجلسة أو بيانات الدخول غير صحيحة. سجّل الدخول مرة أخرى.';
  if (error.status === 429) return 'محاولات كثيرة. انتظر خمس دقائق ثم حاول مرة أخرى.';
  return error.error?.message || 'تعذّر الاتصال أو حفظ البيانات. تأكد من تشغيل API وحاول مرة أخرى.';
}
