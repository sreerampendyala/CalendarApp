import { CdkOverlayOrigin, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChildren,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import {
  startOfDay,
  areIntervalsOverlapping,
  addMinutes,
  differenceInSeconds,
  parse,
  differenceInMinutes,
  isWithinInterval,
} from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime, formatInTimeZone } from 'date-fns-tz';
import { Subject } from 'rxjs';
import {
  EventDTO,
  BlockedEvent,
  WeekDayEvent,
  BlockedDayEvent,
  Scale,
} from 'src/event-calendar/event-calendar.models';
import { CalendarEventContentPopoverComponent } from 'src/event-calendar/helpers/calendar-event-content-popover/calendar-event-content-popover.component';

@Component({
  selector: 'app-day-card',
  templateUrl: './day-card.component.html',
  styleUrls: ['./day-card.component.scss'],
})
export class DayCardComponent {
  @Input() timeZone: string = 'US/Eastern';

  @Input() resourceId: number = 0;

  @Input() events: EventDTO[] = [];

  @Input() timeStamps: string[] = [];

  @Input() day: string = '';

  @Input() blockedSlots: BlockedEvent[] = [];

  @Input() timeScale: Scale = Scale.HHour;

  @Input() allowBlockedSlotOverride: boolean = false;

  @Input() showPopOverOnClick: boolean = false;

  @Input() rightClickEnable: boolean = false;

  @Input() slotRightClickEnableForResourceId: number = 0;

  @Input() overlayCloseSubject: Subject<void> = new Subject<void>();

  @Output() addEventInDayRangeClicked: EventEmitter<{
    start: string;
    end: string;
    resourceId: number;
  }> = new EventEmitter<{ start: string; end: string; resourceId: number }>();

  @Output() eventClicked: EventEmitter<EventDTO> = new EventEmitter<EventDTO>();

  @ContentChild('popoverContentMV') popoverContentMV: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('contextMenuContentDV') contextMenuContentDV: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('slotContextMenuContentDV')
  slotContextMenuContentDV: TemplateRef<any> = {} as TemplateRef<any>;

  @ViewChildren('eventContextMenuTrigger')
  eventContextMenus!: QueryList<MatMenuTrigger>;

  @ViewChildren('slotContextMenuTrigger')
  slotContextMenus!: QueryList<MatMenuTrigger>;

  endDateTimeStamps: string[] = [];

  formattedEvents: WeekDayEvent[][] = [];

  formattedBlockedEvents: BlockedDayEvent[] = [];

  isOverlayOpen: boolean = false;

  triggerOrigin: CdkOverlayOrigin = {} as CdkOverlayOrigin;

  overlayRef: OverlayRef | null = null;

  constructor(public overlay: Overlay) {}

