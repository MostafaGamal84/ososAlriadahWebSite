import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
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
import { AuctionComponent } from './components/auction/auction.component';
import { OwlComponent } from './components/owl/owl.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

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
    AuctionComponent,
    OwlComponent,
    ProjectsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  title = 'اسس الريادة للخدمات العقارية';
  private snapchatTrackingSubscription?: Subscription;

  constructor(public contactService: ContactService, public router: Router) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.contactService.currentLang = savedLang === 'en' ? 'en' : 'ar';
    document.documentElement.dir =
      this.contactService.currentLang === 'ar' ? 'rtl' : 'ltr';

    this.initializeSnapchatPixelTracking();
  }

  ngOnDestroy(): void {
    this.snapchatTrackingSubscription?.unsubscribe();
  }

  isHomeOrAbout(): boolean {
    const url = this.normalizedUrl();
    return url === '/' || url === '/about';
  }

  isAboutRoute(): boolean {
    return this.normalizedUrl() === '/about';
  }

  private normalizedUrl(): string {
    const [withoutQuery] = this.router.url.split('?');
    const [withoutFragment] = withoutQuery.split('#');
    if (!withoutFragment || withoutFragment === '/') {
      return '/';
    }

    return withoutFragment.startsWith('/')
      ? withoutFragment
      : `/${withoutFragment}`;
  }

  private initializeSnapchatPixelTracking(): void {
    const pixelId = this.getSnapchatPixelId();
    if (!pixelId) {
      return;
    }

    const snaptr = (window as { snaptr?: (...args: unknown[]) => void }).snaptr;
    if (typeof snaptr !== 'function') {
      console.warn('Snapchat Pixel script not loaded. Skipping analytics tracking.');
      return;
    }

    snaptr('track', 'PAGE_VIEW');

    let skipNextNavigation = true;
    this.snapchatTrackingSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        if (skipNextNavigation) {
          skipNextNavigation = false;
          return;
        }

        snaptr('track', 'PAGE_VIEW');
      });
  }

  private getSnapchatPixelId(): string | undefined {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="snapchat-pixel-id"]');
    const content = meta?.content?.trim();
    if (!content || content === 'REPLACE_WITH_YOUR_PIXEL_ID') {
      return undefined;
    }

    return content;
  }
}
