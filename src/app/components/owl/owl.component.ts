import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Partner {
  src: string;
  nameAr: string;
  nameEn: string;
}

@Component({
  selector: 'app-owl',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owl.component.html',
  styleUrls: ['./owl.component.css'],
})
export class OwlComponent {
  currentLang: 'ar' | 'en' = (localStorage.getItem('lang') as 'ar' | 'en') || 'ar';
  get dir(): 'rtl' | 'ltr' { return this.currentLang === 'ar' ? 'rtl' : 'ltr'; }

  partners: Partner[] = [
    { src: 'assets/images/Ahli.svg',   nameAr: 'البنك الأهلي السعودي',                    nameEn: 'SNB - Saudi National Bank' },
    { src: 'assets/images/infath.svg', nameAr: 'مركز الإسناد والتصفية (إنفاذ)',          nameEn: 'Enfath Center' },
    { src: 'assets/images/MIM.svg',    nameAr: 'وزارة الصناعة والثروة المعدنية',          nameEn: 'Ministry of Industry & Mineral Resources' },
    { src: 'assets/images/Modon.svg',  nameAr: 'مدن',                                     nameEn: 'MODON' },
    { src: 'assets/images/Moj.svg',    nameAr: 'وزارة العدل',                              nameEn: 'Ministry of Justice' },
    { src: 'assets/images/rajhi.svg',  nameAr: 'مصرف الراجحي',                             nameEn: 'Al Rajhi Bank' },
    { src: 'assets/images/Sah.svg',    nameAr: 'SAH',                                      nameEn: 'SAH' },       // ← update if needed
    { src: 'assets/images/Tasfia.svg', nameAr: 'تصفية',                                    nameEn: 'Tasfiah' },  // ← update if needed
  ];

  trackByIdx(i: number) { return i; }
}
