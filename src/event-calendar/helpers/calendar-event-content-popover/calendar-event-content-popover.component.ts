import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-calendar-event-content-popover',
  templateUrl: './calendar-event-content-popover.component.html',
  styleUrls: ['./calendar-event-content-popover.component.scss'],
})
export class CalendarEventContentPopoverComponent {
  @Input() content: TemplateRef<any> | null = null;

  @Input() noPadding: boolean = false;
}
