import React from 'react';
import { Gift, Calendar, Coins } from 'lucide-react';

interface DailyBonusProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  streak: number;
  nextBonusAmount: number;
  canClaim: boolean;
  hoursUntilNext: number;
}

export const DailyBonus: React.FC<DailyBonusProps> = ({
  isOpen,
  onClose,
  onClaim,
  streak,
  nextBonusAmount,
  canClaim,
  hoursUntilNext
}) => {
  if (!isOpen) return null;

  const bonusSchedule = [
    { day: 1, amount: 1000 },
    { day: 2, amount: 2000 },
    { day: 3, amount: 3000 },
    { day: 4, amount: 4000 },
    { day: 5, amount: 5000 },
    { day: 6, amount: 7500 },
    { day: 7, amount: 10000 }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Bonus</h2>
            <p className="text-gray-600">Come back every day for amazing rewards!</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-purple-600" />
                <span className="font-medium text-gray-800">Current Streak</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{streak} days</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {bonusSchedule.map(item => (
                <div
                  key={item.day}
                  className={`text-center p-2 rounded-lg text-xs ${
                    item.day <= streak
                      ? 'bg-green-100 text-green-600'
                      : item.day === streak + 1
                      ? 'bg-yellow-100 text-yellow-600 ring-2 ring-yellow-300'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <div className="font-bold">Day {item.day}</div>
                  <div>{item.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>

          {canClaim ? (
            <button
              onClick={() => {
                onClaim();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2"
            >
              <Coins size={20} />
              <span>Claim {nextBonusAmount.toLocaleString()} Coins</span>
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-gray-100 text-gray-600 py-3 px-6 rounded-xl">
                Next bonus in {hoursUntilNext}h
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-3 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};