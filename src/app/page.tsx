'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Terminal, Bot, Layout, Code2, Github, Gamepad2, Sparkles, ChevronLeft, ChevronRight, Download, Mic, Wand2, Video, Scissors, Calendar, Database, Clock, Upload, Zap, MousePointer } from 'lucide-react';
import localFont from 'next/font/local';
import { createPortal } from 'react-dom';

// Pixel art display font (used for game-card titles)
const pixelFont = localFont({ 
  src: './fonts/PixelFont.ttf', 
  variable: '--font-pixel' 
});

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
 * Animated ASCII network activity trace for the terminal card.
 * Rotates RX/TX block-character strings to simulate live packet flow.
 *
 * Returns:
 *   A decorative RX/TX readout element with a continuous character rotation.
 */
const NetworkTrace = () => {
  const [rx, setRx] = useState("▄▅▃▂▅▇▄▃");
  const [tx, setTx] = useState("▂▃▅▇▃▂▄▅");

  useEffect(() => {
    const id = setInterval(() => {
      setRx(prev => {
        const chars = Array.from(prev);
        return chars.slice(1).join('') + chars[0];
      });
      setTx(prev => {
        const chars = Array.from(prev);
        return chars.slice(1).join('') + chars[0];
      });
    }, 100); 
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col text-emerald-500/40 leading-tight">
       <span className="tracking-widest">RX: {rx}</span>
       <span className="tracking-widest">TX: {tx}</span>
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
        {/* On gèle le temps : plus aucune animation ne s'exécute pour le robot */}
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
        className={`absolute inset-0 cursor-pointer group overflow-hidden transition-all duration-500 rounded-3xl ${
          screenshotUrl ? 'border-2 border-[#2c3e50] shadow-lg opacity-100' : 'opacity-0'
        } ${isDiving ? 'opacity-0' : 'hover:-translate-y-1'}`}
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
        {screenshotUrl ? (
          <img src={screenshotUrl} alt="" className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex flex-col items-center opacity-30">
               <Terminal className="text-[#2c3e50] mb-2" size={24} />
               <span className="text-[#2c3e50] text-[8px] font-mono tracking-widest font-bold">CAPTURING...</span>
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
  const projects = [
    { 
      name: 'kln-portfolio', 
      desc: 'Interactive personal portfolio', 
      tags: 'Next.js • TypeScript • Tailwind', 
      stars: 4, 
      url: 'https://github.com/kln-mltre/kln-portfolio' 
    },
    { 
      name: 'KlipScheduler', 
      desc: 'Full automation of TikTok clip scheduling & publishing', 
      tags: 'Python • Playwright • UNIX Signals', 
      stars: 5, 
      url: 'https://github.com/kln-mltre/KlipScheduler' 
    },
    { 
      name: 'KlipMachine', 
      desc: 'AI-powered viral TikTok clip generator', 
      tags: 'Python • Whisper AI • FFmpeg', 
      stars: 3, 
      url: 'https://github.com/kln-mltre/KlipMachine' 
    },
    { 
      name: 'net-a22', 
      desc: 'Logic puzzle game built with SDL', 
      tags: 'C • SDL • Algorithms', 
      stars: 4, 
      url: 'https://github.com/kln-mltre/net-a22' 
    },
    { 
      name: 'margaux-love-letter', 
      desc: 'Interactive stop-motion love letter', 
      tags: 'React • Next.js • Tailwind', 
      stars: 3, 
      url: 'https://github.com/kln-mltre/margaux-love-letter' 
    },
  ];

  // --- GitHub carousel state and navigation ---
  const [currentProject, setCurrentProject] = useState(0);

  /** Advances the GitHub carousel to the next project (wraps around). */
  const nextProject = () => setCurrentProject((prev) => (prev + 1) % projects.length);
  /** Moves the GitHub carousel to the previous project (wraps around). */
  const prevProject = () => setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);

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

  // --- Terminal card state (uptime counter, system data) ---
  const [uptime, setUptime] = useState(0);
  const [pid] = useState(() => Math.floor(Math.random() * 8000) + 1000);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  /**
   * Formats a duration in seconds as MM:SS with zero-padding.
   *
   * Args:
   *   seconds: Total elapsed seconds.
   *
   * Returns:
   *   Formatted time string (e.g., "02:37").
   */
  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [sysData, setSysData] = useState({
    ip: "FETCHING...",
    isp: "SCANNING...",
    net: "DETECTING...",
    sys: "ANALYZING..."
  });

  useEffect(() => {
    // Measures round-trip latency with a double HEAD request (first warms the connection)
    const calculatePing = async () => {
      try {
        const targetUrl = `/?t=${new Date().getTime()}`;
        await fetch(targetUrl, { method: 'HEAD', cache: 'no-store' });
        const start = performance.now();
        await fetch(targetUrl, { method: 'HEAD', cache: 'no-store' });
        const end = performance.now();
        return Math.round(end - start);
      } catch (e) {
        return null;
      }
    };

    // Fetches visitor IP data with session caching and a fallback API
    const fetchIpData = async () => {
    const cachedData = sessionStorage.getItem('sysIpData');
    if (cachedData) return JSON.parse(cachedData);

    try {
      const res = await fetch('https://ipinfo.io/json');
      if (!res.ok) throw new Error("Rate limit");
      const data = await res.json();
      sessionStorage.setItem('sysIpData', JSON.stringify(data));
      return data;
    } catch (e) {
        try {
          // Fallback: ipapi.co when ipinfo.io rate-limits or fails
          const res2 = await fetch('https://ipapi.co/json/');
          return await res2.json();
        } catch (e2) {
          return {}; // Graceful degradation: ad-blockers or offline
        }
      }
    };

    // Run IP lookup and ping measurement concurrently
    Promise.all([
      fetchIpData(),
      calculatePing()
    ]).then(([ipData, measuredPing]) => {
      // --- IP & ISP ---
      const ip = ipData.ip || "127.0.0.1";
      let isp = "UNKNOWN ISP";
      
      if (ipData.org) {
        // Strip the "AS<number> " prefix that ipinfo.io prepends to the ISP name
        isp = ipData.org.replace(/^AS\d+\s/, '').toUpperCase();
      }

      // --- Network & Ping ---
      const nav = navigator as any;
      const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
      let type = "WIFI/LAN"; 
      
      if (conn && conn.effectiveType) {
        type = conn.effectiveType.toUpperCase();
      }

      let finalPing = "42ms";
      if (measuredPing) {
        finalPing = `${measuredPing}ms`;
      } else if (conn && conn.rtt) {
        finalPing = `${conn.rtt}ms`;
      }

      // --- OS & Browser detection ---
      const ua = navigator.userAgent;
      let os = "UNIX";
      if (ua.includes("Win")) os = "WINDOWS";
      if (ua.includes("Mac")) os = "MACOS";
      if (ua.includes("Linux")) os = "LINUX";
      
      let browser = "WEBKIT";
      if (ua.includes("Firefox")) browser = "FIREFOX";
      else if (ua.includes("Edg")) browser = "EDGE";
      else if (ua.includes("Chrome")) browser = "CHROME";
      else if (ua.includes("Safari")) browser = "SAFARI";

      setSysData({ 
        ip, 
        isp,
        net: `${type} / ${finalPing}`,
        sys: `${os} [${browser}]`
      });
    });
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
          {/* --- [A] Identity badge card Polaroid-style with animated photo and barcode --- */}
          <div className="relative rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-[#5b0a0a] to-[#3d0707] min-h-[420px] desk:min-h-0 row-span-2 order-1 desk:order-none flex flex-col overflow-hidden shadow-lg">
            
            {/* Punch hole decoration */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-[#fdf6e3] rounded-full border-2 border-[#2c3e50] z-20 shadow-inner" />

            {/* Text content layer */}
            <div className="flex-1 flex flex-col px-6 pt-14 pb-2 relative z-30 pointer-events-none">
              
              <div className="relative">
                <h2 className="text-3xl desk:text-4xl font-black uppercase text-white leading-none tracking-tight">Kylian</h2>
                <p className="text-base font-semibold text-[#f2e8d5] mt-1 italic opacity-90">Full-stack Explorer</p>
              </div>

              {/* Skills list */}
              <ul className="space-y-1.5 mt-3 w-3/4">
                {[
                  'Creative Front-end', 
                  'Low-level & System', 
                  'AI & Automation'
                ].map((tag) => (
                  <li key={tag} className="text-[12px] font-bold text-white/90 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#f2e8d5]" />
                    {tag}
                  </li>
                ))}
              </ul>
                
              {/* Decorative chip module (smart card aesthetic) */}
              <div className="absolute top-13.5 right-4 desk:top-14.5 desk:right-6 w-10 h-8 rounded-md bg-gradient-to-br from-[#c5a36e] to-[#a88a54] border border-black/20 p-1 flex items-center justify-center shadow-inner opacity-90 z-40">
                <div className="w-full h-full border border-black/10 rounded-sm grid grid-cols-2 grid-rows-3 gap-0.5 opacity-50">
                  {[...Array(6)].map((_, i) => <div key={i} className="border-[0.5px] border-black/20" />)}
                </div>
              </div>

              {/* Handwritten signature overlay */}
              <div className="absolute bottom-[10px] left-[-7px] desk:bottom-[10px] desk:left-[-3px] h-28 w-28 brightness-125">
                <img 
                  src="/signature.png" 
                  alt="Signature" 
                  className="h-full w-full object-contain object-left opacity-70" 
                />
              </div>
            </div>

            {/* Polaroid photo with hover lift and shine effect */}
            <div tabIndex={0} className="absolute bottom-4 right-3 desk:right-4 z-10 group cursor-pointer focus:outline-none">
              <div className="bg-[#fdf6e3] p-1.5 pb-6 shadow-2xl rotate-3 transform transition-all group-hover:rotate-1 group-focus:rotate-1 group-hover:-translate-y-4 group-focus:-translate-y-4 duration-500 overflow-hidden relative">
                
                <div className="w-24 h-auto border-2 border-[#2c3e50]/10 overflow-hidden relative z-10">
                   <img src="/PP.png" alt="Kylian" className="w-full h-full object-cover" />
                </div>
                
                {/* Glossy shine sweep on hover/focus */}
                <div className="absolute -inset-full z-20 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-[60%] group-hover:translate-x-[60%] group-focus:translate-x-[60%] transition-transform duration-700 pointer-events-none" />
              </div>
            </div>

            {/* Card footer barcode and serial ID */}
            <div className="bg-gradient-to-r from-[#f2e8d5] to-[#eaddcf] rounded-b-3xl px-6 py-2.5 border-t-2 border-[#2c3e50] relative z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.2)] flex items-center justify-between">
              
              {/* Barcode graphic */}
              <div className="flex items-center h-5 opacity-80">
                {[2,2,2,1,3,1,1,2,3,1,2,1,1,3,1,2,2,1,1,3,2,1,1,2,1,3,1,2,1,1,2,3,1,1,2,1,3,2].map((w, i) => (
                  <div key={i} className={i % 2 === 0 ? 'bg-[#3d0707]' : 'bg-transparent'} style={{ width: `${w}px`, height: '100%', flexShrink: 0 }} />
                ))}
              </div>

              <span className="text-[10px] font-black text-[#3d0707] tracking-widest font-mono mt-0.5">
                KM-2005-026
              </span>
              
            </div>

          </div>

          {/* --- [B] Contact card 3D mailbox with flag and interactive letter --- */}
          <div tabIndex={0} className="group relative rounded-4xl border-2 border-[#2c3e50] bg-gradient-to-br from-[#681212] to-[#450505] min-h-[150px] desk:min-h-0 overflow-visible shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] cursor-pointer z-10 hover:z-50 focus:z-50 perspective-[1000px] order-2 desk:order-none focus:outline-none">
            
            {/* Inner door groove decoration */}
            <div className="absolute inset-2 border border-black/30 rounded-3xl shadow-[0_1px_0_rgba(255,255,255,0.1)] pointer-events-none z-0"></div>

            {/* 3D mailbox flag pivots backward on hover via rotateX with strong perspective */}
            <div className="absolute bottom-[75%] -right-[10px] w-4 h-34 z-0 flex flex-col items-center pointer-events-none" style={{ perspective: '400px' }}>
               
               {/* Metal pivot base */}
               <div className="absolute bottom-0 w-[10px] h-6 -right-[-2px] bg-gradient-to-r from-gray-400 to-gray-600 rounded-sm shadow-[-1px_0_2px_rgba(0,0,0,0.8)] z-20 flex flex-col items-center justify-around py-0.5 border border-gray-800 -translate-x-0.5">
                 <div className="w-1 h-1 bg-black/80 rounded-full shadow-inner"></div>
                 <div className="w-1 h-1 bg-black/80 rounded-full shadow-inner"></div>
               </div>
               
               {/* Flag arm rotates from bottom hinge, slight Y-axis tilt reveals depth */}
               <div 
                 className="absolute bottom-2 w-2 h-16 bg-[#bb0707] origin-bottom transition-all duration-700 ease-in-out z-10 rounded-t-sm border border-[#a11d27] group-hover:[transform:rotateX(75deg)_rotateY(-15deg)] group-focus:[transform:rotateX(75deg)_rotateY(-15deg)]"
                 style={{ transformStyle: 'preserve-3d' }}
               >
                  {/* Dynamic drop shadow (removed on hover) */}
                  <div className="absolute inset-0 shadow-[4px_2px_4px_rgba(0,0,0,0.4)] group-hover:shadow-none group-focus:shadow-none transition-shadow duration-700"></div>
                  {/* Flag plate */}
                  <div className="absolute top-0 left-0 w-8 h-5 bg-[#bb0707] rounded-r-sm border-t border-r border-b border-[#a11d27]"></div>
               </div>
            </div>

            {/* Realistic mailbox slot and awning decoration */}
            <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[75%] h-14 z-0 flex flex-col items-center">
              <div className="w-[102%] h-2.5 bg-gradient-to-b from-[#7a1515] to-[#5b0a0a] rounded-t-sm shadow-[0_4px_6px_rgba(0,0,0,0.4)] z-10 border-t border-white/10"></div>
              <div className="w-full h-11 bg-[#4a0808] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] rounded-b-sm border border-black/20 flex items-center justify-center">
                 <div className="w-[90%] h-3.5 bg-[#110101] rounded-full shadow-[inset_0_5px_5px_rgba(0,0,0,1)] border-b border-white/10"></div>
              </div>
            </div>

            {/* Lock */}
            <div className="absolute bottom-14 inset-x-5 flex items-center justify-between z-0 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 border border-gray-500 shadow-[0_2px_5px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center justify-center relative">
                 <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-600 to-gray-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    <div className="w-1 h-3.5 bg-black/90 rounded-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"></div>
                 </div>
              </div>

              {/* Address label plate */}
              <div className="w-[50%] max-w-[110px] h-9 bg-gradient-to-b from-gray-300 to-gray-500 rounded-sm shadow-[0_2px_4px_rgba(0,0,0,0.5)] p-[2px] flex items-center justify-center">
                <div className="w-full h-full bg-[#ebd5b3] shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden">
                   <span className="text-[10px] font-sans font-semibold text-gray-800 tracking-tight">Mr. Malartre</span>
                   <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Interactive letter that unfolds on hover to reveal contact info */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-0 overflow-visible z-10 pointer-events-none">
              
              {/* Visible paper edge (peek) */}
              <div 
                className="bg-white rounded-t-sm shadow-[0_-2px_10px_rgba(0,0,0,0.3)] h-3 relative z-10 border-b border-gray-200 w-[55%] transition-all duration-500 group-hover:w-[85%] group-focus:w-[89%]"
                style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 9px, #e5e7eb 9px, #e5e7eb 10px)' }}
              ></div>
              
              {/* Unfolding letter body */}
              <div 
                className="bg-white shadow-xl origin-top transition-all duration-500 ease-out overflow-hidden rounded-b-sm max-h-2 scale-y-0 w-[45%] group-hover:max-h-[160px] group-focus:max-h-[200px] group-hover:scale-y-100 group-focus:scale-y-100 group-hover:w-[85%] group-focus:w-[89%] relative pointer-events-auto"
                style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 9px, #e5e7eb 10.7px, #e5e7eb 10px)' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 opacity-50"></div>
                <div className="pt-2 pb-4 flex flex-col items-center justify-center relative z-10">
                  <Mail className="mb-2 text-red-500" size={26} />
                  <p className="text-[17px] mt-[-4px] font-bold text-gray-800 leading-tight">Contact</p>
                  <p className="text-[14px] font-semibold text-gray-600 mt-1">kylian.malartre@gmail.com</p>
                </div>
              </div>
            </div>

          </div>

          {/* --- [C] KlipScheduler card TikTok automation pipeline visualization --- */}
          <div tabIndex={0} className="group rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pl-3 pr-4 pt-2.5 pb-4 min-h-[200px] desk:min-h-0 col-span-2 order-4 desk:order-none flex flex-col overflow-hidden shadow-lg relative cursor-pointer focus:outline-none">
            {/* Header */}
            <div className="flex items-center gap-2 mb-0 pt-3 pl-2 pr-2 flex-none">
              <Terminal className="text-amber-400 flex-shrink-0" size={22} />
              <h3 className="font-bold text-lg text-white leading-tight">KlipScheduler</h3>
              <span className="ml-auto text-[10px] text-slate-300 font-mono leading-tight text-right">Automatically schedules and publishes<br/>clips on TikTok</span>
            </div>

            {/* Four-stage pipeline: Calendar → SQLite → Worker → TikTok Driver */}
            <div className="flex-1 flex items-center justify-between relative pt-[-15px]">
              {/* Step 1 - Calendar */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-full max-w-[110px] rounded-lg border-2 border-amber-500/40 bg-amber-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-amber-400/70 group-focus:border-amber-400/70 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] group-focus:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-500">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  <Calendar className="text-amber-400 mb-1.5 relative z-10" size={20} />
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider relative z-10">Calendar</span>
                  <span className="text-[9px] text-amber-500/90 font-mono relative z-10">Date & Desc</span>
                  <span className="text-[9px] text-amber-600/80 font-mono relative z-10">Schedule</span>
                </div>
              </div>

              {/* Wire 1↔2 : Calendar ⇄ SQLite */}
              <div className="flex flex-col gap-[8px] justify-center flex-1 min-w-[10px]">
                {/* → Cal→SQLite */}
                <div className="w-full h-[1.5px] bg-amber-700 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent" style={{ animation: 'electricPulse 2s ease-in-out infinite' }} />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-500 leading-none" style={{ fontSize: '5px' }}>▶</span>
                </div>
                {/* ← SQLite→Cal */}
                <div className="w-full h-[1px] bg-sky-800/60 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/70 to-transparent" style={{ animation: 'electricPulseReverse 2s ease-in-out infinite 1s' }} />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-sky-500/70 leading-none" style={{ fontSize: '5px' }}>◀</span>
                </div>
              </div>

              {/* Step 2 - SQLite DB */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-full max-w-[110px] rounded-lg border-2 border-sky-500/40 bg-sky-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-sky-400/70 group-focus:border-sky-400/70 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] group-focus:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all duration-500">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  <Database className="text-sky-400 mb-1.5 relative z-10" size={20} />
                  <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider relative z-10">SQLite</span>
                  <span className="text-[9px] text-sky-500/90 font-mono relative z-10">Video DB</span>
                </div>
              </div>

              {/* Wire 2↔3 : SQLite ⇄ Worker */}
              <div className="flex flex-col gap-[8px] justify-center flex-1 min-w-[10px]">
                {/* → SQLite→Worker */}
                <div className="w-full h-[1.5px] bg-sky-700 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent" style={{ animation: 'electricPulse 2s ease-in-out infinite 0.5s' }} />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sky-500 leading-none" style={{ fontSize: '5px' }}>▶</span>
                </div>
                {/* ← Worker→SQLite */}
                <div className="w-full h-[1px] bg-rose-800/60 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400/70 to-transparent" style={{ animation: 'electricPulseReverse 2s ease-in-out infinite 1.5s' }} />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-rose-500/70 leading-none" style={{ fontSize: '5px' }}>◀</span>
                </div>
              </div>

              {/* Step 3 - Worker */}
              <div className="flex flex-col items-center flex-shrink-0 relative">
                <div className="w-full max-w-[110px] rounded-lg border-2 border-rose-500/40 bg-rose-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-rose-400/70 group-focus:border-rose-400/70 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] group-focus:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all duration-500">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(244,63,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  <Clock className="text-rose-400 mb-1.5 relative z-10" size={20} />
                  <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider relative z-10">Worker</span>
                  <span className="text-[9px] text-rose-600/80 font-mono relative z-10">24/7</span>
                </div>
              </div>

              {/* Wire 3↔4 : Worker ⇄ Driver */}
              <div className="flex flex-col gap-[8px] justify-center flex-1 min-w-[10px]">
                {/* → Worker→Driver */}
                <div className="w-full h-[1.5px] bg-rose-700 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-400 to-transparent" style={{ animation: 'electricPulse 2s ease-in-out infinite 1s' }} />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 text-rose-500 leading-none" style={{ fontSize: '5px' }}>▶</span>
                </div>
                {/* ← Driver→Worker */}
                <div className="w-full h-[1px] bg-fuchsia-800/60 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fuchsia-400/70 to-transparent" style={{ animation: 'electricPulseReverse 2s ease-in-out infinite 1s' }} />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 text-fuchsia-500/70 leading-none" style={{ fontSize: '5px' }}>◀</span>
                </div>
              </div>

              {/* Step 4 - TikTok Driver */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-full max-w-[110px] rounded-lg border-2 border-fuchsia-500/40 bg-fuchsia-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-fuchsia-400/70 group-focus:border-fuchsia-400/70 group-hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] group-focus:shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all duration-500">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  <Upload className="text-fuchsia-400 mb-1 relative z-10" size={20} />
                  <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider relative z-10">Driver</span>
                  <span className="text-[9px] text-fuchsia-500/90 font-mono relative z-10">bioMouse</span>
                  <span className="text-[9px] text-fuchsia-600/80 font-mono relative z-10">Playwright</span>
                </div>
              </div>

              {/* Dashed SIGUSR1 signal line from Calendar to Worker (runs below the cards) */}
              <svg className="absolute pointer-events-none overflow-visible" style={{ bottom: '-6%', left: '19%', width: '41%', height: '25%' }} viewBox="0 0 200 30" fill="none" preserveAspectRatio="none">
                <path d="M 0,6 Q 155,24 200,2" stroke="rgba(245,158,11,0.4)" strokeWidth="1.5" strokeDasharray="5 4" fill="none" />
                <text x="120" y="28" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="rgba(245,158,11,0.7)" letterSpacing="1">SIGUSR1</text>
              </svg>
            </div>
          </div>

          {/* --- [E] KlipMachine card AI clip generation pipeline visualization --- */}
          <div tabIndex={0} className="group rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 min-h-[200px] desk:min-h-0 col-span-2 order-7 desk:order-none flex flex-col overflow-hidden shadow-lg relative cursor-pointer focus:outline-none">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1 flex-none">
              <Scissors className="text-cyan-400" size={22} />
              <h3 className="font-bold text-lg text-white leading-tight">KlipMachine</h3>
              <span className="ml-auto text-[10px] text-slate-300 font-mono leading-tight text-right">AI pipeline to turn YouTube videos<br/>into viral TikTok moments</span>
            </div>

            {/* Three-stage pipeline: Ingestion → Design → Export */}
            <div className="flex-1 flex items-center justify-between">
              {/* Step 1 - Ingestion */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-full max-w-[100px] rounded-xl border-2 border-cyan-500/40 bg-cyan-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-cyan-400/70 group-focus:border-cyan-400/70 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group-focus:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-500">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  
                  {/* Icon */}
                  <Download className="text-cyan-400 mb-1.5 relative z-10" size={20} />
                  
                  {/* Title */}
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider relative z-10 mb-0.5">Ingestion</span>
                  
                  {/* Tech */}
                  <div className="flex items-center gap-1 relative z-10">
                    <span className="text-cyan-500/60" />
                    <span className="text-[9px] text-cyan-500/90 font-mono">Whisper</span>
                  </div>
                  <span className="text-[9px] text-cyan-600/80 font-mono relative z-10">Groq AI</span>
                  
                </div>
              </div>

              {/* Wire 1→2 */}
              <div className="flex items-center justify-center relative flex-1 min-w-[10px]">
                <div className="w-full h-[2px] bg-cyan-800 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{ animation: 'electricPulse 2s ease-in-out infinite' }} />
                </div>
              </div>

              {/* Step 2 - Design */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-full max-w-[130px] rounded-xl border-2 border-violet-500/40 bg-violet-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-violet-400/70 group-focus:border-violet-400/70 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] group-focus:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-500">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  
                  {/* Icon */}
                  <Wand2 className="text-violet-400 mb-1.5 relative z-10" size={20} />
                  
                  {/* Title */}
                  <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider relative z-10 mb-0.5">Design</span>
                  
                  {/* Tech */}
                  <div className="flex items-center gap-1 relative z-10">
                    <span className="text-violet-500/60"/>
                    <span className="text-[9px] text-violet-500/90 font-mono">Crop</span>
                  </div>
                  <span className="text-[9px] text-violet-600/80 font-mono relative z-10">Subtitles</span>
                
                </div>
              </div>

              {/* Wire 2→3 */}
              <div className="flex items-center justify-center relative flex-1 min-w-[10px]">
                <div className="w-full h-[2px] bg-emerald-800 relative overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" style={{ animation: 'electricPulse 2s ease-in-out infinite 0.7s' }} />
                </div>
              </div>

              {/* Step 3 - Export */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="w-full max-w-[130px] rounded-xl border-2 border-emerald-500/40 bg-emerald-950/50 flex flex-col items-center p-3 relative overflow-hidden group-hover:border-emerald-400/70 group-focus:border-emerald-400/70 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] group-focus:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-500">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)', backgroundSize: '8px 8px' }} />
                  
                  {/* Icon */}
                  <Video className="text-emerald-400 mb-1.5 relative z-10" size={20} />
                  
                  {/* Title */}
                  <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider relative z-10 mb-0.5">Export</span>
                  
                  {/* Tech */}
                  <div className="flex items-center gap-1 relative z-10">
                    <span className="text-emerald-500/60" />
                    <span className="text-[9px] text-emerald-500/90 font-mono">FFmpeg</span>
                  </div>
                  <span className="text-[9px] text-emerald-600/80 font-mono relative z-10">1080p</span>

                </div>
              </div>
            </div>
          </div>

          {/* --- [D] Net puzzle game interactive pixel-art grid showcase --- */}
          <div className="relative rounded-3xl border-2 border-[#2c3e50] min-h-[200px] desk:min-h-0 row-span-2 desk:row-span-3 order-6 desk:order-none overflow-hidden shadow-sm group">
            
            {/* Pixel-art background rendering set to nearest-neighbor */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/BACKGROUND.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* Game title (uses the custom pixel font) */}
            <div className={`absolute top-3 desk:top-8 inset-x-0 z-10 flex flex-col items-center justify-center leading-none select-none pointer-events-none ${pixelFont.className}`}>
              <h3 className="text-[34px] desk:text-[38px] text-[#ffffff] uppercase">
                Net Puzzle
              </h3>
            </div>

            {/* Puzzle grid each cell is aspect-square for consistent tile alignment */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full grid grid-cols-4 grid-rows-6 scale-120 translate-y-9 desk:scale-143 desk:translate-y-10 desk:row-scale-143" style={{ gap: 0 }}>
                
                {/* Row 1 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/e90_3 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/e90_3:opacity-0 group-focus/e90_3:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/End180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/e90_3:opacity-100 group-focus/e90_3:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/e90_1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/e90_1:opacity-0 group-focus/e90_1:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/End180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/e90_1:opacity-100 group-focus/e90_1:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 2 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/t1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Tee90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/t1:opacity-0 group-focus/t1:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Tee180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/t1:opacity-100 group-focus/t1:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/c1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Corner270.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/c1:opacity-0 group-focus/c1:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Corner.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/c1:opacity-100 group-focus/c1:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 3 */}
                <div tabIndex={0} className="group/s_bot1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_bot1:opacity-0 group-focus/s_bot1:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_bot1:opacity-100 group-focus/s_bot1:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/t2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Tee270.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/t2:opacity-0 group-focus/t2:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Tee.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/t2:opacity-100 group-focus/t2:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/c2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Corner90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/c2:opacity-0 group-focus/c2:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Corner270.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/c2:opacity-100 group-focus/c2:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/s_top relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_top:opacity-0 group-focus/s_top:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_top:opacity-100 group-focus/s_top:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>

                {/* Row 4 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/s2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s2:opacity-0 group-focus/s2:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s2:opacity-100 group-focus/s2:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/s1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s1:opacity-0 group-focus/s1:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s1:opacity-100 group-focus/s1:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 5 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/s3 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s3:opacity-0 group-focus/s3:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s3:opacity-100 group-focus/s3:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/e90_2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/e90_2:opacity-0 group-focus/e90_2:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/End.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/e90_2:opacity-100 group-focus/e90_2:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 6 */}
                <div tabIndex={0} className="group/s_bot2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_bot2:opacity-0 group-focus/s_bot2:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_bot2:opacity-100 group-focus/s_bot2:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/c3 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Corner270.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/c3:opacity-0 group-focus/c3:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Corner.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/c3:opacity-100 group-focus/c3:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/ep1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/ep1:opacity-0 group-focus/ep1:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/End90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/ep1:opacity-100 group-focus/ep1:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/s_top6 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_top6:opacity-0 group-focus/s_top6:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_top6:opacity-100 group-focus/s_top6:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>

                </div>
            </div>
          </div>

          {/* --- [I] Terminal card live system info with CRT scanline effect --- */}
          <div tabIndex={0} className="group relative rounded-3xl border-2 border-[#2c3e50] bg-[#121212] p-4 min-h-[150px] desk:min-h-0 flex flex-col overflow-hidden shadow-inner font-mono text-[10px] order-3 desk:order-none focus:outline-none cursor-pointer">
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-50" />

            {/* Terminal Header */}
            <div className="flex gap-1.5 mb-[9px] opacity-40 group-hover:opacity-100 transition-opacity flex-none">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Idle state: live system logs and animated network trace */}
            <div className="flex flex-col h-full text-emerald-500/80 group-hover:opacity-0 group-focus:opacity-0 transition-all duration-300 pointer-events-none">
              
              {/* Log header: process ID and live uptime counter */}
              <div className="flex justify-between border-b border-emerald-900/30 pb-1 mb-1.5 flex-none font-bold text-[11px] tracking-tighter">
                <span suppressHydrationWarning>PROC[P:{pid || '----'}]</span>
                <span suppressHydrationWarning>Uptime[{formatUptime(uptime)}]</span>
              </div>
              
              {/* System data readout */}
              <div className="space-y-1 flex-none">
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> IP: {sysData.ip}</p>
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> ISP: {sysData.isp}</p>
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> NET: {sysData.net}</p>
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> OP: {sysData.sys}</p>
              </div>

              {/* Animated network activity trace (pushed to bottom of card) */}
              <div className="mt-auto pt-2 border-t border-emerald-900/30 flex justify-between items-end w-full text-[9px]">
                
                <NetworkTrace />

                {/* Blinking terminal cursor */}
                <span className="animate-pulse text-emerald-400 text-xs font-black">_</span>
              </div>

            </div>
            {/* Hover state: portfolio scan overlay */}
            <div className="absolute inset-x-4 top-9 space-y-1.5 text-cyan-400 opacity-0 scale-95 group-hover:opacity-100 group-focus:opacity-100 group-hover:scale-100 group-focus:scale-100 transition-all duration-300 z-10 pointer-events-none">
              <p className="text-white font-bold bg-cyan-900/40 px-1 w-fit mb-2">PORTFOLIO_SCAN</p>
              <p className="flex justify-between"><span>PROBING:</span> <span className="text-white">kylianmalartre.com</span></p>
              <p className="flex justify-between"><span>FOUND:</span> <span className="text-white text-[9px]">ALL_PROJECTS</span></p>
              <p className="flex justify-between"><span>DETECTED:</span> <span className="text-white text-[9px]">ABSOLUTE_FLOW</span></p>
              <p className="flex justify-between"><span>COPYRIGHT:</span> <span className="text-white text-[9px]">©_KLN_2026</span></p>
              <div className="mt-2 h-1 w-full bg-cyan-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 animate-[electricPulse_1.5s_infinite]" style={{ width: '100%' }} />
              </div>
              <p className="text-[9px] text-center font-bold text-white mt-1">STATUS: OPERATIONAL</p>
            </div>

            {/* Subtle glow overlay on hover */}
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* --- [G] GitHub projects banner carousel with navigation --- */}
          <div className="group rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-gray-900 to-gray-800 p-5 min-h-[150px] desk:min-h-0 col-span-2 order-5 desk:order-none hover:-translate-y-1 transition-transform overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Github className="text-white" size={24} />
                <h3 className="font-bold text-lg text-white leading-tight">GitHub Projects</h3>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={prevProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="text-gray-400 hover:text-white" size={20} />
                </button>
                <button 
                  onClick={nextProject}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                  aria-label="Next project"
                >
                  <ChevronRight className="text-gray-400 hover:text-white" size={20} />
                </button>
              </div>
            </div>

            {/* Project carousel */}
            <a 
              href={projects[currentProject].url || "#"}
              target="_blank"
              rel="noopener noreferrer" 
              className="block bg-gray-800/50 rounded-xl p-2 border border-gray-700 hover:bg-gray-700/60 hover:border-gray-500 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-base">{projects[currentProject].name}</h4>
                  <p className="text-sm text-gray-300 mt-1">{projects[currentProject].desc}</p>
                  <p className="text-xs text-gray-400 mt-2">{projects[currentProject].tags}</p>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm">{projects[currentProject].stars}</span>
                </div>
              </div>
            </a>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {projects.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentProject ? 'w-4 bg-white' : 'w-1.5 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

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

