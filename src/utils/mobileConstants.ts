import dynamic from 'next/dynamic';
import { DOCK_APPS } from './constants';

// Dynamically import the mobile settings component
const MobileSettingsApp = dynamic(() => import('@/components/mobile/apps/MobileSettingsApp'), { ssr: false });

// Mobile app grid configuration
export const MOBILE_GRID = {
    COLUMNS: 4,
    ROWS_PER_SCREEN: 6,
    APP_SIZE: 60,
    APP_SPACING: 20,
    MARGIN: 20,
} as const;

// Mobile-specific apps that don't exist on desktop
const MOBILE_SPECIFIC_APPS = [
    {
        id: 'mobile-settings',
        name: 'Settings',
        icon: '/icons/settings.svg',
        component: MobileSettingsApp,
        defaultSize: { width: 400, height: 600 },
        minSize: { width: 350, height: 500 },
        resizable: false,
        draggable: false,
    },
];

export const MOBILE_APPS = [
    ...DOCK_APPS.filter(app => app.id !== 'settings').map((app, index) => ({
        ...app,
        homePosition: {
            page: Math.floor(index / (MOBILE_GRID.COLUMNS * MOBILE_GRID.ROWS_PER_SCREEN)),
            row: Math.floor((index % (MOBILE_GRID.COLUMNS * MOBILE_GRID.ROWS_PER_SCREEN)) / MOBILE_GRID.COLUMNS),
            col: index % MOBILE_GRID.COLUMNS,
        },
    })),
    ...MOBILE_SPECIFIC_APPS.map((app, index) => {
        const baseIndex = DOCK_APPS.filter(a => a.id !== 'settings').length + index;
        return {
            ...app,
            homePosition: {
                page: Math.floor(baseIndex / (MOBILE_GRID.COLUMNS * MOBILE_GRID.ROWS_PER_SCREEN)),
                row: Math.floor((baseIndex % (MOBILE_GRID.COLUMNS * MOBILE_GRID.ROWS_PER_SCREEN)) / MOBILE_GRID.COLUMNS),
                col: baseIndex % MOBILE_GRID.COLUMNS,
            },
        };
    })
];

// iOS-style widget configurations for mobile
export const MOBILE_WIDGETS = [
    {
        id: 'mobile-clock',
        type: 'clock',
        name: 'Clock',
        size: { width: 2, height: 1 },
        position: { page: 0, row: 0, col: 0 },
    },
] as const;

// iOS status bar configuration
export const IOS_STATUS_BAR = {
    HEIGHT: 44,
    DYNAMIC_ISLAND_HEIGHT: 37,
    ELEMENTS: {
        TIME: true,
        BATTERY: true,
        SIGNAL: true,
        WIFI: true,
    },
} as const;

// Navigation gestures
export const MOBILE_GESTURES = {
    SWIPE_THRESHOLD: 50,
    SWIPE_VELOCITY_THRESHOLD: 0.3,
    HOME_INDICATOR_HEIGHT: 34,
} as const;