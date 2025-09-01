'use client';

import { createContext, useContext, useEffect, ReactNode, useMemo } from 'react';
import { AudioManager, SOUND_EFFECTS, SOUND_PATHS } from '@/utils/audioManager';

interface AudioContextType {
  playHoverSound: () => void;
  playClickSound: () => void;
  playSnakeEatSound: () => void;
  playSnakeLoseSound: () => void;
  playSnakeMelody: () => void;
  stopSnakeMelody: () => void;
  playTicTacToeXSound: () => void;
  playTicTacToeOSound: () => void;
  playTicTacToeVictorySound: () => void;
  playTicTacToeDrawSound: () => void;
  setAudioEnabled: (enabled: boolean) => void;
  setMasterVolume: (volume: number) => void;
  isAudioEnabled: () => boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  readonly children: ReactNode;
}

export function AudioProvider({ children }: AudioProviderProps) {
  useEffect(() => {
    const audioManager = AudioManager.getInstance();

    // Preload sound effects
    audioManager.preloadAudio(SOUND_EFFECTS.DOCK_HOVER, SOUND_PATHS[SOUND_EFFECTS.DOCK_HOVER]);
    audioManager.preloadAudio(SOUND_EFFECTS.DOCK_CLICK, SOUND_PATHS[SOUND_EFFECTS.DOCK_CLICK]);
    audioManager.preloadAudio(SOUND_EFFECTS.SNAKE_EAT, SOUND_PATHS[SOUND_EFFECTS.SNAKE_EAT]);
    audioManager.preloadAudio(SOUND_EFFECTS.SNAKE_LOSE, SOUND_PATHS[SOUND_EFFECTS.SNAKE_LOSE]);
    audioManager.preloadAudio(SOUND_EFFECTS.SNAKE_MELODY, SOUND_PATHS[SOUND_EFFECTS.SNAKE_MELODY]);
    audioManager.preloadAudio(SOUND_EFFECTS.TIC_TAC_TOE_X, SOUND_PATHS[SOUND_EFFECTS.TIC_TAC_TOE_X]);
    audioManager.preloadAudio(SOUND_EFFECTS.TIC_TAC_TOE_O, SOUND_PATHS[SOUND_EFFECTS.TIC_TAC_TOE_O]);
    audioManager.preloadAudio(SOUND_EFFECTS.TIC_TAC_TOE_VICTORY, SOUND_PATHS[SOUND_EFFECTS.TIC_TAC_TOE_VICTORY]);
    audioManager.preloadAudio(SOUND_EFFECTS.TIC_TAC_TOE_DRAW, SOUND_PATHS[SOUND_EFFECTS.TIC_TAC_TOE_DRAW]);

    // Cleanup on unmount
    return () => {
      audioManager.cleanup();
    };
  }, []);

  const audioContextValue = useMemo<AudioContextType>(() => ({
    playHoverSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.DOCK_HOVER);
    },
    playClickSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.DOCK_CLICK);
    },
    playSnakeEatSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.SNAKE_EAT);
    },
    playSnakeLoseSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.SNAKE_LOSE);
    },
    playSnakeMelody: () => {
      AudioManager.getInstance().playLoopingSound(SOUND_EFFECTS.SNAKE_MELODY);
    },
    stopSnakeMelody: () => {
      AudioManager.getInstance().stopSound(SOUND_EFFECTS.SNAKE_MELODY);
    },
    playTicTacToeXSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.TIC_TAC_TOE_X);
    },
    playTicTacToeOSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.TIC_TAC_TOE_O);
    },
    playTicTacToeVictorySound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.TIC_TAC_TOE_VICTORY);
    },
    playTicTacToeDrawSound: () => {
      AudioManager.getInstance().playSound(SOUND_EFFECTS.TIC_TAC_TOE_DRAW);
    },
    setAudioEnabled: (enabled: boolean) => {
      AudioManager.getInstance().setEnabled(enabled);
    },
    setMasterVolume: (volume: number) => {
      AudioManager.getInstance().setMasterVolume(volume);
    },
    isAudioEnabled: () => {
      return AudioManager.getInstance().isAudioEnabled();
    }
  }), []);

  return (
    <AudioContext.Provider value={audioContextValue}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
}