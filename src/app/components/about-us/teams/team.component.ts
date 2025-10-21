import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type Lang = 'ar' | 'en';

interface Experience {
  whenAr: string; whenEn: string;
  titleAr: string; titleEn: string;
  orgAr?: string; orgEn?: string;
  descAr?: string; descEn?: string;
}

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
})
export class TeamComponent implements OnInit {
  currentLang: Lang = 'ar';

  /** ====== Profile (from CV) ====== */
  profile = {
    nameAr: 'سلطان جباره الحربي',
    nameEn: 'Sultan J. Alharbi',
    roleAr: 'مستشار ومقيم ومطور عقاري',
    roleEn: 'Real Estate Consultant, Valuer & Developer',
    locationAr: 'المملكة العربية السعودية',
    locationEn: 'Saudi Arabia',
    email: 'sultan_jj@hotmail.com',
    phone: '+966546600001',
    photoUrl:
      'assets/owner.jpeg',
    cvUrl: 'assets/Sultan-Alharbi-cv.pdf',
    /** Summary / نبذة */
    bioAr:
      'ضابط متقاعد برتبة عميد لمدة ٣٤ سنة، ومستشار ومقيم ومطور عقاري معتمد بخبرة تزيد عن ٢٠ سنة. عمل على تنفيذ مشاريع سكنية وتجارية، ويتمتع بمهارات قوية في تحليل السوق واختيار الأصول وإدارة عمليات البناء والتنسيق مع الجهات ذات العلاقة. هدفه تطوير مشاريع مبتكرة وجذابة تلبي احتياجات السوق وتحقق عوائد مستدامة.',
    bioEn:
      'Retired Brigadier (34 years). Certified real-estate valuer, consultant and developer with 20+ years in residential and commercial delivery. Strong in market analysis, asset selection, build/operations coordination and stakeholder management. Focused on innovative, sustainable projects with solid returns.',
  };

  /** Quick stats */
  stats = [
    { value: '20+', labelAr: 'سنوات خبرة عقارية', labelEn: 'Years in Real Estate' },
    { value: '34', labelAr: 'سنوات خدمة عسكرية', labelEn: 'Years of Military Service' },
    { value: '4+', labelAr: 'رخص واعتمادات', labelEn: 'Licenses & Accreditations' },
    { value: 'متعددة', labelAr: 'عضويات ومناصب', labelEn: 'Boards & Roles' },
  ];

  /** Licenses & certifications */
  licenses = [
    { ar: 'عضو زميل في هيئة التقييم (تقييم)', en: 'Fellow Member – Saudi Authority for Accredited Valuers (Taqeem)' },
    { ar: 'رخصة مقيم عقاري معتمد', en: 'Licensed Real-Estate Valuer' },
    { ar: 'رخصة «فال» – مستشار وتحليلات عقارية', en: '“VAL” License – Real-Estate Consulting & Analytics' },
    { ar: 'مدير اتحاد الملاك وإدارة المرافق', en: 'Owners’ Association / Facilities Management' },
  ];

  /** Skills / مجالات الخبرة */
  skills = [
    { icon: 'fa-solid fa-scale-balanced', ar: 'التقييم العقاري', en: 'Valuation' },
    { icon: 'fa-solid fa-building',       ar: 'التطوير العقاري', en: 'Development' },
    { icon: 'fa-solid fa-chart-line',     ar: 'تحليلات السوق',   en: 'Market Analytics' },
    { icon: 'fa-solid fa-file-contract',  ar: 'إدارة العقود',    en: 'Contract Mgmt' },
    { icon: 'fa-solid fa-diagram-project',ar: 'إدارة المشاريع',  en: 'Project Mgmt' },
    { icon: 'fa-solid fa-gavel',          ar: 'المزادات',        en: 'Auctions' },
    { icon: 'fa-solid fa-coins',          ar: 'التمويل العقاري', en: 'Real-Estate Finance' },
    { icon: 'fa-solid fa-shield-halved',  ar: 'إدارة المخاطر',   en: 'Risk Mgmt' },
    { icon: 'fa-solid fa-people-roof',    ar: 'اتحاد الملاك',     en: 'Owners’ Associations' },
    { icon: 'fa-solid fa-pen-ruler',      ar: 'دراسات الجدوى',    en: 'Feasibility Studies' },
  ];

