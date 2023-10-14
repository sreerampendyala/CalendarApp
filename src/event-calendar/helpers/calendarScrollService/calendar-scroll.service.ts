import { Subject } from 'rxjs';

export class CalendarScrollService {
  verticalOffSet: Subject<number> = new Subject<number>();

  resetToTop: Subject<void> = new Subject<void>();

  setScrollTop: Subject<number> = new Subject<number>();
}
