export const MOBILE_BREAKPOINT = 768;

export const isMobile = (): boolean => {
    if (globalThis.window === undefined) return false;
    return globalThis.window.innerWidth < MOBILE_BREAKPOINT;
};

export const isIOS = (): boolean => {
    if (globalThis.window === undefined) return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
    if (globalThis.window === undefined) return false;
    return 'ontouchstart' in globalThis.window || navigator.maxTouchPoints > 0;
};

export const getViewportSize = () => {
    if (globalThis.window === undefined) return { width: 0, height: 0 };
    return {
        width: globalThis.window.innerWidth,
        height: globalThis.window.innerHeight
    };
};

export const getSafeAreaInsets = () => {
    if (globalThis.window === undefined) return { top: 0, bottom: 0 };

    // Get CSS custom properties for safe area insets
    const computedStyle = getComputedStyle(document.documentElement);
    return {
        top: Number.parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        bottom: Number.parseInt(computedStyle.getPropertyValue('--sab') || '0'),
    };
};