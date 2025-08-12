import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUp, CountUpOptions } from 'countup.js';
import { CountUpDirective } from '../../../directives/count-up.directive';
import { Router } from '@angular/router';

interface Feature {
  icon: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
}

interface Testimonial {
  quote: { en: string; ar: string };
  clientName: string;
  clientImage: string;
  rating: number;
}

interface Statistic {
  value: string;
  label: { en: string; ar: string };
}

@Component({
  selector: 'app-brokerage',
  imports: [CommonModule, CountUpDirective],
  templateUrl: './brokerage.component.html',
  styleUrl: './brokerage.component.css',
})
export class BrokerageComponent implements OnInit {
  @Input() currentLang: 'en' | 'ar' = 'en';
  constructor(private router: Router) {}

  // Hero Section Data
  companyTitle = {
    en: 'Premium Trading Solutions',
    ar: 'حلول التداول المتميزة',
  };

  description = {
    en: 'Access global markets with our award-winning trading platform and expert support',
    ar: 'الوصول إلى الأسواق العالمية مع منصة التداول الحائزة على جوائز والدعم الفني المتميز',
  };

  initialValue = 0;
  counterOptions: CountUpOptions = {
    duration: 2,
    separator: '',
    decimal: '',
    prefix: '',
    suffix: '', // Will be set dynamically
  };

  ngOnInit() {
    this.currentLang = localStorage.getItem('lang') === 'en' ? 'en' : 'ar';

    setTimeout(() => {
      this.initialValue = 1;
    }, 100);
  }

  getStatValue(value: string): number {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(numValue) ? 0 : numValue;
  }

  // Stats Section Data
  statistics: Statistic[] = [
    { value: '15+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: '500K+', label: { en: 'Satisfied Clients', ar: 'عميل راضي' } },
    {
      value: '99.8%',
      label: { en: 'System Reliability', ar: 'موثوقية النظام' },
    },
    { value: '24/7', label: { en: 'Customer Support', ar: 'دعم فني' } },
  ];

  // Features Section Data
  features: Feature[] = [
    {
      icon: 'fa-chart-line',
      title: { en: 'Advanced Trading', ar: 'تداول متقدم' },
      description: {
        en: 'Sophisticated trading platforms with integrated analysis tools',
        ar: 'منصات تداول متطورة مع أدوات تحليل متكاملة',
      },
    },
    {
      icon: 'fa-shield-alt',
      title: { en: 'Security & Protection', ar: 'أمان وحماية' },
      description: {
        en: 'Your funds protected with highest global security standards',
        ar: 'أموالك محمية بأعلى معايير الأمان العالمية',
      },
    },
    {
      icon: 'fa-coins',
      title: { en: 'Diverse Assets', ar: 'تنوع الأصول' },
      description: {
        en: 'Trade 1000+ financial instruments across global markets',
        ar: 'تداول أكثر من 1000 أصل مالي في مختلف الأسواق',
      },
    },
    {
      icon: 'fa-graduation-cap',
      title: { en: 'Comprehensive Education', ar: 'تعليمي مكثف' },
      description: {
        en: 'Comprehensive educational resources for all skill levels',
        ar: 'موارد تعليمية شاملة للمبتدئين والمحترفين',
      },
    },
  ];

  // Testimonials Data
  testimonials: Testimonial[] = [
    {
      quote: {
        en: 'The best broker I worked with in terms of speed and outstanding technical support',
        ar: 'أفضل وسيط تعاملت معه من حيث السرعة والدعم الفني المميز',
      },
      clientName: 'Ahmed Mohammed',
      clientImage: 'assets/images/client1.jpg',
      rating: 5,
    },
    {
      quote: {
        en: 'Excellent educational resources helped me improve my trading skills significantly',
        ar: 'الموارد التعليمية الممتازة ساعدتني في تحسين مهارات التداول بشكل كبير',
      },
      clientName: 'Sarah Johnson',
      clientImage: 'assets/images/client2.jpg',
      rating: 4,
    },
  ];

  // CTA Section Data
  ctaData = {
    title: {
      en: 'Ready to Start Your Trading Journey?',
      ar: 'جاهز لبدء رحلتك في التداول؟',
    },
    subtitle: {
      en: 'Register now and get up to $5000 welcome bonus',
      ar: 'سجل الآن واحصل على مكافأة ترحيبية تصل إلى 5000$',
    },
    buttonText: {
      en: 'Know More',
      ar: 'شاهد المزيد',
    },
  };

  // Button Handlers
  scrollDown(): void {
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  }
  learnMore() {
    console.log('Learn more clicked');
  }

  getStars(rating: number): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < rating);
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
