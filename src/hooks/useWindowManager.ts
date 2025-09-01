'use client';

import { useCallback, useEffect, useRef } from 'react';
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

  // Get current window state
  const currentWindow = windows.find(w => w.id === windowId);

  // Calculate window constraints
  const getConstraints = useCallback((): WindowConstraints => {
    if (typeof window === 'undefined') {
      return { minX: 0, minY: 0, maxX: 1920, maxY: 1000 };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const dockHeight = 80;
    const headerHeight = 52;

    // Allow window to be dragged slightly off-screen but keep header visible
    const minVisibleWidth = 100;
    const minVisibleHeight = headerHeight;

    return {
      minX: -(currentWindow?.size.width || 300) + minVisibleWidth,
      minY: 0,
      maxX: viewportWidth - minVisibleWidth,
      maxY: viewportHeight - dockHeight - minVisibleHeight,
    };
  }, [currentWindow?.size]);

  // Handle window focus
  const handleFocus = useCallback(() => {
    try {
      focusWindow(windowId);
      onFocus?.();
    } catch (error) {
      console.error('Error focusing window:', error);
    }
  }, [windowId, focusWindow, onFocus]);

  // Handle drag start
  const handleDragStart = useCallback((event: MouseEvent | TouchEvent) => {
    if (!currentWindow || currentWindow.isMaximized) return;

    try {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      dragStateRef.current = {
        startX: clientX,
        startY: clientY,
        startWindowX: currentWindow.position.x,
        startWindowY: currentWindow.position.y,
      };

      handleFocus();
    } catch (error) {
      console.error('Error starting drag:', error);
    }
  }, [currentWindow, handleFocus]);

  // Handle drag
  const handleDrag = useCallback((event: MouseEvent | TouchEvent) => {
    if (!dragStateRef.current || !currentWindow || currentWindow.isMaximized) return;

    try {
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

      const deltaX = clientX - dragStateRef.current.startX;
      const deltaY = clientY - dragStateRef.current.startY;

      const newX = dragStateRef.current.startWindowX + deltaX;
      const newY = dragStateRef.current.startWindowY + deltaY;

      const constraints = getConstraints();
      const constrainedX = Math.max(constraints.minX, Math.min(constraints.maxX, newX));
      const constrainedY = Math.max(constraints.minY, Math.min(constraints.maxY, newY));

      const newPosition = { x: constrainedX, y: constrainedY };

      // Only update if position actually changed
      if (constrainedX !== currentWindow.position.x || constrainedY !== currentWindow.position.y) {
        moveWindow(windowId, newPosition);
        onMove?.(newPosition);
      }
    } catch (error) {
      console.error('Error during drag:', error);
    }
  }, [currentWindow, windowId, moveWindow, onMove, getConstraints]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    try {
      dragStateRef.current = null;
    } catch (error) {
      console.error('Error ending drag:', error);
    }
  }, []);

  // Handle resize start
  const handleResizeStart = useCallback((
    event: MouseEvent,
    direction: 'se' | 'e' | 's' | 'sw' | 'w' | 'n' | 'ne' | 'nw' = 'se'
  ) => {
    if (!currentWindow) return;

    try {
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
    } catch (error) {
      console.error('Error starting resize:', error);
    }
  }, [currentWindow, handleFocus]);

  // Handle resize
  const handleResize = useCallback((event: MouseEvent) => {
    if (!resizeStateRef.current || !currentWindow) return;

    try {
      const deltaX = event.clientX - resizeStateRef.current.startX;
      const deltaY = event.clientY - resizeStateRef.current.startY;

      let newWidth = resizeStateRef.current.startWidth;
      let newHeight = resizeStateRef.current.startHeight;
      let newX = resizeStateRef.current.startWindowX;
      let newY = resizeStateRef.current.startWindowY;

      const { direction } = resizeStateRef.current;

      // Calculate new dimensions and position based on resize direction
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

      // Apply viewport constraints
      const maxWidth = (typeof window !== 'undefined' ? window.innerWidth : 1920) - newX;
      const maxHeight = (typeof window !== 'undefined' ? window.innerHeight : 1080) - newY - 80;

      newWidth = Math.min(newWidth, Math.max(300, maxWidth));
      newHeight = Math.min(newHeight, Math.max(200, maxHeight));

      const newSize = { width: newWidth, height: newHeight };
      const newPosition = { x: newX, y: newY };

      // Update window size and position
      resizeWindow(windowId, newSize);
      if (newX !== currentWindow.position.x || newY !== currentWindow.position.y) {
        moveWindow(windowId, newPosition);
        onMove?.(newPosition);
      }
      onResize?.(newSize);
    } catch (error) {
      console.error('Error during resize:', error);
    }
  }, [currentWindow, windowId, resizeWindow, moveWindow, onMove, onResize]);

  // Handle resize end
  const handleResizeEnd = useCallback(() => {
    try {
      resizeStateRef.current = null;
    } catch (error) {
      console.error('Error ending resize:', error);
    }
  }, []);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((event: KeyboardEvent): string | null => {
    if (!currentWindow) return null;

    try {
      // Cmd/Ctrl + W to close window
      if ((event.metaKey || event.ctrlKey) && event.key === 'w') {
        event.preventDefault();
        return 'close';
      }

      // Cmd/Ctrl + M to minimize window
      if ((event.metaKey || event.ctrlKey) && event.key === 'm') {
        event.preventDefault();
        return 'minimize';
      }

      // F11 or Cmd/Ctrl + Enter to maximize/restore
      if (event.key === 'F11' || ((event.metaKey || event.ctrlKey) && event.key === 'Enter')) {
        event.preventDefault();
        return 'maximize';
      }
    } catch (error) {
      console.error('Error handling keyboard shortcut:', error);
    }

    return null;
  }, [currentWindow]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        dragStateRef.current = null;
        resizeStateRef.current = null;
      } catch (error) {
        console.error('Error during cleanup:', error);
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