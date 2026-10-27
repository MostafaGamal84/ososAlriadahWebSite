import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appAppInViewport]',
})
export class AppInViewportDirective implements AfterViewInit, OnDestroy {
  @Input() animationClass: string = 'fade-from-bottom';
  @Input() revealDelay = 0;

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    // Keep content visible when motion is disabled or observation is unavailable.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    this.renderer.setStyle(
      this.el.nativeElement,
      '--reveal-delay',
      `${this.revealDelay}ms`,
    );
    // Add initial animation class
    this.renderer.addClass(this.el.nativeElement, this.animationClass);

    // Wait until the element is comfortably inside the viewport. Cap the
    // required visible area so sections taller than the screen can still reveal.
    const viewportHeight = window.innerHeight;
    const bottomInset = Math.round(viewportHeight * 0.15);
    const elementHeight = this.el.nativeElement.getBoundingClientRect().height;
    const revealThreshold = Math.min(
      0.2,
      (viewportHeight * 0.2) / Math.max(elementHeight, 1),
    );

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // isIntersecting alone can be true before the threshold is reached,
          // including the observer's initial notification.
          if (
            entry.isIntersecting &&
            entry.intersectionRatio >= revealThreshold &&
            !this.hasAnimated
          ) {
            this.renderer.addClass(this.el.nativeElement, 'show');
            this.hasAnimated = true;
            this.observer?.unobserve(this.el.nativeElement);
          }
        });
      },
      {
        threshold: revealThreshold,
        rootMargin: `0px 0px -${bottomInset}px 0px`,
      },
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
