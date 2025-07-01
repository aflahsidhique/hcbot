import React from 'react';
import { Coins, Zap, Trophy, Gift, User } from 'lucide-react';
import { TelegramUser } from '../types/telegram';

interface GameHeaderProps {
  coins: number;
  energy: number;
  maxEnergy: number;
  level: number;
  onDailyBonusClick: () => void;
  onAchievementsClick: () => void;
  hasUnclaimedBonus: boolean;
  user: TelegramUser | null;
  isInTelegram: boolean;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  coins,
  energy,
  maxEnergy,
  level,
  onDailyBonusClick,
  onAchievementsClick,
  hasUnclaimedBonus,
  user,
  isInTelegram
}) => {
  const getDisplayName = () => {
    if (!user) return 'Player';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName} ${lastName}`.trim() || user.username || `User ${user.id}`;
  };

  const getInitials = () => {
    if (!user) return 'P';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    } else if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-b-3xl shadow-lg">
      {/* User Info Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-sm font-bold">{getInitials()}</span>
              </div>
            )}
            {user?.is_premium && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">{getDisplayName()}</h2>
            <div className="flex items-center space-x-2 text-sm text-white/80">
              <span>Level {level}</span>
              {user?.username && (
                <>
                  <span>•</span>
                  <span>@{user.username}</span>
                </>
              )}
            </div>
            {!isInTelegram && (
              <div className="text-xs text-yellow-300 mt-1">
                🔧 Development Mode
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onDailyBonusClick}
            className={`p-2 rounded-full transition-all ${
              hasUnclaimedBonus 
                ? 'bg-yellow-400 text-purple-800 animate-pulse' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Gift size={20} />
          </button>
          <button
            onClick={onAchievementsClick}
            className="p-2 bg-white/20 rounded-full text-white transition-all hover:bg-white/30"
          >
            <Trophy size={20} />
          </button>
        </div>
      </div>
      
      {/* Game Stats Section */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Coins size={24} className="text-yellow-400" />
          <span className="text-2xl font-bold">{coins.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Zap size={20} className="text-yellow-300" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{energy}/{maxEnergy}</span>
            <div className="w-20 h-2 bg-white/20 rounded-full">
              <div 
                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${(energy / maxEnergy) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Telegram ID for debugging (only in development) */}
      {process.env.NODE_ENV === 'development' && user && (
        <div className="mt-2 text-xs text-white/60">
          Telegram ID: {user.id}
        </div>
      )}
    </div>
  );
};