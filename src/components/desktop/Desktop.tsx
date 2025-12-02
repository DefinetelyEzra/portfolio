'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import { DOCK_APPS } from '@/utils/constants';
import Dock from './Dock';
import Wallpaper from './Wallpaper';
import Window from '../windows/Window';
import HeroWindow from '../hero/HeroWindow';
import Notifications from './Notifications';
import WidgetManager from '../desktop/widgets/WidgetManager';

export default function Desktop() {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    moveWindow,
    resizeWindow,
    addNotification,
  } = useDesktopStore();

  // Welcome notification
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: 'Welcome!',
        message: 'Click on dock icons to explore my portfolio',
        type: 'info',
        duration: 5000,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [addNotification]);

  // Memoize sorted visible windows to prevent unnecessary re-sorts
  const sortedVisibleWindows = useMemo(() =>
    windows
      .filter(w => w.isVisible)
      .sort((a, b) => a.zIndex - b.zIndex),
    [windows]
  );

  // Memoize window event handlers to prevent unnecessary re-renders
  const handleWindowClose = useCallback((windowId: string) => {
    closeWindow(windowId);
  }, [closeWindow]);

  const handleWindowMinimize = useCallback((windowId: string) => {
    minimizeWindow(windowId);
  }, [minimizeWindow]);

  const handleWindowMaximize = useCallback((windowId: string) => {
    maximizeWindow(windowId);
  }, [maximizeWindow]);

  const handleWindowMove = useCallback((windowId: string, position: { x: number; y: number }) => {
    moveWindow(windowId, position);
  }, [moveWindow]);

  const handleWindowResize = useCallback((windowId: string, size: { width: number; height: number }) => {
    resizeWindow(windowId, size);
  }, [resizeWindow]);

  const handleWindowFocus = useCallback((windowId: string) => {
    focusWindow(windowId);
  }, [focusWindow]);

  // Handle click outside windows to unfocus
  const handleDesktopClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clicked on desktop background
      // Could add desktop context menu here
    }
  }, []);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDesktopClick(e as unknown as React.MouseEvent);
    }
  }, [handleDesktopClick]);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 select-none cursor-default"
        aria-label="Desktop workspace"
        onClick={handleDesktopClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {/* Wallpaper */}
        <Wallpaper />

        {/* Windows */}
        <AnimatePresence mode="sync">
          {sortedVisibleWindows.map((window) => {
            const app = DOCK_APPS.find(a => a.id === window.appId);
            if (!app) return null;

            return (
              <Window
                key={window.id}
                window={window}
                app={app}
                onClose={() => handleWindowClose(window.id)}
                onMinimize={() => handleWindowMinimize(window.id)}
                onMaximize={() => handleWindowMaximize(window.id)}
                onMove={(position) => handleWindowMove(window.id, position)}
                onResize={(size) => handleWindowResize(window.id, size)}
                onFocus={() => handleWindowFocus(window.id)}
              />
            );
          })}
        </AnimatePresence>

        {/* Desktop Widgets */}
        <WidgetManager />

        {/* Dock */}
        <Dock />

        {/* Notifications */}
        <Notifications />

        {/* Hero Window*/}
        <HeroWindow/>
      </div>
    </main>
  );
}