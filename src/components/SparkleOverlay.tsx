'use client';

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

export function SparkleOverlay() {
  const [sparkles, setSparkles] = useState<{ id: number; top: number; left: number; size: number }[]>([]);

  useEffect(() => {
    const newSparkles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 30 + 10,
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute sparkle-element text-primary"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            transition: 'all 0.5s ease',
            animationDelay: `${Math.random() * 2}s`,
          }}
        >
          <Heart fill="currentColor" size={s.size} />
        </div>
      ))}
    </div>
  );
}
