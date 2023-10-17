import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  format,
  eachWeekendOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Subject } from 'rxjs';
import { CalendarEventView, EventDTO } from '../event-calendar.models';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent {
  @Input() timeZone: string = 'US/Eastern';

  @Input() dateInMonth: Date = utcToZonedTime(new Date(), this.timeZone);

  @Input() eventDetails: CalendarEventView | null = null;

  @Input() showPopOverOnClick: boolean = false;

  @Input() hasCardTitle: boolean = false;

  @Input() rightClickEnable: boolean = false;

  @Input() overlayCloseSubject: Subject<void> = new Subject<void>();

  @ContentChild('popoverContentES') popoverContentES: TemplateRef<any> =
    {} as TemplateRef<any>;

  @ContentChild('contextMenuContentES') contextMenuContentES: TemplateRef<any> =
    {} as TemplateRef<any>;

  today: string = zonedTimeToUtc(
    startOfDay(utcToZonedTime(new Date(), this.timeZone)),
    this.timeZone
  ).toISOString();

  daysInMonth: string[][] = [];

  @Output() badgeClicked: EventEmitter<string> = new EventEmitter<string>();

  @Output() addEventInMonthClicked: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() eventClicked: EventEmitter<EventDTO> = new EventEmitter<EventDTO>();

  weekHeaders = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  title: string = 'January 1996';

  year: string = '1996';

  ngOnInit(): void {
    this.createView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['dateInMonth']?.currentValue !==
      changes['dateInMonth']?.previousValue
    ) {
      this.createView();
    }
  }

  createView() {
    this.today = zonedTimeToUtc(
      startOfDay(utcToZonedTime(new Date(), this.timeZone)),
      this.timeZone
    ).toISOString();
    this.daysInMonth = this.getDaysInMonth();
    this.title = format(this.dateInMonth, 'LLLL yyyy');
  }

  getDaysInMonth(): string[][] {
    const eachWeekend = eachWeekendOfMonth(this.dateInMonth);

    const monthDays: string[] = [];

    eachWeekend.forEach((date) => {
      monthDays.push(
        JSON.stringify(
          eachDayOfInterval({
            start: startOfWeek(date),
            end: endOfWeek(date),
          }).map((wDate) => zonedTimeToUtc(wDate, this.timeZone).toISOString())
        )
      );
    });

    return [...new Set(monthDays)].map((r) => JSON.parse(r));
  }

  getStartOfMonth(date: Date) {
    return zonedTimeToUtc(
      startOfMonth(utcToZonedTime(date, this.timeZone)),
      this.timeZone
    );
  }

  getEndOfMonth(date: Date) {
    return zonedTimeToUtc(
      endOfMonth(utcToZonedTime(date, this.timeZone)),
      this.timeZone
    );
  }

  onDayClick(day: string) {
    const start = this.getStartOfMonth(new Date(day));
    const end = this.getEndOfMonth(new Date(day));
    if (
      isWithinInterval(new Date(day), {
        start,
        end,
      })
    ) {
      this.addEventInMonthClicked.emit(day);
    }
  }
}
