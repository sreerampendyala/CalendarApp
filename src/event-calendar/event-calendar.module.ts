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
import { CalendarTZPipe } from './helpers/calendarTimeZonePipe/calendar-tz.pipe';
import { CalendarScrollDirective } from './helpers/calendarScrollDirective/calendar-scroll.directive';

@NgModule({
  declarations: [
    EventCalendarComponent,
    CalendarTZPipe,
    CalendarScrollDirective,
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
