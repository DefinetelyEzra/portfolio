/**
 * Animation utilities for macOS-style window effects
 */

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
export function calculateMinimizeCoordinates(
    windowElement: HTMLElement,
    dockIconElement: HTMLElement
): AnimationCoordinates {
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
}

/**
 * Generate bezier curve path for genie effect
 */
export function generateGeniePath(
    coordinates: AnimationCoordinates,
    steps: number = 50
): BezierPath {
    const { startX, startY, startWidth, startHeight, endX, endY, endWidth, endHeight } = coordinates;

    const x: number[] = [];
    const y: number[] = [];
    const width: number[] = [];
    const height: number[] = [];

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;

        // Cubic bezier curve for position (with control points for genie effect)
        const controlX1 = startX + (endX - startX) * 0.2;
        const controlY1 = startY - 50; // Pull upward slightly
        const controlX2 = endX - (endX - startX) * 0.2;
        const controlY2 = endY - 30; // Create the characteristic curve

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
}

/**
 * Cubic bezier interpolation
 */
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
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
    easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),
    easeIn: (t: number): number => t * t * t,
    easeInOut: (t: number): number =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    elastic: (t: number): number => {
        if (t === 0) return 0;
        if (t === 1) return 1;
        const p = 0.3;
        const a = 1;
        const s = p / 4;
        return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
    }
};

/**
 * Calculate animation duration based on distance
 */
export function calculateAnimationDuration(
    coordinates: AnimationCoordinates,
    baseDuration: number = 0.6
): number {
    const distance = Math.sqrt(
        Math.pow(coordinates.endX - coordinates.startX, 2) +
        Math.pow(coordinates.endY - coordinates.startY, 2)
    );

    // Scale duration based on distance (with min/max bounds)
    const scaleFactor = distance / 500; // Normalize to typical screen distance
    return Math.max(0.4, Math.min(1.0, baseDuration * scaleFactor));
}

/**
 * Get dock icon element by app ID
 */
export function getDockIconElement(appId: string): HTMLElement | null {
    return document.querySelector(`[data-dock-icon="${appId}"]`) as HTMLElement;
}

/**
 * Check if element is visible and within viewport
 */
export function isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 &&
        rect.top >= 0 && rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;
}

/**
 * Generate genie effect path points for canvas rendering
 */
export function generateGeniePathPoints(
    startRect: DOMRect,
    endRect: DOMRect,
    progress: number
): {
    topLeft: { x: number; y: number };
    topRight: { x: number; y: number };
    bottomLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
} {
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    // Calculate the characteristic genie warping
    const warpFactor = Math.sin(progress * Math.PI) * 0.3;
    const pullFactor = progress * progress;

    // End point (dock icon center)
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    // Interpolate corners with warping effect
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
}

/**
 * Create genie warp transformation matrix
 */
export function createGenieTransform(progress: number): string {
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    const scaleX = 1 - easeProgress * 0.95;
    const scaleY = 1 - easeProgress * 0.9;
    const skewX = easeProgress * 15;
    const rotateX = easeProgress * 10;
    const warpY = easeProgress * 20;

    return `
        scaleX(${scaleX})
        scaleY(${scaleY})
        skew(${skewX}deg, 0deg)
        rotateX(${rotateX}deg)
        translateY(${warpY}px)
    `;
}