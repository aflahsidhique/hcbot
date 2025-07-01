import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white shadow-2xl min-h-screen w-full flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl flex items-center justify-center mb-6 animate-bounce">
            <span className="text-4xl">🐹</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hamster Combat</h1>
          <p className="text-gray-600 mb-8">Loading your game...</p>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>Connecting to Telegram...</p>
          </div>
        </div>
      </div>
    </div>
  );
};