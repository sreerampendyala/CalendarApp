import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Subject } from 'rxjs';
import {
  CalendarEventView,
  ResourceBlockedEventsView,
  EventDTO,
  Views,
  Scale,
} from '../event-calendar.models';
import { CalendarScrollService } from '../helpers/calendarScrollService/calendar-scroll.service';

@Component({
  selector: 'app-days-view',
  templateUrl: './days-view.component.html',
  styleUrls: ['./days-view.component.scss'],
})
export class DaysViewComponent {
  @Input() timeZone: string = 'US/Eastern';

  @Input() selectedDate: Date = utcToZonedTime(new Date(), this.timeZone);

  @Input() calendarView: Views = Views.Day;

  @Input() eventDetails: CalendarEventView | null = null;

  @Input() blockedSlots: ResourceBlockedEventsView | null = null;

  @Input() timeScale: Scale = Scale.Hour;

  @Input() timeStamps: string[] = [];

  @Input() hasCardTitle: boolean = false;

  @Input() allowBlockedSlotOverride: boolean = false;

  @Input() showPopOverOnClick: boolean = false;

  @Input() rightClickEnable: boolean = false;

  @Input() slotRightClickEnableForResourceId: number = 0;

  @Input() overlayCloseSubject: Subject<void> = new Subject<void>();

  @ContentChild('popoverContentES') popoverContentES: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('contextMenuContentES') contextMenuContentES: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('slotContextMenuContentES')
  slotContextMenuContentES: TemplateRef<any> = {} as TemplateRef<any>;

  @ContentChild('resourceTitleDV') resourceTitleDV: TemplateRef<any> =
    {} as TemplateRef<any>;

  @Output() addEventInDayRangeClicked: EventEmitter<{
    start: string;
    end: string;
    resourceId: number;
  }> = new EventEmitter<{ start: string; end: string; resourceId: number }>();

  @Output() eventClicked: EventEmitter<EventDTO> = new EventEmitter<EventDTO>();

  daysInView: string[] = [];

  today: string = zonedTimeToUtc(
    startOfDay(utcToZonedTime(new Date(), this.timeZone)),
    this.timeZone
  ).toISOString();

  constructor(public scrollService: CalendarScrollService) {}

  ngOnInit(): void {
    this.today = zonedTimeToUtc(
      startOfDay(utcToZonedTime(new Date(), this.timeZone)),
      this.timeZone
    ).toISOString();
    this.createView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedDate']?.currentValue !==
        changes['selectedDate']?.previousValue ||
      changes['calendarView']?.currentValue !==
        changes['calendarView']?.previousValue
    ) {
      this.createView();
    }
  }

  createView() {
    if (this.eventDetails) {
      this.daysInView = Object.keys(this.eventDetails.events);
    }
  }

  onScroll(scrollTop: number) {
    this.scrollService.setScrollTop.next(scrollTop);
  }
}
