'use client';

import { useDesktopStore } from '@/store/desktopStore';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { ALL_WALLPAPERS, getNextWallpaper, type WallpaperData } from '@/utils/wallpaperUtils';
import { Play, Pause, SkipForward, SkipBack, Shuffle } from 'lucide-react';

const CYCLE_INTERVALS = {
  slow: 600000,    // 10 minutes
  medium: 300000,  // 5 minutes
  fast: 60000,     // 1 minute
} as const;

type CycleSpeed = keyof typeof CYCLE_INTERVALS;

export default function Wallpaper() {
  const { settings, updateSettings } = useDesktopStore();
  const initialWallpaper = ALL_WALLPAPERS.find((w: WallpaperData) => w.path === settings.wallpaper) || ALL_WALLPAPERS[0];
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cycleSpeed, setCycleSpeed] = useState<CycleSpeed>('medium');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState<WallpaperData>(initialWallpaper);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const getWallpaperStyle = useMemo(() => {
    const wallpaper = ALL_WALLPAPERS.find(w => w.path === settings.wallpaper) || initialWallpaper;

    switch (wallpaper.type) {
      case 'gradient':
        return { background: wallpaper.path };
      case 'animated':
        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
      case 'static':
      default:
        return {
          backgroundImage: `url(${wallpaper.path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
    }
  }, [settings.wallpaper, initialWallpaper]);

  // Debounced wallpaper change
  const changeWallpaper = useCallback((newWallpaper: WallpaperData) => {
    if (isTransitioning) return; 
    setIsTransitioning(true);
    setTimeout(() => {
      updateSettings({ wallpaper: newWallpaper.path });
      setCurrentWallpaper(newWallpaper);
      setIsTransitioning(false);
    }, 200);
  }, [updateSettings, isTransitioning]);

  // Auto-cycle functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      const nextWallpaper = getNextWallpaper(settings.wallpaper, isMobile);
      changeWallpaper(nextWallpaper);
    }, CYCLE_INTERVALS[cycleSpeed]);

    return () => clearInterval(interval);
  }, [isAutoPlaying, cycleSpeed, settings.wallpaper, changeWallpaper, isMobile]);

  const goToNext = useCallback(() => {
    const nextWallpaper = getNextWallpaper(settings.wallpaper, isMobile);
    changeWallpaper(nextWallpaper);
  }, [settings.wallpaper, changeWallpaper, isMobile]);

  const goToPrevious = useCallback(() => {
    const currentIndex = ALL_WALLPAPERS.findIndex((w: WallpaperData) => w.path === settings.wallpaper);
    const prevIndex = currentIndex === 0 ? ALL_WALLPAPERS.length - 1 : currentIndex - 1;
    changeWallpaper(ALL_WALLPAPERS[prevIndex]);
  }, [settings.wallpaper, changeWallpaper]);

  const goToRandom = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * ALL_WALLPAPERS.length);
    changeWallpaper(ALL_WALLPAPERS[randomIndex]);
  }, [changeWallpaper]);

  return (
    <>
      {/* Main wallpaper */}
      <div
        className={`fixed inset-0 -z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-90' : 'opacity-100'}`}
        style={getWallpaperStyle}
      >
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Preloader for next wallpaper (only when auto-playing) */}
      {isAutoPlaying && (
        <div
          className="fixed inset-0 -z-20"
          style={{
            backgroundImage: `url(${getNextWallpaper(settings.wallpaper, isMobile).path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Control panel */}
      <div
        className="fixed bottom-6 right-6 z-50"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Collapsed state - just the current wallpaper name */}
        <div className={`transition-all duration-300 ${showControls ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bg-black/20 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm">
            {currentWallpaper?.name || 'Unknown Wallpaper'}
          </div>
        </div>

        {/* Expanded controls */}
        <div className={`absolute bottom-0 right-0 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
          <div className="bg-black/40 backdrop-blur-md text-white rounded-xl p-4 min-w-[280px]">
            {/* Current wallpaper info */}
            <div className="mb-3">
              <h3 className="font-medium text-sm">{currentWallpaper?.name}</h3>
              <p className="text-xs text-white/70 capitalize">{currentWallpaper?.category}</p>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center space-x-2 mb-3">
              <button
                onClick={goToPrevious}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Previous wallpaper"
                type="button"
                aria-label="Previous wallpaper"
              >
                <SkipBack size={16} />
              </button>

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                type="button"
                aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
              >
                {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                onClick={goToNext}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Next wallpaper"
                type="button"
                aria-label="Next wallpaper"
              >
                <SkipForward size={16} />
              </button>

              <button
                onClick={goToRandom}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Random wallpaper"
                type="button"
                aria-label="Random wallpaper"
              >
                <Shuffle size={16} />
              </button>
            </div>

            {/* Speed control */}
            <div className="mb-3">
              <label htmlFor="speed-control" className="text-xs text-white/70 block mb-1">
                Slideshow Speed
              </label>
              <select
                id="speed-control"
                value={cycleSpeed}
                onChange={(e) => setCycleSpeed(e.target.value as CycleSpeed)}
                className="bg-white/20 rounded px-2 py-1 text-xs w-full"
              >
                <option value="slow" className="text-black">Slow (10 mins)</option>
                <option value="medium" className="text-black">Medium (5 mins)</option>
                <option value="fast" className="text-black">Fast (1 min)</option>
              </select>
            </div>

            {/* Progress indicator */}
            {isAutoPlaying && (
              <div className="w-full bg-white/20 rounded-full h-1">
                <div
                  className="bg-white h-1 rounded-full"
                  style={{
                    width: '0%',
                    animation: `progress ${CYCLE_INTERVALS[cycleSpeed]}ms linear infinite`
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS styles */}
      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
}