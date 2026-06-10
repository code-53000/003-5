import { useGameStore } from '@/store/gameStore';
import { GameStatus, UpgradeType } from '@/types/game';
import { UPGRADE_OPTIONS, UPGRADE_COLORS } from '@/constants/game';

const UpgradeOverlay = () => {
  const status = useGameStore((state) => state.status);
  const pendingUpgradeOptions = useGameStore((state) => state.pendingUpgradeOptions);
  const upgrades = useGameStore((state) => state.upgrades);
  const selectUpgrade = useGameStore((state) => state.selectUpgrade);

  if (status !== GameStatus.UPGRADING) return null;

  const getCurrentLevel = (type: UpgradeType): number => {
    const existing = upgrades.find((u) => u.type === type);
    return existing ? existing.level : 0;
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-85 flex items-center justify-center rounded-lg z-20 overflow-auto">
      <div className="text-center p-6 max-w-2xl w-full">
        <h2 className="text-3xl text-amber-400 font-pixel mb-2">LEVEL UP!</h2>
        <p className="text-amber-200 text-sm font-pixel mb-6">选择一项升级</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {pendingUpgradeOptions.map((option) => {
            const currentLevel = getCurrentLevel(option.type);
            const color = UPGRADE_COLORS[option.type];
            return (
              <button
                key={option.type}
                onClick={() => selectUpgrade(option.type)}
                className="bg-amber-950 hover:bg-amber-900 border-2 rounded-xl p-4 transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ borderColor: color }}
              >
                <div className="text-5xl mb-3">{option.icon}</div>
                <div
                  className="text-lg font-pixel mb-2"
                  style={{ color }}
                >
                  {option.name}
                </div>
                <div className="text-amber-200 text-xs font-pixel mb-2">
                  {option.description}
                </div>
                {currentLevel > 0 && (
                  <div className="text-amber-400 text-xs font-pixel">
                    当前等级: Lv.{currentLevel}
                  </div>
                )}
                {currentLevel > 0 && (
                  <div className="text-green-400 text-xs font-pixel mt-1">
                    → Lv.{currentLevel + 1}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-amber-300 text-xs font-pixel">点击选择一项升级</p>
      </div>
    </div>
  );
};

export default UpgradeOverlay;
