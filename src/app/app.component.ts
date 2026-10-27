import { Component } from '@angular/core';
import { SiteContentService } from './services/site-content.service';
import { LiveEditorComponent } from './admin/live-editor.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ContactService } from './services/contact.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BackToTopComponent, FooterComponent, HeaderComponent, RouterOutlet, LiveEditorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'اسس الريادة للخدمات العقارية';
  private snapchatTrackingSubscription?: Subscription;

  constructor(public contactService: ContactService, public router: Router, private cms: SiteContentService) {}

  ngOnInit(): void {
    this.cms.load().catch(() => { /* Original content stays readable if the API is unavailable. */ });
    const savedLang = localStorage.getItem('lang');
    this.contactService.currentLang = savedLang === 'en' ? 'en' : 'ar';
    document.documentElement.lang = this.contactService.currentLang;
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
