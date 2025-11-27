import {
  WidgetPosition,
  WidgetSize,
  WidgetConstraints,
  TimezoneOption,
} from "@/types/widget";

export const WIDGET_CONSTRAINTS = {
  minX: 20,
  minY: 20,
  maxX: () => Math.max(800, globalThis.window?.innerWidth - 100 || 800),
  maxY: () => Math.max(600, globalThis.window?.innerHeight - 150 || 600),
} as const;

// Helper function to get current screen breakpoint
function getScreenBreakpoint(): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' {
  const width = globalThis.window?.innerWidth || 1200;
  
  if (width < 480) return 'xs';
  if (width < 640) return 'sm'; 
  if (width < 768) return 'md';
  if (width < 1024) return 'lg';
  if (width < 1280) return 'xl';
  return '2xl';
}

// Responsive positioning configurations for each breakpoint
const RESPONSIVE_POSITIONS: Record<string, Record<string, WidgetPosition>> = {
  'xs': {
    'search-spotlight': { x: 10, y: 20 },
    'analog-clock': { x: 10, y: 100 },
    'calendar-glance': { x: 10, y: 220 },
    'skill-meter': { x: 10, y: 340 },
    'quote-generator': { x: 10, y: 460 },
    'system-stats': { x: 10, y: 580 },
  },
  'sm': {
    'search-spotlight': { x: 50, y: 20 },
    'analog-clock': { x: 20, y: 100 },
    'calendar-glance': { x: 280, y: 100 },
    'skill-meter': { x: 20, y: 320 },
    'quote-generator': { x: 150, y: 220 },
    'system-stats': { x: 350, y: 320 },
  },
  'md': {
    'search-spotlight': { x: 184, y: 20 }, // Center for 768px
    'analog-clock': { x: 50, y: 100 },
    'calendar-glance': { x: 418, y: 100 }, // Right side
    'skill-meter': { x: 50, y: 350 },
    'quote-generator': { x: 200, y: 250 },
    'system-stats': { x: 418, y: 350 },
  },
  'lg': {
    'search-spotlight': { x: 287, y: 20 }, // Center for 1024px
    'analog-clock': { x: 80, y: 120 },
    'calendar-glance': { x: 674, y: 120 },
    'skill-meter': { x: 80, y: 400 },
    'quote-generator': { x: 350, y: 280 },
    'system-stats': { x: 674, y: 400 },
  },
  'xl': {
    'search-spotlight': { x: 415, y: 20 }, // Center for 1280px
    'analog-clock': { x: 100, y: 100 },
    'calendar-glance': { x: 930, y: 100 },
    'skill-meter': { x: 100, y: 450 },
    'quote-generator': { x: 500, y: 300 },
    'system-stats': { x: 930, y: 450 },
  },
  '2xl': {
    'search-spotlight': { x: 645, y: 20 }, // Center for 1536px
    'analog-clock': { x: 100, y: 100 },
    'calendar-glance': { x: 1286, y: 100 },
    'skill-meter': { x: 100, y: 450 },
    'quote-generator': { x: 680, y: 300 },
    'system-stats': { x: 1186, y: 450 },
  },
};

// Helper function to calculate responsive positions
function calculateResponsivePosition(type: string): WidgetPosition {
  const breakpoint = getScreenBreakpoint();
  const screenWidth = globalThis.window?.innerWidth || 1200;
  const screenHeight = globalThis.window?.innerHeight || 800;
  
  // Get position from responsive configuration
  const position = RESPONSIVE_POSITIONS[breakpoint]?.[type];
  
  if (position) {
    // Ensure position stays within bounds
    const maxX = Math.max(0, screenWidth - 300); // Assuming max widget width of 300
    const maxY = Math.max(0, screenHeight - 200); // Assuming max widget height of 200
    
    return {
      x: Math.min(position.x, maxX),
      y: Math.min(position.y, maxY),
    };
  }
  
  // Fallback calculation if no predefined position exists
  switch (type) {
    case 'search-spotlight':
      return {
        x: Math.max(0, (screenWidth / 2) - 225), // Center horizontally
        y: 20
      };
    case 'calendar-glance':
      return {
        x: Math.max(50, screenWidth - 350), // Right side
        y: 120
      };
    case 'skill-meter':
      return {
        x: Math.min(100, screenWidth - 250),
        y: Math.max(200, screenHeight - 350) // Bottom left area
      };
    case 'quote-generator':
      return {
        x: Math.max(20, Math.min((screenWidth / 2) - 190, screenWidth - 380)),
        y: Math.max(150, Math.min((screenHeight / 2) - 110, screenHeight - 220))
      };
    case 'system-stats':
      return {
        x: Math.max(50, screenWidth - 350), // Right side
        y: Math.max(300, screenHeight - 250) // Bottom right area
      };
    default:
      return { 
        x: Math.min(150, screenWidth - 300), 
        y: Math.min(150, screenHeight - 200) 
      };
  }
}

