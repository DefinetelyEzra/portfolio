'use client';

import { useRef, useCallback, useState, useEffect, memo } from 'react';
import MinimizeAnimation from './MinimizeAnimation';
import { motion } from 'framer-motion';
import { WindowProps, AppConfig, WindowState } from '@/types/desktop';
import WindowControls from './WindowControls';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useDesktopStore } from '@/store/desktopStore';

// Memoized function to check if window is topmost
const isTopmostWindow = (currentZ: number): boolean => {
  const windows = document.querySelectorAll('[data-window]');
  if (!windows.length) return true;

  let maxZ = 0;
  for (const el of windows) {
    const z = Number.parseInt((el as HTMLElement).dataset.zIndex || '0');
    if (z > maxZ) maxZ = z;
  }

  return currentZ === maxZ;
};

function Window({
  window: windowState,
  app,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onResize,
  onFocus,
}: Readonly<WindowProps>) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  // Local state for smooth resize (updated directly without store)
  const [localSize, setLocalSize] = useState(windowState.size);
  const [localPosition, setLocalPosition] = useState(windowState.position);

  // Sync local state with store when not resizing/dragging
  useEffect(() => {
    if (!isResizing) {
      setLocalSize(windowState.size);
    }
  }, [windowState.size, isResizing]);

  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(windowState.position);
    }
  }, [windowState.position, isDragging]);

  const {
    handleFocus,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    handleResizeStart,
    handleResize,
    handleResizeEnd,
    handleKeyDown,
  } = useWindowManager({
    windowId: windowState.id,
    onFocus,
    onMove: (position) => {
      setLocalPosition(position);
      onMove(position);
    },
    onResize: (size) => {
      setLocalSize(size);
      // Don't call onResize during active resize - only on end
    },
  });

  /** Handlers - Memoized for performance **/
  const handleHeaderDragStart = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (!app.draggable || windowState.isMaximized) return;

    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    handleDragStart(e.nativeEvent);
  }, [app.draggable, windowState.isMaximized, handleDragStart]);

  const handleWindowResizeStart = useCallback((e: React.MouseEvent) => {
    if (!app.resizable || windowState.isMaximized) return;

    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    handleResizeStart(e.nativeEvent);
  }, [app.resizable, windowState.isMaximized, handleResizeStart]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    onMaximize();
  }, [onMaximize]);

  const handleWindowClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleFocus();
  }, [handleFocus]);

  /** Mouse event handlers **/
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleDrag(e);
      } else if (isResizing) {
        handleResize(e);
      }
    };

    const onMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        handleDragEnd();
      }
      if (isResizing) {
        setIsResizing(false);
        handleResizeEnd();
        // Now update the store with final size
        onResize(localSize);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing, handleDrag, handleDragEnd, handleResize, handleResizeEnd, onResize, localSize]);

  /** Keyboard shortcuts - Only for topmost window **/
  useEffect(() => {
    if (!isTopmostWindow(windowState.zIndex)) return;

    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      const action = handleKeyDown(e);
      switch (action) {
        case 'close':
          onClose();
          break;
        case 'minimize':
          onMinimize();
          break;
        case 'maximize':
          onMaximize();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [windowState.zIndex, handleKeyDown, onClose, onMinimize, onMaximize]);

  const AppComponent = app.component;

  // Use local size/position during drag/resize for smooth updates
  const currentSize = isResizing ? localSize : windowState.size;
  const currentPosition = isDragging ? localPosition : windowState.position;

  // Calculate dimensions once
  const windowStyle: React.CSSProperties = {
    width: windowState.isMaximized ? '100vw' : currentSize.width,
    height: windowState.isMaximized ? '100vh' : currentSize.height,
    zIndex: windowState.zIndex,
    position: windowState.isMaximized ? 'fixed' : 'absolute',
    visibility: windowState.isAnimatingMinimize || windowState.isAnimatingRestore ? 'hidden' : 'visible',
    display: windowState.isMinimized && !windowState.isAnimatingRestore ? 'none' : 'block',
  };

  /** Render **/
  return (
    <>
      <motion.div
        ref={windowRef}
        data-window
        data-z-index={windowState.zIndex}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: 1,
          opacity: 1,
          x: currentPosition.x,
          y: currentPosition.y,
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 0.3,
          // Disable animations during drag OR resize
          x: (isDragging || isResizing) ? { duration: 0, type: false } : undefined,
          y: (isDragging || isResizing) ? { duration: 0, type: false } : undefined,
        }}
        className={`
          backdrop-blur-xl rounded-lg shadow-2xl border overflow-hidden
          ${windowState.isMaximized ? 'fixed inset-0 rounded-none' : ''}
          ${isDragging ? 'cursor-grabbing select-none' : ''}
          ${isResizing ? 'select-none' : ''}
          ${windowState.isAnimatingMinimize ? 'pointer-events-none' : ''}
        `}
        style={{
          ...windowStyle,
          background: 'var(--window-bg)',
          borderColor: 'var(--window-border)',
        }}
        onClick={handleWindowClick}
      >
        {/* Header */}
        <WindowHeader
          app={app}
          windowState={windowState}
          isDragging={isDragging}
          onHeaderDragStart={handleHeaderDragStart}
          onDoubleClick={handleDoubleClick}
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />

        {/* Content */}
        <WindowContent AppComponent={AppComponent} app={app} />

        {/* Resize Handle */}
        {app.resizable && !windowState.isMaximized && (
          <ResizeHandle
            isResizing={isResizing}
            onResizeStart={handleWindowResizeStart}
          />
        )}
      </motion.div>

      {/* Minimize Animation Component */}
      {(windowState.isAnimatingMinimize || windowState.isAnimatingRestore) && windowRef.current && (
        <MinimizeAnimation
          windowElement={windowRef.current}
          appId={windowState.appId}
          isRestoring={!!windowState.isAnimatingRestore}
          onComplete={() => {
            if (windowState.isAnimatingMinimize) {
              useDesktopStore.getState().completeMinimize(windowState.id);
            } else {
              useDesktopStore.getState().completeRestore(windowState.id);
            }
          }}
        />
      )}
    </>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(Window, (prevProps, nextProps) => {
  return (
    prevProps.window.id === nextProps.window.id &&
    prevProps.window.position.x === nextProps.window.position.x &&
    prevProps.window.position.y === nextProps.window.position.y &&
    prevProps.window.size.width === nextProps.window.size.width &&
    prevProps.window.size.height === nextProps.window.size.height &&
    prevProps.window.isMinimized === nextProps.window.isMinimized &&
    prevProps.window.isMaximized === nextProps.window.isMaximized &&
    prevProps.window.zIndex === nextProps.window.zIndex &&
    prevProps.window.isAnimatingMinimize === nextProps.window.isAnimatingMinimize &&
    prevProps.window.isAnimatingRestore === nextProps.window.isAnimatingRestore
  );
});

interface WindowHeaderProps {
  app: AppConfig;
  windowState: WindowState;
  isDragging: boolean;
  onHeaderDragStart: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}

const WindowHeader = memo(function WindowHeader({
  app,
  windowState,
  isDragging,
  onHeaderDragStart,
  onDoubleClick,
  onClose,
  onMinimize,
  onMaximize,
}: Readonly<WindowHeaderProps>) {
  const { currentTheme } = useDesktopStore();

  return (
    <div
      className={`
        flex items-center justify-between px-4 py-3 border-b
        ${currentTheme === 'dark'
          ? 'bg-linear-to-r from-gray-800 to-gray-900 border-gray-700/50'
          : 'bg-linear-to-r from-gray-50 to-gray-100 border-gray-200/50'
        }
        ${app.draggable && !windowState.isMaximized ? 'cursor-grab' : ''}
        ${isDragging ? 'cursor-grabbing' : ''}
      `}
      onMouseDown={onHeaderDragStart}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center space-x-3">
        <WindowControls
          onClose={onClose}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
        />
        <h2 className={`text-sm font-medium select-none pointer-events-none ${
          currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {app.name}
        </h2>
      </div>
    </div>
  );
});

interface WindowContentProps {
  AppComponent: React.ComponentType;
  app: AppConfig;
}

const WindowContent = memo(function WindowContent({ AppComponent, app }: Readonly<WindowContentProps>) {
  return (
    <div className="flex-1 overflow-hidden relative" style={{ height: 'calc(100% - 52px)' }}>
      <div className="absolute inset-0 overflow-auto">
        {AppComponent ? (
          <AppComponent />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <h2 className="text-xl font-semibold mb-2">{app.name}</h2>
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

interface ResizeHandleProps {
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
}

const ResizeHandle = memo(function ResizeHandle({ isResizing, onResizeStart }: Readonly<ResizeHandleProps>) {
  return (
    <button
      className={`
        absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-transparent border-none p-0
        ${isResizing ? 'bg-blue-500/20' : 'hover:bg-gray-200/50'}
      `}
      onMouseDown={onResizeStart}
      aria-label="Resize window"
    >
      <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400" />
    </button>
  );
});