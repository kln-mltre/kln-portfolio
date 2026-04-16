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
import UKitCard from '@/components/cards/UKitCard';

/**
 * Main portfolio page component.
 * Renders a bento-grid layout with interactive project cards, a live terminal,
 * a GitHub carousel, a self-capturing Droste card, and an animated storytelling envelope.
 * The grid scrolls horizontally on mobile and snaps to a 4-column layout on desktop.
 *
 * Returns:
 * The full-page portfolio layout as a React element.
 */
export default function Home() {

  const scrollRef = useRef<HTMLElement>(null);
  const [pageScale, setPageScale] = useState(1);
  const [isDesk, setIsDesk] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [manualZoom, setManualZoom] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsRestricted(window.innerHeight < 478);
      const w = window.innerWidth;
      const h = window.innerHeight;

      const isDesktop = w >= 1024 && h >= 750;
      setIsDesk(isDesktop);

      if (isDesktop) {
        // Constrains the canvas to fit within the viewport without clipping
        // using the smallest scale factor between width and height.
        const scaleX = w / 1100;
        const scaleY = (h - 100) / 860;
        setPageScale(Math.min(scaleX, scaleY) * manualZoom);
      } else {
        // Forces the canvas to scale based on width only,
        // allowing natural vertical scrolling for the overflow content.
        const scaleX = w / 550;
        setPageScale(scaleX * manualZoom);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [manualZoom]);

  const currentW = isDesk ? 1100 : 550;
  const currentH = isDesk ? 860 : 1150;
  
  const scaledW = currentW * pageScale;
  const scaledH = currentH * pageScale;

  return (
    <main className="relative h-[100dvh] w-full bg-[#fdf6e3] text-[#2c3e50] font-sans overflow-hidden select-none">
      
      <div 
        className="absolute -top-[50vh] -bottom-[50vh] left-0 right-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(44, 62, 80, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(44, 62, 80, 0.06) 1px, transparent 1px),
            linear-gradient(rgba(44, 62, 80, 0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(44, 62, 80, 0.025) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
          backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
        }}
      />

      <div 
        className={`fixed inset-0 z-[99999] bg-[#fdf6e3] flex-col items-center justify-center text-[#2c3e50] p-8 text-center ${isRestricted ? 'flex' : 'hidden'}`}
      >
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
        <p className="mt-8 text-[10px] font-mono opacity-80 uppercase tracking-tighter">
          [ ERR: Viewport too small. This site is not available for iPhone 4 users <br/> or anyone living in 480px of height. Modern problems require modern displays. ]
        </p>
      </div>

      <div 
        className="absolute inset-0 w-full h-full flex flex-col overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z-10"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 7px, black calc(100% - 7px), transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 7px, black calc(100% - 7px), transparent 100%)'
        }}
      >
      
      {/* Ghost Wrapper
        Reserves the exact scaled dimensions in the document flow.
        Using mx-auto centers the layout horizontally without affecting vertical scroll behavior.
      */}
      <div 
        className="relative mx-auto mt-0 desk:mt-0"
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`,
          transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Main Canvas
          Renders at a fixed base resolution and scales down via CSS transform.
          Ensures pixel-perfect layouts and prevents text reflow issues across devices.
        */}
        <div 
          className="absolute top-0 left-0 flex flex-col p-4 desk:p-8"
          style={{
            width: `${currentW}px`,
            height: `${currentH}px`,
            transform: `scale(${pageScale})`,
            transformOrigin: 'top left',
            transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <header className="flex-none relative mb-6">
            <div className="pr-32">
              <h1 className="text-3xl font-black uppercase tracking-tight leading-none text-[#2c3e50]">
                Kylian Malartre
              </h1>
              <p className="text-lg font-medium opacity-70 mt-1 text-[#2c3e50]">
                Computer Science Student at the University of Bordeaux
              </p>
            </div>

            {/* Detaches the logo from the document flow to prevent shifting the grid's vertical alignment */}
            <a
              href="https://github.com/KAE-Lab" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group absolute top-[-17px] desk:top-[-22px] right-[-13px] desk:right-[-14px] transition-transform duration-300 hover:scale-110 outline-none origin-center"
            >
              <span className="hidden desk:block absolute right-full top-1/2 -translate-y-1/2 mr-3 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xl border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] text-[#2c3e50] text-[13px] font-mono font-bold uppercase tracking-wider whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
                KAE Lab
              </span>
              <img 
                src="/logo-kae-lab.png" 
                alt="KAE-Lab Logo" 
                className="h-25 desk:h-27 w-auto object-contain opacity-95"
              />
            </a>
          </header>

          {/* Bento Grid: 4-column dense layout on desktop, 2-column with fixed row heights on mobile */}
          <div 
            className={`flex-1 grid gap-4 ${isDesk ? 'grid-cols-4 grid-rows-4 grid-flow-dense' : 'grid-cols-2 auto-rows-[190px]'}`}
          >
            <IdentityCard />
            <MailboxCard />
            <FlipCard 
              className="row-span-1 col-span-2 order-5 desk:order-none"
              front={<KlipSchedulerCard />}
              back={<KlipMachineCard />} 
            />
            
            <UKitCard />
            <NetPuzzleCard />
            <TerminalCard />
            <GithubCard />
            <ValentineCard />
            <InceptionCase />
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}