import { Direction, PassengerType, UpgradeType, UpgradeOption } from '@/types/game';

export const GRID_SIZE = 20;
export const CELL_SIZE = 30;
export const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

export const INITIAL_SPEED = 500;
export const MIN_SPEED = 100;
export const MAX_LEVEL = 10;
export const PASSENGERS_PER_LEVEL = 3;
export const SCORE_PER_PASSENGER = 10;

export const INITIAL_TRAIN_LENGTH = 3;
export const INITIAL_DIRECTION = Direction.RIGHT;

export const URGENT_PASSENGER_TICKS = 15;
export const URGENT_PASSENGER_PENALTY = 15;

export const PASSENGER_SCORES: Record<PassengerType, number> = {
  [PassengerType.NORMAL]: 10,
  [PassengerType.URGENT]: 20,
  [PassengerType.FAT]: 20,
};

export const PASSENGER_WEIGHTS: Record<PassengerType, number> = {
  [PassengerType.NORMAL]: 60,
  [PassengerType.URGENT]: 25,
  [PassengerType.FAT]: 15,
};

export const COLORS = {
  BACKGROUND: '#2d1b0e',
  GRID_LINE: '#3d2817',
  RAIL: '#4a3728',
  RAIL_SLEEPER: '#3a2718',
  TRAIN_HEAD: '#e67e22',
  TRAIN_HEAD_DARK: '#d35400',
  TRAIN_BODY: '#c0392b',
  TRAIN_BODY_DARK: '#a93226',
  TRAIN_WINDOW: '#f1c40f',
  TRAIN_WHEEL: '#2c3e50',
  CHIMNEY: '#7f8c8d',
  STATION_NORMAL: '#27ae60',
  STATION_NORMAL_DARK: '#1e8449',
  STATION_URGENT: '#e74c3c',
  STATION_URGENT_DARK: '#c0392b',
  STATION_FAT: '#9b59b6',
  STATION_FAT_DARK: '#8e44ad',
  STATION_SIGN: '#f39c12',
  SMOKE: '#bdc3c7',
  TEXT: '#ecf0f1',
  TEXT_DARK: '#95a5a6',
  ACCENT: '#e74c3c',
  COUNTDOWN_WARN: '#f39c12',
  COUNTDOWN_DANGER: '#e74c3c',
} as const;

export const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
};

export const DIRECTION_VECTOR: Record<Direction, { dx: number; dy: number }> = {
  [Direction.UP]: { dx: 0, dy: -1 },
  [Direction.DOWN]: { dx: 0, dy: 1 },
  [Direction.LEFT]: { dx: -1, dy: 0 },
  [Direction.RIGHT]: { dx: 1, dy: 0 },
};

export const UPGRADE_OPTIONS: Record<UpgradeType, UpgradeOption> = {
  [UpgradeType.SHIELD]: {
    type: UpgradeType.SHIELD,
    name: '能量护盾',
    description: '抵挡一次致命碰撞',
    icon: '🛡️',
  },
  [UpgradeType.SHORTEN]: {
    type: UpgradeType.SHORTEN,
    name: '车身缩短',
    description: '移除末节车厢',
    icon: '✂️',
  },
  [UpgradeType.MAGNET]: {
    type: UpgradeType.MAGNET,
    name: '磁力吸附',
    description: '站台自动靠拢',
    icon: '🧲',
  },
  [UpgradeType.RADAR]: {
    type: UpgradeType.RADAR,
    name: '站台雷达',
    description: '显示站台方向',
    icon: '📡',
  },
  [UpgradeType.BRAKE]: {
    type: UpgradeType.BRAKE,
    name: '紧急刹车',
    description: '短时降低速度',
    icon: '⏸️',
  },
};

export const UPGRADE_CONFIG = {
  [UpgradeType.SHIELD]: {
    initialUses: 1,
    maxUsesPerLevel: 1,
  },
  [UpgradeType.MAGNET]: {
    initialRange: 2,
    rangePerLevel: 1,
  },
  [UpgradeType.BRAKE]: {
    speedMultiplier: 0.5,
    duration: 3,
    cooldown: 10,
  },
} as const;

export const UPGRADE_COLORS: Record<UpgradeType, string> = {
  [UpgradeType.SHIELD]: '#3498db',
  [UpgradeType.SHORTEN]: '#e74c3c',
  [UpgradeType.MAGNET]: '#9b59b6',
  [UpgradeType.RADAR]: '#f39c12',
  [UpgradeType.BRAKE]: '#27ae60',
};
