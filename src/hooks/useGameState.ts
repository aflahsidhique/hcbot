import { useState, useEffect, useCallback } from 'react';

interface GameState {
  coins: number;
  energy: number;
  maxEnergy: number;
  tapPower: number;
  level: number;
  totalTaps: number;
  totalCoinsEarned: number;
  lastDailyBonus: string;
  dailyBonusStreak: number;
  upgrades: {
    tapPower: number;
    maxEnergy: number;
    energyRegen: number;
    autoTapper: number;
  };
}

const INITIAL_STATE: GameState = {
  coins: 0,
  energy: 1000,
  maxEnergy: 1000,
  tapPower: 1,
  level: 1,
  totalTaps: 0,
  totalCoinsEarned: 0,
  lastDailyBonus: '',
  dailyBonusStreak: 0,
  upgrades: {
    tapPower: 0,
    maxEnergy: 0,
    energyRegen: 0,
    autoTapper: 0
  }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('hamsterGame');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('hamsterGame', JSON.stringify(gameState));
  }, [gameState]);

  // Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.energy < prev.maxEnergy) {
          const regenRate = 1 + prev.upgrades.energyRegen;
          return {
            ...prev,
            energy: Math.min(prev.maxEnergy, prev.energy + regenRate)
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-tapper
  useEffect(() => {
    if (gameState.upgrades.autoTapper > 0) {
      const interval = setInterval(() => {
        setGameState(prev => {
          if (prev.energy > 0) {
            const autoTapPower = Math.floor(prev.tapPower * 0.1 * prev.upgrades.autoTapper);
            return {
              ...prev,
              coins: prev.coins + autoTapPower,
              energy: Math.max(0, prev.energy - 1),
              totalCoinsEarned: prev.totalCoinsEarned + autoTapPower
            };
          }
          return prev;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [gameState.upgrades.autoTapper, gameState.tapPower]);

  const tap = useCallback(() => {
    setGameState(prev => {
      if (prev.energy > 0) {
        const newTotalTaps = prev.totalTaps + 1;
        const newTotalCoins = prev.totalCoinsEarned + prev.tapPower;
        const newLevel = Math.floor(newTotalTaps / 100) + 1;
        
        return {
          ...prev,
          coins: prev.coins + prev.tapPower,
          energy: Math.max(0, prev.energy - 1),
          totalTaps: newTotalTaps,
          totalCoinsEarned: newTotalCoins,
          level: newLevel
        };
      }
      return prev;
    });
  }, []);

  const upgradeShop = useCallback((upgradeId: string) => {
    setGameState(prev => {
      const upgradeCosts = {
        tapPower: Math.floor(100 * Math.pow(1.5, prev.upgrades.tapPower)),
        maxEnergy: Math.floor(200 * Math.pow(1.4, prev.upgrades.maxEnergy)),
        energyRegen: Math.floor(500 * Math.pow(1.6, prev.upgrades.energyRegen)),
        autoTapper: Math.floor(10000 * Math.pow(2, prev.upgrades.autoTapper))
      };

      const cost = upgradeCosts[upgradeId as keyof typeof upgradeCosts];
      
      if (prev.coins >= cost) {
        const newUpgrades = { ...prev.upgrades };
        newUpgrades[upgradeId as keyof typeof newUpgrades]++;
        
        let newState = {
          ...prev,
          coins: prev.coins - cost,
          upgrades: newUpgrades
        };

        // Apply upgrade effects
        if (upgradeId === 'tapPower') {
          newState.tapPower = 1 + newUpgrades.tapPower;
        } else if (upgradeId === 'maxEnergy') {
          newState.maxEnergy = 1000 + (newUpgrades.maxEnergy * 100);
        }

        return newState;
      }
      return prev;
    });
  }, []);

  const claimDailyBonus = useCallback(() => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    setGameState(prev => {
      let newStreak = 1;
      
      if (prev.lastDailyBonus === yesterday) {
        newStreak = prev.dailyBonusStreak + 1;
      } else if (prev.lastDailyBonus === today) {
        return prev; // Already claimed today
      }
      
      newStreak = Math.min(newStreak, 7); // Max 7 day streak
      const bonusAmount = newStreak * 1000;
      
      return {
        ...prev,
        coins: prev.coins + bonusAmount,
        lastDailyBonus: today,
        dailyBonusStreak: newStreak,
        totalCoinsEarned: prev.totalCoinsEarned + bonusAmount
      };
    });
  }, []);

  const canClaimDailyBonus = () => {
    const today = new Date().toDateString();
    return gameState.lastDailyBonus !== today;
  };

  const getNextBonusAmount = () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    let nextStreak = 1;
    if (gameState.lastDailyBonus === yesterday) {
      nextStreak = Math.min(gameState.dailyBonusStreak + 1, 7);
    }
    
    return nextStreak * 1000;
  };

  return {
    ...gameState,
    tap,
    upgradeShop,
    claimDailyBonus,
    canClaimDailyBonus: canClaimDailyBonus(),
    nextBonusAmount: getNextBonusAmount()
  };
};