import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { ContactComponent } from './components/contact/contact.component';
import { FeatureComponent } from './components/feature/feature.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { OurServicesComponent } from './components/our-services/our-services.component';
import { AppInViewportDirective } from './directives/app-in-viewport.directive';
import { ContactService } from './services/contact.service';
import { CommonModule } from '@angular/common';
import { PackagesComponent } from './components/auction/auction.component';
import { OwlComponent } from './components/owl/owl.component';
import { ProjectsComponent } from './components/projects/projects.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Components
    AboutUsComponent,
    BackToTopComponent,
    ContactComponent,
    FeatureComponent,
    FooterComponent,
    HeaderComponent,
    OurServicesComponent,
    AppInViewportDirective,
    RouterOutlet,
    CommonModule,
    PackagesComponent,
    OwlComponent,
    ProjectsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'اسس الريادة للخدمات العقارية';
  constructor(public contactService: ContactService, public router: Router) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.contactService.currentLang = savedLang === 'en' ? 'en' : 'ar';
    document.documentElement.dir =
      this.contactService.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  isHomeOrAbout(): boolean {
    const url = this.router.url.split('?')[0].split('#')[0];
    return url === '/' || url === '/about';
  }

  
}
