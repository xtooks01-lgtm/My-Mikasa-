
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  type: 'petal' | 'heart';
}

export const FloatingElements: React.FC<{ intensity?: number }> = ({ intensity = 15 }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: intensity }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 110,
      size: Math.random() * 10 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      type: Math.random() > 0.5 ? 'petal' : 'heart',
    }));
    setParticles(newParticles);
  }, [intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-pink-200 opacity-40 transition-transform"
          style={{
            left: `${p.x}%`,
            fontSize: `${p.size}px`,
            animation: `float-up ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            bottom: '-10%',
          }}
        >
          {p.type === 'petal' ? '🌸' : '🩷'}
        </div>
      ))}
      <style>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
