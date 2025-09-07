'use client';

import { ReactNode, useEffect } from 'react';
import { useMobileStore } from '@/store/mobileStore';
import { useDesktopStore } from '@/store/desktopStore';

interface MobileAppWrapperProps {
    children: ReactNode;
}

export default function MobileAppWrapper({ children }: Readonly<MobileAppWrapperProps>) {
    const { currentTheme, settings } = useMobileStore();
    const { updateSettings: updateDesktopSettings, currentTheme: desktopTheme } = useDesktopStore();

    // Sync mobile theme to desktop store whenever mobile theme changes
    useEffect(() => {
        if (currentTheme !== desktopTheme) {
            updateDesktopSettings({ 
                theme: settings.theme,
            });
        }
    }, [currentTheme, settings.theme, desktopTheme, updateDesktopSettings]);

    return (
            <div className="min-h-screen mobile-app-container">
                {children}
            </div>
    );
}