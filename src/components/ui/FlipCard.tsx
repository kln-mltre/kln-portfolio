'use client';

import React, { useState } from 'react';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

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
        
        {/* Interaction hint icon */}
        <div className="absolute top-4 right-4 z-50 opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <line x1="12" y1="22" x2="12" y2="12"></line>
          </svg>
        </div>
      </div>

      {/* Face B (Back): Expands horizontally after Face A disappears */}
      <div 
        className={`[grid-area:1/1] relative w-full h-full grid transition-all duration-300 ease-in-out ${
          isFlipped ? 'scale-x-100 opacity-100 delay-300' : 'scale-x-0 opacity-0 delay-0'
        }`}
      >
        {back}
        
        <div className="absolute top-4 right-4 z-50 opacity-30 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-md">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <line x1="12" y1="22" x2="12" y2="12"></line>
          </svg>
        </div>
      </div>
    </div>
  );
}