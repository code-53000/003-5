import { useGameStore } from '@/store/gameStore';
import { UpgradeType } from '@/types/game';
import { UPGRADE_OPTIONS, UPGRADE_COLORS, UPGRADE_CONFIG } from '@/constants/game';

const InfoBar = () => {
  const score = useGameStore((state) => state.score);
  const level = useGameStore((state) => state.level);
  const highScore = useGameStore((state) => state.highScore);
  const upgrades = useGameStore((state) => state.upgrades);
  const brakeCooldown = useGameStore((state) => state.brakeCooldown);
  const brakeActive = useGameStore((state) => state.brakeActive);

  const getUpgradeDisplay = (upgrade: { type: UpgradeType; level: number; usesRemaining?: number; cooldownRemaining?: number }) => {
    const option = UPGRADE_OPTIONS[upgrade.type];
    const color = UPGRADE_COLORS[upgrade.type];
    let statusText = `Lv.${upgrade.level}`;

    if (upgrade.type === UpgradeType.SHIELD && upgrade.usesRemaining !== undefined) {
      statusText = `${upgrade.usesRemaining}次`;
    }
    if (upgrade.type === UpgradeType.MAGNET) {
      const range = UPGRADE_CONFIG[UpgradeType.MAGNET].initialRange +
        (upgrade.level - 1) * UPGRADE_CONFIG[UpgradeType.MAGNET].rangePerLevel;
      statusText = `${range}格`;
    }
    if (upgrade.type === UpgradeType.BRAKE) {
      if (brakeActive) {
        statusText = '刹车中';
      } else if (brakeCooldown > 0) {
        statusText = `冷却${brakeCooldown}`;
      } else {
        statusText = '就绪';
      }
    }

    return { option, color, statusText };
  };

  return (
    <div className="w-full max-w-xl">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 bg-amber-950 border-2 border-amber-800 rounded-lg p-4 text-center">
          <div className="text-amber-400 text-xs font-pixel mb-1">SCORE</div>
          <div className="text-white text-xl font-pixel">{score.toString().padStart(5, '0')}</div>
        </div>

        <div className="flex-1 bg-amber-950 border-2 border-amber-800 rounded-lg p-4 text-center">
          <div className="text-amber-400 text-xs font-pixel mb-1">LEVEL</div>
          <div className="text-white text-xl font-pixel">{level.toString().padStart(2, '0')}</div>
        </div>

        <div className="flex-1 bg-amber-950 border-2 border-amber-800 rounded-lg p-4 text-center">
          <div className="text-amber-400 text-xs font-pixel mb-1">HIGH</div>
          <div className="text-yellow-400 text-xl font-pixel">{highScore.toString().padStart(5, '0')}</div>
        </div>
      </div>

      {upgrades.length > 0 && (
        <div className="bg-amber-950 border-2 border-amber-800 rounded-lg p-3">
          <div className="text-amber-400 text-xs font-pixel mb-2 text-center">已激活升级</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {upgrades.map((upgrade) => {
              const { option, color, statusText } = getUpgradeDisplay(upgrade);
              return (
                <div
                  key={upgrade.type}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-900 bg-opacity-50"
                  style={{ borderLeft: `3px solid ${color}` }}
                >
                  <span className="text-lg">{option.icon}</span>
                  <div>
                    <div
                      className="text-xs font-pixel"
                      style={{ color }}
                    >
                      {option.name}
                    </div>
                    <div className="text-amber-200 text-xs font-pixel">
                      {statusText}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBar;
