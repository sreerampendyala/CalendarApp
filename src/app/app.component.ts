import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Subject } from 'rxjs';
import {
  ResourceBlockedEvent,
  BlockedEvent,
  Views,
  ResourceEvents,
  EventDTO,
} from 'src/event-calendar/event-calendar.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'CalendarApp';

  readonly CalendarView = Views;

  view: Views = Views.Week;

  dateControl: UntypedFormControl = new UntypedFormControl('');

  overlayCloseSubject: Subject<void> = new Subject<void>();

  clickedEvent: EventDTO = {} as EventDTO;

  date: Date = new Date();

  events: EventDTO[] = [
    {
      eventName: 'Event 3',
      backgroundColor: '#0069a3',
      foregroundColor: '#fff',
      endDateTime: new Date(
        zonedTimeToUtc(new Date('5/1/2023').setHours(8, 0, 0, 0), 'US/Eastern')
      ),
      startDateTime: new Date(
        zonedTimeToUtc(new Date('5/1/2023').setHours(7, 0, 0, 0), 'US/Eastern')
      ),
      eventId: 3,
      recurringEvent: true,
    },
    {
      eventName: 'Event 1',
      backgroundColor: '#0069a3',
      foregroundColor: '#fff',
      endDateTime: new Date(
        zonedTimeToUtc(new Date().setHours(11, 0, 0, 0), 'US/Eastern')
      ),
      startDateTime: new Date(
        zonedTimeToUtc(new Date().setHours(9, 0, 0, 0), 'US/Eastern')
      ),
      eventId: 1,
      recurringEvent: true,
    },
    {
      eventName: 'Event 2',
      backgroundColor: '#ffd630',
      foregroundColor: '#000',
      endDateTime: new Date(
        zonedTimeToUtc(new Date().setHours(18, 0, 0, 0), 'US/Eastern')
      ),
      startDateTime: new Date(
        zonedTimeToUtc(new Date().setHours(5, 0, 0, 0), 'US/Eastern')
      ),
      eventId: 2,
      recurringEvent: false,
    },
    {
      eventName: 'Event 1dcdscdscdssdcdcdsscsdcdcsdcdscdscdscdscsdcs',
      backgroundColor: '#00e9d1',
      foregroundColor: '#000',
      endDateTime: new Date(new Date().setHours(12, 0, 0, 0)),
      startDateTime: new Date(new Date().setHours(10, 0, 0, 0)),
      eventId: 3,
      recurringEvent: false,
      cardTrailingIconText: 'R',
      showCardTitleTrailingIcon: true,
    },
    {
      eventName: 'Event 2',
      backgroundColor: '#ffd630',
      foregroundColor: '#000',
      endDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            11,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      startDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            8,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      eventId: 4,
      recurringEvent: true,
    },
    {
      eventName: 'Event 12',
      backgroundColor: '#ffd630',
      foregroundColor: '#000',
      endDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            11,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      startDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            8,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      eventId: 4,
      recurringEvent: true,
    },
    {
      eventName: 'Event 3',
      backgroundColor: '#0069a3',
      foregroundColor: '#fff',
      endDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            13,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      startDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            12,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      eventId: 5,
      recurringEvent: true,
    },
    {
      eventName: 'Event 4',
      backgroundColor: '#003731',
      foregroundColor: '#fff',
      endDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            15,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      startDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            14,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      eventId: 6,
      recurringEvent: true,
    },
    {
      eventName: 'Event 5',
      backgroundColor: '#2f1b41',
      foregroundColor: '#fff',
      endDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            17,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      startDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            16,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      eventId: 7,
      recurringEvent: true,
    },
    {
      eventName: 'Event 6',
      backgroundColor: '#2f1b41',
      foregroundColor: '#fff',
      endDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            24,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      startDateTime: new Date(
        zonedTimeToUtc(
          new Date(new Date().setDate(new Date().getDate() - 1)).setHours(
            20,
            0,
            0,
            0
          ),
          'US/Eastern'
        )
      ),
      eventId: 8,
      recurringEvent: true,
    },
  ];

  resourceEvents: ResourceEvents[] = [
    {
      resourceId: 100,
      events: this.events,
    },
  ];

  blockedSlots: ResourceBlockedEvent[] = [
    {
      resourceId: 100,
      events: (() => {
        const days = eachDayOfInterval({
          start: startOfWeek(new Date()),
          end: endOfWeek(new Date()),
        });

        const blockedSlots: BlockedEvent[] = [];

        days.forEach((day) =>
          blockedSlots.push({
            startDateTime: new Date(
              zonedTimeToUtc(new Date(day.setHours(0, 0, 0, 0)), 'US/Eastern')
            ),
            endDateTime: new Date(
              zonedTimeToUtc(new Date(day.setHours(5, 0, 0, 0)), 'US/Eastern')
            ),
          })
        );
        return blockedSlots;
      })(),
    },
  ];

  changeView(view: Views) {
    this.view = view;
  }

  onEventClicked(event: EventDTO) {
    console.log('Event clicked', event);
    this.clickedEvent = event;
  }

  onBadgeClicked() {
    console.log('Badge Clicked');
  }

  onAddEventInMonthClicked(date: string) {
    console.log('Add Event Month Clicked', date);
  }

  onAddEventInDayRangeClicked(obj: {
    start: string;
    end: string;
    resourceId: number;
  }) {
    console.log('Add Day Range  Clicked', obj);
  }

  handleDateChange(selectedDate: string | null) {
    if (selectedDate) {
      this.date = new Date(selectedDate);
    }
  }

  closePopOver() {
    this.overlayCloseSubject.next();
  }

  scrollTo5() {
    document.getElementById('event-100-7')?.scrollIntoView();
    document.getElementById('event-100-7')?.focus();
  }
}
