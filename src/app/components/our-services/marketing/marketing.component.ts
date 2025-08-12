import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing',
  imports: [MatIconModule, MatProgressBarModule],
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.css'
})
export class MarketingComponent {
  currentLang: string = localStorage.getItem('lang') || 'ar';

  constructor(private router: Router) { }
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
  }
}
