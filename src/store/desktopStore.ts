import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WindowState, DesktopSettings, NotificationData } from '@/types/desktop';
import { DOCK_APPS } from '@/utils/constants';
import { ALL_WALLPAPERS } from '@/utils/wallpaperUtils';

interface EnhancedDesktopSettings extends DesktopSettings {
    wallpaperCycling: {
        enabled: boolean;
        speed: 'slow' | 'medium' | 'fast';
        categories: string[];
        shuffle: boolean;
    };
    soundEnabled: boolean;
}

interface DesktopStore {
    // Window Management
    windows: WindowState[];
    activeWindowId: string | null;
    nextZIndex: number;

    // Settings 
    settings: EnhancedDesktopSettings;

    // Notifications
    notifications: NotificationData[];

    // UI State
    isBooting: boolean;
    isLoggedIn: boolean;

    // Wallpaper state
    wallpaperHistory: string[];
    currentWallpaperIndex: number;

    currentTheme: 'light' | 'dark';
    systemTheme: 'light' | 'dark';

    // Actions
    openWindow: (appId: string) => void;
    closeWindow: (windowId: string) => void;
    minimizeWindow: (windowId: string) => void;
    completeMinimize: (windowId: string) => void;
    restoreWindow: (windowId: string) => void;
    completeRestore: (windowId: string) => void;
    maximizeWindow: (windowId: string) => void;
    focusWindow: (windowId: string) => void;
    moveWindow: (windowId: string, position: { x: number; y: number }) => void;
    resizeWindow: (windowId: string, size: { width: number; height: number }) => void;
    clearMinimizeAnimation: (windowId: string) => void;

    // Settings Actions 
    updateSettings: (settings: Partial<EnhancedDesktopSettings>) => void;
    updateWallpaperSettings: (settings: Partial<EnhancedDesktopSettings['wallpaperCycling']>) => void;

    // Wallpaper Actions
    setWallpaper: (wallpaper: string) => void;
    addToWallpaperHistory: (wallpaper: string) => void;
    clearWallpaperHistory: () => void;

    // Theme Actions
    setSystemTheme: (theme: 'light' | 'dark') => void;
    getResolvedTheme: () => 'light' | 'dark';

    // Notification Actions
    addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;

    // UI Actions
    setBooting: (isBooting: boolean) => void;
    setLoggedIn: (isLoggedIn: boolean) => void;
}

const defaultSettings: EnhancedDesktopSettings = {
    wallpaper: ALL_WALLPAPERS[0]?.path || '/wallpapers/default.jpg',
    theme: 'dark',
    dockPosition: 'bottom',
    showNotifications: true,
    soundEnabled: true,
    wallpaperCycling: {
        enabled: true,
        speed: 'medium',
        categories: ['all'],
        shuffle: false,
    },
};

