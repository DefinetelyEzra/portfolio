'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDesktopStore } from '@/store/desktopStore';
import { isMobile } from '@/utils/deviceDetection';
import Desktop from '@/components/desktop/Desktop';

export default function HomePage() {
  const router = useRouter();
  const { setSystemTheme, currentTheme } = useDesktopStore();
  const [mounted, setMounted] = useState(false);

  // System theme detection
  useEffect(() => {
    const detectSystemTheme = (e?: MediaQueryListEvent) => {
      const isDark = e ? e.matches : globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDark ? 'dark' : 'light');
    };

    detectSystemTheme();
    const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', detectSystemTheme);

    return () => mediaQuery.removeEventListener('change', detectSystemTheme);
  }, [setSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.className = currentTheme ?? 'dark';
  }, [currentTheme]);

  // Check and redirect mobile users - runs on mount and resize
  useEffect(() => {
    setMounted(true);

    const checkAndRedirect = () => {
      if (isMobile()) {
        // Use window.location for immediate redirect on resize
        globalThis.window.location.href = '/web';
      }
    };

    // Immediate check on mount
    if (isMobile()) {
      router.push('/web');
      return;
    }

    // Listen for resize events
    window.addEventListener('resize', checkAndRedirect);
    return () => window.removeEventListener('resize', checkAndRedirect);
  }, [router]);

  // Don't render until mounted and verified not mobile
  if (!mounted || isMobile()) {
    return (
      <main className={`fixed inset-0 overflow-hidden ${currentTheme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  // Render desktop for non-mobile devices
  return (
    <main className={`fixed inset-0 overflow-hidden ${currentTheme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}>
      <Desktop />
    </main>
  );
}