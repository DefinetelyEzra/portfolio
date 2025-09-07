'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/desktopStore';
import { MOBILE_BREAKPOINT } from '@/utils/constants';
import { useAudioContext } from '@/components/ui/AudioProvider';
import BootScreen from '@/components/ui/BootScreen';
import Desktop from '@/components/desktop/Desktop';
import { isMobile } from '@/utils/deviceDetection';
import MobileLauncher from '@/components/mobile/MobileLauncher';
import MobileApp from '@/components/mobile/MobileApp';

export default function HomePage() {
  const { isBooting, setMobile, setSystemTheme, currentTheme } = useDesktopStore();
  const { setAudioEnabled, setMasterVolume } = useAudioContext();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [currentMobileApp, setCurrentMobileApp] = useState<string | null>(null);

  useEffect(() => {
    const updateDeviceType = () => {
      const isMobileView = window.innerWidth < MOBILE_BREAKPOINT || isMobile();
      setIsMobileDevice(isMobileView);
      setMobile(isMobileView);
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);

    return () => window.removeEventListener('resize', updateDeviceType);
  }, [setMobile]);

  // System theme detection
  useEffect(() => {
    const detectSystemTheme = (e?: MediaQueryListEvent) => {
      const isDark = e ? e.matches : window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDark ? 'dark' : 'light');
    };

    detectSystemTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectSystemTheme);

    return () => mediaQuery.removeEventListener('change', detectSystemTheme);
  }, [setSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = currentTheme ?? 'dark';
  }, [currentTheme]);

  // Initialize audio settings and handle reduced motion
  useEffect(() => {
    setMasterVolume(0.3); // 30% volume
    setAudioEnabled(true);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => setAudioEnabled(!e.matches);

    setAudioEnabled(!mediaQuery.matches); // Initial check
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, [setAudioEnabled, setMasterVolume]);

  // Render the appropriate component based on state
  const renderContent = () => {
    if (isBooting) {
      return <BootScreen key="boot" />;
    }

    if (isMobileDevice) {
      return (
        <div key="mobile" className="h-full">
          {currentMobileApp ? (
            <MobileApp
              appId={currentMobileApp}
              onClose={() => setCurrentMobileApp(null)}
              onHome={() => setCurrentMobileApp(null)}
            />
          ) : (
            <MobileLauncher onAppOpen={setCurrentMobileApp} />
          )}
        </div>
      );
    }

    return <Desktop key="desktop" />;
  };

  return (
    <main className={`fixed inset-0 overflow-hidden ${currentTheme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </main>
  );
}