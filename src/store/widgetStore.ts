import { create } from 'zustand';
import { WidgetState } from '@/types/widget';
import { generateWidgetId, getDefaultWidgetPosition } from '@/utils/widgetHelpers';
import { LayoutSettings, DEFAULT_LAYOUT_SETTINGS } from '@/types/widgetLayout';

interface WidgetStore {
    widgets: WidgetState[];
    nextWidgetZIndex: number;

    // Widget Layout Settings
    widgetLayoutSettings: LayoutSettings;

    // Widget Actions
    addWidget: (type: string, customSettings?: Record<string, unknown>) => void;
    removeWidget: (widgetId: string) => void;
    updateWidget: (widgetId: string, updates: Partial<WidgetState>) => void;
    focusWidget: (widgetId: string) => void;

    // Widget Layout Actions
    updateWidgetLayoutSettings: (settings: Partial<LayoutSettings>) => void;
}

export const useWidgetStore = create<WidgetStore>((set) => ({
    widgets: [
        {
            id: generateWidgetId(),
            type: 'analog-clock',
            position: getDefaultWidgetPosition('analog-clock'),
            size: { width: 290, height: 290 },
            isVisible: true,
            zIndex: 2000,
            settings: {},
            theme: 'dark',
            constraints: { minWidth: 150, minHeight: 150, maxWidth: 400, maxHeight: 400 },
        },
        {
            id: generateWidgetId(),
            type: 'calendar-glance',
            position: getDefaultWidgetPosition('calendar-glance'),
            size: { width: 300, height: 400 },
            isVisible: true,
            zIndex: 2001,
            settings: {
                showWeekNumbers: false,
                startWeek: 'sunday',
                highlightToday: true,
                showEvents: true,
                eventCategories: ['project', 'milestone', 'skill', 'personal'],
                theme: 'auto',
                animation: 'smooth',
            },
            theme: 'dark',
            constraints: { minWidth: 250, minHeight: 300, maxWidth: 400, maxHeight: 600 },
        },
        {
            id: generateWidgetId(),
            type: 'search-spotlight',
            position: getDefaultWidgetPosition('search-spotlight'),
            size: { width: 450, height: 50 },
            isVisible: true,
            zIndex: 2002,
            settings: {
                showSuggestions: true,
                maxResults: 6,
                searchCategories: ['apps', 'projects', 'skills', 'content'],
                animateResults: true,
            },
            theme: 'dark',
            constraints: { minWidth: 250, minHeight: 40, maxWidth: 500, maxHeight: 80 },
        },
        {
            id: generateWidgetId(),
            type: 'skill-meter',
            position: getDefaultWidgetPosition('skill-meter'),
            size: { width: 320, height: 200 },
            isVisible: true,
            zIndex: 2003,
            settings: {
                autoRotate: true,
                rotationInterval: 15,
                showBoostEffect: true,
                displayMode: 'gauge',
                theme: 'auto',
                showDetails: true,
                categories: ['all'],
            },
            theme: 'dark',
            constraints: { minWidth: 250, minHeight: 150, maxWidth: 450, maxHeight: 300 },
        },
        {
            id: generateWidgetId(),
            type: 'quote-generator',
            position: getDefaultWidgetPosition('quote-generator'),
            size: { width: 380, height: 220 },
            isVisible: true,
            zIndex: 2004,
            settings: {
                autoRefresh: true,
                refreshInterval: 'normal',
                categories: ['tech', 'motivation', 'personal'],
                showAuthor: true,
                animationType: 'flip',
                enableEasterEggs: true,
            },
            theme: 'dark',
            constraints: { minWidth: 300, minHeight: 180, maxWidth: 500, maxHeight: 350 },
        },
    ],
    nextWidgetZIndex: 2005,
    widgetLayoutSettings: DEFAULT_LAYOUT_SETTINGS,

    // Widget Management Actions
    addWidget: (type: string, customSettings?: Record<string, unknown>) => {
        set((state) => {
            // Get the fixed position for this widget type
            const position = getDefaultWidgetPosition(type);

            const getDefaults = (widgetType: string) => {
                switch (widgetType) {
                    case 'analog-clock':
                        return {
                            size: { width: 290, height: 290 },
                            constraints: { minWidth: 150, minHeight: 150, maxWidth: 400, maxHeight: 400 },
                            settings: {},
                        };
                    case 'calendar-glance':
                        return {
                            size: { width: 300, height: 400 },
                            constraints: { minWidth: 250, minHeight: 300, maxWidth: 400, maxHeight: 600 },
                            settings: {
                                showWeekNumbers: false,
                                startWeek: 'sunday',
                                highlightToday: true,
                                showEvents: true,
                                eventCategories: ['project', 'milestone', 'skill', 'personal'],
                                theme: 'auto',
                                animation: 'smooth',
                            },
                        };
                    case 'search-spotlight':
                        return {
                            size: { width: 450, height: 50 },
                            constraints: { minWidth: 250, minHeight: 40, maxWidth: 500, maxHeight: 80 },
                            settings: {
                                showSuggestions: true,
                                maxResults: 6,
                                searchCategories: ['apps', 'projects', 'skills', 'content'],
                                animateResults: true,
                            },
                        };
                    case 'skill-meter':
                        return {
                            size: { width: 320, height: 200 },
                            constraints: { minWidth: 250, minHeight: 150, maxWidth: 450, maxHeight: 300 },
                            settings: {
                                autoRotate: true,
                                rotationInterval: 15,
                                showBoostEffect: true,
                                displayMode: 'gauge',
                                theme: 'auto',
                                showDetails: true,
                                categories: ['all'],
                            },
                        };
                    case 'quote-generator':
                        return {
                            size: { width: 380, height: 220 },
                            constraints: { minWidth: 300, minHeight: 180, maxWidth: 500, maxHeight: 350 },
                            settings: {
                                autoRefresh: true,
                                refreshInterval: 'normal',
                                categories: ['tech', 'motivation', 'personal'],
                                showAuthor: true,
                                animationType: 'flip',
                                enableEasterEggs: true,
                            },
                        };
                    default:
                        return {
                            size: { width: 200, height: 200 },
                            constraints: { minWidth: 100, minHeight: 100, maxWidth: 600, maxHeight: 600 },
                            settings: {},
                        };
                }
            };

            const defaults = getDefaults(type);
            const newWidget: WidgetState = {
                id: generateWidgetId(),
                type,
                position,
                size: defaults.size,
                isVisible: true,
                zIndex: state.nextWidgetZIndex,
                settings: { ...defaults.settings, ...customSettings },
                theme: 'auto',
                constraints: defaults.constraints,
            };

            return {
                widgets: [...state.widgets, newWidget],
                nextWidgetZIndex: state.nextWidgetZIndex + 1,
            };
        });
    },

    removeWidget: (widgetId: string) => {
        set((state) => ({
            widgets: state.widgets.filter((w) => w.id !== widgetId),
        }));
    },

    updateWidget: (widgetId: string, updates: Partial<WidgetState>) => {
        set((state) => ({
            widgets: state.widgets.map((w) => (w.id === widgetId ? { ...w, ...updates } : w)),
        }));
    },

    focusWidget: (widgetId: string) => {
        set((state) => {
            const maxZIndex = Math.max(...state.widgets.map(w => w.zIndex), state.nextWidgetZIndex);
            return {
                widgets: state.widgets.map((w) =>
                    w.id === widgetId ? { ...w, zIndex: w.type === 'search-spotlight' ? maxZIndex + 1 : maxZIndex } : w
                ),
                nextWidgetZIndex: state.nextWidgetZIndex + 1,
            };
        });
    },

    updateWidgetLayoutSettings: (settings: Partial<LayoutSettings>) => {
        set((state) => ({
            widgetLayoutSettings: { ...state.widgetLayoutSettings, ...settings },
        }));
    },

}));