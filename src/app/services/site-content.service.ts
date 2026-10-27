import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

export interface ContentSnapshot { version: number; values: Record<string,string>; }
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private http = inject(HttpClient);
  private router = inject(Router);
  published = signal<Record<string,string>>({});
  draft = signal<Record<string,string>>({});
  editing = signal(false);
  selecting = signal(true);
  version = 1;
  defaults = new Map<string,string>();
  get dirty() { return JSON.stringify(this.draft()) !== JSON.stringify(this.published()); }
  key(raw: string): string {
    const scope = raw.startsWith('header.') || raw.startsWith('footer.') ? 'shared' : this.router.url.split('?')[0].split('#')[0];
    return `${scope}:${localStorage.getItem('lang') === 'en' ? 'en' : 'ar'}:${raw}`;
  }
  value(fallback: unknown, raw: string): string {
    const key = this.key(raw), text = String(fallback ?? '');
    this.defaults.set(key, text);
    return (this.editing() ? this.draft() : this.published())[key] ?? text;
  }
  async load() { const data = await firstValueFrom(this.http.get<ContentSnapshot>('/api/public/content')); this.version = data.version; this.published.set(data.values); }
  async begin() { await this.load(); this.draft.set({...this.published()}); this.editing.set(true); this.selecting.set(true); }
  update(key: string, value: string) { this.draft.update(current => ({...current, [key]: value})); }
  reset(key: string) { this.draft.update(current => { const copy = {...current}; delete copy[key]; return copy; }); }
  discard() { this.draft.set({...this.published()}); this.editing.set(false); }
  async save() {
    const data = await firstValueFrom(this.http.put<ContentSnapshot>('/api/admin/content', {version:this.version, values:this.draft()}));
    this.version = data.version; this.published.set(data.values); this.draft.set({...data.values});
  }
}
