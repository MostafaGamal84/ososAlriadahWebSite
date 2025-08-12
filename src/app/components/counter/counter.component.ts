import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { CounterService, CounterItem } from '../../services/counter.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
  animations: [
    trigger('counterAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(30px)',
        })
      ),
      state(
        'visible',
        style({
          opacity: 1,
          transform: 'translateY(0)',
        })
      ),
      transition('hidden => visible', [
        animate('0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'),
      ]),
    ]),
  ],
})
export class CounterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('counterValue') counterElements!: QueryList<ElementRef>;
  counters: CounterItem[] = [];
  animationState: string[] = [];
  currentLang: string = 'ar';
  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;
  private animationFrameId: number | null = null;

  constructor(
    private counterService: CounterService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngAfterViewInit(): void {
    this.initializeIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private initializeComponent(): void {
    this.currentLang = localStorage.getItem('lang') || 'ar';
    this.counters = this.counterService.getCounters();
    this.animationState = this.counters.map(() => 'hidden');
  }

  private initializeIntersectionObserver(): void {
    if (!('IntersectionObserver' in window)) {
      this.animateAllCounters();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersections(entries),
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    this.counterElements.forEach((element) => {
      this.observer?.observe(element.nativeElement);
    });
  }

  private handleIntersections(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const index = this.counterElements
          .toArray()
          .findIndex((el) => el.nativeElement === entry.target);

        if (index !== -1) {
          this.animateCounter(index);
          this.observer?.unobserve(entry.target);
        }
      }
    });
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  handleViewportChanges(): void {
    if (window.innerWidth <= 768 && !this.hasAnimated) {
      this.animateAllCounters();
    }
  }

  private animateAllCounters(): void {
    if (this.hasAnimated) return;

    this.animationState = this.counters.map(() => 'visible');
    this.counters.forEach((_, index) => this.animateCounter(index));
    this.hasAnimated = true;
  }

  private animateCounter(index: number): void {
    this.animationState[index] = 'visible';
    this.startCounterAnimation(index);
  }

  private startCounterAnimation(index: number): void {
    const counter = this.counters[index];
    if (!counter || counter.interval) return;

    const startTime = performance.now();
    const duration = counter.duration;
    const startValue = 0;
    const targetValue = counter.target;

    const updateCounter = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = this.easeOutCubic(progress);

      counter.count = Math.round(
        startValue + (targetValue - startValue) * easeProgress
      );
      this.cdRef.markForCheck();

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        counter.count = targetValue;
        this.cdRef.markForCheck();
        this.cleanupCounter(counter);
      }
    };

    counter.interval = updateCounter;
    this.animationFrameId = requestAnimationFrame(updateCounter);
  }

  private easeOutCubic(progress: number): number {
    return 1 - Math.pow(1 - progress, 3);
  }

  onAnimationDone(event: any, index: number): void {
    if (event.toState === 'visible') {
      this.startCounterAnimation(index);
    }
  }

  private cleanup(): void {
    this.counters.forEach((counter) => this.cleanupCounter(counter));
    this.observer?.disconnect();

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private cleanupCounter(counter: CounterItem): void {
    if (counter.interval && typeof counter.interval === 'function') {
      cancelAnimationFrame(this.animationFrameId!);
    }
    counter.interval = null;
  }

  formatNumber(value: number): string {
    return this.counterService.formatNumber(value, this.currentLang);
  }
}
