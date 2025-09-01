export type ThemeType = 'light' | 'dark' | 'auto';
export type WidgetCategory = 'productivity' | 'system' | 'entertainment' | 'utility';
export type WeekStart = 'sunday' | 'monday';
export type EventCategory = 'project' | 'milestone' | 'skill' | 'personal';
export type AnimationType = 'minimal' | 'smooth' | 'bouncy';

export interface WidgetPosition {
  readonly x: number;
  readonly y: number;
}

export interface WidgetSize {
  readonly width: number;
  readonly height: number;
}

export interface WidgetConstraints {
  readonly minWidth: number;
  readonly minHeight: number;
  readonly maxWidth?: number;
  readonly maxHeight?: number;
}

export interface WidgetState {
  readonly id: string;
  readonly type: string;
  readonly position: WidgetPosition;
  readonly size: WidgetSize;
  readonly isVisible: boolean;
  readonly zIndex: number;
  readonly settings: Record<string, unknown>;
  readonly constraints?: { 
    readonly minWidth: number;
    readonly minHeight: number;
    readonly maxWidth?: number;
    readonly maxHeight?: number;
  };
  readonly theme: ThemeType;
}

export interface WidgetConfig {
  readonly id: string;
  readonly type: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly defaultSize: WidgetSize;
  readonly constraints: WidgetConstraints;
  readonly defaultSettings: Record<string, unknown>;
  readonly category: WidgetCategory;
}

import { LayoutSettings } from "./widgetLayout";

export interface BaseWidgetProps {
  readonly widget: WidgetState;
  readonly children: React.ReactNode;
  readonly title: string;
  readonly className?: string;
  readonly onClose: () => void;
  readonly onSettingsChange?: (settings: Record<string, unknown>) => void;
  readonly layoutSettings?: LayoutSettings;
  readonly containerBounds?: { width: number; height: number };
}

export interface TimezoneOption {
  readonly value: string;
  readonly label: string;
  readonly offset: string;
}

export interface ClockSettings {
  readonly timezone: string;
  readonly showSeconds: boolean;
  readonly use24Hour: boolean;
  readonly showDate: boolean;
  readonly theme: ThemeType;
}

export interface CalendarSettings {
  readonly showWeekNumbers: boolean;
  readonly startWeek: WeekStart;
  readonly highlightToday: boolean;
  readonly showEvents: boolean;
  readonly eventCategories: readonly EventCategory[];
  readonly theme: ThemeType;
  readonly animation: AnimationType;
}