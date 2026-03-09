'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Terminal, Bot, Layout, Code2, Github, Gamepad2, Sparkles, ChevronLeft, ChevronRight, Download, Mic, Wand2, Video, Scissors, Calendar, Database, Clock, Upload, Zap, MousePointer } from 'lucide-react';
import localFont from 'next/font/local';
import { createPortal } from 'react-dom';

import IdentityCard from '@/components/cards/IdentityCard';
import MailboxCard from '@/components/cards/MailboxCard';
import KlipSchedulerCard from '@/components/cards/KlipSchedulerCard';
import KlipMachineCard from '@/components/cards/KlipMachineCard';
import NetPuzzleCard from '@/components/cards/NetPuzzleCard';
import TerminalCard from '@/components/cards/TerminalCard';
import GithubCard from '@/components/cards/GithubCard';
import ValentineCard from '@/components/cards/ValentineCard';
import BuildingCard from '@/components/cards/BuildingCard';


import InceptionCase from '@/components/cards/InceptionCase';
import FlipCard from '@/components/ui/FlipCard';

/**
 * Main portfolio page component.
 * Renders a bento-grid layout with interactive project cards, a live terminal,
 * a GitHub carousel, a self-capturing Droste card, and an animated storytelling envelope.
 * The grid scrolls horizontally on mobile and snaps to a 4-column layout on desktop.
 *
 * Returns:
 *   The full-page portfolio layout as a React element.
 */
export default function Home() {

  // --- Layout / viewport scaling ---
  const [pageScale, setPageScale] = useState(1);
  const [isDesk, setIsDesk] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Below 570 px height the grid is too compressed to be usable; show the restricted overlay.
      if (window.innerHeight < 478) { 
        setIsRestricted(true);
      } else {
        setIsRestricted(false);
      }

      // Desktop layout: scale the fixed 1100×860 canvas to fill the available viewport.
      if (window.innerWidth >= 1024 && window.innerHeight >= 750) {
        setIsDesk(true);
        
        // Fixed logical canvas dimensions the design was authored at this size.
        const CANVAS_WIDTH = 1100;
        const CANVAS_HEIGHT = 860; 

        const availableWidth = window.innerWidth - 0;
        // Reserve 103 px for the browser chrome so the canvas never overflows vertically.
        const availableHeight = window.innerHeight - 103;

        const scaleX = availableWidth / CANVAS_WIDTH;
        const scaleY = availableHeight / CANVAS_HEIGHT;

        // Taking the smaller ratio guarantees the canvas fits both dimensions simultaneously;
        // scale may exceed 1 on large monitors and drop below 1 on compact screens.
        let finalScale = Math.min(scaleX, scaleY);

        //finalScale = Math.min(finalScale, 2.0);

        setPageScale(finalScale);
      } else {
        setIsDesk(false);
        setPageScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    // Full-viewport layout: fixed height on desktop, dynamic viewport height on mobile
    <main 
      className="relative h-[100dvh] w-full overflow-hidden bg-[#fdf6e3] text-[#2c3e50] flex flex-col items-center justify-center font-sans"
      style={{
        backgroundImage: `
          linear-gradient(rgba(44, 62, 80, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(44, 62, 80, 0.06) 1px, transparent 1px),
          linear-gradient(rgba(44, 62, 80, 0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(44, 62, 80, 0.025) 1px, transparent 1px)
        `,
        // Major grid lines at 50px, minor millimeter subdivisions at 10px
        backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
        backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
      }}
    >

      {/* Restricted viewport overlay blocks interaction when the window is too small to render the layout */}
      <div 
        className={`fixed inset-0 z-[99999] bg-[#fdf6e3] flex-col items-center justify-center text-[#2c3e50] p-8 text-center ${isRestricted ? 'flex' : 'hidden'}`}
      >
        
        {/* Animated pause bars */}
        <div className="flex gap-2 mb-6">
          <div className="w-3 h-10 bg-[#2c3e50] rounded-sm animate-[pulse_1.5s_ease-in-out_infinite]" />
          <div className="w-3 h-10 bg-[#2c3e50] rounded-sm animate-[pulse_1.5s_ease-in-out_infinite_0.5s]" />
        </div>

        <h2 className="text-xl desk:text-2xl font-black font-mono tracking-widest uppercase mb-4">
          Wait a minute...
        </h2>
        
        <p className="text-sm desk:text-base font-medium opacity-80 max-w-[450px] leading-relaxed">
          Please **rotate your device** or **stop squishing this site** with your browser window :)
        </p>

        {/* Flavor text for unsupported viewport sizes */}
        <p className="mt-8 text-[10px] font-mono opacity-80 uppercase tracking-tighter">
          [ ERR: Viewport too small. This site is not available for iPhone 4 users <br/> or anyone living in 480px of height. Modern problems require modern displays. ]
        </p>

      </div>
      
      <div 
        className={`flex flex-col p-4 desk:p-8 ${isDesk ? 'absolute' : 'w-full h-full'}`}
        style={isDesk ? {
          width: '1100px',
          height: '860px',
          // Top is fixed so the header always aligns with the viewport edge regardless of scale.
          top: '0px',
          left: '50%',
          // Horizontal centering only; Y translation is intentionally omitted to keep the top edge pinned.
          transform: `translateX(-50%) scale(${pageScale})`,
          // Scale origin anchored to the top so the header never moves on resize.
          transformOrigin: 'top center',
        } : {}}
      >
        <header className="flex-none flex justify-between items-start mb-6 mt-2 desk:mt-0 [@media(max-height:610px)]:hidden">
          <div className='pr-24'>
            <h1 className="text-3xl font-black uppercase tracking-tight leading-none">Kylian Malartre</h1>
            <p className="text-lg font-medium opacity-70 mt-1">Computer Science Student at the University of Bordeaux</p>
          </div>

          {/* Absolute positioning prevents the logo height from pushing the bento grid down */}
          <a 
            href="https://github.com/KAE-Lab" 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-[7px] desk:top-[5px] right-[10px] desk:right-[25px] transition-transform duration-300 hover:scale-110 focus-visible:scale-110 outline-none origin-center"
            aria-label="KAE-Lab GitHub Organization"
          >
            <img 
              src="/logo-kae-lab.png" 
              alt="KAE-Lab Logo" 
              className="h-24 desk:h-30 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity duration-300 drop-shadow-sm"
            />
          </a>
        </header>

        {/* Bento grid: horizontal scroll (2-row) on mobile, 4-column dense layout on desktop */}
        <div 
          className="flex-1 grid content-center desk:content-stretch grid-rows-[200px_200px] grid-flow-col desk:grid-rows-4 desk:grid-flow-dense desk:grid-cols-4 gap-4 mt-2 desk:mt-0 pb-6 desk:pb-0 overflow-x-auto desk:overflow-visible overflow-y-hidden snap-x auto-cols-[230px] desk:auto-cols-auto -mx-4 px-4 desk:mx-0 desk:px-0"
        >

          <IdentityCard />

          <MailboxCard />

          <FlipCard 
            className="row-span-1 col-span-2 order-4 desk:order-none"
            front={<KlipSchedulerCard />}
            back={<KlipMachineCard />} 
          />

          <BuildingCard />

          <NetPuzzleCard />

          <TerminalCard />

          <GithubCard />

          <ValentineCard />

         {/* --- [F] Inception / Droste effect card (hidden on mobile) --- */}
          <div className="hidden desk:block">
            <InceptionCase />
          </div>

        </div>
      </div>
    </main>
  );
}

