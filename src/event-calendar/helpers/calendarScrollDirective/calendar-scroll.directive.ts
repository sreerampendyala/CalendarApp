import {
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subject, pairwise, startWith, takeUntil } from 'rxjs';
import { CalendarScrollService } from '../calendarScrollService/calendar-scroll.service';

@Directive({
  selector: '[appCalendarScroll]',
})
export class CalendarScrollDirective implements OnInit, OnDestroy {
  destroySubject: Subject<void> = new Subject<void>();

  @HostListener('wheel', ['$event'])
  public onScroll(event: WheelEvent) {
    this.scrollService.verticalOffSet.next(event.deltaY);
    event.stopImmediatePropagation();
  }

  constructor(
    public elementRef: ElementRef,
    public scrollService: CalendarScrollService
  ) {}

  ngOnInit() {
    this.scrollService.verticalOffSet
      .pipe(takeUntil(this.destroySubject))
      .subscribe((currentVerticalOffSet) => {
        this.elementRef.nativeElement.scrollTop += currentVerticalOffSet;
      });

    this.scrollService.setScrollTop
      .pipe(takeUntil(this.destroySubject), startWith(null), pairwise())
      .subscribe(([previousScrollTop, currentScrollTop]) => {
        if (currentScrollTop && currentScrollTop !== previousScrollTop) {
          this.elementRef.nativeElement.scrollTop = currentScrollTop;
        }
      });

    this.scrollService.resetToTop
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        this.elementRef.nativeElement.scrollTop = 0;
      });
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
