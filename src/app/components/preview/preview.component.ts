import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule, Location } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-preview',
  imports: [PdfViewerModule,CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css'
})
export class PreviewComponent {
title = 'Document';
  pdfUrl = ''; // e.g. '/assets/pdfs/sample.pdf'

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.route.queryParamMap.subscribe(q => {
      const raw = q.get('url') || '';
      this.title = q.get('title') || this.title;

      // ensure a leading slash so Angular doesn’t 404 on deep routes
      let parsed = raw;
      try { parsed = decodeURIComponent(raw); } catch {}
      if (parsed && !/^https?:\/\//i.test(parsed) && !parsed.startsWith('/')) {
        parsed = '/' + parsed;
      }
      this.pdfUrl = parsed;
    });
  }

  back() {
    if (history.length > 1) this.location.back();
    else this.router.navigateByUrl('/');
  }

  openInNewTab() {
    if (this.pdfUrl) {
      const abs = this.absoluteUrl(this.pdfUrl);
      window.open(abs, '_blank', 'noopener,noreferrer');
    }
  }

  isArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text || '');
  }

  private absoluteUrl(path: string): string {
    try { return new URL(path, window.location.origin).toString(); }
    catch { return path; }
  }
}