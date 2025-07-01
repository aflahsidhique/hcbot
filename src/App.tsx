import React, { useState, useEffect } from 'react';
import { TrendingUp, Zap, Clock, Target, Star, Trophy, Coins } from 'lucide-react';
import { GameHeader } from './components/GameHeader';
import { HamsterCharacter } from './components/HamsterCharacter';
import { UpgradeShop } from './components/UpgradeShop';
import { DailyBonus } from './components/DailyBonus';
import { Achievements } from './components/Achievements';
import { NavigationBar } from './components/NavigationBar';
import { LoadingScreen } from './components/LoadingScreen';
import { useGameState } from './hooks/useGameState';
import { useTelegram } from './hooks/useTelegram';

function App() {
  const gameState = useGameState();
  const { user, webApp, isLoading, isInTelegram } = useTelegram();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUpgradeShop, setShowUpgradeShop] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Auto-show daily bonus if available - moved before conditional return
  useEffect(() => {
    if (gameState.canClaimDailyBonus && gameState.totalTaps > 0) {
      const timer = setTimeout(() => {
        setShowDailyBonus(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.canClaimDailyBonus, gameState.totalTaps]);

  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleTap = () => {
    if (gameState.energy > 0) {
      gameState.tap();
      setIsAnimating(true);
      
      // Haptic feedback for Telegram
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
      
      setTimeout(() => setIsAnimating(false), 200);
    }
  };

  const upgrades = [
    {
      id: 'tapPower',
      name: 'Tap Power',
      description: 'Increase coins per tap',
      cost: Math.floor(100 * Math.pow(1.5, gameState.upgrades.tapPower)),
      level: gameState.upgrades.tapPower,
      maxLevel: 50,
      icon: <TrendingUp size={20} />,
      effect: `+${gameState.upgrades.tapPower} coins per tap`
    },
    {
      id: 'maxEnergy',
      name: 'Max Energy',
      description: 'Increase maximum energy',
      cost: Math.floor(200 * Math.pow(1.4, gameState.upgrades.maxEnergy)),
      level: gameState.upgrades.maxEnergy,
      maxLevel: 30,
      icon: <Zap size={20} />,
      effect: `+${gameState.upgrades.maxEnergy * 100} max energy`
    },
    {
      id: 'energyRegen',
      name: 'Energy Regeneration',
      description: 'Faster energy recovery',
      cost: Math.floor(500 * Math.pow(1.6, gameState.upgrades.energyRegen)),
      level: gameState.upgrades.energyRegen,
      maxLevel: 20,
      icon: <Clock size={20} />,
      effect: `+${gameState.upgrades.energyRegen} energy/second`
    },
    {
      id: 'autoTapper',
      name: 'Auto Tapper',
      description: 'Automatically tap for you',
      cost: Math.floor(10000 * Math.pow(2, gameState.upgrades.autoTapper)),
      level: gameState.upgrades.autoTapper,
      maxLevel: 10,
      icon: <Target size={20} />,
      effect: `${gameState.upgrades.autoTapper > 0 ? 'Active' : 'Inactive'}`
    }
  ];

  const achievements = [
    {
      id: 'first_tap',
      name: 'First Tap',
      description: 'Tap the hamster for the first time',
      icon: <Target size={20} />,
      progress: gameState.totalTaps,
      target: 1,
      completed: gameState.totalTaps >= 1,
      reward: 100
    },
    {
      id: 'hundred_taps',
      name: 'Tap Master',
      description: 'Tap 100 times',
      icon: <Star size={20} />,
      progress: gameState.totalTaps,
      target: 100,
      completed: gameState.totalTaps >= 100,
      reward: 1000
    },
    {
      id: 'thousand_taps',
      name: 'Tap Legend',
      description: 'Tap 1,000 times',
      icon: <Trophy size={20} />,
      progress: gameState.totalTaps,
      target: 1000,
      completed: gameState.totalTaps >= 1000,
      reward: 5000
    },
    {
      id: 'ten_thousand_coins',
      name: 'Rich Hamster',
      description: 'Earn 10,000 coins',
      icon: <Coins size={20} />,
      progress: gameState.totalCoinsEarned,
      target: 10000,
      completed: gameState.totalCoinsEarned >= 10000,
      reward: 2000
    }
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'shop') {
      setShowUpgradeShop(true);
    } else if (tab === 'achievements') {
      setShowAchievements(true);
    }
    
    // Haptic feedback for navigation
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  const handleUpgrade = (upgradeId: string) => {
    gameState.upgradeShop(upgradeId);
    
    // Success haptic feedback
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen">
        <GameHeader
          coins={gameState.coins}
          energy={gameState.energy}
          maxEnergy={gameState.maxEnergy}
          level={gameState.level}
          onDailyBonusClick={() => setShowDailyBonus(true)}
          onAchievementsClick={() => setShowAchievements(true)}
          hasUnclaimedBonus={gameState.canClaimDailyBonus}
          user={user}
          isInTelegram={isInTelegram}
        />
        
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hamster Combat</h1>
            <p className="text-gray-600">
              {user ? `Welcome back, ${user.first_name}!` : 'Tap to earn coins!'}
            </p>
          </div>
          
          <HamsterCharacter
            onTap={handleTap}
            isAnimating={isAnimating}
            tapPower={gameState.tapPower}
          />
          
          <div className="mt-6 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Taps</span>
                  <div className="font-bold text-lg">{gameState.totalTaps.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Coins per Tap</span>
                  <div className="font-bold text-lg">{gameState.tapPower}</div>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowUpgradeShop(true)}
            className="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all"
          >
            Upgrade Shop
          </button>
        </div>
        
        <NavigationBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
        
        <UpgradeShop
          coins={gameState.coins}
          upgrades={upgrades}
          onUpgrade={handleUpgrade}
          isOpen={showUpgradeShop}
          onClose={() => {
            setShowUpgradeShop(false);
            setActiveTab('home');
          }}
        />
        
        <DailyBonus
          isOpen={showDailyBonus}
          onClose={() => setShowDailyBonus(false)}
          onClaim={gameState.claimDailyBonus}
          streak={gameState.dailyBonusStreak}
          nextBonusAmount={gameState.nextBonusAmount}
          canClaim={gameState.canClaimDailyBonus}
          hoursUntilNext={24}
        />
        
        <Achievements
          isOpen={showAchievements}
          onClose={() => {
            setShowAchievements(false);
            setActiveTab('home');
          }}
          achievements={achievements}
        />
      </div>
    </div>
  );
}

export default App;