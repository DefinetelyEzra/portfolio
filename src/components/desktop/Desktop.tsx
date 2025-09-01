'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import { DOCK_APPS } from '@/utils/constants';
import Dock from './Dock';
import Wallpaper from './Wallpaper';
import Window from '../windows/Window';
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

  // Handle click outside windows to unfocus
  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Clicked on desktop background
      // Could add desktop context menu here
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDesktopClick(e as unknown as React.MouseEvent);
    }
  };

  return (

    <main className="fixed inset-0 overflow-hidden">
      {/* Use a proper interactive element for desktop */}
      <main
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
          {windows
            .filter(w => w.isVisible)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((window) => {
              const app = DOCK_APPS.find(a => a.id === window.appId);
              if (!app) return null;

              return (
                <Window
                  key={window.id}
                  window={window}
                  app={app}
                  onClose={() => closeWindow(window.id)}
                  onMinimize={() => minimizeWindow(window.id)}
                  onMaximize={() => maximizeWindow(window.id)}
                  onMove={(position) => moveWindow(window.id, position)}
                  onResize={(size) => resizeWindow(window.id, size)}
                  onFocus={() => focusWindow(window.id)}
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
      </main>
    </main>
  );
}