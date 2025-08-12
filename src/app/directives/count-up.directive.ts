import {
  Directive,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CountUp, CountUpOptions } from 'countup.js';
@Directive({
  selector: '[appCountUp]',
})
export class CountUpDirective implements OnChanges {
  @Input('appCountUp') countUp!: number;
  @Input() options?: CountUpOptions;

  private countUpInstance?: CountUp;

  constructor(private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['countUp'] || changes['options']) {
      this.updateCounter();
    }
  }

  private updateCounter() {
    if (!this.countUpInstance) {
      this.createInstance();
    } else {
      this.countUpInstance.update(this.countUp);
    }
  }

  private createInstance() {
    this.countUpInstance = new CountUp(
      this.el.nativeElement,
      this.countUp,
      this.options
    );

    if (!this.countUpInstance.error) {
      this.countUpInstance.start();
    } else {
      console.error(this.countUpInstance.error);
    }
  }
}
