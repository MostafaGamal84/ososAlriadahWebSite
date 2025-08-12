import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
interface VisionMissionItem {
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  imageUrl: string;
  videoUrl?: string;
  features?: {
    icon: string;
    textAr: string;
    textEn: string;
  }[];
  actionTextAr?: string;
  actionTextEn?: string;
  actionLink?: string;
}
@Component({
  selector: 'app-vision',
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css'],
  imports: [CommonModule],
})
export class VisionComponent implements OnInit {
  currentLang: string = 'ar';

  visionSections: VisionMissionItem[] = [
    {
      titleAr: 'رؤيتنا',
      titleEn: 'Our Vision',
      textAr:
        'نسعى لأن نكون الرواد في تقديم الحلول العقارية المتكاملة التي تلبي تطلعات عملائنا وتساهم في بناء مجتمعات مستدامة. نطمح إلى إعادة تعريف معايير الجودة في قطاع العقارات من خلال الابتكار والشفافية والتميز في الخدمة.',
      textEn:
        'We strive to be pioneers in providing integrated real estate solutions that meet our clients aspirations and contribute to building sustainable communities. We aim to redefine quality standards in the real estate sector through innovation, transparency, and service excellence.',
      imageUrl:
        'https://i.pinimg.com/1200x/b9/86/cd/b986cdd3b618e3c90520ec6227466f64.jpg',
      videoUrl:
        'https://i.pinimg.com/1200x/b9/86/cd/b986cdd3b618e3c90520ec6227466f64.jpg',
      features: [
        {
          icon: 'fas fa-lightbulb',
          textAr: 'الابتكار في الحلول',
          textEn: 'Innovative Solutions',
        },
        {
          icon: 'fas fa-handshake',
          textAr: 'شراكات استراتيجية',
          textEn: 'Strategic Partnerships',
        },
        {
          icon: 'fas fa-chart-line',
          textAr: 'نمو مستدام',
          textEn: 'Sustainable Growth',
        },
      ],
      actionTextAr: 'استكشف رؤيتنا',
      actionTextEn: 'Explore Our Vision',
    },
    {
      titleAr: 'رؤيتنا',
      titleEn: 'Our Vision',
      textAr:
        'نلتزم بتقديم خدمات عقارية استثنائية تعتمد على المعرفة السوقية العميقة والخبرة المتراكمة. نعمل على بناء علاقات طويلة الأمد مع عملائنا من خلال الحلول المخصصة التي تحقق أهدافهم الاستثمارية والسكنية.',
      textEn:
        'We are committed to delivering exceptional real estate services based on deep market knowledge and accumulated expertise. We work to build long-term relationships with our clients through customized solutions that achieve their investment and residential goals.',
      imageUrl:
        'https://i.pinimg.com/736x/13/9a/d7/139ad7fcd1d1e27353062d87d0b09c93.jpg',
      videoUrl: '../../../../../public/videoframe_14020.png',
      actionLink: '/contact',
      actionTextAr: 'تواصل معنا',
      actionTextEn: 'Contact Us',
    },
  ];

  ngOnInit() {
    this.currentLang = localStorage.getItem('lang') || 'ar';
  }

  toggleLanguage(): void {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', this.currentLang);
  }

  openVideoModal(videoUrl: string): void {
    console.log('Opening video:', videoUrl);
  }
}
