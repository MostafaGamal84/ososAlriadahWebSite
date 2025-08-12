import { Injectable } from '@angular/core';

export interface CounterConfig {
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  refreshRate?: number;
}

export interface CounterItem {
  [x: string]: any;
  label: string;
  target: number;
  icon: string;
  count: number;
  interval?: any;
  duration: number;
  labelAr: string;
  labelEn: string;
}

@Injectable({
  providedIn: 'root',
})
export class CounterService {
  private readonly DEFAULT_ANIMATION_DURATION = 2000;
  private readonly DEFAULT_REFRESH_RATE = 16;
  private readonly DEFAULT_THRESHOLD = 0.5;
  private readonly DEFAULT_ROOT_MARGIN = '0px 0px -10% 0px';
  getCounters(): CounterItem[] {
    return [
      {
        icon: 'fas fa-users',
        count: 0,
        target: 1250,
        labelAr: 'عملاء سعداء',
        labelEn: 'Happy Clients',
        duration: 2000,
        label: '',
      },
      {
        icon: 'fas fa-project-diagram',
        count: 0,
        target: 340,
        labelAr: 'مشاريع مكتملة',
        labelEn: 'Projects Completed',
        duration: 2000,
        label: '',
      },
      {
        icon: 'fas fa-trophy',
        count: 0,
        target: 28,
        labelAr: 'جوائز مكتسبة',
        labelEn: 'Awards Won',
        duration: 2000,
        label: '',
      },
      {
        icon: 'fas fa-clock',
        count: 0,
        target: 7500,
        labelAr: 'ساعة عمل',
        labelEn: 'Working Hours',
        duration: 2000,
        label: '',
      },
    ];
  }

  createIntersectionObserver(
    callback: IntersectionObserverCallback,
    config?: CounterConfig
  ): IntersectionObserver {
    return new IntersectionObserver(callback, {
      threshold: config?.threshold || this.DEFAULT_THRESHOLD,
      rootMargin: config?.rootMargin || this.DEFAULT_ROOT_MARGIN,
    });
  }

  calculateProgress(
    startTime: number,
    duration: number = this.DEFAULT_ANIMATION_DURATION
  ): { progress: number; easeProgress: number } {
    const currentTime = performance.now();
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Use easeOutExpo for smooth deceleration
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    return { progress, easeProgress };
  }

  formatNumber(value: number, lang: string): string {
    return lang === 'ar'
      ? new Intl.NumberFormat('ar-EG').format(value)
      : new Intl.NumberFormat('en-US').format(value);
  }
}
