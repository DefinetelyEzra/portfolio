export interface WallpaperData {
  id: string;
  name: string;
  type: 'static' | 'gradient' | 'animated';
  path: string;
  url?: string; // backward compatibility 
  preview?: string;
  category?: 'nature' | 'abstract' | 'minimal' | 'space' ;
}

export const WALLPAPER_COLLECTION: WallpaperData[] = [
  {
    id: 'default',
    name: 'Default',
    type: 'static',
    path: '/wallpapers/default.jpg',
    url: '/wallpapers/default.jpg',
    category: 'minimal',
  },
  {
    id: 'mountain',
    name: 'Mountains',
    type: 'static',
    path: '/wallpapers/mountains.jpg',
    url: '/wallpapers/mountains.jpg',
    category: 'nature',
  },
  {
    id: 'ocean',
    name: 'Beach Backwash',
    type: 'static',
    path: '/wallpapers/ocean.jpg',
    url: '/wallpapers/ocean.jpg',
    category: 'nature',
  },
  {
    id: 'Docks',
    name: 'Docks',
    type: 'static',
    path: '/wallpapers/dock.jpg',
    url: '/wallpapers/dock.jpg',
    category: 'nature',
  },
  {
    id: 'desert',
    name: 'Desert Dunes',
    type: 'static',
    path: '/wallpapers/dune.jpg',
    url: '/wallpapers/dune.jpg',
    category: 'nature',
  },
  {
    id: 'desert2',
    name: 'Desert',
    type: 'static',
    path: '/wallpapers/desert.jpg',
    url: '/wallpapers/desert.jpg',
    category: 'nature',
  },
  {
    id: 'space',
    name: 'Earth View',
    type: 'static',
    path: '/wallpapers/globe.jpg',
    url: '/wallpapers/globe.jpg',
    category: 'space',
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
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Gradient',
    type: 'gradient' as const,
    path: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    url: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    category: 'abstract' as const,
  },
  {
    id: 'gradient-sunset',
    name: 'Sunset Gradient',
    type: 'gradient' as const,
    path: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    url: 'linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)',
    category: 'abstract' as const,
  },
];

export const ALL_WALLPAPERS = [...WALLPAPER_COLLECTION, ...GRADIENT_WALLPAPERS];

export const getRandomWallpaper = (): WallpaperData => {
  const randomIndex = Math.floor(Math.random() * ALL_WALLPAPERS.length);
  return ALL_WALLPAPERS[randomIndex];
};

export const getWallpapersByCategory = (category: WallpaperData['category']): WallpaperData[] => {
  return ALL_WALLPAPERS.filter(wallpaper => wallpaper.category === category);
};

export const getNextWallpaper = (currentPath: string): WallpaperData => {
  const currentIndex = ALL_WALLPAPERS.findIndex(w => w.path === currentPath);
  const nextIndex = (currentIndex + 1) % ALL_WALLPAPERS.length;
  return ALL_WALLPAPERS[nextIndex];
};

export const getPreviousWallpaper = (currentPath: string): WallpaperData => {
  const currentIndex = ALL_WALLPAPERS.findIndex(w => w.path === currentPath);
  const prevIndex = currentIndex === 0 ? ALL_WALLPAPERS.length - 1 : currentIndex - 1;
  return ALL_WALLPAPERS[prevIndex];
};