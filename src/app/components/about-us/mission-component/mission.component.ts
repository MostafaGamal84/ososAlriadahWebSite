import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrls: ['./mission.component.css'],
  imports: [CommonModule],
})
export class MissionComponent {
  currentLang: string = 'ar';
  constructor(private router: Router) {}
  mission: { [key: string]: string } = {
    ar: `رسالتنا هي تمكين الأفراد والشركات من اتخاذ قرارات عقارية ذكية وآمنة من خلال خبرتنا العميقة وفريقنا المتخصص. نلتزم بتقديم أعلى معايير الاحترافية والشفافية، ونؤمن أن الثقة والمصداقية هما حجر الأساس لأي علاقة ناجحة. هدفنا هو بناء شراكات طويلة الأمد مع عملائنا، وتحقيق نتائج ملموسة تواكب تطورات السوق العقاري الحديث.`,
    en: `Our mission is to empower individuals and businesses to make smart and secure property decisions through our deep expertise and specialized team. We are committed to the highest standards of professionalism and transparency, believing that trust and credibility are the foundation of successful relationships. Our goal is to build long-term partnerships and deliver tangible results that keep pace with the modern real estate market.`,
  };

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.currentLang = savedLang === 'en' ? 'en' : 'ar';
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
