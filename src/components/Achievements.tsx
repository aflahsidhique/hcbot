import React from 'react';
import { Trophy, Star, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  target: number;
  completed: boolean;
  reward: number;
}

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({
  isOpen,
  onClose,
  achievements
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
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
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`rounded-xl p-4 border transition-all ${
                achievement.completed
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    achievement.completed
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                          style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  {achievement.completed ? (
                    <div className="flex items-center space-x-1 text-yellow-600">
                      <Star size={16} />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      +{achievement.reward.toLocaleString()} 🪙
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};