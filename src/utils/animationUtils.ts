/**
 * Animation utilities for macOS-style window effects
 */

import { memoize } from 'lodash';

export interface AnimationCoordinates {
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    endX: number;
    endY: number;
    endWidth: number;
    endHeight: number;
}

export interface BezierPath {
    x: number[];
    y: number[];
    width: number[];
    height: number[];
}

/**
 * Calculate animation coordinates from window to dock icon
 */
export const calculateMinimizeCoordinates = memoize(
    (windowElement: HTMLElement, dockIconElement: HTMLElement): AnimationCoordinates => {
        const windowRect = windowElement.getBoundingClientRect();
        const dockRect = dockIconElement.getBoundingClientRect();

        return {
            startX: windowRect.left,
            startY: windowRect.top,
            startWidth: windowRect.width,
            startHeight: windowRect.height,
            endX: dockRect.left + (dockRect.width / 2) - 20,
            endY: dockRect.top + (dockRect.height / 2) - 15,
            endWidth: 40,
            endHeight: 30,
        };
    },
    (windowElement: HTMLElement, dockIconElement: HTMLElement) => `${windowElement.id}-${dockIconElement.id}`
);

/**
 * Generate bezier curve path for genie effect
 */
export const generateGeniePath = memoize(
    (coordinates: AnimationCoordinates, steps: number = 30): BezierPath => {
        const { startX, startY, startWidth, startHeight, endX, endY, endWidth, endHeight } = coordinates;

        const x: number[] = [];
        const y: number[] = [];
        const width: number[] = [];
        const height: number[] = [];

        const controlX1 = startX + (endX - startX) * 0.2;
        const controlY1 = startY - 50;
        const controlX2 = endX - (endX - startX) * 0.2;
        const controlY2 = endY - 30;

        for (let i = 0; i <= steps; i++) {
            const t = i / steps;

            const currentX = cubicBezier(t, startX, controlX1, controlX2, endX);
            const currentY = cubicBezier(t, startY, controlY1, controlY2, endY);
            const currentWidth = lerp(t, startWidth, endWidth);
            const currentHeight = lerp(t, startHeight, endHeight);

            x.push(currentX);
            y.push(currentY);
            width.push(currentWidth);
            height.push(currentHeight);
        }

        return { x, y, width, height };
    },
    (coordinates: AnimationCoordinates, steps: number = 30) => `${JSON.stringify(coordinates)}-${steps}`
);

/**
 * Cubic bezier interpolation
 */
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    return uu * u * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + tt * t * p3;
}

/**
 * Linear interpolation
 */
function lerp(t: number, start: number, end: number): number {
    return start + (end - start) * t;
}

/**
 * Easing functions for smooth animations
 */
export const easingFunctions = {
    easeOut: (t: number): number => 1 - (1 - t) ** 3,
    easeIn: (t: number): number => t ** 3,
    easeInOut: (t: number): number => t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2,
    easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t ** 2 : 1 - ((-2 * t + 2) ** 2) / 2,
    elastic: memoize((t: number): number => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const p = 0.3;
        return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
    }, (t: number) => t.toFixed(3))
};

/**
 * Calculate animation duration based on distance
 */
export const calculateAnimationDuration = memoize(
    (coordinates: AnimationCoordinates, baseDuration: number = 0.6): number => {
        const distance = Math.hypot(
            coordinates.endX - coordinates.startX,
            coordinates.endY - coordinates.startY
        );

        const scaleFactor = distance / 500;
        return Math.max(0.4, Math.min(1, baseDuration * scaleFactor));
    },
    (coordinates: AnimationCoordinates, baseDuration: number = 0.6) => `${JSON.stringify(coordinates)}-${baseDuration}`
);

/**
 * Get dock icon element by app ID
 */
const dockIconCache = new Map<string, HTMLElement | null>();
export function getDockIconElement(appId: string): HTMLElement | null {
    if (dockIconCache.has(appId)) {
        return dockIconCache.get(appId)!;
    }

    const element = document.querySelector(`[data-dock-icon="${appId}"]`);
    dockIconCache.set(appId, element as HTMLElement | null);
    return element as HTMLElement | null;
}

/**
 * Check if element is visible and within viewport
 */
export const isElementVisible = memoize(
    (element: HTMLElement): boolean => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 &&
            rect.height > 0 &&
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth;
    },
    (element: HTMLElement) => element.id
);

/**
 * Generate genie effect path points for canvas rendering
 */
export const generateGeniePathPoints = memoize(
    (startRect: DOMRect, endRect: DOMRect, progress: number): {
        topLeft: { x: number; y: number };
        topRight: { x: number; y: number };
        bottomLeft: { x: number; y: number };
        bottomRight: { x: number; y: number };
    } => {
        const easeProgress = easingFunctions.easeOut(progress);

        const warpFactor = Math.sin(progress * Math.PI) * 0.3;
        const pullFactor = progress * progress;

        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;

        const topLeft = {
            x: startRect.left + (endX - startRect.left) * easeProgress + warpFactor * 20,
            y: startRect.top + (endY - startRect.top) * easeProgress - pullFactor * 30
        };

        const topRight = {
            x: startRect.right + (endX - startRect.right) * easeProgress - warpFactor * 20,
            y: startRect.top + (endY - startRect.top) * easeProgress - pullFactor * 30
        };

        const bottomLeft = {
            x: startRect.left + (endX - startRect.left) * easeProgress + warpFactor * 40,
            y: startRect.bottom + (endY - startRect.bottom) * easeProgress + pullFactor * 10
        };

        const bottomRight = {
            x: startRect.right + (endX - startRect.right) * easeProgress - warpFactor * 40,
            y: startRect.bottom + (endY - startRect.bottom) * easeProgress + pullFactor * 10
        };

        return { topLeft, topRight, bottomLeft, bottomRight };
    },
    (startRect: DOMRect, endRect: DOMRect, progress: number) =>
        `${startRect.left},${startRect.top},${startRect.width},${startRect.height}-` +
        `${endRect.left},${endRect.top},${endRect.width},${endRect.height}-${progress.toFixed(3)}`
);

/**
 * Create genie warp transformation matrix
 */
export const createGenieTransform = memoize(
    (progress: number): string => {
        const easeProgress = easingFunctions.easeOut(progress);

        const scaleX = 1 - easeProgress * 0.95;
        const scaleY = 1 - easeProgress * 0.9;
        const skewX = easeProgress * 15;
        const rotateX = easeProgress * 10;
        const warpY = easeProgress * 20;

        return `scale(${scaleX}, ${scaleY}) skew(${skewX}deg, 0deg) rotateX(${rotateX}deg) translateY(${warpY}px)`;
    },
    (progress: number) => progress.toFixed(3)
);