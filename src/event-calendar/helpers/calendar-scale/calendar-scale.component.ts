import { CdkOverlayOrigin, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Scale } from 'src/event-calendar/event-calendar.models';
import { CalendarEventContentPopoverComponent } from '../calendar-event-content-popover/calendar-event-content-popover.component';

@Component({
  selector: 'app-calendar-scale',
  templateUrl: './calendar-scale.component.html',
  styleUrls: ['./calendar-scale.component.scss'],
})
export class CalendarScaleComponent {
  readonly Scale = Scale;

  @Input() timeScale: Scale = Scale.Hour;

  @ViewChild('scalePopover') scalePopoverContent: TemplateRef<any> =
    {} as TemplateRef<any>;

  @Output() changedTimeScale: EventEmitter<Scale> = new EventEmitter<Scale>();

  triggerOrigin: CdkOverlayOrigin = {} as CdkOverlayOrigin;

  overlayRef: OverlayRef | null = null;

  constructor(public overlay: Overlay) {}

  openPopup(trigger: CdkOverlayOrigin) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(trigger.elementRef)
        .withViewportMargin(100)
        .withPush(false)
        .withFlexibleDimensions(false)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
          },
        ]),
    });

    const componentRef = this.overlayRef.attach(
      new ComponentPortal(CalendarEventContentPopoverComponent)
    );

    componentRef.instance.content = this.scalePopoverContent;
    componentRef.instance.noPadding = true;

    this.overlayRef.outsidePointerEvents().subscribe(() => {
      this.overlayRef?.dispose();
    });
  }

  onScaleIconClicked(
    scale: Scale,
    isPopOverClosed: boolean,
    trigger: CdkOverlayOrigin
  ) {
    if (isPopOverClosed) {
      this.overlayRef?.dispose();
      this.changedTimeScale.emit(scale);
    } else {
      this.openPopup(trigger);
    }
  }
}
