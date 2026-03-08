import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Terminal, Sparkles } from 'lucide-react';

/**
 * Self-referencing "Droste effect" card that captures a live screenshot
 * of the page and lets the user click to trigger a full-screen dive-in animation.
 * Skips capture when rendered during screenshot mode (?screenshot=1) to avoid recursion.
 *
 * Returns:
 *   An interactive card displaying a live page screenshot with a dive animation on click.
 */
export default function InceptionCase() {
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