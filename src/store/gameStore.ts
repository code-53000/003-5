import { create } from 'zustand';
import { GameState, Direction, GameStatus, TrainSegment, PassengerStation, SmokeParticle, PassengerType, PassengerStats, UpgradeType, Upgrade, UpgradeOption } from '@/types/game';
import { INITIAL_DIRECTION, INITIAL_TRAIN_LENGTH, GRID_SIZE, UPGRADE_CONFIG, UPGRADE_OPTIONS } from '@/constants/game';
import { isCollidingWithTrain } from '@/utils/collision';

const createInitialTrain = (): TrainSegment[] => {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);
  const train: TrainSegment[] = [];

  for (let i = 0; i < INITIAL_TRAIN_LENGTH; i++) {
    train.push({
      id: i,
      x: startX - i,
      y: startY,
    });
  }

  return train;
};

const createInitialPassengerStats = (): PassengerStats => ({
  [PassengerType.NORMAL]: 0,
  [PassengerType.URGENT]: 0,
  [PassengerType.FAT]: 0,
});

const getInitialState = (): Omit<GameState, 'highScore'> => ({
  score: 0,
  level: 1,
  status: GameStatus.IDLE,
  train: createInitialTrain(),
  direction: INITIAL_DIRECTION,
  nextDirection: null,
  station: null,
  smokeParticles: [],
  passengersCollected: 0,
  passengerStats: createInitialPassengerStats(),
  upgrades: [],
  pendingUpgradeOptions: [],
  brakeActive: false,
  brakeCooldown: 0,
  shieldFlash: false,
});

