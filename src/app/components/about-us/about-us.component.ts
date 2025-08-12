import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChildren('slide') slideElements!: QueryList<ElementRef>;
  @ViewChildren('dot') dotElements!: QueryList<ElementRef>;

  slides: string[] = [
    'https://pbs.twimg.com/profile_banners/1756713945530822656/1723365269/1500x500',
    'https://i.pinimg.com/736x/65/42/3f/65423f429769fc5b2d9fb2adc31137a4.jpg',
    'https://i.pinimg.com/1200x/d2/37/6e/d2376e0164064e8f7b28e1f98187748f.jpg',
    'https://i.pinimg.com/736x/5b/9f/bc/5b9fbc4ed0a53f32e955adca994dda0b.jpg',
  ];

  currentSlide = 0;
  private slideSubscription?: Subscription;
  private readonly SLIDE_INTERVAL = 3500;

  sectionTitle = {
    ar: ' أسس الريادة للخدمات العقارية',
    en: 'Osos Al-Riyada Real Estate Services',
  };

  description = {
    ar: ` أسس الريادة للخدمات العقارية، تقدم حلول مبتكرة في التسويق وإدارة وتطوير العقارات بثقة وجودة.`,
    en: `Osos Al-Riyada Real Estate Services provides innovative solutions in marketing, management,
     and development with trust and quality.

`,
  };

  currentLang: string = 'ar';

  constructor(public contactService: ContactService) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.currentLang = savedLang === 'en' ? 'en' : 'ar';

    document.documentElement.setAttribute(
      'dir',
      this.currentLang === 'ar' ? 'rtl' : 'ltr'
    );

    this.startSlideshow();
  }

  ngAfterViewInit(): void {
    this.updateSlideClasses();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }
  switchLang(lang: 'ar' | 'en'): void {
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  }

  private startSlideshow(): void {
    this.stopSlideshow();
    this.slideSubscription = interval(this.SLIDE_INTERVAL).subscribe(() => {
      this.moveToNextSlide();
    });
  }

  private stopSlideshow(): void {
    this.slideSubscription?.unsubscribe();
  }

  private moveToNextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlideClasses();
  }

  setCurrentSlide(index: number): void {
    this.currentSlide = index;
    this.updateSlideClasses();
    this.startSlideshow();
  }

  private updateSlideClasses(): void {
    this.slideElements?.forEach((slide, i) =>
      slide.nativeElement.classList.toggle('active', i === this.currentSlide)
    );

    this.dotElements?.forEach((dot, i) =>
      dot.nativeElement.classList.toggle('active', i === this.currentSlide)
    );
  }
  scrollToAuctions(): void {
    const auctionsSection = document.querySelector('.auctions-section');
    if (auctionsSection) {
      auctionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