  /** Experience & roles (timeline) */
  milestones: Experience[] = [
    {
      whenAr: 'حالياً', whenEn: 'Present',
      titleAr: 'مدير شركة أسس الريادة للخدمات العقارية',
      titleEn: 'Director – Osos Al-Riyada Real-Estate Services',
      descAr: 'إدارة العمليات وتقديم الاستشارات والتقييم والتطوير.',
      descEn: 'Leads operations across advisory, valuation and development.',
    },
    {
      whenAr: 'حالياً', whenEn: 'Present',
      titleAr: 'مدير شركة مفتاح الحلول للتقييم العقاري',
      titleEn: 'Director – Miftah Al-Hulul Valuation',
      descAr: 'إدارة أعمال التقييم والحوكمة المهنية.',
      descEn: 'Managing valuation practice and professional governance.',
    },
    {
      whenAr: 'سابقاً', whenEn: 'Formerly',
      titleAr: 'نائب رئيس شركة الماجد للاستثمارات العقارية (جدة)',
      titleEn: 'Vice President – Al-Majid Real-Estate Investments (Jeddah)',
      descAr: 'الإشراف على الاستثمارات والعقود والمشاريع.',
      descEn: 'Oversaw investments, contracts and projects.',
    },
    {
      whenAr: 'سابقاً', whenEn: 'Formerly',
      titleAr: 'عضو مجلس إدارة شركة الغرب للاستثمار العقاري (جدة)',
      titleEn: 'Board Member – Al-Gharb Real-Estate Investment (Jeddah)',
      descAr: 'حوكمة واستراتيجيات نمو.',
      descEn: 'Governance and growth strategy.',
    },
    {
      whenAr: 'سابقاً', whenEn: 'Formerly',
      titleAr: 'الرئيس التنفيذي لنادي تبوك لذوي الاحتياجات الخاصة',
      titleEn: 'CEO – Tabuk Club for Persons with Disabilities',
      descAr: 'قيادة تنفيذية ومبادرات مجتمعية.',
      descEn: 'Executive leadership and community initiatives.',
    },
    {
      whenAr: 'عضويات', whenEn: 'Memberships',
      titleAr:
        'نائب لجنة تراحم بمنطقة تبوك • عضو مجلس/لجان استشارية (تراحم تبوك، المجلس الاستشاري لذوي الإعاقة، حفظ النعَم)',
      titleEn:
        'Deputy of “Tarahum” (Tabuk) • Committee/Council memberships (Tarahem Tabuk, Disability Advisory Council, Hafz Al-Ni’am)',
      descAr: 'مساهمات مهنية ومجتمعية.',
      descEn: 'Professional and community contributions.',
    },
  ];

  /** Education */
  education = [
    { ar: 'بكالوريوس العلوم العسكرية', en: 'BSc – Military Sciences' },
    { ar: 'ماجستير العلوم العسكرية',   en: 'MSc – Military Sciences' },
  ];

  /** Socials (same as your site) */
  socials = [
    { key: 'tiktok',   icon: 'fab fa-tiktok',         href: 'https://www.tiktok.com/@ussryadah',    label: 'TikTok' },
    { key: 'snapchat', icon: 'fab fa-snapchat-ghost', href: 'https://t.snapchat.com/BQCcG0Tc',      label: 'Snapchat' },
    { key: 'x',        icon: 'fab fa-x-twitter',      href: 'https://x.com/ussryadahco',            label: 'X' },
    { key: 'instagram',icon: 'fab fa-instagram',      href: 'https://www.instagram.com/usselryadah',label: 'Instagram' },
  ];

  constructor(private router: Router) {}
  ngOnInit(): void {
    const saved = localStorage.getItem('lang');
    this.currentLang = saved === 'en' ? 'en' : 'ar';
  }

  get displayName(): string {
    return this.currentLang === 'ar' ? this.profile.nameAr : this.profile.nameEn;
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
