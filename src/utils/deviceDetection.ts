export const MOBILE_BREAKPOINT = 768;

export const isMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
};

export const isIOS = (): boolean => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const getViewportSize = () => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    return {
        width: window.innerWidth,
        height: window.innerHeight
    };
};

export const getSafeAreaInsets = () => {
    if (typeof window === 'undefined') return { top: 0, bottom: 0 };

    // Get CSS custom properties for safe area insets
    const computedStyle = getComputedStyle(document.documentElement);
    return {
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
    };
};