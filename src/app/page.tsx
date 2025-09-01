'use client';

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import { MOBILE_BREAKPOINT } from '@/utils/constants';
import { useAudioContext } from '@/components/ui/AudioProvider';
import BootScreen from '@/components/ui/BootScreen';
import Desktop from '@/components/desktop/Desktop';

export default function HomePage() {
  const { isBooting, setMobile, setSystemTheme, currentTheme } = useDesktopStore();
  const { setAudioEnabled, setMasterVolume } = useAudioContext();

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [setMobile]);

  // Add system theme detection
  useEffect(() => {
    const detectSystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDark ? 'dark' : 'light');
    };

    // Initial detection
    detectSystemTheme();

    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectSystemTheme);

    return () => {
      mediaQuery.removeEventListener('change', detectSystemTheme);
    };
  }, [setSystemTheme]);

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.className = currentTheme || 'dark';
  }, [currentTheme]);

  // Initialize audio settings
  useEffect(() => {
    setMasterVolume(0.3); // 30% volume
    setAudioEnabled(true);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setAudioEnabled(!e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setAudioEnabled, setMasterVolume]);

  return (
    <main className={`fixed inset-0 overflow-hidden ${currentTheme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      <AnimatePresence mode="wait">
        {isBooting ? (
          <BootScreen key="boot" />
        ) : (
          <Desktop key="desktop" />
        )}
      </AnimatePresence>
    </main>
  );
}