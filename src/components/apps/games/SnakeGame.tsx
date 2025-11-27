import { useState, useEffect, useCallback } from 'react';
import { useAudioContext } from '@/components/ui/AudioProvider';

// Device detection utilities
const MOBILE_BREAKPOINT = 768;

const isMobile = (): boolean => {
    if (globalThis.window === undefined) return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
};

const isTouchDevice = (): boolean => {
    if (globalThis.window === undefined) return false;
    return 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0;
};
interface SnakeGameState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: { x: number; y: number };
  score: number;
  gameOver: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<SnakeGameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 0, y: 0 }, 
    score: 0,
    gameOver: false,
  });
  const [highScore, setHighScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
  const [deviceIsMobile, setDeviceIsMobile] = useState(false);
  const [deviceIsTouchDevice, setDeviceIsTouchDevice] = useState(false);

  const { playSnakeEatSound, playSnakeLoseSound, playSnakeMelody, stopSnakeMelody } = useAudioContext();

  // Check device type on mount and window resize
  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceIsMobile(isMobile());
      setDeviceIsTouchDevice(isTouchDevice());
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prev) => {
      if (prev.gameOver) return prev; 

      const head = { x: prev.snake[0].x + prev.direction.x, y: prev.snake[0].y + prev.direction.y };

      // Check boundaries
      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20) {
        return { ...prev, gameOver: true };
      }

      // Check collision with itself
      if (prev.snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true };
      }

      const newSnakeBody = [head, ...prev.snake];

      // Check if food is eaten
      if (head.x === prev.food.x && head.y === prev.food.y) {
        playSnakeEatSound();
        setHighScore((prevHigh) => Math.max(prevHigh, prev.score + 10));
        return {
          ...prev,
          snake: newSnakeBody,
          food: {
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          },
          score: prev.score + 10,
        };
      } else {
        newSnakeBody.pop();
        return { ...prev, snake: newSnakeBody };
      }
    });
  }, [playSnakeEatSound]);

  useEffect(() => {
    if (snake.direction.x !== 0 || snake.direction.y !== 0) {
      if (!gameStarted) {
        setGameStarted(true);
        playSnakeMelody();
      }
      const gameInterval = setInterval(moveSnake, 200);
      return () => clearInterval(gameInterval);
    }
  }, [snake.direction, moveSnake, gameStarted, playSnakeMelody]);

  useEffect(() => {
    if (snake.gameOver && gameStarted) {
      stopSnakeMelody();
      playSnakeLoseSound();
    }
  }, [snake.gameOver, gameStarted, stopSnakeMelody, playSnakeLoseSound]);

  const changeDirection = useCallback((newDirection: { x: number; y: number }) => {
    if (snake.gameOver) return;

    setSnake((prev) => {
      // Prevent reverse direction
      if (
        (newDirection.x !== 0 && prev.direction.x === 0) ||
        (newDirection.y !== 0 && prev.direction.y === 0)
      ) {
        return { ...prev, direction: newDirection };
      }
      return prev;
    });
  }, [snake.gameOver]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (snake.gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        changeDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        changeDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        changeDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        changeDirection({ x: 1, y: 0 });
        break;
    }
  }, [snake.gameOver, changeDirection]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (snake.gameOver) return;
    
    const touch = e.touches[0];
    if (touch) {
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  }, [snake.gameOver]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStart || snake.gameOver) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const touchEnd: TouchPosition = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          changeDirection({ x: 1, y: 0 }); // Right
        } else {
          changeDirection({ x: -1, y: 0 }); // Left
        }
      } else if (deltaY > 0) {
        changeDirection({ x: 0, y: 1 }); // Down
      } else {
        changeDirection({ x: 0, y: -1 }); // Up
      }
    }

    setTouchStart(null);
  }, [touchStart, snake.gameOver, changeDirection]);

  useEffect(() => {
    if (!deviceIsTouchDevice) {
      globalThis.addEventListener('keydown', handleKeyPress);
      return () => globalThis.removeEventListener('keydown', handleKeyPress);
    }
  }, [handleKeyPress, deviceIsTouchDevice]);

  const resetGame = () => {
    stopSnakeMelody();
    setSnake({
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 0, y: 0 },
      score: 0,
      gameOver: false,
    });
    setGameStarted(false);
    setTouchStart(null);
  };

  const getInstructionText = () => {
    if (deviceIsMobile || deviceIsTouchDevice) {
      return 'Swipe to move • Eat red food to grow';
    }
    return 'Use arrow keys to move • Eat red food to grow';
  };

  const getGameOverInstructionText = () => {
    if (deviceIsMobile || deviceIsTouchDevice) {
      return 'Swipe to control the snake';
    }
    return 'Use arrow keys to control the snake';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Snake Game</h2>
          <p className="text-gray-400">Score: {snake.score}</p>
          <p className="text-gray-400">High Score: {highScore}</p>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.001 8.001 0 01-15.356-2m15.356 2H15"
            />
          </svg>
          <span>Reset</span>
        </button>
      </div>

      <div
        className="grid grid-cols-20 gap-px bg-gray-700 p-2 rounded-lg max-w-lg mx-auto mb-4 border-none outline-none focus:ring-2 focus:ring-green-400 touch-none select-none"
        style={{ gridTemplateColumns: 'repeat(20, 1fr)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {Array.from({ length: 400 }).map((_, index) => {
          const x = index % 20;
          const y = Math.floor(index / 20);
          const isSnake = snake.snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = snake.food.x === x && snake.food.y === y;
          const isHead = snake.snake[0]?.x === x && snake.snake[0]?.y === y;

          let cellClass = 'aspect-square pointer-events-none transition-all duration-100';
          if (isHead) {
            cellClass += ' bg-green-400';
          } else if (isSnake) {
            cellClass += ' bg-green-600';
          } else if (isFood) {
            cellClass += ' bg-red-500';
          } else {
            cellClass += ' bg-gray-900';
          }

          return <div key={`snake-cell-${x}-${y}`} className={cellClass} aria-hidden="true" />;
        })}
      </div>

      {snake.gameOver && (
        <div className="text-center">
          <p className="text-red-400 text-lg mb-2">Game Over!</p>
          <p className="text-gray-300">{getGameOverInstructionText()}</p>
        </div>
      )}

      {!snake.gameOver && (
        <p className="text-center text-gray-400">{getInstructionText()}</p>
      )}
    </div>
  );
};

export default SnakeGame;