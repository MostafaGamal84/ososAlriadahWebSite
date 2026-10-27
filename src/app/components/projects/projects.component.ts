import { HttpClient } from '@angular/common/http';
import { PageHeadingComponent } from '../page-heading/page-heading.component';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppInViewportDirective } from '../../directives/app-in-viewport.directive';

interface Project {
  id: number;
  titleAr: string;
  descAr: string;
  titleEn: string;
  descEn: string;
  image: string;
  pdfUrl: string; // <-- make sure each project has this
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, AppInViewportDirective, PageHeadingComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent {
  unavailableImages = new Set<number>();
  imageFallback(event: Event, id: number): void {
    if (this.unavailableImages.has(id)) return;
    this.unavailableImages.add(id);
    (event.target as HTMLImageElement).src = 'images/property-placeholder.svg';
  }
  // language & direction
  currentLang: string = localStorage.getItem('lang') || 'ar';
  // start with NO active card (no shade open)
  activeIndex = -1;
  constructor(private router: Router, private http: HttpClient) {}
  loading = true;
  loadFailed = false;
  ngOnInit() { this.loadProjects(); }
  loadProjects() {
    this.loading=true;this.loadFailed=false;
    this.http.get<Project[]>('/api/public/projects').subscribe({
      next: rows => { this.projects=rows;this.loading=false; },
      error: () => { this.loadFailed=true;this.loading=false; }
    });
  }
  projects: Project[] = [];

  // computed progress width (0% when none active)
  get progressPercent(): number {
    return this.activeIndex >= 0
      ? ((this.activeIndex + 1) / this.projects.length) * 100
      : 0;
  }

  // interactions
  setActive(i: number) {
    this.activeIndex = i;
  }
  clearActive() {
    this.activeIndex = -1;
  }

  next() {
    if (this.projects.length === 0) return;
    this.activeIndex =
      this.activeIndex < 0 ? 0 : (this.activeIndex + 1) % this.projects.length;
  }

  prev() {
    if (this.projects.length === 0) return;
    this.activeIndex =
      this.activeIndex < 0
        ? this.projects.length - 1
        : (this.activeIndex - 1 + this.projects.length) % this.projects.length;
  }

  trackById = (_: number, p: Project) => p.id;

  openPdf(p: Project) {
    const title = this.currentLang === 'ar' ? p.titleAr : p.titleEn;
    this.router.navigate(['/preview'], {
      queryParams: { url: encodeURIComponent(p.pdfUrl), title },
    });
  }
}
