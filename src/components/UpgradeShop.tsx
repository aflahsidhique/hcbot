import React from 'react';
import { ShoppingCart, TrendingUp, Zap, Clock } from 'lucide-react';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  icon: React.ReactNode;
  effect: string;
}

interface UpgradeShopProps {
  coins: number;
  upgrades: Upgrade[];
  onUpgrade: (upgradeId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeShop: React.FC<UpgradeShopProps> = ({
  coins,
  upgrades,
  onUpgrade,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Upgrade Shop</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <span className="text-gray-500">✕</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {upgrades.map(upgrade => {
            const canAfford = coins >= upgrade.cost;
            const isMaxLevel = upgrade.level >= upgrade.maxLevel;
            
            return (
              <div
                key={upgrade.id}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                      {upgrade.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{upgrade.name}</h3>
                      <p className="text-sm text-gray-600">{upgrade.description}</p>
                      <p className="text-xs text-purple-600 font-medium">{upgrade.effect}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                      Level {upgrade.level}/{upgrade.maxLevel}
                    </div>
                    {!isMaxLevel ? (
                      <button
                        onClick={() => onUpgrade(upgrade.id)}
                        disabled={!canAfford || isMaxLevel}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          canAfford
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {upgrade.cost.toLocaleString()} 🪙
                      </button>
                    ) : (
                      <div className="px-4 py-2 rounded-lg bg-green-100 text-green-600 font-medium">
                        MAX
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};