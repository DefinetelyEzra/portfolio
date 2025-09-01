export type CalendarEventType = "project" | "milestone" | "skill" | "personal";

export interface CalendarEvent {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly date: Date;
  readonly type: CalendarEventType;
  readonly color?: string;
  readonly isRecurring?: boolean;
  readonly metadata?: {
    readonly projectId?: string;
    readonly skillLevel?: number;
    readonly link?: string;
    readonly tags?: readonly string[];
  };
}

export interface CalendarSettings {
  readonly showWeekNumbers: boolean;
  readonly startWeek: "sunday" | "monday";
  readonly highlightToday: boolean;
  readonly showEvents: boolean;
  readonly eventCategories: readonly CalendarEventType[];
  readonly theme: "light" | "dark" | "auto";
  readonly animation: "minimal" | "smooth" | "bouncy";
}

export interface CalendarDay {
  readonly date: Date;
  readonly isCurrentMonth: boolean;
  readonly isToday: boolean;
  readonly events: readonly CalendarEvent[];
  readonly dayOfWeek: number;
}

export interface PortfolioMilestone {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: Date;
  readonly category: "project" | "skill" | "achievement" | "learning";
  readonly importance: "low" | "medium" | "high";
  readonly funFact?: string;
}

export interface FunFact {
  readonly id: string;
  readonly text: string;
  readonly category: "tech" | "personal" | "random" | "portfolio";
  readonly isEasterEgg?: boolean;
}