// Keep the old fixed positions as fallback
export const FIXED_WIDGET_POSITIONS: Record<string, WidgetPosition> = {
  "search-spotlight": { x: 600, y: 20 },
  "analog-clock": { x: 100, y: 100 },
  "calendar-glance": { x: 1200, y: 100 },
  "skill-meter": { x: 100, y: 450 },
  "quote-generator": { x: 635, y: 300 },
} as const;

export const TIMEZONE_OPTIONS: readonly TimezoneOption[] = [
  { value: "UTC", label: "UTC", offset: "+00:00" },
  { value: "America/New_York", label: "New York (EST)", offset: "-05:00" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)", offset: "-08:00" },
  { value: "Europe/London", label: "London (GMT)", offset: "+00:00" },
  { value: "Europe/Paris", label: "Paris (CET)", offset: "+01:00" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "+09:00" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: "+08:00" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)", offset: "+11:00" },
  { value: "Africa/Lagos", label: "Lagos (WAT)", offset: "+01:00" },
] as const;

export function constrainSize(
  size: WidgetSize,
  constraints: WidgetConstraints
): WidgetSize {
  try {
    return {
      width: Math.max(
        constraints.minWidth,
        Math.min(size.width, constraints.maxWidth || Number.MAX_SAFE_INTEGER)
      ),
      height: Math.max(
        constraints.minHeight,
        Math.min(size.height, constraints.maxHeight || Number.MAX_SAFE_INTEGER)
      ),
    };
  } catch (error) {
    console.warn("Error constraining widget size:", error);
    return { width: constraints.minWidth, height: constraints.minHeight };
  }
}

export function generateWidgetId(): string {
  return `widget-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getDefaultWidgetPosition(type: string): WidgetPosition {
  // Always use responsive calculation for better screen adaptation
  return calculateResponsivePosition(type);
}

export function formatTimezone(timezone: string): string {
  try {
    const option = TIMEZONE_OPTIONS.find((tz) => tz.value === timezone);
    return option?.label || timezone;
  } catch (error) {
    console.warn("Error formatting timezone:", error);
    return timezone;
  }
}

export function getCurrentTime(timezone?: string): Date {
  try {
    // Check if Intl and DateTimeFormat are supported
    if (!Intl?.DateTimeFormat) {
      return new Date(); // Fallback to system time if Intl unsupported
    }

    if (!timezone || !TIMEZONE_OPTIONS.some((tz) => tz.value === timezone)) {
      return new Date(); // Fallback to system time if no valid timezone
    }

    // For UTC, just return current UTC time
    if (timezone === 'UTC') {
      return new Date();
    }

    // For other timezones, get the current time in that timezone and convert it back to a Date object that represents the local time in that timezone
    const now = new Date();

    // Get the time in the target timezone
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const dateParts = parts.reduce((acc: Record<string, string>, part) => {
      if (part.type !== "literal") {
        acc[part.type] = part.value;
      }
      return acc;
    }, {});

    // Creates a Date object where the local time matches the timezone time
    const timezoneDate = new Date(
      `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}:${dateParts.second}`
    );

    // Validate the resulting date
    if (Number.isNaN(timezoneDate.getTime())) {
      console.warn("Invalid date constructed for timezone:", timezone);
      return new Date(); // Fallback to system time
    }

    return timezoneDate;
  } catch (error) {
    console.warn("Error getting current time for timezone:", timezone, error);
    return new Date(); // Fallback to system time
  }
}