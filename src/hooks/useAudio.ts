import { useCallback, useRef, useEffect } from 'react';

interface UseAudioOptions {
  volume?: number;
  preload?: boolean;
  loop?: boolean;
}

export const useAudio = (src: string, options: UseAudioOptions = {}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume = 0.3, preload = true, loop = false } = options;

  useEffect(() => {
    if (globalThis.window !== undefined) {
      try {
        const audio = new Audio(src);
        audio.volume = volume;
        audio.loop = loop;
        audio.preload = preload ? 'auto' : 'none';

        // Handle audio loading errors
        audio.addEventListener('error', (e) => {
          console.warn(`Audio failed to load: ${src}`, e);
        });

        audioRef.current = audio;

        // Preload audio if specified
        if (preload) {
          audio.load();
        }

        return () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current = null;
          }
        };
      } catch (error) {
        console.warn(`Failed to create audio element for: ${src}`, error);
      }
    }
  }, [src, volume, loop, preload]);

  const play = useCallback(() => {
    if (audioRef.current) {
      // Reset audio to beginning
      audioRef.current.currentTime = 0;

      // Play audio with explicit promise handling
      audioRef.current
        .play()
        .then(() => {
          // Audio played successfully
        })
        .catch((error) => {
          console.warn('Audio play failed:', error);
        });
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } catch (error) {
        console.warn('Error stopping audio:', error);
      }
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
      } catch (error) {
        console.warn('Error setting audio volume:', error);
      }
    }
  }, []);

  return {
    play,
    stop,
    setVolume,
    isReady: !!audioRef.current
  };
};