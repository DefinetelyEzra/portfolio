export interface WidgetPosition {
  readonly x: number;
  readonly y: number;
}

export interface WidgetSize {
  readonly width: number;
  readonly height: number;
}

export interface LayoutSettings {
  readonly showGrid?: boolean; 
  readonly enableAnimations?: boolean;
}

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  showGrid: false,
  enableAnimations: true,
} as const;