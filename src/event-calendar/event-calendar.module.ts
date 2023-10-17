import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EventCalendarComponent } from './event-calendar.component';
import { CalendarScrollService } from './helpers/calendarScrollService/calendar-scroll.service';
import { CalendarScrollDirective } from './helpers/calendarScrollDirective/calendar-scroll.directive';
import { MonthViewComponent } from './month-view/month-view.component';
import { DaysViewComponent } from './days-view/days-view.component';
import { CalendarScaleComponent } from './helpers/calendar-scale/calendar-scale.component';
import { CalendarMonthDayCardComponent } from './month-view/calendar-month-day-card/calendar-month-day-card.component';
import { CalendarEventContentPopoverComponent } from './helpers/calendar-event-content-popover/calendar-event-content-popover.component';
import { DayCardComponent } from './days-view/day-card/day-card.component';
import { CalendarTZPipe } from './helpers/calendarTimeZonePipe/calendar-tz.pipe';

@NgModule({
  declarations: [
    EventCalendarComponent,
    CalendarTZPipe,
    CalendarScrollDirective,
    MonthViewComponent,
    DaysViewComponent,
    CalendarScaleComponent,
    CalendarMonthDayCardComponent,
    CalendarEventContentPopoverComponent,
    DayCardComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    OverlayModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [EventCalendarComponent],
  providers: [CalendarScrollService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EventCalendarModule {}
