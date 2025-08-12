import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FilterOption {
  label: string;
  value: string;
}

interface Property {
  badge?: string;
  image: string;
  title: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  price: string;
  type?: string;
  city?: string;
}

interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

@Component({
  selector: 'app-leasing',
  imports: [MatIconModule, CommonModule, FormsModule, MatProgressBarModule],
  templateUrl: './leasing.component.html',
  styleUrl: './leasing.component.css',
})
export class LeasingComponent {
  currentLang: string = localStorage.getItem('lang') || 'ar';
  constructor(private router: Router) {}
  hero = {
    title: 'حلول تأجير العقارات الممتازة',
    subtitle: 'نسهل عملية تأجير العقارات بمنصتنا المتكاملة وإدارتنا الاحترافية',
    image: 'assets/leasing-hero.jpg',
    ctaPrimary: 'عرض الوحدات المتاحة',
    ctaSecondary: 'تسجيل عقار للتأجير',
  };

  propertyTypes = [
    { label: 'الكل', value: '' },
    { label: 'شقق', value: 'apartment' },
    { label: 'فلل', value: 'villa' },
    { label: 'مكاتب', value: 'office' },
    { label: 'محلات تجارية', value: 'shop' },
  ];

  cities = [
    { label: 'الرياض', value: 'riyadh' },
    { label: 'جدة', value: 'jeddah' },
    { label: 'الدمام', value: 'dammam' },
    { label: 'مكة المكرمة', value: 'mecca' },
  ];

  features: Feature[] = [
    {
      icon: 'home_work',
      title: 'إدارة كاملة',
      description:
        'نقدم خدمة إدارة كاملة تشمل إيجار المستأجرين، تحصيل الإيجار، والصيانة الدورية',
    },
    {
      icon: 'verified_user',
      title: 'مستأجرون موثوقون',
      description:
        'نخضع المستأجرين لفحوصات دقيقة لضمان الجدية والالتزام المالي',
    },
    {
      icon: 'payments',
      title: 'تحصيل آمن',
      description: 'نظام تحصيل آمن ومباشر للإيجار مع تقارير شهرية مفصلة',
    },
    {
      icon: 'support_agent',
      title: 'دعم مستمر',
      description:
        'فريق دعم متاح على مدار الساعة لمعالجة أي استفسارات أو مشاكل',
    },
    {
      icon: 'schedule',
      title: 'إجراءات سريعة',
      description: 'نسهل إجراءات التأجير بأقل وقت وجهد لضمان رضا العملاء',
    },
    {
      icon: 'security',
      title: 'حماية قانونية',
      description: 'نوفر عقود إيجار قانونية تحمي حقوق المؤجر والمستأجر',
    },
    {
      icon: 'trending_up',
      title: 'تسعير تنافسي',
      description: 'نساعدك في تحديد أسعار إيجار مناسبة حسب سوق العقارات',
    },
    {
      icon: 'location_city',
      title: 'تغطية شاملة',
      description: 'نغطي أهم المدن والمناطق لتلبية احتياجاتك العقارية',
    },
  ];

  selectedPropertyType: string = '';
  selectedCity: string = '';

  allProperties: Property[] = [
    {
      type: 'apartment',
      city: 'riyadh',
      badge: 'متوفر الآن',
      image: 'assets/apartment-1.jpg',
      title: 'شقة فاخرة - حي السفارات الرياض',
      bedrooms: 3,
      bathrooms: 2,
      size: 180,
      price: '25,000 ر.س/شهر',
    },
    {
      type: 'villa',
      city: 'jeddah',
      image: 'assets/villa-1.jpg',
      title: 'فيلا راقية - حي الياسمين جدة',
      bedrooms: 5,
      bathrooms: 3,
      size: 350,
      price: '45,000 ر.س/شهر',
    },
    {
      type: 'office',
      city: 'dammam',
      badge: 'جديد',
      image: 'assets/office-1.jpg',
      title: 'مكتب تجاري - حي الأعمال الدمام',
      bedrooms: 2,
      bathrooms: 1,
      size: 120,
      price: '18,000 ر.س/شهر',
    },
    {
      type: 'shop',
      city: 'mecca',
      image: 'assets/shop-1.jpg',
      title: 'محل تجاري - شارع التحلية مكة',
      bedrooms: 0,
      bathrooms: 1,
      size: 80,
      price: '12,000 ر.س/شهر',
    },
  ];

  // هنا نحتفظ بالخصائص المعروضة بعد الفلترة
  properties: Property[] = [...this.allProperties];

  // خطوات عملية التأجير
  processSteps: ProcessStep[] = [
    {
      number: 1,
      title: 'تسجيل العقار',
      description: 'قم بتسجيل عقارك عبر المنصة أو عن طريق زيارة أحد مكاتبنا',
    },
    {
      number: 2,
      title: 'التقييم والتسعير',
      description: 'يقوم خبراؤنا بتقييم العقار وتحديد سعر إيجار مناسب للسوق',
    },
    {
      number: 3,
      title: 'العرض والتسويق',
      description:
        'نقوم بتسويق العقار عبر منصاتنا وشركائنا لإيجاد المستأجر المناسب',
    },
    {
      number: 4,
      title: 'التأجير والإدارة',
      description: 'ننهي الإجراءات القانونية ونبدأ بإدارة العقار نيابة عنك',
    },
  ];

  // بيانات زر النداء للعمل CTA
  cta = {
    title: 'هل ترغب في تأجير عقارك؟',
    description:
      'سجل معنا الآن واستفد من خدماتنا الاحترافية لإدارة وتأجير عقارك',
    button: 'تسجيل عقار جديد',
  };

  // دالة فلترة الخصائص بناءً على الفلاتر المحددة
  searchProperties() {
    this.properties = this.allProperties.filter((property) => {
      const matchesType = this.selectedPropertyType
        ? property.type === this.selectedPropertyType
        : true;
      const matchesCity = this.selectedCity
        ? property.city === this.selectedCity
        : true;
      return matchesType && matchesCity;
    });
  }

  // دالة لعرض تفاصيل العقار (مثال بسيط)
  viewPropertyDetails(property: Property) {
    console.log('عرض تفاصيل العقار:', property);
    alert(`عرض تفاصيل العقار: ${property.title}`);
  }

  // دالة تسجيل عقار جديد (مثال بسيط)
  registerProperty() {
    console.log('تسجيل عقار جديد');
    alert('سيتم توجيهك إلى صفحة تسجيل العقار');
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
