'use client';

import { useEffect, useCallback, useState } from 'react';
import { useDesktopStore } from '@/store/desktopStore';
import { MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from '@/utils/constants';

interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

interface DesktopHookReturn {
  viewport: ViewportInfo;
  isOnline: boolean;
  isFullscreen: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  refreshViewport: () => void;
}

export function useDesktop(): DesktopHookReturn {
  const { setMobile } = useDesktopStore();

  const [viewport, setViewport] = useState<ViewportInfo>({
    width: globalThis.window === undefined ? 1920 : window.innerWidth,
    height: globalThis.window === undefined ? 1080 : window.innerHeight,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Update viewport information
  const updateViewport = useCallback(() => {
    try {
      if (globalThis.window === undefined) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < MOBILE_BREAKPOINT;
      const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
      const isDesktop = width >= TABLET_BREAKPOINT;

      const newViewport = {
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
      };

      setViewport(newViewport);
      setMobile(isMobile);
      const isDark = globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches;
      useDesktopStore.getState().setSystemTheme(isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error updating viewport:', error);
    }
  }, [setMobile]);

  // Check fullscreen status
  const checkFullscreen = useCallback(() => {
    try {
      if (typeof document === 'undefined') return;

      setIsFullscreen(!!document.fullscreenElement);
    } catch (error) {
      console.error('Error checking fullscreen status:', error);
    }
  }, []);

  // Enter fullscreen mode
  const enterFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (typeof document === 'undefined' || !document.documentElement.requestFullscreen) {
        throw new Error('Fullscreen API not supported');
      }

      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      throw error;
    }
  }, []);

  // Exit fullscreen mode
  const exitFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (typeof document === 'undefined' || !document.exitFullscreen) {
        throw new Error('Fullscreen API not supported');
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
      throw error;
    }
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(async (): Promise<void> => {
    try {
      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
      throw error;
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  // Handle online/offline status
  const handleOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  // Handle window resize
  const handleResize = useCallback(() => {
    updateViewport();
  }, [updateViewport]);

  // Handle fullscreen change
  const handleFullscreenChange = useCallback(() => {
    checkFullscreen();
  }, [checkFullscreen]);

  // Handle visibility change (tab switching)
  const handleVisibilityChange = useCallback(() => {
    try {
      if (typeof document === 'undefined') return;

      if (document.visibilityState === 'hidden') {
        // Page is hidden
        console.debug('Desktop hidden');
      } else {
        // Page is visible
        console.debug('Desktop visible');
      }
    } catch (error) {
      console.error('Error handling visibility change:', error);
    }
  }, []);

  // Refresh viewport manually
  const refreshViewport = useCallback(() => {
    updateViewport();
  }, [updateViewport]);

  // Set up event listeners
  useEffect(() => {
    try {
      if (globalThis.window === undefined) return;

      // Initial setup
      updateViewport();
      checkFullscreen();

      // Add event listeners
      window.addEventListener('resize', handleResize);
      globalThis.window.addEventListener('online', handleOnline);
      globalThis.window.addEventListener('offline', handleOffline);
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize);
        globalThis.window.removeEventListener('online', handleOnline);
        globalThis.window.removeEventListener('offline', handleOffline);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } catch (error) {
      console.error('Error setting up desktop listeners:', error);
    }
  }, [
    updateViewport,
    checkFullscreen,
    handleResize,
    handleOnline,
    handleOffline,
    handleFullscreenChange,
    handleVisibilityChange,
  ]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let rafId: number;

    const debouncedResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateViewport, 16); // ~60fps
      });
    };

    if (globalThis.window !== undefined) {
      // Remove the duplicate resize listener setup
      window.addEventListener('resize', debouncedResize, { passive: true });
      globalThis.window.addEventListener('online', handleOnline, { passive: true });
      globalThis.window.addEventListener('offline', handleOffline, { passive: true });
      document.addEventListener('fullscreenchange', handleFullscreenChange, { passive: true });
      document.addEventListener('visibilitychange', handleVisibilityChange, { passive: true });

      return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', debouncedResize);
        globalThis.window.removeEventListener('online', handleOnline);
        globalThis.window.removeEventListener('offline', handleOffline);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [handleFullscreenChange, handleOffline, handleOnline, handleVisibilityChange, updateViewport]);

  return {
    viewport,
    isOnline,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    refreshViewport,
  };
}