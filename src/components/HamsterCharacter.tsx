import React, { useState, useEffect } from 'react';

interface HamsterCharacterProps {
  onTap: () => void;
  isAnimating: boolean;
  tapPower: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  value: number;
}

export const HamsterCharacter: React.FC<HamsterCharacterProps> = ({
  onTap,
  isAnimating,
  tapPower
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextParticleId, setNextParticleId] = useState(0);

  const handleTap = (event: React.MouseEvent) => {
    onTap();
    
    // Create particle effect
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newParticle: Particle = {
      id: nextParticleId,
      x,
      y,
      value: tapPower
    };
    
    setParticles(prev => [...prev, newParticle]);
    setNextParticleId(prev => prev + 1);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);
  };

  return (
    <div className="relative flex items-center justify-center py-8">
      <div className="relative">
        <button
          onClick={handleTap}
          className={`relative w-48 h-48 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl transform transition-all duration-150 hover:scale-105 active:scale-95 ${
            isAnimating ? 'animate-bounce' : ''
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-full" />
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🐹</span>
          </div>
          
          {/* Tap ripple effect */}
          <div className="absolute inset-0 rounded-full opacity-0 animate-ping bg-white/30" />
        </button>
        
        {/* Particle effects */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute pointer-events-none animate-bounce"
            style={{
              left: particle.x,
              top: particle.y,
              transform: 'translate(-50%, -50%)',
              animation: 'particleFloat 1s ease-out forwards'
            }}
          >
            <div className="flex items-center space-x-1 bg-yellow-400 text-purple-800 px-2 py-1 rounded-full text-sm font-bold shadow-lg">
              <span>+{particle.value}</span>
              <span>🪙</span>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -200%) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
};