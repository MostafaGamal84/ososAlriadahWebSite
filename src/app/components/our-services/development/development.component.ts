import { Component } from '@angular/core';
interface Feature {
  icon: string;
  title: string;
  description: string;
}
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CountUpDirective } from '../../../directives/count-up.directive';
import { Router } from '@angular/router';
import { Direction } from '@angular/cdk/bidi';
interface TeamMember {
  name: string;
  role: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

@Component({
  selector: 'app-development',
  imports: [CommonModule, MatIconModule, CountUpDirective],
  templateUrl: './development.component.html',
  styleUrl: './development.component.css',
})
export class DevelopmentComponent {
  currentLang: 'ar' | 'en' = 'ar';

  activeTech = 'Concrete';
  features = [
    {
      icon: 'home_work',
      title: { en: 'Innovative Designs', ar: 'تصاميم مبتكرة' },
      description: {
        en: 'We create unique architectural designs tailored to each project.',
        ar: 'نبتكر تصاميم معمارية فريدة تناسب كل مشروع.',
      },
    },
    {
      icon: 'engineering',
      title: { en: 'Quality Construction', ar: 'بناء عالي الجودة' },
      description: {
        en: 'Using premium materials and expert craftsmanship.',
        ar: 'نستخدم أفضل المواد وأعلى مستويات الحرفية.',
      },
    },
    {
      icon: 'eco',
      title: { en: 'Sustainability', ar: 'الاستدامة' },
      description: {
        en: 'Eco-friendly and energy-efficient building solutions.',
        ar: 'حلول بناء صديقة للبيئة وموفرة للطاقة.',
      },
    },
  ];

  technologies = ['Concrete', 'Steel', 'Glass', 'Smart Systems'];

  stats = [
    { value: 25, label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 150, label: { en: 'Completed Projects', ar: 'مشاريع منجزة' } },
    { value: 10, label: { en: 'Awards Won', ar: 'جوائز محلية ودولية' } },
    { value: 300, label: { en: 'Happy Clients', ar: 'عملاء سعداء' } },
  ];

  team = [
    {
      name: 'Ahmed Ali',
      role: 'Lead Architect',
      image: 'assets/team/ahmed.jpg',
      social: {
        twitter: 'https://twitter.com/ahmed',
        linkedin: 'https://linkedin.com/in/ahmed',
        github: '',
      },
    },
    {
      name: 'Sara Hassan',
      role: 'Project Manager',
      image: 'assets/team/sara.jpg',
      social: {
        twitter: '',
        linkedin: 'https://linkedin.com/in/sara',
        github: '',
      },
    },
  ];

  constructor(private router: Router) {
    this.currentLang = (localStorage.getItem('lang') as 'ar' | 'en') || 'ar';
    this.applyLanguageSettings();
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', this.currentLang);
    this.applyLanguageSettings();
  }

  private applyLanguageSettings() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  selectTech(tech: string) {
    this.activeTech = tech;
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
