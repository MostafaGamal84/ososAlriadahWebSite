import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, transition, style, animate } from '@angular/animations';

import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { interval, Subscription } from 'rxjs';
import { AuctionService } from '../../services/auction.service/auction.service';

Swiper.use([Navigation, Pagination, Autoplay]);

type AuctionStatus = 'upcoming' | 'current' | 'ended';

interface Countdown {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface Auction {
  id: number;
  name: string;
  start: string;
  end: string;
  content?: string;
  imagePath?: string;
  pdfPath?: string;
  imageUrl?: string;   // full URL for image
  pdfUrl?: string;     // full URL for pdf
  openingPrice?: number;
  agentName?: string;
  district?: string;
  city?: string;
  gallery?: string[];
  url?: string;        // external auction platform URL
  status: AuctionStatus;
  cd: Countdown;
}

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('statusBadge', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('150ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
      transition('* => *', [
        style({ transform: 'scale(0.95)', opacity: 0.8 }),
        animate('120ms ease-out', style({ transform: 'scale(1)', opacity: 1 })),
      ]),
    ]),
    trigger('timerSwap', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(-4px)' }),
        animate('160ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class PackagesComponent implements OnInit, AfterViewInit, OnDestroy {
  swiper: Swiper | null = null;

  currentLang: 'ar' | 'en' = 'ar';
  auctions: Auction[] = [];
  filteredAuctions: Auction[] = [];
  selectedTab: 'all' | 'current' | 'upcoming' | 'ended' = 'all';
  isLoading = false;

  private subscriptions = new Subscription();
  private timerSubscription?: Subscription;

  placeholder = 'https://placehold.co/800x450/png';

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private auctionService: AuctionService
  ) {}

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') === 'en' ? 'en' : 'ar';
    this.loadAuctions();
    this.startTimer(); // live counter
  }

  ngAfterViewInit(): void {
    this.initializeSwiper();
  }

  ngOnDestroy(): void {
    this.destroySwiper();
    this.subscriptions.unsubscribe();
    this.stopTimer();
  }

  /** ---------- Data ---------- */
  private loadAuctions(): void {
    this.isLoading = true;

    const sub = this.auctionService.getAllAuctions().subscribe({
      next: (rows: any[]) => {
        this.auctions = rows.map((r) => {
          const status = this.computeStatus(r.start, r.end);
          const a: Auction = {
            id: r.id,
            name: r.name,
            start: r.start,
            end: r.end,
            content: r.content || '',
            imagePath: r.imagePath || '',
            pdfPath: r.pdfPath || '',
            imageUrl: 'https://app.osos-alriadah.com/'+r.imagePath,
            pdfUrl: this.fullUrl(r.pdfPath),
            url: this.fullUrl(r.url),
            openingPrice: r.openingPrice ?? 0,
            agentName: r.agentName || '',
            district: r.district || '',
            city: r.city || '',
            gallery: r.gallery || [],
            // 🔗 external platform URL (try several common field names)
            status,
            cd: this.buildCountdown(status, r.start, r.end),
          };
          return a;
        });

        this.applyFilter(true);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });

    this.subscriptions.add(sub);
  }

  private fullUrl(rel?: string): string {
    if (!rel) return '';
    if (/^https?:\/\//i.test(rel)) return rel;
    return `  baseUrl: 'https://app.osos-alriadah.com/${rel.replace(/^\/+/, '')}`;
  }

  /** Try to find the external URL on typical field names */
  private pickExternalUrl(r: any): string {
    const candidate =
      r.url || r.auctionUrl || r.externalUrl || r.platformUrl || r.link || '';
    return typeof candidate === 'string' ? candidate : '';
  }

  /** ---------- Tabs & Filtering ---------- */
  selectTab(tab: 'all' | 'current' | 'upcoming' | 'ended'): void {
    this.selectedTab = tab;
    this.applyFilter(true);
  }

  // recreateSwiper: when true, rebuild swiper (e.g., on tab change or initial load)
  private applyFilter(recreateSwiper = true): void {
    this.filteredAuctions =
      this.selectedTab === 'all'
        ? this.auctions
        : this.auctions.filter((a) => a.status === this.selectedTab);

    if (recreateSwiper) this.recreateSwiper();
  }

  /** ---------- Swiper ---------- */
  private recreateSwiper(): void {
    setTimeout(() => this.initializeSwiper(), 0);
  }

  private initializeSwiper(): void {
    this.destroySwiper();
    if (!this.filteredAuctions.length) return;

    this.swiper = new Swiper('.auction-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: false,
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
      preventClicks: false,
      preventClicksPropagation: false,
    });
  }

  private destroySwiper(): void {
    this.swiper?.destroy(true, true);
    this.swiper = null;
  }

  /** ---------- Live Countdown (no re-render) ---------- */
  trackById(_i: number, a: Auction) {
    return a.id;
  }

  private startTimer(): void {
    this.timerSubscription = interval(1000).subscribe(() => {
      const now = Date.now();

      // Update IN-PLACE so DOM nodes stay (no flicker)
      for (const a of this.auctions) {
        const st = this.computeStatus(a.start, a.end, now);
        a.status = st;
        a.cd = this.buildCountdown(st, a.start, a.end, now);
      }

      // Refresh the filtered list without rebuilding Swiper each tick
      this.applyFilter(false);

      try {
        (this.swiper as any)?.update?.();
      } catch {}

      this.cdr.markForCheck();
    });
  }

  private stopTimer(): void {
    this.timerSubscription?.unsubscribe();
  }

  private computeStatus(
    startStr: string,
    endStr: string,
    now = Date.now()
  ): AuctionStatus {
    const start = new Date(startStr).getTime();
    const end = new Date(endStr).getTime();
    if (isNaN(start) || isNaN(end)) return 'ended';
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'current';
    return 'ended';
  }

  private buildCountdown(
    status: AuctionStatus,
    startStr: string,
    endStr: string,
    now = Date.now()
  ): Countdown {
    if (status === 'ended')
      return { days: '0', hours: '00', minutes: '00', seconds: '00' };

    const target =
      status === 'upcoming'
        ? new Date(startStr).getTime()
        : new Date(endStr).getTime();

    const diff = Math.max(target - now, 0);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    return {
      days: String(d),
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    };
    }

  /** ---------- Share ---------- */
  shareAuction(a: Auction): void {
    const shareUrl = a.url || a.pdfUrl || window.location.href;
    const data = { title: a.name, text: a.content || '', url: shareUrl };
    const navAny = navigator as any;
    if (navAny.share) {
      navAny.share(data).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareUrl);
      alert(this.currentLang === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
    }
  }
}
