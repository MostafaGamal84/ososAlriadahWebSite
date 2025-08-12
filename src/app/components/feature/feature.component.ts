import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterComponent } from '../counter/counter.component';
import { ContactService } from '../../services/contact.service';

interface FeatureIcon {
  type: 'svg' | 'img';
  content: string;
  style?: { [key: string]: string };
}

interface Feature {
  id: number;
  // title: string;/
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  // description: string;
  icon: FeatureIcon;
  // subtitle?: string;
}

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [CounterComponent, CommonModule],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
})
export class FeatureComponent {
  constructor(public contactService: ContactService) {}
  currentLang: string = 'ar';

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.currentLang = savedLang === 'en' ? 'en' : 'ar';
  }
  features: Feature[] = [
    {
      id: 1,
      titleAr: 'سهولة البحث عن العقارات',
      titleEn: 'Easy Property Search',
      subtitleAr: 'سهولة البحث عن العقارات',
      subtitleEn: 'Easy Property Search',
      descriptionAr:
        'منصة متكاملة تتيح لك البحث عن العقارات بسهولة حسب الموقع والسعر والنوع، مع واجهة استخدام سلسة وسريعة.',
      descriptionEn:
        'An integrated platform that allows you to search for properties easily by location, price, and type, with a smooth and fast user interface.',
      icon: {
        type: 'img',
        content:
          'https://pbs.twimg.com/media/GxrmAr8WgAA-cIp?format=jpg&name=large',
      },
    },
    {
      id: 2,
      titleAr: 'تقييم العقارات بدقة',
      titleEn: 'Accurate Property Evaluation',
      subtitleAr: 'تقييم العقارات بدقة',
      subtitleEn: 'Accurate Property Evaluation',
      descriptionAr:
        'نقدم خدمات تقييم احترافية للعقارات لضمان اتخاذ قرارات استثمارية سليمة وشفافة.',
      descriptionEn:
        'We provide professional property evaluation services to ensure sound and transparent investment decisions.',
      icon: {
        type: 'img',
        content:
          'https://pbs.twimg.com/media/GwkBRWHXcAAfB-4?format=jpg&name=900x900',
      },
    },
    {
      id: 3,
      titleAr: 'دعم واستشارات عقارية',
      titleEn: 'Real Estate Support & Consulting',
      subtitleAr: 'دعم واستشارات عقارية',
      subtitleEn: 'Real Estate Support & Consulting',
      descriptionAr:
        'فريق متخصص يقدم لك الدعم والاستشارات في جميع مراحل شراء أو بيع العقار، لضمان تجربة آمنة وناجحة.',
      descriptionEn:
        'A specialized team provides you with support and consulting at all stages of buying or selling property, ensuring a safe and successful experience.',
      icon: {
        type: 'img',
        content:
          'https://pbs.twimg.com/media/GweoaxDWAAA0XQo?format=jpg&name=4096x4096',
      },
    },
    {
      id: 4,
      titleAr: 'مزادات عقارية شفافة',
      titleEn: 'Transparent Real Estate Auctions',
      subtitleAr: 'مزادات عقارية شفافة',
      subtitleEn: 'Transparent Real Estate Auctions',
      descriptionAr:
        'نقدم مزادات عقارية إلكترونية تتيح لك المنافسة على أفضل العقارات بكل شفافية وسهولة، مع ضمان حقوق جميع المشاركين ووضوح الإجراءات.',
      descriptionEn:
        'We offer online real estate auctions that allow you to compete for the best properties with full transparency and ease, ensuring the rights of all participants and clear procedures.',
      icon: {
        type: 'img',
        content:
          'https://pbs.twimg.com/media/GwkBRWHXcAAfB-4?format=jpg&name=large',
        style: {
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(17, 60, 124, 0.15)',
        },
      },
    },
  ];

  section = {
    titleAr: 'مميزات خدماتنا العقارية',
    titleEn: 'Our Real Estate Service Features',
  };

  isValidSvg(content: string): boolean {
    return content.includes('<svg') && content.includes('</svg>');
  }

  getAnimationClass(index: number): string {
    const classes = ['slide-bottom', 'slide-left', 'slide-right', 'fade-in'];
    return classes[index % classes.length];
  }
}
