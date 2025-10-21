import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type LangPair = { ar: string; en: string };

interface City extends LangPair { value: string; }
interface TypeOpt extends LangPair { value: string; }

interface Feature {
  icon: string;
  titleAr: string; titleEn: string;
  descAr: string;  descEn: string;
}

interface Step {
  titleAr: string; titleEn: string;
  descAr: string;  descEn: string;
}

interface FAQ {
  qAr: string; qEn: string;
  aAr: string; aEn: string;
}

interface PropertyCard {
  id: number;
  titleAr: string; titleEn: string;
  cityAr: string; cityEn: string;
  image: string;
  price: number;
  period?: 'month' | 'year';
  periodAr?: string; periodEn?: string;
  area: number;
  beds?: number;
  baths?: number;
  type: 'residential' | 'commercial';
  badgeAr: string; badgeEn: string;
}

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatProgressBarModule],
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent {
  currentLang: 'ar' | 'en' = (localStorage.getItem('lang') as 'ar' | 'en') || 'ar';
  showComingSoon = false; // set to true if you want the old card

  constructor(private router: Router) {}

  get dir(): 'rtl' | 'ltr' {
    return this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // ===== Filters =====
  cities: City[] = [
    { value: 'makkah', ar: 'مكة المكرمة', en: 'Makkah' },
    { value: 'jeddah', ar: 'جدة', en: 'Jeddah' },
    { value: 'riyadh', ar: 'الرياض', en: 'Riyadh' }
  ];

  types: TypeOpt[] = [
    { value: 'residential', ar: 'سكني', en: 'Residential' },
    { value: 'commercial',  ar: 'تجاري', en: 'Commercial' }
  ];

  filters = {
    city: 'all',
    type: 'all',
    budget: 'all' // "min-max" | "min+" | "all"
  };

  properties: PropertyCard[] = [
    {
      id: 1,
      titleAr: 'شقة فاخرة مطلة على الحرم', titleEn: 'Luxury Apartment near Haram',
      cityAr: 'مكة المكرمة', cityEn: 'Makkah',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop',
      price: 8500, period: 'month', periodAr: 'شهري', periodEn: 'month',
      area: 145, beds: 3, baths: 3,
      type: 'residential',
      badgeAr: 'للإيجار', badgeEn: 'For Rent'
    },
    {
      id: 2,
      titleAr: 'معرض تجاري على طريق رئيسي', titleEn: 'Showroom on Main Road',
      cityAr: 'جدة', cityEn: 'Jeddah',
      image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?q=80&w=1600&auto=format&fit=crop',
      price: 250000, period: 'year', periodAr: 'سنوي', periodEn: 'year',
      area: 380,
      type: 'commercial',
      badgeAr: 'للإيجار السنوي', badgeEn: 'Annual Lease'
    },
    {
      id: 3,
      titleAr: 'فيلا حديثة مع حديقة', titleEn: 'Modern Villa with Garden',
      cityAr: 'الرياض', cityEn: 'Riyadh',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1600&auto=format&fit=crop',
      price: 1850000,
      area: 420, beds: 5, baths: 5,
      type: 'residential',
      badgeAr: 'للبيع', badgeEn: 'For Sale'
    }
  ];

  displayed: PropertyCard[] = [...this.properties];

  private matchesBudget(price: number): boolean {
    const b = this.filters.budget;
    if (b === 'all') return true;
    if (b.endsWith('+')) {
      const min = Number(b.replace('+', ''));
      return price >= min;
    }
    const [min, max] = b.split('-').map(Number);
    return price >= min && price <= max;
  }

  applyFilters() {
    this.displayed = this.properties.filter(p => {
      const cityOk = this.filters.city === 'all'
        || p.cityEn.toLowerCase() === this.filters.city
        || p.cityAr === this.cities.find(c => c.value === this.filters.city)?.ar;

      const typeOk = this.filters.type === 'all' || p.type === this.filters.type;

      const budgetOk = this.matchesBudget(p.price);

      return cityOk && typeOk && budgetOk;
    });
  }

  resetFilters() {
    this.filters = { city: 'all', type: 'all', budget: 'all' };
    this.displayed = [...this.properties];
  }

  trackById(_: number, item: { id: number }) { return item.id; }
  trackByIdx(index: number) { return index; }

  // ===== Features / Steps / FAQs =====
  features: Feature[] = [
    {
      icon: 'photo_camera',
      titleAr: 'تصوير وتسويق احترافي', titleEn: 'Pro Photography & Ads',
      descAr: 'جلسة تصوير احترافية، مخطط أرضي، وجولة افتراضية مع حملات إعلانية مدفوعة مستهدفة.',
      descEn: 'Professional photos, floorplans, and virtual tours with tightly targeted paid campaigns.'
    },
    {
      icon: 'support_agent',
      titleAr: 'إدارة الاستفسارات', titleEn: 'Lead Management',
      descAr: 'نُدير الاتصالات والمواعيد والاستفسارات لضمان تجربة سلسة للعميل.',
      descEn: 'We handle calls, viewings, and Q&A to keep the experience smooth and stress-free.'
    },
    {
      icon: 'gavel',
      titleAr: 'تفاوض وصياغة العقود', titleEn: 'Negotiation & Contracts',
      descAr: 'نقود التفاوض ونساعد في صياغة العقود بما يضمن حقوق الطرفين.',
      descEn: 'We lead negotiations and assist with paperwork to protect both parties.'
    }
  ];

  steps: Step[] = [
    {
      titleAr: 'تقييم سريع', titleEn: 'Quick Assessment',
      descAr: 'نراجع العقار ونحدّد السعر أو الإيجار الأنسب وفق السوق.',
      descEn: 'We review the property and set an optimal price or rent based on market data.'
    },
    {
      titleAr: 'خطة تسويق', titleEn: 'Marketing Plan',
      descAr: 'ننطلق بخطة تصوير وإعلانات مدفوعة مع صفحة عرض احترافية.',
      descEn: 'Launch a photography + paid ads plan with a polished landing page.'
    },
    {
      titleAr: 'عروض ومعاينات', titleEn: 'Showings & Offers',
      descAr: 'تنسيق المواعيد واستقبال العروض والرد على الاستفسارات.',
      descEn: 'Coordinate viewings, manage offers, and respond to inquiries.'
    },
    {
      titleAr: 'إتمام التعاقد', titleEn: 'Close the Deal',
      descAr: 'نساعد في التفاوض والاتفاق حتى التوقيع ونقل المسؤوليات.',
      descEn: 'Assist through negotiation and contract signing to handover.'
    }
  ];

  faqs: FAQ[] = [
    {
      qAr: 'كم يستغرق تسويق العقار عادة؟',
      qEn: 'How long does marketing usually take?',
      aAr: 'يعتمد على نوع العقار والموقع؛ غالباً من 2 إلى 8 أسابيع.',
      aEn: 'Depends on type and location; typically 2–8 weeks.'
    },
    {
      qAr: 'هل تقدمون تصويرًا احترافيًا؟',
      qEn: 'Do you include professional photography?',
      aAr: 'نعم، ويشمل لقطات داخلية وخارجية وقد نوفّر جولات افتراضية.',
      aEn: 'Yes—interior/exterior shots and virtual tours when suitable.'
    },
    {
      qAr: 'كيف يتم تحديد الإيجار أو سعر البيع؟',
      qEn: 'How do you set rent/sale price?',
      aAr: 'وفق بيانات السوق ومقارنات مبيعات/إيجارات مماثلة.',
      aEn: 'Using market data and comparable sales/rents.'
    }
  ];
}