export const useDesktopStore = create<DesktopStore>()(
    persist(
        (set, get) => ({
            // Initial State
            windows: [],
            activeWindowId: null,
            nextZIndex: 1000,
            settings: defaultSettings,
            notifications: [],
            isBooting: true,
            isLoggedIn: false,
            wallpaperHistory: [],
            currentWallpaperIndex: 0,
            currentTheme: 'dark',
            systemTheme: 'dark',

            // Window Management Actions
            openWindow: (appId: string) => {
                set((state) => {
                    const windowsByApp = new Map<string, WindowState[]>();

                    for (const window of state.windows) {
                        if (!windowsByApp.has(window.appId)) {
                            windowsByApp.set(window.appId, []);
                        }
                        windowsByApp.get(window.appId)!.push(window);
                    }

                    const appWindows = windowsByApp.get(appId) || [];
                    const existingWindow = appWindows.find((w: WindowState) => w.isVisible);

                    if (existingWindow) {
                        if (existingWindow.isMinimized) {
                            return {
                                windows: state.windows.map((w: WindowState) =>
                                    w.id === existingWindow.id
                                        ? { ...w, isMinimized: false, isAnimatingRestore: true, zIndex: state.nextZIndex }
                                        : w
                                ),
                                activeWindowId: existingWindow.id,
                                nextZIndex: state.nextZIndex + 1,
                            };
                        } else {
                            return {
                                windows: state.windows.map((w: WindowState) =>
                                    w.id === existingWindow.id
                                        ? { ...w, zIndex: state.nextZIndex }
                                        : w
                                ),
                                activeWindowId: existingWindow.id,
                                nextZIndex: state.nextZIndex + 1,
                            };
                        }
                    }

                    const app = DOCK_APPS.find((a) => a.id === appId);
                    const defaultSize = app?.defaultSize || { width: 800, height: 600 };

                    const newWindow: WindowState = {
                        id: `${appId}-${Date.now()}`,
                        appId,
                        position: {
                            x: 100 + (state.windows.length % 10) * 30,
                            y: 100 + (state.windows.length % 10) * 30,
                        },
                        size: defaultSize,
                        isMinimized: false,
                        isMaximized: false,
                        zIndex: state.nextZIndex,
                        isVisible: true,
                    };

                    return {
                        windows: [...state.windows, newWindow],
                        activeWindowId: newWindow.id,
                        nextZIndex: state.nextZIndex + 1,
                    };
                });
            },
            closeWindow: (windowId: string) => {
                set((state) => ({
                    windows: state.windows.filter((w) => w.id !== windowId),
                    activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId,
                }));
            },
            minimizeWindow: (windowId: string) => {
                set((state) => {
                    return {
                        windows: state.windows.map((w) =>
                            w.id === windowId
                                ? { ...w, isAnimatingMinimize: true }
                                : w
                        ),
                    };
                });
            },
            completeMinimize: (windowId: string) => {
                set((state) => ({
                    windows: state.windows.map((w) =>
                        w.id === windowId
                            ? { ...w, isMinimized: true, isAnimatingMinimize: false }
                            : w
                    ),
                    activeWindowId: state.activeWindowId === windowId ? null : state.activeWindowId,
                }));
            },
            restoreWindow: (windowId: string) => {
                set((state) => ({
                    windows: state.windows.map((w) =>
                        w.id === windowId ? { ...w, isMinimized: false, isAnimatingRestore: true, zIndex: state.nextZIndex } : w
                    ),
                    activeWindowId: windowId,
                    nextZIndex: state.nextZIndex + 1,
                }));
            },
            completeRestore: (windowId: string) => {
                set((state) => ({
                    windows: state.windows.map((w) =>
                        w.id === windowId
                            ? { ...w, isAnimatingRestore: false }
                            : w
                    ),
                }));
            },
            clearMinimizeAnimation: (windowId: string) => {
                set((state) => ({
                    windows: state.windows.map((w) =>
                        w.id === windowId ? { ...w, isAnimatingMinimize: false } : w
                    ),
                }));
            },
            maximizeWindow: (windowId: string) => {
                set((state) => {
                    const updatedWindows = state.windows.map((w) =>
                        w.id === windowId
                            ? {
                                ...w,
                                isMaximized: !w.isMaximized,
                                position: w.isMaximized ? { x: 100, y: 100 } : { x: 0, y: 0 },
                                size: w.isMaximized
                                    ? { width: 800, height: 600 }
                                    : { width: globalThis.window.innerWidth, height: globalThis.window.innerHeight - 80 },
                                layoutKey: Date.now(),
                            }
                            : w
                    );
                    return { windows: updatedWindows };
                });
            },
            focusWindow: (windowId: string) => {
                set((state) => ({
                    windows: state.windows.map((w) =>
                        w.id === windowId ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
                    ),
                    activeWindowId: windowId,
                    nextZIndex: state.nextZIndex + 1,
                }));
            },
            moveWindow: (windowId: string, position: { x: number; y: number }) => {
                set((state) => ({
                    windows: state.windows.map((w) => (w.id === windowId ? { ...w, position } : w)),
                }));
            },
            resizeWindow: (windowId: string, size: { width: number; height: number }) => {
                set((state) => ({
                    windows: state.windows.map((w) => (w.id === windowId ? { ...w, size } : w)),
                }));
            },

            // Settings Actions
            updateSettings: (newSettings: Partial<EnhancedDesktopSettings>) => {
                set((state) => {
                    const updatedSettings = { ...state.settings, ...newSettings };
                    const resolvedTheme = updatedSettings.theme === 'auto' ? state.systemTheme : updatedSettings.theme;

                    return {
                        settings: updatedSettings,
                        currentTheme: resolvedTheme,
                    };
                });
            },
            updateWallpaperSettings: (newWallpaperSettings: Partial<EnhancedDesktopSettings['wallpaperCycling']>) => {
                set((state) => ({
                    settings: {
                        ...state.settings,
                        wallpaperCycling: { ...state.settings.wallpaperCycling, ...newWallpaperSettings },
                    },
                }));
            },

            // Wallpaper Actions
            setWallpaper: (wallpaper: string) => {
                set((state) => {
                    // Validate wallpaper exists in collection
                    const wallpaperExists = ALL_WALLPAPERS.some(w => w.path === wallpaper || w.url === wallpaper);
                    const finalWallpaper = wallpaperExists ? wallpaper : ALL_WALLPAPERS[0]?.path || '/wallpapers/default.jpg';

                    const shouldAddToHistory = state.settings.wallpaper !== finalWallpaper;
                    const newHistory = shouldAddToHistory
                        ? [...state.wallpaperHistory.slice(-19), state.settings.wallpaper]
                        : state.wallpaperHistory;

                    return {
                        settings: { ...state.settings, wallpaper: finalWallpaper },
                        wallpaperHistory: newHistory,
                    };
                });
            },
            addToWallpaperHistory: (wallpaper: string) => {
                set((state) => ({
                    wallpaperHistory: [...state.wallpaperHistory.slice(-19), wallpaper],
                }));
            },
            clearWallpaperHistory: () => {
                set({ wallpaperHistory: [] });
            },

            // Theme Actions
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

            // Notification Actions
            addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => {
                const newNotification: NotificationData = {
                    ...notification,
                    id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
                    timestamp: Date.now(),
                };

                set((state) => ({
                    notifications: [...state.notifications, newNotification],
                }));

                if (notification.duration) {
                    setTimeout(() => {
                        get().removeNotification(newNotification.id);
                    }, notification.duration);
                }
            },
            removeNotification: (id: string) => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                }));
            },

            // UI Actions
            setBooting: (isBooting: boolean) => {
                set({ isBooting });
            },
            setLoggedIn: (isLoggedIn: boolean) => {
                set({ isLoggedIn });
            },
        }),
        {
            name: 'macos-portfolio-storage',
            partialize: (state) => ({
                settings: state.settings,
                isLoggedIn: state.isLoggedIn,
                wallpaperHistory: state.wallpaperHistory,
            }),
        }
    )
);