'use client';

import { useEffect } from 'react';
import { useDesktopStore } from '@/store/desktopStore';
import WebPortfolio from './Webportfolio';

export default function WebPage() {
    const { setSystemTheme, currentTheme } = useDesktopStore();

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

    return <WebPortfolio />;
}