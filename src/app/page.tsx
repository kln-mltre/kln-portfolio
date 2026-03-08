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

// Handwritten display font (used for the storytelling card)
const handwrittenFont = localFont({ 
  src: './fonts/HandwrittenFont.ttf', 
  variable: '--font-handwritten'
});

/**
 * Animated stop-motion sticker with two-frame sprite toggle.
 * Both frames are preloaded once to avoid additional network requests;
 * only CSS opacity is toggled at randomized intervals.
 *
 * Args:
 *   src: Path to the primary sprite image (.png).
 *   pos: Absolute positioning config top, left offsets and base scale factor.
 *
 * Returns:
 *   A positioned, non-interactive sticker element with a continuous wiggle animation.
 */
const MiniSticker = ({ src, pos }: { src: string, pos: { top: string, left: string, scale: number } }) => {
  const [state, setState] = useState(0);

  useEffect(() => {
    const initialDelay = Math.random() * 2000;
    let timeoutId: NodeJS.Timeout;
    const loop = () => {
      setState((prev) => (prev === 0 ? 1 : 0));
      timeoutId = setTimeout(loop, 500 + Math.random() * 1500);
    };
    const startTimeout = setTimeout(loop, initialDelay);
    return () => { clearTimeout(startTimeout); clearTimeout(timeoutId); };
  }, []);

  const baseScale = pos.scale || 1;
  const currentScale = state === 1 ? baseScale * 1.1 : baseScale;
  const bisSrc = src.replace('.png', 'bis.png');

  return (
    <div
      className="absolute pointer-events-none select-none w-12 h-12"
      style={{
        top: pos.top, 
        left: pos.left,
        transform: `scale(${currentScale}) translateZ(0)`, 
        transition: 'none',
        filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.15))",
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Both frames are preloaded once; only opacity toggles to avoid extra network requests */}
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: state === 0 ? 1 : 0, transition: 'none' }} />
      <img src={bisSrc} alt="" className="absolute inset-0 w-full h-full object-contain" style={{ opacity: state === 1 ? 1 : 0, transition: 'none' }} />
    </div>
  );
};

/**
 * Self-referencing "Droste effect" card that captures a live screenshot
 * of the page and lets the user click to trigger a full-screen dive-in animation.
 * Skips capture when rendered during screenshot mode (?screenshot=1) to avoid recursion.
 *
 * Returns:
 *   An interactive card displaying a live page screenshot with a dive animation on click.
 */
