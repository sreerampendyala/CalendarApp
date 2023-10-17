import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  EventDTO,
  CalendarEventView,
  ResourceBlockedEvent,
  ResourceBlockedEventsView,
  ResourceEvents,
  Scale,
  Views,
} from './event-calendar.models';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Subject } from 'rxjs';
import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  eachMinuteOfInterval,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  differenceInMinutes,
} from 'date-fns';
import { CalendarScrollService } from './helpers/calendarScrollService/calendar-scroll.service';

@Component({
  selector: 'app-event-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
})
export class EventCalendarComponent
  implements OnInit, AfterViewInit, OnChanges
{
  readonly CalendarView = Views;

  readonly Scale = Scale;

  @Input() timeZone: string = 'US/Eastern';

  @Input() date: Date = utcToZonedTime(new Date(), this.timeZone);

  @Input() calendarView: Views = Views.Day;

  @Input() timeScale: Scale = Scale.Hour;

  @Input() blockedSlots: ResourceBlockedEvent[] = [];

  @Input() showPopOverOnClick: boolean = false;

  @Input() resourceEvents: ResourceEvents[] = [];

  @Input() hasCardTitle: boolean = false;

  @Input() hasRightClickEnabled: boolean = false;

  @Input() rightClickEnabledResourceId: number = 0;

  @Input() allowBlockedSlotsOverride: boolean = false;

  @Input() overlayCloseSubject: Subject<void> = new Subject<void>();

  @ViewChild('timeMarkerContainer') timeMarkerContainer!: ElementRef;

  @ContentChild('popoverContent') popoverContent: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('contextMenuContent') contextMenuContent: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('slotContextMenuContent')
  slotContextMenuContent: TemplateRef<any> = {} as TemplateRef<any>;

  @ContentChild('resourceTitle') resourceTitle: TemplateRef<any> =
    {} as TemplateRef<any>;

  @Output() badgeClicked: EventEmitter<string> = new EventEmitter<string>();

  @Output() addEventInMonthClicked: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() eventClicked: EventEmitter<EventDTO> = new EventEmitter<EventDTO>();

  @Output() dayRangeEventClicked: EventEmitter<
    EventDTO & { resourceId: number }
  > = new EventEmitter<EventDTO & { resourceId: number }>();

  @Output() addEventInDayRangeClicked: EventEmitter<{
    start: string;
    end: string;
    resourceId: number;
  }> = new EventEmitter<{ start: string; end: string; resourceId: number }>();

  @Output() calenderScroll: EventEmitter<void> = new EventEmitter<void>();

  formattedEventsView: CalendarEventView[] = [];

  formattedBlockedEvents: ResourceBlockedEventsView[] = [];

  noonTime: string = '12:00 PM';

  timeStamps: string[] = [];

  constructor(public scrollService: CalendarScrollService) {}

  ngOnInit(): void {
    this.formattedEventsView = [];
    this.formatViewEvents();
    this.formatBlockedEvents();
  }

  ngAfterViewInit() {
    if (this.calendarView !== Views.Month) {
      this.scrollTimeMarker();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['date']?.currentValue !== changes?.['date']?.previousValue ||
      changes['calendarView']?.currentValue !==
        changes['calendarView']?.previousValue
    ) {
      this.createView();
    }
  }

  createView() {
    this.scrollService.resetToTop.next();
    this.formattedEventsView = [];
    this.formattedBlockedEvents = [];
    this.formatViewEvents();
    this.formatBlockedEvents();
  }

  scrollTimeMarker() {
    const topOffset = 250;
    const scrollTop =
      (this.timeMarkerContainer.nativeElement.clientHeight *
        Number(this.getMarkerPosition().slice(0, -1))) /
      100;
    this.scrollService.setScrollTop.next(scrollTop - topOffset);
  }

  formatViewEvents() {
    const allDays = this.getDays();

    this.resourceEvents.forEach((resourceEvent) => {
      let allEvents = resourceEvent?.events.slice() || [];

      this.formattedEventsView.push(
        allDays.reduce(
          (presentValue, currentValue) => {
            const dayEvents = allEvents.filter((e) =>
              isWithinInterval(e.startDateTime, {
                start: this.getStartOfDay(currentValue),
                end: this.getEndOfDay(currentValue),
              })
            );

            // To improve performance and remove the already mapped records.
            allEvents = allEvents.filter(
              (e) =>
                !isWithinInterval(e.startDateTime, {
                  start: this.getStartOfDay(currentValue),
                  end: this.getEndOfDay(currentValue),
                })
            );

            const rValue: CalendarEventView = {
              ...presentValue,
              events: {
                ...presentValue.events,
                [zonedTimeToUtc(currentValue, this.timeZone).toISOString()]:
                  dayEvents,
              },
            };

            return rValue;
          },
          {
            resourceId: resourceEvent.resourceId,
          } as CalendarEventView
        )
      );
    });
  }

  formatBlockedEvents() {
    if (this.calendarView === Views.Month) return;
    const allDays = this.getDays();

    this.blockedSlots.forEach((blockedSlot) => {
      let allEvents = blockedSlot?.events.slice() || [];

      this.formattedBlockedEvents.push(
        allDays.reduce(
          (presentValue, currentValue) => {
            const dayEvents = allEvents.filter((e) =>
              isWithinInterval(e.startDateTime, {
                start: this.getStartOfDay(currentValue),
                end: this.getEndOfDay(currentValue),
              })
            );

            // To improve performance and remove the already mapped records.
            allEvents = allEvents.filter(
              (e) =>
                !isWithinInterval(e.startDateTime, {
                  start: this.getStartOfDay(currentValue),
                  end: this.getEndOfDay(currentValue),
                })
            );

            const rValue: ResourceBlockedEventsView = {
              ...presentValue,
              events: {
                ...presentValue.events,
                [zonedTimeToUtc(currentValue, this.timeZone).toISOString()]:
                  dayEvents,
              },
            };

            return rValue;
          },
          {
            resourceId: blockedSlot.resourceId,
          } as ResourceBlockedEventsView
        )
      );
    });
  }

  getStartOfDay(date: Date) {
    return zonedTimeToUtc(
      startOfDay(
        utcToZonedTime(zonedTimeToUtc(date, this.timeZone), this.timeZone)
      ),
      this.timeZone
    );
  }

  getEndOfDay(date: Date) {
    return zonedTimeToUtc(
      endOfDay(
        utcToZonedTime(zonedTimeToUtc(date, this.timeZone), this.timeZone)
      ),
      this.timeZone
    );
  }

  onScroll(scrollTop: number) {
    this.scrollService.setScrollTop.next(scrollTop);
  }

  onChangedTimeScale(scale: Scale) {
    this.timeScale = scale;
    this.createView();
  }

  onDayRangeEventClicked(event: EventDTO, resourceId: number) {
    this.dayRangeEventClicked.emit({
      ...event,
      resourceId,
    });
  }

  getTimeStamps() {
    const date = utcToZonedTime(new Date(), this.timeZone);
    return eachMinuteOfInterval(
      {
        start: startOfDay(date),
        end: endOfDay(date),
      },
      {
        step: this.timeScale,
      }
    ).map((stamp) => format(stamp, 'hh:mm a'));
  }

  getDays() {
    switch (this.calendarView) {
      case Views.Month:
        return eachDayOfInterval({
          start: startOfMonth(this.date),
          end: endOfMonth(this.date),
        });

      case Views.Week:
        this.timeStamps = this.getTimeStamps();
        return eachDayOfInterval({
          start: startOfWeek(this.date),
          end: endOfWeek(this.date),
        });

      default:
        this.timeStamps = this.getTimeStamps();
        return [startOfDay(this.date)];
    }
  }

  getBlockedEventsOfResource(resourceId: number) {
    return (
      this.formattedBlockedEvents.find((be) => be.resourceId === resourceId) ||
      null
    );
  }

  get timeMarkerContainerHeight() {
    return `${3.375 * this.timeStamps.length}rem`;
  }

  // eslint-disable-next-line class-methods-use-this
  getMarkerPosition() {
    const zonedTime = utcToZonedTime(new Date(), this.timeZone);
    return `${
      (differenceInMinutes(zonedTime, startOfDay(zonedTime)) * 100) / 1440
    }%`;
  }

  // eslint-disable-next-line class-methods-use-this
  getTime(): string {
    const zonedTime = utcToZonedTime(new Date(), this.timeZone);
    return format(zonedTime, 'hh:mm a');
  }

  get marginConditionsOnDayRange(): string {
    const trail = this.calendarView === Views.Week ? 'week' : 'day';
    return this.hasCardTitle ? `with-header-${trail}` : `no-header-${trail}`;
  }
}
