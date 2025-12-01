export type ThemeType = 'light' | 'dark' | 'auto';

export interface WidgetPosition {
  readonly x: number;
  readonly y: number;
}

export interface WidgetSize {
  readonly width: number;
  readonly height: number;
}

export interface WidgetState {
  readonly id: string;
  readonly type: string;
  readonly position: WidgetPosition;
  readonly size: WidgetSize;
  readonly isVisible: boolean;
  readonly zIndex: number;
  readonly settings: Record<string, unknown>;
  readonly theme: ThemeType;
  readonly constraints?: { 
    readonly minWidth: number;
    readonly minHeight: number;
    readonly maxWidth?: number;
    readonly maxHeight?: number;
  };
}