'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import MinimizeAnimation from './MinimizeAnimation';
import { motion } from 'framer-motion';
import { WindowProps, AppConfig, WindowState } from '@/types/desktop';
import WindowControls from './WindowControls';
import { useWindowManager } from '@/hooks/useWindowManager';
import { useDesktopStore } from '@/store/desktopStore';

function isTopmostWindow(currentZ: number): boolean {
  const windows = Array.from(document.querySelectorAll('[data-window]'));
  if (!windows.length) return true;
  const maxZ = Math.max(
    ...windows.map(el => Number.parseInt((el as HTMLElement).dataset.zIndex || '0'))
  );
  return currentZ === maxZ;
}

export default function Window({
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
    onMove,
    onResize,
  });

  /** Handlers **/
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
      e.preventDefault();
      if (isDragging) {
        handleDrag(e);
      }
      if (isResizing) {
        handleResize(e);
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      if (isDragging) {
        setIsDragging(false);
        handleDragEnd();
      }
      if (isResizing) {
        setIsResizing(false);
        handleResizeEnd();
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: false });
    document.addEventListener('mouseup', onMouseUp, { passive: false });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, isResizing, handleDrag, handleDragEnd, handleResize, handleResizeEnd]);

  /** Keyboard shortcuts **/
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
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [windowState.zIndex, handleKeyDown, onClose, onMinimize, onMaximize]);

  useEffect(() => {
    if ((windowState.isAnimatingMinimize || windowState.isAnimatingRestore) && windowRef.current) {
      const dockIcon = document.querySelector(`[data-dock-icon="${windowState.appId}"]`) as HTMLElement;
      if (dockIcon) {
        // Window will be hidden by MinimizeAnimation component
      }
    }
  }, [windowState.isAnimatingMinimize, windowState.isAnimatingRestore, windowState.appId]);

  const AppComponent = app.component;

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
          x: windowState.position.x,
          y: windowState.position.y,
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          duration: 0.3,
          x: isDragging ? { duration: 0, type: false } : undefined,
          y: isDragging ? { duration: 0, type: false } : undefined,
        }}
        className={`
        absolute backdrop-blur-xl rounded-lg shadow-2xl border overflow-hidden
        bg-[var(--window-bg)] border-[var(--window-border)]
        ${windowState.isMaximized ? 'fixed inset-0 rounded-none' : ''}
        ${isDragging ? 'cursor-grabbing select-none' : ''}
        ${isResizing ? 'select-none' : ''}
        ${windowState.isAnimatingMinimize ? 'pointer-events-none' : ''}
      `}
        style={{
          width: windowState.isMaximized ? '100vw' : windowState.size.width,
          height: windowState.isMaximized ? '100vh' : windowState.size.height,
          zIndex: windowState.zIndex,
          position: windowState.isMaximized ? 'fixed' : 'absolute',
          visibility: windowState.isAnimatingMinimize || windowState.isAnimatingRestore ? 'hidden' : 'visible',
          display: windowState.isMinimized && !windowState.isAnimatingRestore ? 'none' : 'block',
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

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* Minimize Animation Component */}
      {(windowState.isAnimatingMinimize || windowState.isAnimatingRestore) && (
        <MinimizeAnimation
          windowElement={windowRef.current!}
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

function WindowHeader({
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
    <motion.div
      className={`
        flex items-center justify-between px-4 py-3 border-b
        ${currentTheme === 'dark'
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700/50'
          : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/50'
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
        <h2 className={`text-sm font-medium select-none pointer-events-none ${currentTheme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
          {app.name}
        </h2>
      </div>
    </motion.div>
  );
}

interface WindowContentProps {
  AppComponent: React.ComponentType;
  app: AppConfig;
}

function WindowContent({ AppComponent, app }: Readonly<WindowContentProps>) {
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
}

interface ResizeHandleProps {
  isResizing: boolean;
  onResizeStart: (e: React.MouseEvent) => void;
}

function ResizeHandle({ isResizing, onResizeStart }: Readonly<ResizeHandleProps>) {
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
}