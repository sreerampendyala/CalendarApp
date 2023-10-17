export enum Actions {
  Add,
  Edit,
}

export enum Views {
  Month,
  Week,
  Day,
}

export enum Scale {
  Hour = 60,
  TQHour = 45,
  HHour = 30,
  QHour = 15,
}

export interface EventAlignment {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export interface EventDTO {
  startDateTime: Date;
  endDateTime: Date;
  eventName: string;
  recurringEvent: boolean;
  eventId: number;
  backgroundColor: string;
  foregroundColor: string;
  showCardTitleTrailingIcon?: boolean;
  cardTrailingIconText?: string;
}

export interface BlockedEvent {
  startDateTime: Date;
  endDateTime: Date;
}

export interface ResourceEvents {
  resourceId: number;
  events: EventDTO[];
}

export interface WeekDayEvent extends EventDTO, EventAlignment {}

export interface BlockedDayEvent extends BlockedEvent, EventAlignment {}

export interface CalendarEventView {
  resourceId: number;
  events: {
    [date: string]: EventDTO[];
  };
}

export interface ResourceBlockedEvent {
  resourceId: number;
  events: BlockedEvent[];
}

export interface ResourceBlockedEventsView {
  resourceId: number;
  events: {
    [date: string]: BlockedEvent[];
  };
}

export interface EventCalendarActionEvent {
  eventId?: number;
  actionType: Actions;
}
