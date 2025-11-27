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

export function useWindowManager({
  windowId,
  onFocus,
  onMove,
  onResize,
}: UseWindowManagerOptions) {
  const { windows, focusWindow, moveWindow, resizeWindow } = useDesktopStore();
  const dragStateRef = useRef<DragState | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized current window
  const currentWindow = useMemo(() =>
    windows.find(w => w.id === windowId),
    [windows, windowId]
  );

  // Memoized constraints with viewport resize listener
  const [viewport, setViewport] = useState({
    // Is the window object defined?
    width: globalThis.window === undefined ? 1920 : window.innerWidth,
    height: globalThis.window === undefined ? 1080 : window.innerHeight
  });
  useEffect(() => {
    if (globalThis === undefined) return;

    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getConstraints = useMemo((): WindowConstraints => {
    const dockHeight = 80;
    const headerHeight = 52;
    const minVisibleWidth = 100;
    const minVisibleHeight = headerHeight;

    return {
      minX: -(currentWindow?.size.width || 300) + minVisibleWidth,
      minY: 0,
      maxX: viewport.width - minVisibleWidth,
      maxY: viewport.height - dockHeight - minVisibleHeight,
    };
  }, [currentWindow?.size, viewport.width, viewport.height]);

  // Handle window focus
  const handleFocus = useCallback(() => {
    focusWindow(windowId);
    onFocus?.();
  }, [windowId, focusWindow, onFocus]);

  // Handle drag start
  const handleDragStart = useCallback((event: MouseEvent | TouchEvent) => {
    if (!currentWindow || currentWindow.isMaximized) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    dragStateRef.current = {
      startX: clientX,
      startY: clientY,
      startWindowX: currentWindow.position.x,
      startWindowY: currentWindow.position.y,
    };

    handleFocus();
  }, [currentWindow, handleFocus]);

  // Handle drag with debounced updates
  const handleDrag = useCallback((event: MouseEvent | TouchEvent) => {
    if (!dragStateRef.current || !currentWindow || currentWindow.isMaximized) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - dragStateRef.current.startX;
    const deltaY = clientY - dragStateRef.current.startY;

    const newX = dragStateRef.current.startWindowX + deltaX;
    const newY = dragStateRef.current.startWindowY + deltaY;

    const constraints = getConstraints;
    const constrainedX = Math.max(constraints.minX, Math.min(constraints.maxX, newX));
    const constrainedY = Math.max(constraints.minY, Math.min(constraints.maxY, newY));

    const newPosition = { x: constrainedX, y: constrainedY };

    if (constrainedX !== currentWindow.position.x || constrainedY !== currentWindow.position.y) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        moveWindow(windowId, newPosition);
        onMove?.(newPosition);
      }, 5); // ~adjust framerate when needed
    }
  }, [currentWindow, windowId, moveWindow, onMove, getConstraints]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    dragStateRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((
    event: MouseEvent,
    direction: 'se' | 'e' | 's' | 'sw' | 'w' | 'n' | 'ne' | 'nw' = 'se'
  ) => {
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
      direction,
    };

    handleFocus();
  }, [currentWindow, handleFocus]);

  // Handle resize with debounced updates
  const handleResize = useCallback((event: MouseEvent) => {
    if (!resizeStateRef.current || !currentWindow) return;

    const deltaX = event.clientX - resizeStateRef.current.startX;
    const deltaY = event.clientY - resizeStateRef.current.startY;

    let newWidth = resizeStateRef.current.startWidth;
    let newHeight = resizeStateRef.current.startHeight;
    let newX = resizeStateRef.current.startWindowX;
    let newY = resizeStateRef.current.startWindowY;

    const { direction } = resizeStateRef.current;

    if (direction.includes('e')) {
      newWidth = Math.max(300, resizeStateRef.current.startWidth + deltaX);
    }
    if (direction.includes('w')) {
      const widthDelta = -deltaX;
      newWidth = Math.max(300, resizeStateRef.current.startWidth + widthDelta);
      if (newWidth > 300) {
        newX = resizeStateRef.current.startWindowX - widthDelta;
      }
    }
    if (direction.includes('s')) {
      newHeight = Math.max(200, resizeStateRef.current.startHeight + deltaY);
    }
    if (direction.includes('n')) {
      const heightDelta = -deltaY;
      newHeight = Math.max(200, resizeStateRef.current.startHeight + heightDelta);
      if (newHeight > 200) {
        newY = resizeStateRef.current.startWindowY - heightDelta;
      }
    }

    const maxWidth = viewport.width - newX;
    const maxHeight = viewport.height - newY - 80;

    newWidth = Math.min(newWidth, Math.max(300, maxWidth));
    newHeight = Math.min(newHeight, Math.max(200, maxHeight));

    const newSize = { width: newWidth, height: newHeight };
    const newPosition = { x: newX, y: newY };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      resizeWindow(windowId, newSize);
      if (newX !== currentWindow.position.x || newY !== currentWindow.position.y) {
        moveWindow(windowId, newPosition);
        onMove?.(newPosition);
      }
      onResize?.(newSize);
    }, 16); // ~60fps
  }, [currentWindow, windowId, resizeWindow, moveWindow, onMove, onResize, viewport]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    resizeStateRef.current = null;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // Handle keyboard shortcuts with explicit return type
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