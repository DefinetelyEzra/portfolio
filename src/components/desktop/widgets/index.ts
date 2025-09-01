import AnalogClock from './AnalogClock';
import CalendarGlance from './CalendarGlance';
import SearchSpotlight from './SearchSpotlight';
import SkillMeter from './SkillMeter';
import QuoteGenerator from './QuoteGenerator';

// Widget Registry - maps widget types to their components
export const WIDGET_REGISTRY = {
  'analog-clock': AnalogClock,
  'calendar-glance': CalendarGlance,
  'search-spotlight': SearchSpotlight,
  'skill-meter': SkillMeter,
  'quote-generator': QuoteGenerator,
} as const;

// Export widget types for type safety
export type WidgetType = keyof typeof WIDGET_REGISTRY;

// Export all widget components
export {
  AnalogClock,
  CalendarGlance,
  SearchSpotlight,
  SkillMeter,
  QuoteGenerator,
};

// Export utility components
export { default as BaseWidget } from './BaseWidget';
export { default as WidgetManager } from './WidgetManager';

// Widget metadata for the settings panel
export const WIDGET_METADATA = {
  'analog-clock': {
    name: 'Analog Clock',
    description: 'Beautiful analog clock with timezone support',
    category: 'time',
    defaultSize: { width: 290, height: 290 },
    minSize: { width: 200, height: 200 },
    maxSize: { width: 400, height: 400 },
    resizable: true,
    configurable: true,
  },
  'calendar-glance': {
    name: 'Calendar Glance',
    description: 'Monthly calendar with events and milestones',
    category: 'productivity',
    defaultSize: { width: 300, height: 400 },
    minSize: { width: 280, height: 320 },
    maxSize: { width: 400, height: 500 },
    resizable: true,
    configurable: true,
  },
  'search-spotlight': {
    name: 'Search Spotlight',
    description: 'Quick search across portfolio content',
    category: 'utility',
    defaultSize: { width: 350, height: 50 },
    minSize: { width: 300, height: 40 },
    maxSize: { width: 500, height: 80 },
    resizable: true,
    configurable: true,
  },
  'skill-meter': {
    name: 'Skill Meter',
    description: 'Interactive display of technical skills',
    category: 'portfolio',
    defaultSize: { width: 320, height: 200 },
    minSize: { width: 280, height: 160 },
    maxSize: { width: 400, height: 280 },
    resizable: true,
    configurable: true,
  },
  'quote-generator': {
    name: 'Quote Generator',
    description: 'Inspirational quotes with smooth animations',
    category: 'inspiration',
    defaultSize: { width: 380, height: 220 },
    minSize: { width: 320, height: 180 },
    maxSize: { width: 500, height: 300 },
    resizable: true,
    configurable: true,
  },
} as const;

// Widget categories for organization
export const WIDGET_CATEGORIES = {
  time: 'Time & Productivity',
  productivity: 'Productivity',
  utility: 'Utilities',
  portfolio: 'Portfolio',
  inspiration: 'Inspiration',
  system: 'System',
} as const;

// Helper function to get widget metadata
export function getWidgetMetadata(type: WidgetType) {
  return WIDGET_METADATA[type];
}

// Helper function to get widgets by category
export function getWidgetsByCategory(category: keyof typeof WIDGET_CATEGORIES): WidgetType[] {
  return Object.entries(WIDGET_METADATA)
    .filter(([, metadata]) => metadata.category === category)
    .map(([type]) => type as WidgetType);
}

// Helper function to validate widget type
export function isValidWidgetType(type: string): type is WidgetType {
  return type in WIDGET_REGISTRY;
}