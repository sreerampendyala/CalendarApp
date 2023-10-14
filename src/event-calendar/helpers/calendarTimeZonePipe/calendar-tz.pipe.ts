import { Pipe, PipeTransform } from '@angular/core';
import { formatInTimeZone } from 'date-fns-tz';

@Pipe({
  name: 'calendarTZ',
})
export class CalendarTZPipe implements PipeTransform {
  dateTimeFormats: { [key: string]: string } = {
    short: 'M/d/yy, h:mm a',
    dateTime: 'MM/dd/yyyy h:mm a',
    date: 'MM/dd/yyyy',
    time: 'HH:mm a',
  };

  transform(
    time: string | number | null | undefined,
    timeZone: string,
    format: string = this.dateTimeFormats['dateTime']
  ): string {
    if (!time || (typeof time === 'string' && time.length === 0)) return '';

    const dateTimeFormat = this.dateTimeFormats[format] || format;

    if (typeof time === 'number') {
      return formatInTimeZone(
        new Date(time).toISOString(),
        timeZone,
        dateTimeFormat
      );
    }

    return formatInTimeZone(time, timeZone, dateTimeFormat);
  }
}
