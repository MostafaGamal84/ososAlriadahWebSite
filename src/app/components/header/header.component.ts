import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../services/contact.service';

type DropdownKey = 'about' | 'services';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  currentLang: 'ar' | 'en' = 'ar';
  isScrolled = false;

  dropdowns: Record<DropdownKey, boolean> = {
    about: false,
    services: false,
  };

  aboutLinks = [
    { link: '/vision',  labelAr: 'رؤيتنا',      labelEn: 'Our Vision' },
    // { link: '/mission', labelAr: 'رسالتنا',     labelEn: 'Our Mission' },
    { link: '/team',    labelAr: 'فريق العمل',  labelEn: 'Our Team' },
  ];

  serviceLinks = [
    { link: '/development', labelAr: 'التطوير العقاري',  labelEn: 'Development' },
    { link: '/brokerage',   labelAr: 'الوساطة العقارية', labelEn: 'Brokerage' },
    { link: '/mangement',   labelAr: 'إدارة الأملاك',    labelEn: 'Management' },
    { link: '/leasing',     labelAr: 'التمليك والتأجير', labelEn: 'Leasing' },
    { link: '/markting',    labelAr: 'التسويق العقاري',  labelEn: 'Marketing' },
  ];

  constructor(private router: Router, public contactService: ContactService) {}

  ngOnInit(): void {
    this.currentLang = (localStorage.getItem('lang') as 'ar' | 'en') || 'ar';
    document.documentElement.setAttribute('dir', this.getDirection());
  }

  toggleLanguage(): void {
    this.contactService.toggleLanguage();
    this.currentLang = this.contactService.currentLang;
    localStorage.setItem('lang', this.currentLang);
    document.documentElement.setAttribute('dir', this.getDirection());
  }

  getDirection(): 'rtl' | 'ltr' {
    return this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = (window.scrollY || document.documentElement.scrollTop) > 100;
  }

  // إغلاق عند الضغط خارج النافبار
  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    const target = ev.target as HTMLElement;
    const inside = target.closest('.custom-navbar');
    if (!inside) this.closeAllDropdowns();
  }

  toggleDropdown(menu: DropdownKey, ev?: Event): void {
    ev?.preventDefault();
    ev?.stopPropagation();

    // أغلق غيره
    (Object.keys(this.dropdowns) as DropdownKey[]).forEach(k => {
      if (k !== menu) this.dropdowns[k] = false;
    });

    this.dropdowns[menu] = !this.dropdowns[menu];
  }

  closeAllDropdowns(): void {
    (Object.keys(this.dropdowns) as DropdownKey[]).forEach(k => this.dropdowns[k] = false);
  }

  // إغلاق كل القوائم + كولابس الجوال
  closeAllAndCollapse(closeMenu: boolean = true): void {
    this.closeAllDropdowns();
    if (!closeMenu) return;
    const toggler = document.querySelector('.navbar-toggler') as HTMLElement | null;
    const collapse = document.getElementById('navbarNav');
    if (collapse?.classList.contains('show')) toggler?.click();
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // توافقي مع استدعاءات: (click)="navigateAndCloseDropdown(item.link, 'about')"
  navigateAndCloseDropdown(path: string, _dropdown?: string, closeMenu: boolean = true): void {
    this.closeAllDropdowns();
    this.router.navigate([path]).finally(() => this.closeAllAndCollapse(closeMenu));
  }
    scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
