import { AppConfig } from './desktop';

// Extended app config for mobile with home screen positioning
export interface MobileAppConfig extends AppConfig {
    homePosition: {
        page: number;
        row: number;
        col: number;
    };
}

// Mobile-specific settings interface
export interface MobileSettings {
    theme: 'light' | 'dark' | 'auto';
    wallpaper: string;
    soundEnabled: boolean;
    notifications: boolean;
    vibration: boolean;
    autoRotate: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

// Mobile store interface
export interface MobileStore {
    settings: MobileSettings;
    currentTheme: 'light' | 'dark';
    systemTheme: 'light' | 'dark';
    isAppOpen: boolean;
    currentApp: string | null;
    
    updateSettings: (newSettings: Partial<MobileSettings>) => void;
    setSystemTheme: (theme: 'light' | 'dark') => void;
    getResolvedTheme: () => 'light' | 'dark';
    openApp: (appId: string) => void;
    closeApp: () => void;
}