import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '@/store/widgetStore';
import { WIDGET_REGISTRY } from './index';
import { getContainerBounds } from '@/utils/widgetLayout';
import { LayoutSettings, DEFAULT_LAYOUT_SETTINGS } from '@/types/widgetLayout';
import { WidgetState } from '@/types/widget';
import { getDefaultWidgetPosition } from '@/utils/widgetHelpers';

interface WidgetComponentProps {
  readonly widget: WidgetState;
  readonly onClose: () => void;
  readonly onSettingsChange: (settings: Record<string, unknown>) => void;
  readonly layoutSettings: LayoutSettings;
  readonly containerBounds: { width: number; height: number };
}

interface WidgetManagerProps {
  readonly layoutSettings?: LayoutSettings;
}

export default function WidgetManager({
  layoutSettings = DEFAULT_LAYOUT_SETTINGS
}: WidgetManagerProps) {
  const {
    widgets,
    updateWidget,
    removeWidget,
  } = useWidgetStore();

  const [containerBounds, setContainerBounds] = useState(() => getContainerBounds());
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedWidgets = useMemo(() => {
    return [...widgets]
      .sort((a, b) => {
        // Ensure SearchSpotlight always has the highest zIndex
        if (a.type === 'search-spotlight') return 1;
        if (b.type === 'search-spotlight') return -1;
        return a.zIndex - b.zIndex;
      });
  }, [widgets]);

  // Handle window resize to update responsive widget positions
  useEffect(() => {
    const handleResize = () => {
      const newBounds = getContainerBounds();
      setContainerBounds(newBounds);

      // Update positions for widgets that use responsive positioning
      widgets.forEach(widget => {
        const newPosition = getDefaultWidgetPosition(widget.type);
        if (newPosition.x !== widget.position.x || newPosition.y !== widget.position.y) {
          updateWidget(widget.id, { position: newPosition });
        }
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [widgets, updateWidget]);

  const handleClose = useCallback((widgetId: string) => {
    try {
      // First mark as invisible to trigger exit animation
      updateWidget(widgetId, { isVisible: false });

      // Then remove after animation completes
      setTimeout(() => {
        removeWidget(widgetId);
      }, 300); // Match the animation duration
    } catch (error) {
      console.warn('Error closing widget:', error);
    }
  }, [removeWidget, updateWidget]);

  const handleSettingsChange = useCallback((widgetId: string, settings: Record<string, unknown>) => {
    try {
      updateWidget(widgetId, { settings });
    } catch (error) {
      console.warn('Error updating widget settings:', error);
    }
  }, [updateWidget]);

  // Grid overlay for debugging positions
  const renderGridOverlay = () => {
    if (!layoutSettings.showGrid) return null;

    const cellSize = 50;
    const gridLines: React.ReactElement[] = [];

    for (let x = 0; x < containerBounds.width; x += cellSize) {
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={containerBounds.height}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="1"
        />
      );
    }

    for (let y = 0; y < containerBounds.height; y += cellSize) {
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={containerBounds.width}
          y2={y}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth="1"
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          width: containerBounds.width,
          height: containerBounds.height,
        }}
      >
        {gridLines}
      </svg>
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-10"
      style={{ pointerEvents: 'none' }}
    >
      {renderGridOverlay()}
      <AnimatePresence mode="sync">
        {sortedWidgets.map((widget) => {
          const WidgetComponent = WIDGET_REGISTRY[widget.type as keyof typeof WIDGET_REGISTRY] as React.ComponentType<WidgetComponentProps>;

          if (!WidgetComponent) {
            console.warn(`Unknown widget type: ${widget.type}`);
            return null;
          }

          return (
            <WidgetComponent
              key={widget.id}
              widget={widget}
              onClose={() => handleClose(widget.id)}
              onSettingsChange={(settings: Record<string, unknown>) => handleSettingsChange(widget.id, settings)}
              layoutSettings={layoutSettings}
              containerBounds={containerBounds}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}