import { CmsTextPipe } from '../../services/cms-text.pipe';
import { HttpClient } from '@angular/common/http';
import { ProjectRecord } from '../../services/admin-api.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { AppInViewportDirective } from '../../directives/app-in-viewport.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CmsTextPipe, CommonModule, RouterLink, AppInViewportDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(public contact: ContactService, private http: HttpClient) {}
  featuredProjects: ProjectRecord[] = [];
  projectsLoading = true;
  projectsFailed = false;
  ngOnInit() {
    this.http.get<ProjectRecord[]>('/api/public/projects').subscribe({
      next: rows => { this.featuredProjects=rows.filter(p=>p.featured);this.projectsLoading=false; },
      error: () => { this.projectsFailed=true;this.projectsLoading=false; }
    });
  }
  get ar(): boolean {
    return this.contact.currentLang === 'ar';
  }
  imageUnavailable: Record<string, boolean> = {};
  imageFallback(event: Event, key: string): void {
    if (this.imageUnavailable[key]) return;
    this.imageUnavailable[key] = true;
    const image = event.target as HTMLImageElement;
    image.onerror = null;
    image.src = 'images/property-placeholder.svg';
    image.alt = this.ar
      ? 'رسم معماري توضيحي — صورة المشروع غير متاحة'
      : 'Architectural illustration — project image unavailable';
  }
  services = [
    {
      number: '01',
      icon: 'apartment',
      ar: 'التطوير العقاري',
      en: 'Real estate development',
      descriptionAr: 'نحوّل الرؤية إلى مساحات تصنع قيمة وتلبي تطلعات المستقبل.',
      descriptionEn:
        'Turning a vision into spaces that create value for the future.',
      link: '/development',
    },
    {
      number: '02',
      icon: 'handshake',
      ar: 'الوساطة العقارية',
      en: 'Real estate brokerage',
      descriptionAr: 'نصل بين الفرص وأصحابها، بخبرة بالسوق ووضوح في كل خطوة.',
      descriptionEn:
        'Connecting people with opportunities through market insight and clarity.',
      link: '/brokerage',
    },
    {
      number: '03',
      icon: 'domain',
      ar: 'إدارة الأملاك',
      en: 'Property management',
      descriptionAr:
        'عناية متكاملة بأصولك العقارية للحفاظ على قيمتها واستدامتها.',
      descriptionEn:
        'Thoughtful care for your property assets and their lasting value.',
      link: '/mangement',
    },
    {
      number: '04',
      icon: 'key',
      ar: 'التمليك والتأجير',
      en: 'Sales & leasing',
      descriptionAr: 'خيارات عقارية مدروسة تناسب احتياجاتك وتمنحك بداية جديدة.',
      descriptionEn:
        'Considered property options for your needs and your next chapter.',
      link: '/leasing',
    },
    {
      number: '05',
      icon: 'campaign',
      ar: 'التسويق العقاري',
      en: 'Property marketing',
      descriptionAr:
        'نُبرز تميّز عقارك ونوصله إلى الجمهور المناسب بأسلوب مؤثر.',
      descriptionEn:
        'Bringing your property’s unique qualities to the right audience.',
      link: '/markting',
    },
  ];
  partners = ['Moj', 'infath', 'Modon', 'MIM', 'rajhi', 'Ahli'];
  partnerNames = [
    'وزارة العدل',
    'إنفاذ',
    'مدن',
    'وزارة الصناعة والثروة المعدنية',
    'مصرف الراجحي',
    'البنك الأهلي',
  ];
}
