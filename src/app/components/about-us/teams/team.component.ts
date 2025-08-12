import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface TeamMember {
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  imageUrl: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  imports: [CommonModule],
})
export class TeamComponent implements OnInit {
  currentLang: string = 'ar';
  constructor(private router: Router) {}
  teamSections = [
    {
      titleAr: 'فريق العمل',
      titleEn: 'Team',
      textAr: `يضم فريق العمل في أسس الريادة نخبة من الخبراء والمتخصصين...`,
      textEn: `The Osos Al-Riyada team consists of elite experts...`,
      imageUrl:
        'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    },
    {
      titleAr: 'الخبراء',
      titleEn: 'Experts',
      textAr: `يعمل خبراؤنا على تقديم استشارات عقارية متخصصة...`,
      textEn: `Our experts provide specialized real estate consultations...`,
      imageUrl:
        'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80',
    },
  ];

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.currentLang = savedLang === 'en' ? 'en' : 'ar';
  }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
