import { useDesktopStore } from "@/store/desktopStore";
export class AudioManager {
  private static instance: AudioManager;
  private readonly audioCache: Map<string, HTMLAudioElement> = new Map();
  private isEnabled: boolean = true;
  private masterVolume: number = 0.3;

  private constructor() {
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.isEnabled = !prefersReducedMotion;
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public preloadAudio(id: string, src: string): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    try {
      if (!this.audioCache.has(id)) {
        const audio = new Audio(src);
        audio.volume = this.masterVolume;
        audio.preload = 'auto';

        audio.addEventListener('error', (e) => {
          console.warn(`Failed to preload audio: ${src}`, e);
          this.audioCache.delete(id);
        });

        audio.addEventListener('canplaythrough', () => {
          // Audio is ready to play
        });

        this.audioCache.set(id, audio);
        audio.load();
      }
    } catch (error) {
      console.warn(`Error preloading audio ${id}:`, error);
    }
  }

  public playSound(id: string, src?: string): void {
    if (!this.isEnabled) return;

    try {
      let audio = this.audioCache.get(id);

      // If audio not cached and src provided, create it
      if (!audio && src) {
        this.preloadAudio(id, src);
        audio = this.audioCache.get(id);
      }

      if (audio) {
        // Reset to beginning and play
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Failed to play sound ${id}:`, error);
          });
        }
      }
    } catch (error) {
      console.warn(`Error playing sound ${id}:`, error);
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.audioCache.forEach(audio => {
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (error) {
          console.warn('Error stopping audio:', error);
        }
      });
    }
  }

  // Add this method to sync with desktopStore
  public syncWithStore() {
    const isSoundEnabled = useDesktopStore.getState().settings.soundEnabled; 
    if (this.isEnabled !== isSoundEnabled) {
      this.setEnabled(isSoundEnabled);
    }
  }

  public playLoopingSound(id: string, src?: string): void {
    if (!this.isEnabled) return;

    try {
      let audio = this.audioCache.get(id);

      // If audio not cached and src provided, create it
      if (!audio && src) {
        this.preloadAudio(id, src);
        audio = this.audioCache.get(id);
      }

      if (audio) {
        audio.loop = true;
        audio.currentTime = 0;

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn(`Failed to play looping sound ${id}:`, error);
          });
        }
      }
    } catch (error) {
      console.warn(`Error playing looping sound ${id}:`, error);
    }
  }

  public stopSound(id: string): void {
    if (!this.isEnabled) return;

    try {
      const audio = this.audioCache.get(id);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (error) {
      console.warn(`Error stopping sound ${id}:`, error);
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.audioCache.forEach(audio => {
      try {
        audio.volume = this.masterVolume;
      } catch (error) {
        console.warn('Error setting audio volume:', error);
      }
    });
  }

  public isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  public cleanup(): void {
    this.audioCache.forEach(audio => {
      try {
        audio.pause();
        audio.src = '';
      } catch (error) {
        console.warn('Error cleaning up audio:', error);
      }
    });
    this.audioCache.clear();
  }
}

// Sound effect constants
export const SOUND_EFFECTS = {
  DOCK_HOVER: 'dock-hover',
  DOCK_CLICK: 'dock-click',
  SNAKE_EAT: 'snake-eat',
  SNAKE_LOSE: 'snake-lose',
  SNAKE_MELODY: 'snake-melody',
  TIC_TAC_TOE_X: 'tic-tac-toe-x',
  TIC_TAC_TOE_O: 'tic-tac-toe-o',
  TIC_TAC_TOE_VICTORY: 'tic-tac-toe-victory',
  TIC_TAC_TOE_DRAW: 'tic-tac-toe-draw',
} as const;

// Sound file paths
export const SOUND_PATHS = {
  [SOUND_EFFECTS.DOCK_HOVER]: '/sounds/bubble-hover.mp3',
  [SOUND_EFFECTS.DOCK_CLICK]: '/sounds/bubble-click.mp3',
  [SOUND_EFFECTS.SNAKE_EAT]: '/sounds/eating.mp3',
  [SOUND_EFFECTS.SNAKE_LOSE]: '/sounds/lose.mp3',
  [SOUND_EFFECTS.SNAKE_MELODY]: '/sounds/melody.mp3',
  [SOUND_EFFECTS.TIC_TAC_TOE_X]: '/sounds/x-click.mp3',
  [SOUND_EFFECTS.TIC_TAC_TOE_O]: '/sounds/o-click.mp3',
  [SOUND_EFFECTS.TIC_TAC_TOE_VICTORY]: '/sounds/victory.mp3',
  [SOUND_EFFECTS.TIC_TAC_TOE_DRAW]: '/sounds/draw.mp3',
} as const;