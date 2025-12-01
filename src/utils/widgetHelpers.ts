export function generateWidgetId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getDefaultWidgetPosition(): { x: number; y: number } {
  // SearchSpotlight is always centered at top
  if (globalThis.window === undefined) {
    return { x: 0, y: 20 };
  }

  const screenWidth = window.innerWidth;
  const widgetWidth = 450; // SearchSpotlight default width

  return {
    x: Math.max(0, (screenWidth / 2) - (widgetWidth / 2)),
    y: 20
  };
}