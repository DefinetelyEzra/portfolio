export interface MousePosition {
    x: number;
    y: number;
}

export interface ElementBounds {
    left: number;
    top: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

/**
 * Calculate magnetic pull effect
 */
export function calculateMagneticPull(
    mousePos: MousePosition,
    elementBounds: ElementBounds,
    strength: number = 0.3
): { x: number; y: number } {
    const distanceX = mousePos.x - elementBounds.centerX;
    const distanceY = mousePos.y - elementBounds.centerY;

    const distance = Math.hypot(distanceX, distanceY);
    const maxDistance = Math.max(elementBounds.width, elementBounds.height);

    if (distance > maxDistance) {
        return { x: 0, y: 0 };
    }

    const pullX = (distanceX / maxDistance) * strength * 100;
    const pullY = (distanceY / maxDistance) * strength * 100;

    return { x: pullX, y: pullY };
}

/**
 * Calculate 3D card tilt
 */
export function calculate3DTilt(
    mousePos: MousePosition,
    elementBounds: ElementBounds,
    maxTilt: number = 15
): { rotateX: number; rotateY: number } {
    const relativeX = (mousePos.x - elementBounds.left) / elementBounds.width;
    const relativeY = (mousePos.y - elementBounds.top) / elementBounds.height;

    const rotateY = (relativeX - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - relativeY) * maxTilt * 2;

    return { rotateX, rotateY };
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(elementId: string, offset: number = 80): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
    });
}

/**
 * Parallax scroll calculation
 */
export function calculateParallax(scrollY: number, speed: number = 0.5): number {
    return scrollY * speed;
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, offset: number = 0): boolean {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= window.innerHeight - offset &&
        rect.bottom >= offset
    );
}