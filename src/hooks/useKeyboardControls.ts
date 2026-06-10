import { useEffect } from 'react';
import { Direction, GameStatus, UpgradeType } from '@/types/game';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useGameStore } from '@/store/gameStore';

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: Direction.UP,
  ArrowDown: Direction.DOWN,
  ArrowLeft: Direction.LEFT,
  ArrowRight: Direction.RIGHT,
  w: Direction.UP,
  W: Direction.UP,
  s: Direction.DOWN,
  S: Direction.DOWN,
  a: Direction.LEFT,
  A: Direction.LEFT,
  d: Direction.RIGHT,
  D: Direction.RIGHT,
};

export const useKeyboardControls = () => {
  const { changeDirection, togglePause, startGame, activateBrake } = useGameEngine();
  const status = useGameStore((state) => state.status);
  const upgrades = useGameStore((state) => state.upgrades);
  const brakeCooldown = useGameStore((state) => state.brakeCooldown);
  const brakeActive = useGameStore((state) => state.brakeActive);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'p' || e.key === 'P') {
        if (status === GameStatus.PLAYING || status === GameStatus.PAUSED) {
          e.preventDefault();
          togglePause();
        }
        return;
      }

      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        
        if (status === GameStatus.GAME_OVER) {
          startGame();
          return;
        }

        const brakeUpgrade = upgrades.find((u) => u.type === UpgradeType.BRAKE);
        if (brakeUpgrade && status === GameStatus.PLAYING && !brakeActive && brakeCooldown <= 0) {
          activateBrake();
        }
        return;
      }

      const direction = KEY_TO_DIRECTION[e.key];
      if (direction) {
        e.preventDefault();

        if (status === GameStatus.GAME_OVER || status === GameStatus.UPGRADING) {
          return;
        }

        changeDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changeDirection, togglePause, startGame, activateBrake, status, upgrades, brakeCooldown, brakeActive]);

  return null;
};