interface GameStore extends GameState {
  setDirection: (direction: Direction) => void;
  setNextDirection: (direction: Direction | null) => void;
  setStatus: (status: GameStatus) => void;
  setScore: (score: number) => void;
  setLevel: (level: number) => void;
  setHighScore: (highScore: number) => void;
  setTrain: (train: TrainSegment[]) => void;
  setStation: (station: PassengerStation | null) => void;
  addSmokeParticle: (particle: SmokeParticle) => void;
  updateSmokeParticles: (particles: SmokeParticle[]) => void;
  incrementPassengersCollected: (type: PassengerType) => void;
  decrementStationTicks: () => void;
  resetGame: () => void;
  setPendingUpgradeOptions: (options: UpgradeOption[]) => void;
  selectUpgrade: (type: UpgradeType) => void;
  useShield: () => boolean;
  setShieldFlash: (value: boolean) => void;
  activateBrake: () => void;
  deactivateBrake: () => void;
  decrementBrakeCooldown: () => void;
  moveStationTowardsTrain: () => void;
  shortenTrain: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),
  highScore: 0,

  setDirection: (direction) => set({ direction }),
  setNextDirection: (nextDirection) => set({ nextDirection }),
  setStatus: (status) => set({ status }),
  setScore: (score) => set({ score }),
  setLevel: (level) => set({ level }),
  setHighScore: (highScore) => set({ highScore }),
  setTrain: (train) => set({ train }),
  setStation: (station) => set({ station }),

  addSmokeParticle: (particle) =>
    set((state) => ({
      smokeParticles: [...state.smokeParticles, particle].slice(-20),
    })),

  updateSmokeParticles: (smokeParticles) => set({ smokeParticles }),

  incrementPassengersCollected: (type: PassengerType) =>
    set((state) => ({
      passengersCollected: state.passengersCollected + 1,
      passengerStats: {
        ...state.passengerStats,
        [type]: state.passengerStats[type] + 1,
      },
    })),

  decrementStationTicks: () =>
    set((state) => {
      if (!state.station) return {};
      const newTicks = state.station.ticksRemaining - 1;
      return {
        station: {
          ...state.station,
          ticksRemaining: newTicks,
        },
      };
    }),

  resetGame: () => {
    const { highScore } = get();
    set({
      ...getInitialState(),
      highScore,
    });
  },

  setPendingUpgradeOptions: (options) => set({ pendingUpgradeOptions: options }),

  selectUpgrade: (type: UpgradeType) =>
    set((state) => {
      const existingUpgrade = state.upgrades.find((u) => u.type === type);
      let newUpgrades: Upgrade[];

      if (existingUpgrade) {
        newUpgrades = state.upgrades.map((u) => {
          if (u.type === type) {
            const newLevel = u.level + 1;
            if (type === UpgradeType.SHIELD) {
              return {
                ...u,
                level: newLevel,
                usesRemaining: (u.usesRemaining || 0) + UPGRADE_CONFIG[UpgradeType.SHIELD].maxUsesPerLevel,
              };
            }
            return { ...u, level: newLevel };
          }
          return u;
        });
      } else {
        const newUpgrade: Upgrade = {
          type,
          level: 1,
        };
        if (type === UpgradeType.SHIELD) {
          newUpgrade.usesRemaining = UPGRADE_CONFIG[UpgradeType.SHIELD].initialUses;
        }
        if (type === UpgradeType.BRAKE) {
          newUpgrade.cooldownRemaining = 0;
        }
        newUpgrades = [...state.upgrades, newUpgrade];
      }

      if (type === UpgradeType.SHORTEN) {
        const newTrain = [...state.train];
        if (newTrain.length > 1) {
          newTrain.pop();
        }
        return {
          upgrades: newUpgrades,
          train: newTrain,
          status: GameStatus.PLAYING,
          pendingUpgradeOptions: [],
        };
      }

      return {
        upgrades: newUpgrades,
        status: GameStatus.PLAYING,
        pendingUpgradeOptions: [],
      };
    }),

  useShield: (): boolean => {
    const state = get();
    const shieldUpgrade = state.upgrades.find((u) => u.type === UpgradeType.SHIELD);
    if (!shieldUpgrade || !shieldUpgrade.usesRemaining || shieldUpgrade.usesRemaining <= 0) {
      return false;
    }

    const newUpgrades = state.upgrades.map((u) => {
      if (u.type === UpgradeType.SHIELD) {
        return {
          ...u,
          usesRemaining: u.usesRemaining! - 1,
        };
      }
      return u;
    });

    set({
      upgrades: newUpgrades,
      shieldFlash: true,
    });
    return true;
  },

  setShieldFlash: (value) => set({ shieldFlash: value }),

  activateBrake: () =>
    set((state) => {
      const brakeUpgrade = state.upgrades.find((u) => u.type === UpgradeType.BRAKE);
      if (!brakeUpgrade || state.brakeCooldown > 0 || state.brakeActive) {
        return {};
      }
      return { brakeActive: true };
    }),

  deactivateBrake: () =>
    set((state) => ({
      brakeActive: false,
      brakeCooldown: UPGRADE_CONFIG[UpgradeType.BRAKE].cooldown,
    })),

  decrementBrakeCooldown: () =>
    set((state) => {
      if (state.brakeCooldown <= 0) return {};
      return { brakeCooldown: state.brakeCooldown - 1 };
    }),

  moveStationTowardsTrain: () =>
    set((state) => {
      if (!state.station || state.train.length === 0) return {};

      const magnetUpgrade = state.upgrades.find((u) => u.type === UpgradeType.MAGNET);
      if (!magnetUpgrade) return {};

      const range = UPGRADE_CONFIG[UpgradeType.MAGNET].initialRange +
        (magnetUpgrade.level - 1) * UPGRADE_CONFIG[UpgradeType.MAGNET].rangePerLevel;

      const head = state.train[0];
      const dx = state.station.x - head.x;
      const dy = state.station.y - head.y;
      const distance = Math.max(Math.abs(dx), Math.abs(dy));

      if (distance > range) return {};

      let newX = state.station.x;
      let newY = state.station.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        newX = state.station.x - Math.sign(dx);
      } else if (Math.abs(dy) > 0) {
        newY = state.station.y - Math.sign(dy);
      }

      const newPos = { x: newX, y: newY };
      if (isCollidingWithTrain(newPos, state.train)) return {};

      return {
        station: {
          ...state.station,
          x: newX,
          y: newY,
        },
      };
    }),

  shortenTrain: () =>
    set((state) => {
      const newTrain = [...state.train];
      if (newTrain.length > 1) {
        newTrain.pop();
        return { train: newTrain };
      }
      return {};
    }),
}));
