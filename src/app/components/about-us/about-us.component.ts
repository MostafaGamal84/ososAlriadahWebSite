import { CmsTextPipe } from '../../services/cms-text.pipe';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeadingComponent } from '../page-heading/page-heading.component';
import { AppInViewportDirective } from '../../directives/app-in-viewport.directive';
@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CmsTextPipe, 
    CommonModule,
    RouterLink,
    PageHeadingComponent,
    AppInViewportDirective,
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {
  currentLang = localStorage.getItem('lang') === 'en' ? 'en' : 'ar';
}