  ngOnInit(): void {
    this.getEndTimeSlot();
    this.createView();

    this.overlayCloseSubject.subscribe(() => {
      if (this.overlayRef) {
        this.overlayRef.dispose();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']?.currentValue !== changes['events']?.previousValue) {
      this.createView();
    }
  }

  createView() {
    this.formattedEvents = [];
    if (this.events.length) {
      this.formatEvents(this.events.slice());
    }
    this.formattedBlockedEvents = [];
    this.formatBlockedEvents(this.blockedSlots.slice());
  }

  formatBlockedEvents(events: BlockedEvent[]) {
    if (!this.blockedSlots.length) return;

    events.forEach(({ endDateTime, startDateTime }) => {
      this.formattedBlockedEvents.push({
        left: '0',
        right: '0',
        endDateTime,
        startDateTime,
        top: this.getTopOrBottomCoordinates(
          startDateTime,
          zonedTimeToUtc(
            startOfDay(utcToZonedTime(startDateTime, this.timeZone)),
            this.timeZone
          )
        ),
        bottom: this.getTopOrBottomCoordinates(
          endDateTime,
          zonedTimeToUtc(
            startOfDay(utcToZonedTime(startDateTime, this.timeZone)),
            this.timeZone
          ),
          true
        ),
      });
    });
  }

  formatEvents(events: EventDTO[]) {
    if (!events.length) return;

    const overlappingEvents = events
      .filter((event) =>
        areIntervalsOverlapping(
          {
            start: events[0].startDateTime,
            end: addMinutes(events[0].endDateTime, 1),
          },
          {
            start: event.startDateTime,
            end: event.endDateTime,
          }
        )
      )
      .sort(
        (a, b) =>
          differenceInSeconds(b.endDateTime, b.startDateTime) -
          differenceInSeconds(a.endDateTime, a.startDateTime)
      );

    this.formattedEvents.push(
      overlappingEvents.map((e, i) => ({
        ...e,
        top: this.getTopOrBottomCoordinates(
          e.startDateTime,
          zonedTimeToUtc(
            startOfDay(utcToZonedTime(e.startDateTime, this.timeZone)),
            this.timeZone
          )
        ),
        bottom: this.getTopOrBottomCoordinates(
          e.endDateTime,
          zonedTimeToUtc(
            startOfDay(utcToZonedTime(e.startDateTime, this.timeZone)),
            this.timeZone
          ),
          true
        ),
        ...this.getLeftAndRightCoordinates(i, overlappingEvents.length),
      }))
    );

    const remainingEvents = events.filter(
      (e) => !overlappingEvents.map((oe) => oe.eventId).includes(e.eventId)
    );

    this.formatEvents(remainingEvents);
  }

  getEndTimeSlot() {
    this.endDateTimeStamps = this.timeStamps.map((time) =>
      zonedTimeToUtc(
        addMinutes(
          parse(
            time,
            'hh:mm a',
            new Date(formatInTimeZone(this.day, this.timeZone, 'MM/dd/yyyy'))
          ),
          this.timeScale
        ),
        this.timeZone
      ).toISOString()
    );
  }

  onSlotClick(start: string, end: string) {
    this.addEventInDayRangeClicked.emit({
      start: zonedTimeToUtc(
        parse(
          start,
          'hh:mm a',
          new Date(formatInTimeZone(this.day, this.timeZone, 'MM/dd/yyyy'))
        ),
        this.timeZone
      ).toISOString(),
      end,
      resourceId: this.resourceId,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getTopOrBottomCoordinates(date: Date, startOfDate: Date, isBottom = false) {
    const calculatedValue =
      (Math.abs(differenceInMinutes(date, startOfDate)) * 100) / 1440;

    return `${isBottom ? 100 - calculatedValue : calculatedValue}%`;
  }

  // eslint-disable-next-line class-methods-use-this
  getLeftAndRightCoordinates(index: number, totalCount: number) {
    return {
      left: `${(100 / totalCount) * index}%`,
      right: `${100 - (100 / totalCount) * (index + 1)}%`,
    };
  }

  openPopup(trigger: CdkOverlayOrigin) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(trigger.elementRef)
        .withViewportMargin(100)
        .withPush(true)
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
            panelClass: ['event-arrow-extension', 'bottom'],
          },
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            panelClass: ['event-arrow-extension', 'top'],
          },
        ]),
    });

    const componentRef = this.overlayRef.attach(
      new ComponentPortal(CalendarEventContentPopoverComponent)
    );

    componentRef.instance.content = this.popoverContentMV;
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

  onRightClickEvent(scheduleEvent: EventDTO, event: MouseEvent, index: number) {
    event.preventDefault();
    if (
      this.rightClickEnable &&
      scheduleEvent.startDateTime >= startOfDay(this.currentTime)
    ) {
      this.eventContextMenus.get(index)?.menu?.focusFirstItem('mouse');
      this.eventContextMenus.get(index)?.openMenu();
    }
  }

  onRightClickSlot(endTime: string, event: MouseEvent, index: number) {
    event.preventDefault();
    let isPartOfBlockedEvent = false;
    this.blockedSlots.forEach((slot) => {
      isPartOfBlockedEvent =
        isPartOfBlockedEvent ||
        isWithinInterval(new Date(endTime), {
          start: addMinutes(new Date(slot.startDateTime), 1),
          end: new Date(slot.endDateTime),
        });
    });

    if (
      this.slotRightClickEnableForResourceId === this.resourceId &&
      new Date(endTime) >= this.currentTime &&
      !isPartOfBlockedEvent
    ) {
      this.slotContextMenus.get(index)?.menu?.focusFirstItem('mouse');
      this.slotContextMenus.get(index)?.openMenu();
    }
  }

  getEventIndex(eventId: number) {
    return this.formattedEvents.flat().findIndex((e) => e.eventId === eventId);
  }

  // eslint-disable-next-line class-methods-use-this
  get currentTime() {
    return new Date();
  }
}
