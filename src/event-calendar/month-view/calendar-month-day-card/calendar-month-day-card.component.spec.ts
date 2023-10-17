import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMonthDayCardComponent } from './calendar-month-day-card.component';

describe('CalendarMonthDayCardComponent', () => {
  let component: CalendarMonthDayCardComponent;
  let fixture: ComponentFixture<CalendarMonthDayCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarMonthDayCardComponent]
    });
    fixture = TestBed.createComponent(CalendarMonthDayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
