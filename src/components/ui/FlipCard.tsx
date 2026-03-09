'use client';

import React, { useState } from 'react';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const Badge = () => (
    <div className="absolute -top-2.5 -right-2.5 z-50 pointer-events-none">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform transition-shadow duration-300 ease-out group-hover:shadow-[0_5px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:scale-110 will-change-transform">
        {/* Inner highlight */}
        <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-b from-white/15 to-transparent" />
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white/80 relative z-10 group-hover:text-white transition-colors duration-300"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </div>
    </div>
  );

  return (
    // Root container acts as a direct grid cell to maintain bento layout integrity
    <div 
      className={`group cursor-pointer grid w-full h-full ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Face A (Front): Shrinks horizontally to simulate 3D rotation */}
      <div 
        className={`[grid-area:1/1] relative w-full h-full grid transition-all duration-300 ease-in-out ${
          isFlipped ? 'scale-x-0 opacity-0 delay-0' : 'scale-x-100 opacity-100 delay-300'
        }`}
      >
        {front}
        <Badge />
      </div>

      {/* Face B (Back): Expands horizontally after Face A disappears */}
      <div 
        className={`[grid-area:1/1] relative w-full h-full grid transition-all duration-300 ease-in-out ${
          isFlipped ? 'scale-x-100 opacity-100 delay-300' : 'scale-x-0 opacity-0 delay-0'
        }`}
      >
        {back}
        <Badge />
      </div>
    </div>
  );
}