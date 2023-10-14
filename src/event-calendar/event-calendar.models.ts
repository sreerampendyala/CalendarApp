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

export interface CalendarEvent {
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

export interface ResourceEvemts {
  resourceId: number;
  events: CalendarEvent[];
}

export interface WeekDayEvent extends CalendarEvent, EventAlignment {}

export interface BlockedDayEvent extends BlockedEvent, EventAlignment {}

export interface CalendarEventView {
  resourceId: number;
  events: {
    [date: string]: CalendarEvent[];
  };
}

export interface ResouceBlockedEvent {
  resourceId: number;
  events: BlockedEvent[];
}

export interface ResourceBlockedEventView {
  resourceId: number;
  events: {
    [date: string]: BlockedEvent[];
  };
}

export interface EventCalendarActionEvent {
  eventId?: number;
  actionType: Actions;
}
