import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SiteContentService } from '../services/site-content.service';
import { AdminApi, apiError } from '../services/admin-api.service';

@Component({
  selector:'app-live-editor', standalone:true, imports:[CommonModule, FormsModule],
  template:`@if(cms.editing()) {
    <aside class="live-toolbar" dir="rtl" aria-label="أدوات تعديل الموقع">
      <strong>تعديل الموقع مباشرة</strong><span>{{cms.dirty ? 'تغييرات غير محفوظة' : 'كل التغييرات محفوظة'}}</span>
      <button (click)="cms.selecting.set(!cms.selecting()); syncMode()">{{cms.selecting() ? 'تصفح الروابط' : 'اختيار نص أو صورة'}}</button>
      <button class="save" (click)="save()" [disabled]="busy || !cms.dirty">{{busy ? 'جارٍ الحفظ…' : 'حفظ ونشر'}}</button>
      <button (click)="leave()" [disabled]="busy">إنهاء التعديل</button>
      <small>الزائر يرى النسخة المحفوظة فقط. اختر «تصفح الروابط» للانتقال بين الصفحات.</small>
      <p role="status">{{message}}</p>
    </aside>
    @if(selectedKey) {
      <aside class="live-panel" dir="rtl" aria-label="تعديل العنصر المحدد">
        <button class="close" (click)="selectedKey=''" aria-label="إغلاق محرر العنصر">×</button>
        <h2>{{isImage ? 'تغيير الصورة' : 'تعديل النص'}}</h2>
        <p>التغيير يظهر في المعاينة فقط حتى تضغط «حفظ ونشر».</p>
        <label for="live-value">{{isImage ? 'رابط الصورة' : 'النص'}}</label>
        <textarea id="live-value" [ngModel]="value" (ngModelChange)="update($event)" [rows]="isImage ? 3 : 7"></textarea>
        @if(isImage) { <label class="upload">رفع صورة<input type="file" accept="image/png,image/jpeg,image/webp" (change)="upload($event)" [disabled]="busy" /></label> }
        <button (click)="reset()">استعادة المحتوى الأصلي لهذا العنصر</button>
        <button (click)="cancelElement()">إلغاء تعديل هذا العنصر</button>
      </aside>
    }
  }`,
  styleUrl:'./live-editor.component.css'
})
export class LiveEditorComponent implements OnDestroy {
  cms = inject(SiteContentService); private api = inject(AdminApi); private router = inject(Router);
  selectedKey=''; value=''; initialValue: string | undefined; isImage=false; busy=false; message='';
  private click = (event: MouseEvent) => {
    if (!this.cms.editing() || !this.cms.selecting()) return;
    const target = event.target as HTMLElement;
    if (target.closest('app-live-editor')) return;
    const element = target.closest<HTMLElement>('[data-cms-key]');
    if (!element) return;
    event.preventDefault(); event.stopImmediatePropagation();
    this.selectedKey = this.cms.key(element.dataset['cmsKey']!);
    this.initialValue = this.cms.draft()[this.selectedKey];
    this.value = this.initialValue ?? this.cms.defaults.get(this.selectedKey) ?? element.textContent ?? '';
    this.isImage = element.tagName === 'IMG';
  };
  constructor() { document.addEventListener('click',this.click,true); }
  syncMode() { document.body.classList.toggle('cms-selecting',this.cms.editing() && this.cms.selecting()); }
  update(value:string) { this.value=value; this.cms.update(this.selectedKey,value); }
  reset() { this.cms.reset(this.selectedKey); this.value=this.cms.defaults.get(this.selectedKey) ?? ''; }
  cancelElement() { if(this.initialValue === undefined) this.cms.reset(this.selectedKey); else this.cms.update(this.selectedKey,this.initialValue); this.selectedKey=''; }
  async upload(event:Event) {
    const input=event.target as HTMLInputElement; const file=input.files?.[0]; if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)) { this.message='اختر صورة PNG أو JPG أو WEBP.'; return; }
    this.busy=true;
    try { this.update((await this.api.upload(file)).url); } catch(error){this.message=apiError(error);} finally{this.busy=false;input.value='';}
  }
  async save() { this.busy=true;this.message=''; try { await this.cms.save();this.message='تم حفظ ونشر المحتوى.'; } catch(error){this.message=apiError(error);} finally{this.busy=false;} }
  leave() {
    if(this.cms.dirty && !confirm('لديك تعديلات غير محفوظة. هل تريد تجاهلها والخروج؟'))return;
    this.cms.discard();this.selectedKey='';this.syncMode();this.router.navigateByUrl('/admin');
  }
  @HostListener('window:beforeunload',['$event']) beforeUnload(event:BeforeUnloadEvent){if(this.cms.editing() && this.cms.dirty){event.preventDefault();event.returnValue='';}}
  ngOnDestroy(){document.removeEventListener('click',this.click,true);document.body.classList.remove('cms-selecting');}
}
