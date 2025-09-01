export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType;
  defaultSize: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  resizable?: boolean;
  draggable?: boolean;
  themeSupport?: boolean;
}

export interface WindowState {
  id: string;
  appId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  isVisible: boolean;
  isAnimatingMinimize?: boolean;
  isAnimatingRestore?: boolean;  
  preservedState?: Record<string, unknown>;  
  componentKey?: string; 
  layoutKey?: number;
}

export interface MinimizeAnimationProps {
  windowElement: HTMLElement;
  appId: string;
  isRestoring: boolean;
  onComplete: () => void;
}

export interface WallpaperCyclingSettings {
  enabled: boolean;
  speed: 'slow' | 'medium' | 'fast';
  categories: string[];
  shuffle: boolean;
}

export interface DesktopSettings {
  wallpaper: string;
  theme: 'light' | 'dark' | 'auto';
  dockPosition: 'bottom' | 'left' | 'right';
  showNotifications: boolean;
  soundEnabled: boolean;
  apps?: AppConfig[];
  wallpaperCycling?: WallpaperCyclingSettings;
}

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  duration?: number;
}

export interface DockIconProps {
  app: AppConfig;
  isActive: boolean;
  onClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export interface WindowProps {
  window: WindowState;
  app: AppConfig;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (position: { x: number; y: number }) => void;
  onResize: (size: { width: number; height: number }) => void;
  onFocus: () => void;
  currentTheme?: 'light' | 'dark';
}

export type WallpaperType = 'static' | 'gradient' | 'animated' | 'particles';

export interface WallpaperData {
  id: string;
  name: string;
  type: 'static' | 'gradient' | 'animated';
  path: string;
  url?: string;
  preview?: string;
  category?: 'nature' | 'abstract' | 'minimal' | 'space';
}