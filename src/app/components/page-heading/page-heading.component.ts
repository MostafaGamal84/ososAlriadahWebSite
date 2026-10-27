import { Component, Input } from '@angular/core';
import { CmsTextPipe } from '../../services/cms-text.pipe';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-page-heading',
  standalone: true,
  imports: [RouterLink, CmsTextPipe],
  template: `
    <header class="inner-heading">
      <div class="inner-width">
        <nav
          class="inner-breadcrumb"
          [attr.aria-label]="ar ? 'مسار الصفحة' : 'Breadcrumb'"
        >
          <a routerLink="/">{{ ar ? 'الرئيسية' : 'Home' }}</a>
          <span aria-hidden="true">/</span
          ><span aria-current="page">{{ title }}</span>
        </nav>
        <div class="inner-heading-copy">
          <span class="inner-kicker">{{
            eyebrow ||
              (ar
                ? 'أسس الريادة للخدمات العقارية'
                : 'OSOS AL-RIYADAH REAL ESTATE')
          }}</span>
          <h1 data-cms-key="heading.title">{{ title | cmsText:'heading.title' }}</h1>
          <p data-cms-key="heading.description">{{ description | cmsText:'heading.description' }}</p>
        </div>
      </div>
    </header>
  `,
})
export class PageHeadingComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() eyebrow = '';
  constructor(private contact: ContactService) {}
  get ar(): boolean {
    return this.contact.currentLang === 'ar';
  }
}