const InceptionCase = () => {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDiving, setIsDiving] = useState(false);
  const [diveBoxStyle, setDiveBoxStyle] = useState<React.CSSProperties>({});
  
  // Inline styles for the full-screen background layer during the dive-in transition
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({});
  
  const boxRef = useRef<HTMLDivElement>(null);

  // Captures a live page screenshot via the API; skips in screenshot render mode to prevent loops
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('screenshot') === '1') return;

    const capture = () => {
      if (window.innerWidth < 1024 || window.innerHeight < 750) return; // To save ressources on mobile, where the dive effect is disabled
      const w = window.innerWidth;
      const h = window.innerHeight;
      setScreenshotUrl(`/api/screenshot?w=${w}&h=${h}`);
    };

    capture();

    let resizeTimer: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(capture, 1000);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Defaults to false (normal render) to prevent a server/client hydration mismatch.
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  // URL params are only accessible after mount; reading them in a useEffect avoids SSR mismatches.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('screenshot') === '1') {
      setIsScreenshotMode(true);
    }
  }, []);

  // Render a static placeholder during screenshot capture to break the Droste recursion.
  if (isScreenshotMode) {
    return (
      <>
        <style dangerouslySetInnerHTML={{__html: `
          * {
            transition: none !important;
            animation: none !important;
            animation-duration: 0ms !important;
          }
        `}} />
      <div className="relative min-h-[150px] desk:min-h-0 w-full h-full">
        <div 
          className="absolute inset-0 border-0 border-[#2c3e50] bg-[#fdf6e3] rounded-3xl overflow-hidden shadow-lg"
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
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center opacity-30">
              <Terminal className="text-[#2c3e50] mb-2" size={24} />
              <span className="text-[#2c3e50] text-[8px] font-mono tracking-widest font-bold">INCEPTION</span>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  /**
   * Triggers a three-phase dive-in animation on click.
   * Detaches the card, morphs it to fill the viewport, and scales the
   * background outward from the click center before resetting.
   *
   * Args:
   *   e: Mouse event from the clicked card, used to compute the vanishing point.
   */
  const triggerDive = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDiving) return;
    setIsDiving(true);
    const rect = e.currentTarget.getBoundingClientRect();

    // Vanishing point: center of the clicked card for the zoom transform-origin
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    
    // Scale factor so the background image covers the full viewport when expanded
    const zoomFactor = Math.max(window.innerWidth / rect.width, window.innerHeight / rect.height) * 1.5;

    // Phase 1 Detach: fix the card in place at its current screen position
    setDiveBoxStyle({
      position: 'fixed',
      top: rect.top + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      zIndex: 9999,
      borderRadius: '24px',
      transition: 'none',
    });

    // Fix the background layer at full opacity before the transition starts
    setBgStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: 9998, 
      transformOrigin: `${originX}px ${originY}px`,
      transform: 'scale(1)',
      opacity: 1, 
      transition: 'none',
      pointerEvents: 'none',
    });

    // Phase 2 Morph: double-rAF ensures the browser has painted the initial state first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Expand the card to fill the entire viewport
        setDiveBoxStyle({
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          borderRadius: '0px',
          transition: 'all 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
        });

        // Scale the background outward from the vanishing point
        setBgStyle({
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          transformOrigin: `${originX}px ${originY}px`,
          transform: `scale(${zoomFactor})`,
          opacity: 1,
          transition: 'all 1.2s cubic-bezier(0.65, 0, 0.35, 1)',
          pointerEvents: 'none',
        });
      });
    });

    // Phase 3 Reset: restore original state just before the CSS transition ends
    setTimeout(() => {
      setIsDiving(false);
      setDiveBoxStyle({});
      setBgStyle({}); 
    }, 1190);
  };

  return (
    <div className="relative min-h-[150px] desk:min-h-0 w-full h-full">
      
      {/* Portal: renders the dive animation outside the scaled container so it fills the true viewport. */}
      {isDiving && screenshotUrl && typeof document !== 'undefined' && createPortal(
        <>
          {/* Full-viewport background layer that zooms outward from the vanishing point */}
          <div style={bgStyle}>
            <img src={screenshotUrl} alt="background dive" className="w-full h-full object-cover object-top" />
          </div>

          {/* Card clone that morphs to fill the entire screen during the dive transition */}
          <div className="fixed overflow-hidden shadow-2xl" style={{
            ...diveBoxStyle,
            backgroundImage: `
              linear-gradient(rgba(44, 62, 80, 0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(44, 62, 80, 0.06) 1px, transparent 1px),
              linear-gradient(rgba(44, 62, 80, 0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(44, 62, 80, 0.025) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
            backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px'
          }}>
            <img src={screenshotUrl} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
          </div>
        </>,
        document.body
      )}

      {/* Original card in the grid hidden during the dive so the portal clone occupies its visual space */}
      <div
        ref={boxRef}
        onClick={triggerDive}
        className={`absolute inset-0 cursor-pointer group overflow-hidden transition-all duration-500 rounded-3xl border-2 border-[#2c3e50] shadow-lg ${
          isDiving ? 'opacity-0' : 'opacity-100 hover:-translate-y-1'
        }`}
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
      >
        {screenshotUrl && (
          <img 
            src={screenshotUrl} 
            alt="" 
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            draggable={false} 
            onLoad={() => setIsLoaded(true)} 
          />
        )}

        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px]">
            {/* Viewfinder Corners */}
            <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-[#2c3e50]/30 rounded-tl-sm" />
            <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-[#2c3e50]/30 rounded-tr-sm" />
            <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-[#2c3e50]/30 rounded-bl-sm" />
            <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-[#2c3e50]/30 rounded-br-sm" />
            
            {/* Animated Aperture / Focus Symbol */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 border border-[#2c3e50]/10 rounded-full animate-[ping_3s_infinite]" />
              <div className="absolute w-12 h-12 border-2 border-[#2c3e50]/20 rounded-full animate-[pulse_2s_infinite]" />
              <Sparkles className="text-[#2c3e50]/40" size={32} />
            </div>

            <div className="mt-8 flex flex-col items-center gap-1">
              <span className="text-[#2c3e50]/60 text-[10px] font-bold tracking-[0.4em] uppercase">
                Developing...
              </span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 h-1 bg-[#2c3e50]/40 rounded-full animate-bounce" 
                    style={{ animationDelay: `${i * 0.2}s` }} 
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hover overlay: dive prompt label, suppressed while the animation is running */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: isDiving ? 0 : 1 }}>
          <span className="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-md text-[#ffffff] font-mono text-[11px] px-4 py-2 rounded-full border border-[#2c3e50]/20 shadow-lg font-bold tracking-widest transition-opacity duration-300">
            [ CLICK TO DIVE ]
          </span>
        </div>
      </div>
      
    </div>
  );
};

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

  // --- Storytelling card: QR code stop-motion zoom and wobble effect ---
  const [qrHovered, setQrHovered] = useState(false);
  const [qrState, setQrState] = useState({ frame: 0, tick: 0 });

  // Animate toward the target frame (4 on hover, 0 on leave); re-triggers when hover state changes
  useEffect(() => {
    const target = qrHovered ? 4 : 0;
    const id = setInterval(() => {
      setQrState(prev => {
        let nextFrame = prev.frame;
        if (prev.frame < target) nextFrame++;
        else if (prev.frame > target) nextFrame--;
        return { frame: nextFrame, tick: prev.tick + 1 };
      });
    }, 120); 
    return () => clearInterval(id);
  }, [qrHovered]);

  // Progressive scale values per frame final size deliberately overshoots then settles for punch
  const qrScales = [1, 1.8, 2.8, 4.2, 4];
  
  // Wobble runs only during the transition frames; stabilizes once fully zoomed in (frame 4)
  const isWobbling = (qrHovered || qrState.frame > 0) && qrState.frame < 4;
  
  const qrWobbleRot = isWobbling ? (qrState.tick % 2 === 0 ? 3 : -3) : 0;
  const qrWobbleX = isWobbling ? (qrState.tick % 2 === 0 ? 1 : -1) : 0;
  const qrWobbleY = isWobbling ? (qrState.tick % 3 === 0 ? 1 : -1) : 0;

  // Shared texture styles for the storytelling card surfaces
  const cardBackgroundStyle = {
    backgroundColor: "#fffbf0",
    backgroundImage: "url('/texture.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "400px",
    backgroundBlendMode: "multiply" as const,
  };

  const envelopeFlapStyle = {
    backgroundColor: "#fdf6e3",
    backgroundImage: "url('/enveloppe.png')",
    backgroundRepeat: "repeat",
    backgroundSize: "500px",
    backgroundBlendMode: "multiply" as const,
  };

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
        <header className="flex-none mb-6 mt-2 desk:mt-0 [@media(max-height:610px)]:hidden">
          <h1 className="text-3xl font-black uppercase tracking-tight leading-none">Kylian Malartre</h1>
          <p className="text-lg font-medium opacity-70 mt-1">Computer Science Student at the University of Bordeaux</p>
        </header>

        {/* Bento grid: horizontal scroll (2-row) on mobile, 4-column dense layout on desktop */}
        <div 
          className="flex-1 grid content-center desk:content-stretch grid-rows-[200px_200px] grid-flow-col desk:grid-rows-4 desk:grid-flow-dense desk:grid-cols-4 gap-4 mt-2 desk:mt-0 pb-6 desk:pb-0 overflow-x-auto desk:overflow-visible overflow-y-hidden snap-x auto-cols-[230px] desk:auto-cols-auto -mx-4 px-4 desk:mx-0 desk:px-0"
        >

          <IdentityCard />

          <MailboxCard />

          <KlipSchedulerCard />

          <KlipMachineCard />

          <NetPuzzleCard />

          <TerminalCard />

          <GithubCard />

          {/* --- [H] Storytelling card Valentine letter with envelope and QR seal --- */}
          <div className="group rounded-3xl border-2 border-[#2c3e50] min-h-[200px] desk:min-h-0 col-span-2 order-8 desk:order-none flex flex-col relative shadow-sm z-10 hover:z-50">
            
            {/* Background container: clips the texture and stickers within the card bounds */}
            <div className="absolute inset-0 rounded-[22px] overflow-hidden pointer-events-none -z-10" style={cardBackgroundStyle}>
              {/* Decorative flower stickers */}
              <div className="absolute inset-0 z-0">
                <MiniSticker src="/flower5.png" pos={{ top: "4%", left: "26%", scale: 0.9 }} />
                <MiniSticker src="/flower.png" pos={{ top: "50%", left: "-5%", scale: 1.0 }} />
                <MiniSticker src="/flower3.png" pos={{ top: "1%", left: "89%", scale: 0.9 }} />
                <MiniSticker src="/flower4.png" pos={{ top: "70%", left: "30%", scale: 1.1 }} />
                <MiniSticker src="/flower6.png" pos={{ top: "80%", left: "70%", scale: 0.85 }} />

                <MiniSticker src="/flower.png" pos={{ top: "0%", left: "55%", scale: 1.0 }} />
                <MiniSticker src="/flower6.png" pos={{ top: "35%", left: "35%", scale: 0.85 }} />
                <MiniSticker src="/flower4.png" pos={{ top: "60%", left: "90%", scale: 1.2 }} />
                <MiniSticker src="/flower5.png" pos={{ top: "-3%", left: "-3%", scale: 0.8 }} />
                <MiniSticker src="/flower3.png" pos={{ top: "80%", left: "5%", scale: 0.9 }} />
              </div>
            </div>

            {/* SVG displacement filters: strong for text, lite for the QR code */}
            <svg className="absolute w-0 h-0">
              <defs>
                {/* Strong pencil filter for text and borders */}
                <filter id="pencil-filter">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5" result="noise" />
                  <feGaussianBlur in="noise" stdDeviation="2.5" result="smoothedNoise" />
                  <feDisplacementMap in="SourceGraphic" in2="smoothedNoise" scale="5" xChannelSelector="R" yChannelSelector="G" />
                </filter>

                {/* Lite pencil filter for the QR low displacement preserves scannability */}
                <filter id="pencil-filter-lite">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="5" result="noise" />
                  <feGaussianBlur in="noise" stdDeviation="1.5" result="smoothedNoise" />
                  <feDisplacementMap in="SourceGraphic" in2="smoothedNoise" scale="1" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
            </svg>

            {/* Main content: title, description, and interactive envelope */}
            <div className="relative z-10 p-5 flex flex-row items-center justify-between h-full gap-8">
              
              <div className={`flex-shrink-0 ${handwrittenFont.className}`}>
                <h3 className="text-[40px] text-[#2c3e50] leading-none" style={{ filter: "url(#pencil-filter)" }}>St. Valentin</h3>
                <p className="text-[25px] text-rose-500 mt-[-8px]" style={{ filter: "url(#pencil-filter)" }}>Interactive Letter</p>
                <div className="mt-2 bg-white/40 border border-[#5a4a42]/20 rounded-lg p-2 backdrop-blur-sm font-mono text-[10px]">
                   <p className="text-[#5a4a42]">AD: STOP-MOTION/DRAW</p>
                   <p className="text-[#5a4a42]">TARGET: MOBILE-ONLY</p>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <div tabIndex={0} className="relative w-[250px] h-[135px] group/env hover:rotate-5 focus:rotate-5 transition-none cursor-pointer focus:outline-none">
                  
                  {/* Envelope body (folded flaps built with clip-path) */}
                  <div className="absolute inset-0 rounded-sm shadow-lg z-0" style={{ ...envelopeFlapStyle, backgroundColor: "#e0cda8" }} />
                  <div className="absolute inset-0 z-20" style={{ ...envelopeFlapStyle, clipPath: "polygon(0 0, 0% 100%, 50% 50%)" }} />
                  <div className="absolute inset-0 z-20" style={{ ...envelopeFlapStyle, clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }} />
                  <div className="absolute inset-0 z-30" style={{ ...envelopeFlapStyle, clipPath: "polygon(0 100%, 100% 100%, 50% 50%)" }} />

                  {/* Hand-drawn envelope outlines via SVG pencil filter */}
                  <svg className="absolute inset-0 w-full h-full z-30 pointer-events-none" viewBox="0 0 250 135">
                    <g style={{ filter: "url(#pencil-filter)" }} stroke="#5a4a42" strokeWidth="2" fill="none">
                      <rect x="2" y="2" width="246" height="131" rx="3" />
                      <path d="M 2 133 L 125 67 L 248 133" />
                    </g>
                  </svg>

                  {/* Top flap slightly darker fill for contrast against the body */}
                  <div className="absolute inset-0 z-40" style={{ ...envelopeFlapStyle, backgroundColor: "#e4d8c0", clipPath: "polygon(0 0, 100% 0, 50% 55%)" }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 250 135">
                        {/* V-notch path heavier stroke survives the displacement filter without breaking apart */}
                        <path style={{ filter: "url(#pencil-filter)" }} stroke="#5a4a42" strokeWidth="7" fill="none" d="M 2 2 L 125 74 L 248 2" />
                        
                        {/* Top edge path lighter stroke cleanly closes the envelope outline */}
                        <path style={{ filter: "url(#pencil-filter)" }} stroke="#5a4a42" strokeWidth="4" fill="none" d="M 2 -3 Q 125 4.5 248 3" />
                    </svg>
                  </div>

                  {/* Interactive QR code seal zooms in on hover, links to margaux.love on mobile */}
                  <div 
                    onPointerEnter={(e) => { 
                      if (window.innerWidth >= 768 || e.pointerType === 'mouse') setQrHovered(true); 
                    }}
                    onPointerLeave={(e) => { 
                      if (window.innerWidth >= 768 || e.pointerType === 'mouse') setQrHovered(false); 
                    }}
                    onClick={() => {
                      // Below 768 px, scanning a zoomed QR code is impractical; redirect directly instead.
                      if (window.innerWidth < 768) {
                        setQrHovered(false); 
                        window.location.href = 'https://margaux.love';
                      }
                    }}
                    className="absolute z-50 cursor-pointer flex flex-col items-center"
                    style={{ 
                      top: "55%", left: "50%", 
                      transform: `translate(calc(-50% + ${qrWobbleX}px), calc(-50% + ${qrWobbleY}px)) scale(${qrScales[qrState.frame]}) rotate(${qrWobbleRot}deg)`,
                      transition: 'none' 
                    }}
                  >
                    {/* Layered structure: filtered border + crisp unfiltered QR image */}
                    <div className="relative w-14 h-14 shadow-md rounded">
                      
                      {/* Layer 1: white background and hand-drawn border (strong filter) */}
                      <div 
                        className="absolute inset-0 bg-white border-2 border-[#5a4a42] rounded"
                        style={{ filter: "url(#pencil-filter)" }} 
                      />
                      
                      {/* Layer 2: crisp QR image clipped inside the border (no filter applied) */}
                      <div className="absolute inset-[2px] overflow-hidden bg-white rounded-sm flex items-center justify-center">
                        <img 
                          src="/qrcode.svg" 
                          alt="QR Code St Valentin" 
                          className="w-full h-full object-cover"
                          style={{ 
                            transform: 'scale(1.06)' 
                          }} 
                        />
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

         {/* --- [F] Inception / Droste effect card (hidden on mobile) --- */}
          <div className="hidden desk:block">
            <InceptionCase />
          </div>


        </div>
      </div>
    </main>
  );
}

