import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWidgetStore } from '@/store/widgetStore';
import { WIDGET_REGISTRY } from './index';
import { getContainerBounds, validateWidgetPosition } from '@/utils/widgetLayout';
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
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sortedWidgets = useMemo(() => {
    return [...widgets]
      .sort((a, b) => {
        // Ensure SearchSpotlight always has the highest zIndex
        if (a.type === 'search-spotlight') return 1;
        if (b.type === 'search-spotlight') return -1;
        return a.zIndex - b.zIndex;
      });
  }, [widgets]);

  // Enhanced resize handler with debouncing and responsive repositioning
  useEffect(() => {
    // Extracted function to update widget positions
    const updateWidgetPositions = (newBounds: { width: number; height: number }) => {
      widgets.forEach(widget => {
        const newPosition = getDefaultWidgetPosition(widget.type);
        const validatedPosition = validateWidgetPosition(newPosition, widget.size, newBounds);

        // Only update if position actually changed
        if (validatedPosition.x !== widget.position.x || validatedPosition.y !== widget.position.y) {
          updateWidget(widget.id, { position: validatedPosition });
        }
      });
    };

    const handleResize = () => {
      // Clear existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize handling
      resizeTimeoutRef.current = setTimeout(() => {
        const newBounds = getContainerBounds();
        setContainerBounds(newBounds);
        updateWidgetPositions(newBounds);
      }, 150);
    };

    if (typeof window !== 'undefined') {
      // Handle initial load
      handleResize();

      // Add event listeners
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current);
        }
      };
    }
  }, [widgets, updateWidget]);

  // Handle viewport changes for better responsive behavior
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          // Recheck positions when page becomes visible again
          const newBounds = getContainerBounds();
          setContainerBounds(newBounds);

          widgets.forEach(widget => {
            const validatedPosition = validateWidgetPosition(
              widget.position,
              widget.size,
              newBounds
            );

            if (validatedPosition.x !== widget.position.x || validatedPosition.y !== widget.position.y) {
              updateWidget(widget.id, { position: validatedPosition });
            }
          });
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
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

  // Enhanced grid overlay with responsive sizing
  const renderGridOverlay = () => {
    if (!layoutSettings.showGrid) return null;

    // Responsive grid cell size based on screen width
    const getCellSize = () => {
      const width = containerBounds.width;
      if (width < 640) return 25;  // Small screens
      if (width < 1024) return 35; // Medium screens
      return 50; // Large screens
    };

    const cellSize = getCellSize();
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