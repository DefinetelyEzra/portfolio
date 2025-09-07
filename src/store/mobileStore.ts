import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getWallpapersForDevice } from '@/utils/wallpaperUtils';

type ThemeOption = 'light' | 'dark' | 'auto';

interface MobileSettings {
    theme: ThemeOption;
    wallpaper: string;
    soundEnabled: boolean;
    notifications: boolean;
    vibration: boolean;
    autoRotate: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

interface MobileStore {
    // Settings
    settings: MobileSettings;
    currentTheme: 'light' | 'dark';
    systemTheme: 'light' | 'dark';

    // UI State
    isAppOpen: boolean;
    currentApp: string | null;
    hasSeenWelcome: boolean;

    // Actions
    updateSettings: (newSettings: Partial<MobileSettings>) => void;
    setSystemTheme: (theme: 'light' | 'dark') => void;
    getResolvedTheme: () => 'light' | 'dark';
    openApp: (appId: string) => void;
    closeApp: () => void;
    markWelcomeSeen: () => void;
}

const defaultMobileSettings: MobileSettings = {
    theme: 'dark',
    wallpaper: getWallpapersForDevice(true)[0]?.path || '/wallpapers/mobile/default.jpg',
    soundEnabled: true,
    notifications: true,
    vibration: true,
    autoRotate: true,
    fontSize: 'medium',
};

export const useMobileStore = create<MobileStore>()(
    persist(
        (set, get) => ({
            // Initial State
            settings: defaultMobileSettings,
            currentTheme: 'dark',
            systemTheme: 'dark',
            isAppOpen: false,
            currentApp: null,
            hasSeenWelcome: false,

            markWelcomeSeen: () => {
                set({ hasSeenWelcome: true });
            },

            // Actions
            updateSettings: (newSettings: Partial<MobileSettings>) => {
                set((state) => {
                    const updatedSettings = { ...state.settings, ...newSettings };
                    const resolvedTheme = updatedSettings.theme === 'auto' ? state.systemTheme : updatedSettings.theme;

                    // If wallpaper changed, apply it immediately
                    if (newSettings.wallpaper && typeof window !== 'undefined') {
                        document.body.style.backgroundImage = `url(${newSettings.wallpaper})`;
                        document.body.style.backgroundSize = 'cover';
                        document.body.style.backgroundPosition = 'center';
                        document.body.style.backgroundRepeat = 'no-repeat';
                        document.body.style.backgroundAttachment = 'fixed';
                    }

                    return {
                        settings: updatedSettings,
                        currentTheme: resolvedTheme,
                    };
                });
            },

            setSystemTheme: (theme: 'light' | 'dark') => {
                set((state) => {
                    const resolvedTheme = state.settings.theme === 'auto' ? theme : state.settings.theme;
                    return {
                        systemTheme: theme,
                        currentTheme: resolvedTheme,
                    };
                });
            },

            getResolvedTheme: () => {
                const state = get();
                return state.settings.theme === 'auto' ? state.systemTheme : state.settings.theme;
            },

            openApp: (appId: string) => {
                set({
                    isAppOpen: true,
                    currentApp: appId,
                });
            },

            closeApp: () => {
                set({
                    isAppOpen: false,
                    currentApp: null,
                });
            },
        }),
        {
            name: 'mobile-portfolio-storage',
            partialize: (state) => ({
                settings: state.settings,
                hasSeenWelcome: state.hasSeenWelcome,
            }),
        }
    )
);