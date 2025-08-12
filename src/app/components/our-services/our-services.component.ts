import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { Router, RouterModule } from '@angular/router';
register();

interface ServiceLink {
  link: string;
  labelAr: string;
  labelEn: string;
}
interface Service {
  serviceNameAr: string;
  serviceNameEn: string;
  typeAr: string;
  typeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  icon: string;
}

@Component({
  selector: 'app-our-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './our-services.component.html',
  styleUrl: './our-services.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OurServicesComponent {
  currentLang: string = localStorage.getItem('lang') || 'ar';
  expandedCardIndex: number | null = null;
  constructor(private router: Router) {}

  // Swiper breakpoints configuration
  breakpoints = {
    '0': { slidesPerView: 1 },
    '576': { slidesPerView: 2 },
    '768': { slidesPerView: 3 },
    '992': { slidesPerView: 3 },
    '1200': { slidesPerView: 4 },
  };

  // Service data
  services: Service[] = [
    {
      serviceNameAr: 'الوساطة العقارية',
      serviceNameEn: 'Real Estate Brokerage',
      icon: 'https://i.pinimg.com/1200x/d4/49/e3/d449e39da7d9fce3f41e9d14ca90fc13.jpg',
      typeAr: 'خدمات البيع والشراء',
      typeEn: 'Buying & Selling Services',
      descriptionAr:
        'تسهيل عمليات البيع والشراء بين البائعين والمشترين وضمان أفضل الصفقات.',
      descriptionEn:
        'Facilitating buying and selling processes between sellers and buyers, ensuring the best deals.',
      image: '',
    },
    {
      serviceNameAr: 'التسويق العقاري',
      serviceNameEn: 'Real Estate Marketing',
      icon: 'https://i.pinimg.com/736x/5d/0e/64/5d0e64640b791594fe4cb580d2e6fbe2.jpg',
      typeAr: 'الترويج والإعلان',
      typeEn: 'Promotion & Advertising',
      descriptionAr:
        'الترويج للعقارات عبر قنوات تسويقية فعالة للوصول إلى أكبر عدد من العملاء.',
      descriptionEn:
        'Promoting properties through effective marketing channels to reach a larger audience.',
      image: '',
    },
    {
      serviceNameAr: 'التطوير العقاري',
      serviceNameEn: 'Real Estate Development',
      icon: 'https://i.pinimg.com/736x/0e/58/bd/0e58bd8dcd318a87b597b8b89e49eb8b.jpg',
      typeAr: 'البناء والتخطيط',
      typeEn: 'Construction & Planning',
      descriptionAr:
        'تطوير المشاريع العقارية من التخطيط وحتى التنفيذ وفق أعلى المعايير.',
      descriptionEn:
        'Developing real estate projects from planning to execution following top standards.',
      image: '',
    },
    {
      serviceNameAr: 'التمليك والتأجير',
      serviceNameEn: 'Ownership & Leasing',
      icon: 'https://i.pinimg.com/1200x/7b/d6/6b/7bd66bc5dc6aeac07d094dae87497acc.jpg',
      typeAr: 'التأجير والتمليك',
      typeEn: 'Leasing & Ownership',
      descriptionAr:
        'توفير حلول مرنة للتأجير أو التمليك بما يناسب احتياجات العملاء.',
      descriptionEn:
        'Providing flexible solutions for leasing or owning properties tailored to client needs.',
      image: '',
    },
    {
      serviceNameAr: 'إدارة الأملاك',
      serviceNameEn: 'Property Management',
      icon: 'https://i.pinimg.com/236x/42/51/f6/4251f6b86c9be7c19d48d03641cfd998.jpg',
      typeAr: 'إدارة العقارات',
      typeEn: 'Real Estate Management',
      descriptionAr:
        'إدارة وصيانة العقارات لضمان استدامتها وزيادة قيمتها السوقية.',
      descriptionEn:
        'Managing and maintaining properties to ensure sustainability and increase market value.',
      image: '',
    },
    {
      serviceNameAr: 'المزادات العقارية',
      serviceNameEn: 'Real Estate Auctions',
      icon: 'https://i.pinimg.com/1200x/9d/bf/7b/9dbf7bca39ea1fab669bf082e3e4076a.jpg',
      typeAr: 'بيع بالمزاد',
      typeEn: 'Auction Sales',
      descriptionAr: 'تنظيم وإدارة المزادات العقارية لتحقيق أفضل أسعار السوق.',
      descriptionEn:
        'Organizing and managing real estate auctions to achieve the best market prices.',
      image: '',
    },
  ];

  // Service navigation links
  serviceLinks: ServiceLink[] = [
    {
      link: '/development',
      labelAr: 'التطوير العقاري',
      labelEn: 'Development',
    },
    { link: '/brokerage', labelAr: 'الوساطة العقارية', labelEn: 'Brokerage' },
    { link: '/mangement', labelAr: 'إدارة الأملاك', labelEn: 'Management' },
    { link: '/leasing', labelAr: 'التمليك والتأجير', labelEn: 'Leasing' },
    { link: '/markting', labelAr: 'التسويق العقاري', labelEn: 'Marketing' },
  ];

  // Check if link is active
  onSlideChange(event: any): void {
    this.expandedCardIndex = null;
  }

  navigateToService(service: Service): void {
    console.log('Navigating to:', service);
  }

  isActiveLink(link: string): boolean {
    return window.location.pathname === link;
  }
  toggleCardExpand(index: number): void {
    if (this.expandedCardIndex === index) {
      this.expandedCardIndex = null;
    } else {
      this.expandedCardIndex = index;
    }
  }
}
