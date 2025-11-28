'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { useDesktopStore } from '@/store/desktopStore';

interface UseWindowManagerOptions {
  windowId: string;
  onFocus?: () => void;
  onMove?: (position: { x: number; y: number }) => void;
  onResize?: (size: { width: number; height: number }) => void;
}

interface WindowConstraints {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

interface DragState {
  startX: number;
  startY: number;
  startWindowX: number;
  startWindowY: number;
}

interface ResizeState {
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startWindowX: number;
  startWindowY: number;
  direction: string;
}

// Constants
const DOCK_HEIGHT = 80;
const HEADER_HEIGHT = 52;
const MIN_VISIBLE_WIDTH = 100;
const MIN_VISIBLE_HEIGHT = HEADER_HEIGHT;
const MIN_WINDOW_WIDTH = 300;
const MIN_WINDOW_HEIGHT = 200;
const RESIZE_THROTTLE_MS = 16; // ~60fps

export function useWindowManager({
  windowId,
  onFocus,
  onMove,
  onResize,
}: UseWindowManagerOptions) {
  const { windows, focusWindow, moveWindow, resizeWindow } = useDesktopStore();
  const dragStateRef = useRef<DragState | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastResizeTimeRef = useRef<number>(0); // For throttling

  // Memoized current window
  const currentWindow = useMemo(() =>
    windows.find(w => w.id === windowId),
    [windows, windowId]
  );

  // Simple viewport tracking
  const [viewport, setViewport] = useState(() => ({
    width: globalThis.window === undefined ? 1920 : window.innerWidth,
    height: globalThis.window === undefined ? 1080 : window.innerHeight
  }));

  useEffect(() => {
    if (globalThis.window === undefined) return;

    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized constraints calculation
  const getConstraints = useMemo((): WindowConstraints => {
    const windowWidth = currentWindow?.size.width || 300;

    return {
      minX: -windowWidth + MIN_VISIBLE_WIDTH,
      minY: 0,
      maxX: viewport.width - MIN_VISIBLE_WIDTH,
      maxY: viewport.height - DOCK_HEIGHT - MIN_VISIBLE_HEIGHT,
    };
  }, [currentWindow?.size.width, viewport.width, viewport.height]);

  // Handle window focus
  const handleFocus = useCallback(() => {
    focusWindow(windowId);
    onFocus?.();
  }, [windowId, focusWindow, onFocus]);

  // Handle drag start
  const handleDragStart = useCallback((event: MouseEvent) => {
    if (!currentWindow || currentWindow.isMaximized) return;

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWindowX: currentWindow.position.x,
      startWindowY: currentWindow.position.y,
    };

    handleFocus();
  }, [currentWindow, handleFocus]);

  // Optimized drag handler with RAF for smooth performance
  const handleDrag = useCallback((event: MouseEvent) => {
    if (!dragStateRef.current || !currentWindow || currentWindow.isMaximized) return;

    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Use RAF for smooth animation
    rafIdRef.current = requestAnimationFrame(() => {
      const deltaX = event.clientX - dragStateRef.current!.startX;
      const deltaY = event.clientY - dragStateRef.current!.startY;

      const newX = dragStateRef.current!.startWindowX + deltaX;
      const newY = dragStateRef.current!.startWindowY + deltaY;

      // Apply constraints
      const constrainedX = Math.max(
        getConstraints.minX,
        Math.min(getConstraints.maxX, newX)
      );
      const constrainedY = Math.max(
        getConstraints.minY,
        Math.min(getConstraints.maxY, newY)
      );

      // Only update if position actually changed
      if (constrainedX !== currentWindow.position.x || constrainedY !== currentWindow.position.y) {
        const newPosition = { x: constrainedX, y: constrainedY };
        moveWindow(windowId, newPosition);
        onMove?.(newPosition);
      }
    });
  }, [currentWindow, windowId, moveWindow, onMove, getConstraints]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    dragStateRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((event: MouseEvent) => {
    if (!currentWindow) return;

    event.preventDefault();
    event.stopPropagation();

    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: currentWindow.size.width,
      startHeight: currentWindow.size.height,
      startWindowX: currentWindow.position.x,
      startWindowY: currentWindow.position.y,
      direction: 'se',
    };

    lastResizeTimeRef.current = 0; // Reset throttle timer
    handleFocus();
  }, [currentWindow, handleFocus]);

  // Optimized resize handler with throttling + RAF
  const handleResize = useCallback((event: MouseEvent) => {
    if (!resizeStateRef.current || !currentWindow) return;

    const now = performance.now();
    if (now - lastResizeTimeRef.current < RESIZE_THROTTLE_MS) {
      // Skip if throttled
      return;
    }
    lastResizeTimeRef.current = now;

    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    rafIdRef.current = requestAnimationFrame(() => {
      const deltaX = event.clientX - resizeStateRef.current!.startX;
      const deltaY = event.clientY - resizeStateRef.current!.startY;

      let newWidth = Math.max(MIN_WINDOW_WIDTH, resizeStateRef.current!.startWidth + deltaX);
      let newHeight = Math.max(MIN_WINDOW_HEIGHT, resizeStateRef.current!.startHeight + deltaY);

      // Apply viewport constraints
      const maxWidth = viewport.width - currentWindow.position.x;
      const maxHeight = viewport.height - currentWindow.position.y - DOCK_HEIGHT;

      newWidth = Math.min(newWidth, Math.max(MIN_WINDOW_WIDTH, maxWidth));
      newHeight = Math.min(newHeight, Math.max(MIN_WINDOW_HEIGHT, maxHeight));

      const newSize = { width: newWidth, height: newHeight };

      // Update size
      resizeWindow(windowId, newSize);
      onResize?.(newSize);
    });
  }, [currentWindow, windowId, resizeWindow, onResize, viewport]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    resizeStateRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent): 'close' | 'minimize' | 'maximize' | null => {
    if (!currentWindow) return null;

    if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
      event.preventDefault();
      return 'close';
    }

    if ((event.metaKey || event.ctrlKey) && event.key === 'm') {
      event.preventDefault();
      return 'minimize';
    }

    if (event.key === 'F11' || ((event.metaKey || event.ctrlKey) && event.key === 'Enter')) {
      event.preventDefault();
      return 'maximize';
    }

    return null;
  }, [currentWindow]);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return {
    currentWindow,
    handleFocus,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleResizeStart,
    handleResize,
    handleResizeEnd,
    handleKeyDown,
    getConstraints,
  };
}