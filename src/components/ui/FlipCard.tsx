'use client';

import React, { useState, MouseEvent } from 'react';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    // Prevent flip if clicking on text selection
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }

    const target = e.target as HTMLElement;
    
    // Identify if the click is on a standard interactive element
    const isInteractive = target.closest('a, button, input, textarea, select, details, [role="button"], [role="link"], [data-interactive="true"]');
    
    // Identify if the click is specifically on our flip badge
    const isBadge = target.closest('[data-flip-badge="true"]');

    // Identify if the click is on an element explicitly marked as interactive (cursor-pointer), excluding the card root itself
    let isExplicitlyInteractive = false;
    let currentElement: HTMLElement | null = target;

    while (currentElement && currentElement !== e.currentTarget) {
      // The direct children of e.currentTarget are the Face wrappers
      const isFaceWrapper = currentElement.parentElement === e.currentTarget;
      // The children of Face wrappers are the root elements of the passed components (front/back)
      const isCardRoot = currentElement.parentElement?.parentElement === e.currentTarget;

      if (!isFaceWrapper && !isCardRoot) {
        const classes = currentElement.className;
        if (typeof classes === 'string' && classes.includes('cursor-pointer')) {
          isExplicitlyInteractive = true;
          break;
        }
      }
      currentElement = currentElement.parentElement;
    }

    // If it's an interactive element AND not our badge, don't flip
    if ((isInteractive || isExplicitlyInteractive) && !isBadge) {
      return;
    }

    setIsFlipped(!isFlipped);
  };

  const Badge = () => (
    <div className="absolute -top-2.5 -right-2.5 z-50 pointer-events-none">
      <div 
        data-flip-badge="true"
        className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] transition-transform transition-shadow duration-300 ease-out group-hover:shadow-[0_5px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.3)] group-hover:scale-110 will-change-transform pointer-events-auto"
      >
        {/* Inner highlight */}
        <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-b from-white/15 to-transparent" />
        <svg 
         width="19" 
         height="19" 
         viewBox="0 0 24 24" 
         fill="none" 
         stroke="currentColor" 
         strokeWidth="2.5" 
         strokeLinecap="round" 
         strokeLinejoin="round" 
         className={`text-white transition-transform duration-500 ${isFlipped ? 'rotate-180' : 'rotate-0'}`}
        >
         <path d="m16 3 4 4-4 4" />
         <path d="M20 7H4" />
         <path d="m8 21-4-4 4-4" />
         <path d="M4 17h16" />
         </svg>
      </div>
    </div>
  );

  return (
    // Root container acts as a direct grid cell to maintain bento layout integrity
    <div 
      className={`group cursor-pointer grid w-full h-full ${className}`}
      onClick={handleClick}
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