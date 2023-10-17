import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarEventContentPopoverComponent } from './calendar-event-content-popover.component';

describe('CalendarEventContentPopoverComponent', () => {
  let component: CalendarEventContentPopoverComponent;
  let fixture: ComponentFixture<CalendarEventContentPopoverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarEventContentPopoverComponent]
    });
    fixture = TestBed.createComponent(CalendarEventContentPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
