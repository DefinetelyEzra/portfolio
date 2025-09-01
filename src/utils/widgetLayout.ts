import { WidgetPosition, WidgetSize } from '@/types/widgetLayout';
import { getDefaultWidgetPosition } from './widgetHelpers';

export function getWidgetPosition(widgetType: string): WidgetPosition {
    return getDefaultWidgetPosition(widgetType);
}

// Resized handling (future use)
export function getContainerBounds(): { width: number; height: number } {
    try {
        if (typeof window !== 'undefined') {
            return {
                width: window.innerWidth,
                height: window.innerHeight,
            };
        }
        return { width: 1200, height: 800 }; // Fallback for SSR
    } catch (error) {
        console.warn('Error getting container bounds:', error);
        return { width: 1200, height: 800 };
    }
}

// Basic validation to ensure widgets stay within viewport
export function validateWidgetPosition(
    position: WidgetPosition,
    size: WidgetSize,
    containerBounds: { width: number; height: number }
): WidgetPosition {
    try {
        const minX = 0;
        const minY = 0;
        const maxX = Math.max(minX, containerBounds.width - size.width);
        const maxY = Math.max(minY, containerBounds.height - size.height);

        return {
            x: Math.max(minX, Math.min(position.x, maxX)),
            y: Math.max(minY, Math.min(position.y, maxY)),
        };
    } catch (error) {
        console.warn('Error validating widget position:', error);
        return { x: 100, y: 100 };
    }
}