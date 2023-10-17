import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarScaleComponent } from './calendar-scale.component';

describe('CalendarScaleComponent', () => {
  let component: CalendarScaleComponent;
  let fixture: ComponentFixture<CalendarScaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarScaleComponent]
    });
    fixture = TestBed.createComponent(CalendarScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
