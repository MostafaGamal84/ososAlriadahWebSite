import { CmsTextPipe } from '../../../services/cms-text.pipe';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeadingComponent } from '../../page-heading/page-heading.component';
import { AppInViewportDirective } from '../../../directives/app-in-viewport.directive';
@Component({
  selector: 'app-brokerage',
  standalone: true,
  imports: [CmsTextPipe, 
    CommonModule,
    RouterLink,
    PageHeadingComponent,
    AppInViewportDirective,
  ],
  templateUrl: './brokerage.component.html',
  styleUrl: './brokerage.component.css',
})
export class BrokerageComponent {
  currentLang: 'ar' | 'en' =
    localStorage.getItem('lang') === 'en' ? 'en' : 'ar';
  features = [
    {
      icon: 'fa-house',
      title: { ar: 'عرض العقار', en: 'Property presentation' },
      description: {
        ar: 'تنظيم معلومات العقار وإبراز تفاصيله ليستطيع العميل تقييم مدى ملاءمته.',
        en: 'Organising property information so clients can assess how well it suits their needs.',
      },
    },
    {
      icon: 'fa-calendar-check',
      title: { ar: 'الاستفسارات والزيارات', en: 'Enquiries & viewings' },
      description: {
        ar: 'التواصل مع المهتمين وتنسيق الزيارات والإجابة عن أسئلتهم.',
        en: 'Communicating with interested clients, coordinating viewings and answering questions.',
      },
    },
    {
      icon: 'fa-handshake',
      title: { ar: 'التفاوض والمتابعة', en: 'Negotiation & follow-up' },
      description: {
        ar: 'تقريب وجهات النظر حول السعر والشروط، ومتابعة خطوات إتمام الاتفاق.',
        en: 'Helping parties discuss price and terms, and following up through the agreement process.',
      },
    },
  ];
}
