/** @type {import('tailwindcss').Config} */
export const content = [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
];
export const darkMode = 'class';
export const theme = {
  extend: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      'mobile': {'max': '767px'},
      'desktop': {'min': '768px'},
    },
    fontFamily: {
      sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    colors: {
      macos: {
        gray: {
          50: '#f9f9f9',
          100: '#ececec',
          200: '#e3e3e3',
          300: '#cdcdcd',
          400: '#b4b4b4',
          500: '#9b9b9b',
          600: '#676767',
          700: '#424242',
          800: '#2f2f2f',
          900: '#1a1a1a',
        },
        blue: {
          500: '#007AFF',
          600: '#0056CC',
        },
        red: {
          500: '#FF3B30',
        },
        yellow: {
          500: '#FFCC00',
        },
        green: {
          500: '#34C759',
        },
      },
    },
    backdropBlur: {
      xs: '2px',
    },
    spacing: {
      'dock-sm': '48px',
      'dock-md': '64px',
      'dock-lg': '80px',
      'widget-sm': '120px',
      'widget-md': '160px',
      'widget-lg': '200px',
      'safe-top': 'env(safe-area-inset-top)',
      'safe-bottom': 'env(safe-area-inset-bottom)',
      'mobile-app': '60px',
      'status-bar': '44px',
    },
    animation: {
      'dock-bounce': 'dock-bounce 0.6s ease-in-out',
      'window-open': 'window-open 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      'fade-in': 'fade-in 0.5s ease-out',
      'slide-up': 'slide-up 0.4s ease-out',
      'spring-bounce': 'spring-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      'slide-in': 'slide-in 0.3s ease-out',
      'fade-in-up': 'fade-in-up 0.5s ease-out',
    },
    keyframes: {
      'dock-bounce': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-10px)' },
      },
      'window-open': {
        '0%': { transform: 'scale(0.8)', opacity: '0' },
        '100%': { transform: 'scale(1)', opacity: '1' },
      },
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      'slide-up': {
        '0%': { transform: 'translateY(20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
      'spring-bounce': {
        '0%': { transform: 'scale(0.8) translateY(20px)', opacity: '0' },
        '50%': { transform: 'scale(1.05) translateY(-5px)', opacity: '0.8' },
        '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
      },
      'slide-in': {
        '0%': { transform: 'translateX(100%)', opacity: '0' },
        '100%': { transform: 'translateX(0)', opacity: '1' },
      },
      'fade-in-up': {
        '0%': { transform: 'translateY(20px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
  },
};
export const plugins = [];