export interface WallpaperData {
  id: string;
  name: string;
  type: 'static' | 'gradient' | 'animated';
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

// Gradient wallpapers
export const GRADIENT_WALLPAPERS = [
  {
    id: 'gradient-purple',
    name: 'Purple Gradient',
    type: 'gradient' as const,
    path: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    category: 'abstract' as const,
    device: 'desktop' as const,
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Gradient',
    type: 'gradient' as const,
    path: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    url: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    category: 'abstract' as const,
    device: 'desktop' as const,
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Gradient',
    type: 'gradient' as const,
    path: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    url: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    category: 'abstract' as const,
    device: 'desktop' as const,
  },
];

export const MOBILE_WALLPAPERS: WallpaperData[] = [
  {
    id: 'default01',
    name: 'Default',
    type: 'static',
    path: '/wallpapers/mobile/default.jpg',
    url: '/wallpapers/mobile/default.jpg',
    category: 'abstract',
    device: 'mobile' as const,
  },
  {
    id: 'default02',
    name: 'Default2',
    type: 'static',
    path: '/wallpapers/mobile/default2.jpg',
    url: '/wallpapers/mobile/default2.jpg',
    category: 'abstract',
    device: 'mobile' as const,
  },
  {
    id: 'default03',
    name: 'Default3',
    type: 'static',
    path: '/wallpapers/mobile/redmoon.jpg',
    url: '/wallpapers/mobile/redmoon.jpg',
    category: 'abstract',
    device: 'mobile' as const,
  },
  {
    id: 'peaks',
    name: 'Peaks',
    type: 'static',
    path: '/wallpapers/mobile/peaks.jpg',
    url: '/wallpapers/mobile/peaks.jpg',
    category: 'nature',
    device: 'mobile' as const,
  },
  {
    id: 'beach',
    name: 'Beach',
    type: 'static',
    path: '/wallpapers/mobile/beach.jpg',
    url: '/wallpapers/mobile/beach.jpg',
    category: 'nature',
    device: 'mobile' as const,
  },
  {
    id: 'sky',
    name: 'Sky',
    type: 'static',
    path: '/wallpapers/mobile/sky.jpg',
    url: '/wallpapers/mobile/sky.jpg',
    category: 'nature',
    device: 'mobile' as const,
  },
];

export const ALL_WALLPAPERS = [...WALLPAPER_COLLECTION, ...GRADIENT_WALLPAPERS, ...MOBILE_WALLPAPERS];

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