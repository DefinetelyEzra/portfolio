export interface WallpaperData {
  id: string;
  name: string;
  type: 'static' | 'animated';
  path: string;
  url?: string; // backward compatibility 
  preview?: string;
  category?: 'nature' | 'abstract' | 'minimal' | 'space';
  device?: 'all' | 'mobile' | 'desktop';
}

export const WALLPAPER_COLLECTION: WallpaperData[] = [
  {
    id: 'default',
    name: 'Default',
    type: 'static',
    path: '/wallpapers/default.jpg',
    url: '/wallpapers/default.jpg',
    category: 'minimal',
    device: 'desktop' as const,
  },
  {
    id: 'mountain',
    name: 'Mountains',
    type: 'static',
    path: '/wallpapers/mountains.jpg',
    url: '/wallpapers/mountains.jpg',
    category: 'nature',
    device: 'desktop' as const,
  },
  {
    id: 'ocean',
    name: 'Beach Backwash',
    type: 'static',
    path: '/wallpapers/ocean.jpg',
    url: '/wallpapers/ocean.jpg',
    category: 'nature',
    device: 'desktop' as const,
  },
  {
    id: 'Docks',
    name: 'Docks',
    type: 'static',
    path: '/wallpapers/dock.jpg',
    url: '/wallpapers/dock.jpg',
    category: 'nature',
    device: 'desktop' as const,
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    type: 'static',
    path: '/wallpapers/dune.jpg',
    url: '/wallpapers/dune.jpg',
    category: 'nature',
    device: 'desktop' as const,
  },
  {
    id: 'desert2',
    name: 'Desert',
    type: 'static',
    path: '/wallpapers/desert.jpg',
    url: '/wallpapers/desert.jpg',
    category: 'nature',
    device: 'desktop' as const,
  },
  {
    id: 'space',
    name: 'Earth View',
    type: 'static',
    path: '/wallpapers/globe.jpg',
    url: '/wallpapers/globe.jpg',
    category: 'space',
    device: 'desktop' as const,
  },
];

// Animated wallpapers
export const ANIMATED_WALLPAPERS: WallpaperData[] = [
  {
    id: 'breathing-colors',
    name: 'Breathing Colors',
    type: 'animated' as const,
    path: 'breathing-colors',
    category: 'abstract' as const,
    device: 'all' as const,
  },
];

export const ALL_WALLPAPERS = [...WALLPAPER_COLLECTION, ...ANIMATED_WALLPAPERS];

export const getWallpapersForDevice = (isMobile: boolean): WallpaperData[] => {
  return ALL_WALLPAPERS.filter(wallpaper => !wallpaper.device || wallpaper.device === 'all' || wallpaper.device === (isMobile ? 'mobile' : 'desktop'));
};

export const getRandomWallpaper = (isMobile: boolean): WallpaperData => {
  const deviceWallpapers = getWallpapersForDevice(isMobile);
  const randomIndex = Math.floor(Math.random() * deviceWallpapers.length);
  return deviceWallpapers[randomIndex];
};

export const getWallpapersByCategory = (category: WallpaperData['category'], isMobile: boolean): WallpaperData[] => {
  return getWallpapersForDevice(isMobile).filter(wallpaper => wallpaper.category === category);
};

export const getNextWallpaper = (currentPath: string, isMobile: boolean): WallpaperData => {
  const deviceWallpapers = getWallpapersForDevice(isMobile);
  const currentIndex = deviceWallpapers.findIndex(w => w.path === currentPath);
  const nextIndex = (currentIndex + 1) % deviceWallpapers.length;
  return deviceWallpapers[nextIndex];
};

export const getPreviousWallpaper = (currentPath: string, isMobile: boolean): WallpaperData => {
  const deviceWallpapers = getWallpapersForDevice(isMobile);
  const currentIndex = deviceWallpapers.findIndex(w => w.path === currentPath);
  const prevIndex = currentIndex === 0 ? deviceWallpapers.length - 1 : currentIndex - 1;
  return deviceWallpapers[prevIndex];
};