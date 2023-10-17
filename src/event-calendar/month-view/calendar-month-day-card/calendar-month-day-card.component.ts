import { CdkOverlayOrigin, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  differenceInMinutes,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Subject } from 'rxjs';
import { EventDTO } from 'src/event-calendar/event-calendar.models';
import { CalendarEventContentPopoverComponent } from 'src/event-calendar/helpers/calendar-event-content-popover/calendar-event-content-popover.component';

@Component({
  selector: 'app-calendar-month-day-card',
  templateUrl: './calendar-month-day-card.component.html',
  styleUrls: ['./calendar-month-day-card.component.scss'],
})
export class CalendarMonthDayCardComponent {
  @Input() timeZone: string = 'US/Eastern';

  @Input() date: string = utcToZonedTime(
    new Date(),
    this.timeZone
  ).toISOString();

  @Input() resourceId: number = 0;

  @Input() monthDate: Date = new Date();

  @Input() events: EventDTO[] = [];

  @Input() rightClickEnable: boolean = false;

  @Input() showPopOverOnClick: boolean = false;

  @Input() overlayCloseSubject: Subject<void> = new Subject<void>();

  @ContentChild('popoverContentMV') popoverContentMV: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('contextMenuContentMV') contextMenuContentMV: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ViewChild('container', { static: true }) containerRef!: ElementRef;

  @ViewChild('dayHeader', { static: true }) headerRef!: ElementRef;

  @Output() badgeClicked: EventEmitter<string> = new EventEmitter<string>();

  @Output() eventClicked: EventEmitter<EventDTO> = new EventEmitter<EventDTO>();

  visibleEvents: EventDTO[] = [];

  hiddenEventsCount = 0;

  isDateNotInMonth: boolean = false;

  isOverlayOpen: boolean = false;

  triggerOrigin: CdkOverlayOrigin = {} as CdkOverlayOrigin;

  @ViewChildren(MatMenuTrigger)
  contextMenus!: QueryList<MatMenuTrigger>;

  overlayRef: OverlayRef | null = null;

  constructor(
    public overlay: Overlay,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.createView();

    this.overlayCloseSubject.subscribe(() => {
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }
    });
  }

  ngAfterViewInit() {
    this.calculateVisibleEvents();
    this.changeDetectorRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['date'].currentValue && changes?.['date'].previousValue) {
      this.createView();
    }
  }

  createView() {
    this.isDateNotInMonth = !isWithinInterval(new Date(this.date), {
      start: this.getStartOfMonth(this.monthDate),
      end: this.getEndOfMonth(this.monthDate),
    });
  }

  onBadgeClick(event: MouseEvent) {
    event.stopPropagation();
    this.badgeClicked.emit(this.date);
  }

  openPopup(trigger: CdkOverlayOrigin) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(trigger.elementRef)
        .withViewportMargin(100)
        .withPush(false)
        .withFlexibleDimensions(false)
        .withPositions([
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            panelClass: ['event-arrow-extension', 'left'],
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            panelClass: ['event-arrow-extension', 'right'],
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
            overlayY: 'bottom',
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
    });

    const componentRef = this.overlayRef.attach(
      new ComponentPortal(CalendarEventContentPopoverComponent)
    );

    componentRef.instance.content = this.popoverContentMV;
  }

  getStartOfMonth(date: Date) {
    return zonedTimeToUtc(
      startOfMonth(
        utcToZonedTime(zonedTimeToUtc(date, this.timeZone), this.timeZone)
      ),
      this.timeZone
    );
  }

  getEndOfMonth(date: Date) {
    return zonedTimeToUtc(
      endOfMonth(
        utcToZonedTime(zonedTimeToUtc(date, this.timeZone), this.timeZone)
      ),
      this.timeZone
    );
  }

  onEventCardClicked(
    scheduleEvent: EventDTO,
    event: Event,
    trigger: CdkOverlayOrigin
  ) {
    event.stopPropagation();
    this.eventClicked.emit(scheduleEvent);

    if (this.showPopOverOnClick) {
      this.openPopup(trigger);
    }
  }

  calculateVisibleEvents() {
    const cardAndHeaderHeight = this.headerRef.nativeElement.offsetHeight;

    const containerHeight =
      this.containerRef.nativeElement.offsetHeight - cardAndHeaderHeight;

    const maxVisibleEvents = Math.floor(containerHeight / cardAndHeaderHeight);
    this.visibleEvents = this.events.slice(0, maxVisibleEvents);
    this.hiddenEventsCount = Math.max(0, this.events.length - maxVisibleEvents);
  }

  // eslint-disable-next-line class-methods-use-this
  isAllDayEvent = (startDateTime: Date, endDateTime: Date) => {
    const minutesDifference = differenceInMinutes(endDateTime, startDateTime);

    return minutesDifference === 1439; //  24 hours
  };

  onRightClick(event: MouseEvent, record: EventDTO) {
    event.preventDefault();
    if (this.rightClickEnable) {
      const index = this.visibleEvents.findIndex(
        (r) => r.eventId === record.eventId
      );
      this.contextMenus.get(index)?.menu?.focusFirstItem('mouse');
      this.contextMenus.get(index)?.openMenu();
    }
  }
}
