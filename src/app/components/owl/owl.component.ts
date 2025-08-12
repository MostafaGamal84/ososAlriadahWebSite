import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-owl',
  imports: [CommonModule],
  templateUrl: './owl.component.html',
  styleUrl: './owl.component.css',
})
export class OwlComponent implements AfterViewInit {
  logos: string[] = [
    'assets/images/Ahli.svg',
  'assets/images/infath.svg',
  'assets/images/MIM.svg',
  'assets/images/Modon.svg',
  'assets/images/Moj.svg',
  'assets/images/rajhi.svg',
  'assets/images/Sah.svg',
  'assets/images/Tasfia.svg',
  ];

  ngAfterViewInit(): void {
    $('.logo-carousel').owlCarousel({
      items: 9,
      margin: 20,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      loop: true,
      dots: false,
      nav: false,
      center: true,
      rtl: document.documentElement.lang === 'ar',
      responsive: {
        0: { items: 1 },
        476: { items: 1 },
        768: { items: 4 },
        992: { items: 6 },
        1200: { items: 9 },
      },
    });
  }
}
