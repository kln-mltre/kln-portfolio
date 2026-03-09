import React, { useState, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Self-referencing "Droste effect" card using a static miniature preview
 * and a live DOM-clone dive animation on click.
 *
 * On click it instantly clones the current DOM tree of <main> via cloneNode(true).
 * This preserves all CSS class states (flipped cards, carousel position, etc.)
 * without any image generation or async work — the clone renders in the same document
 * so every stylesheet applies automatically.  Dive animation is immediate (<1ms capture).
 * The clone removes the inception card itself to avoid recursive nesting.
 *
 * Returns:
 *   An interactive card displaying a miniature preview with a dive animation on click.
 */
export default function InceptionCase() {
  const [isDiving, setIsDiving] = useState(false);
  const [isPreDive, setIsPreDive] = useState(false);
  const [isCardHidden, setIsCardHidden] = useState(false);
  const [diveBoxStyle, setDiveBoxStyle] = useState<React.CSSProperties>({});
  const [bgStyle, setBgStyle] = useState<React.CSSProperties>({});
  const [fgInnerStyle, setFgInnerStyle] = useState<React.CSSProperties>({});

  const bgPortalRef = useRef<HTMLDivElement>(null);
  const fgPortalRef = useRef<HTMLDivElement>(null);
  const bgCloneRef = useRef<HTMLElement | null>(null);
  const fgCloneRef = useRef<HTMLElement | null>(null);
  const preDiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(() => {
    return () => {
      if (preDiveTimerRef.current) {
        clearTimeout(preDiveTimerRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isDiving) return;

    const bgHost = bgPortalRef.current;
    const fgHost = fgPortalRef.current;

    if (bgHost && bgCloneRef.current) {
      bgHost.replaceChildren(bgCloneRef.current);
    }

    if (fgHost && fgCloneRef.current) {
      fgHost.replaceChildren(fgCloneRef.current);
    }

    return () => {
      bgHost?.replaceChildren();
      fgHost?.replaceChildren();
    };
  }, [isDiving]);

  // Runs the 3-phase dive animation from card rect to full viewport.
  const startDiveAnimation = (rect: DOMRect) => {
    setIsDiving(true);
    setIsPreDive(false);
    setIsCardHidden(false);
    const DIVE_MS = 1350;
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Scale factor so the background image covers the full viewport when expanded
    const zoomFactor = Math.max(vw / rect.width, vh / rect.height) * 1.5;

    const coverScale = Math.max(rect.width / vw, rect.height / vh);
    const dx = rect.left + rect.width / 2 - vw / 2;
    const dy = rect.top + rect.height / 2 - vh / 2;
    const insetTop = rect.top;
    const insetRight = vw - (rect.left + rect.width);
    const insetBottom = vh - (rect.top + rect.height);
    const insetLeft = rect.left;

    const ease = 'cubic-bezier(0.65, 0, 0.35, 1)';

    // Phase 1: clip foreground to the card rect.
    setDiveBoxStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 24px)`,
      borderRadius: '24px',
      transition: 'none',
      willChange: 'clip-path',
      overflow: 'hidden',
    });

    // Inner clone starts scaled in cover-mode at card center.
    setFgInnerStyle({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: vw + 'px',
      height: vh + 'px',
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(${coverScale})`,
      transformOrigin: 'center center',
      overflow: 'hidden',
      pointerEvents: 'none',
      transition: 'none',
      willChange: 'transform',
    });

    // Background starts at full opacity before morph.
    setBgStyle({
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: 9998, 
      transformOrigin: `${originX}px ${originY}px`,
      transform: 'translate3d(0, 0, 0) scale(1)',
      opacity: 1, 
      transition: 'none',
      pointerEvents: 'none',
      willChange: 'transform',
    });

    // Phase 2: morph to fullscreen after initial paint.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Open clip to reveal full viewport.
        setDiveBoxStyle({
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          clipPath: 'inset(0px 0px 0px 0px round 0px)',
          borderRadius: '0px',
          transition: `clip-path ${DIVE_MS}ms ${ease}, border-radius ${DIVE_MS}ms ${ease}`,
          willChange: 'clip-path',
          overflow: 'hidden',
        });

        // Grow inner clone to full 1:1 scale.
        setFgInnerStyle({
          position: 'absolute',
          left: '0px',
          top: '0px',
          width: vw + 'px',
          height: vh + 'px',
          transform: 'translate3d(0px, 0px, 0) scale(1, 1)',
          transformOrigin: 'center center',
          overflow: 'hidden',
          pointerEvents: 'none',
          transition: `transform ${DIVE_MS}ms ${ease}`,
          willChange: 'transform',
        });

        // Push background outward from vanishing point.
        setBgStyle({
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '100vw',
          height: '100vh',
          zIndex: 9998,
          transformOrigin: `${originX}px ${originY}px`,
          transform: `translate3d(0, 0, 0) scale(${zoomFactor})`,
          opacity: 1,
          transition: `transform ${DIVE_MS}ms ${ease}`,
          pointerEvents: 'none',
          willChange: 'transform',
        });
      });
    });

    // Phase 3: reset after transition ends.
    setTimeout(() => {
      setIsDiving(false);
      setIsPreDive(false);
      setIsCardHidden(false);
      setDiveBoxStyle({});
      setBgStyle({});
      setFgInnerStyle({});
      bgCloneRef.current = null;
      fgCloneRef.current = null;
    }, DIVE_MS + 50);

    setTimeout(() => {
      setIsCardHidden(true);
    }, 120);
  };

  // On click: prepare clones, show scanning bridge, then launch dive.
  const triggerDive = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDiving || isPreDive) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    // Build both clones during scanning phase so animation starts lighter.
    const baseClone = mainEl.cloneNode(true) as HTMLElement;
    baseClone.querySelector('[data-inception-card]')?.remove();

    const buildOptimizedClone = () => {
      const clone = baseClone.cloneNode(true) as HTMLElement;
      clone.setAttribute('data-inception-clone-root', '');

      const freezeStyle = document.createElement('style');
      freezeStyle.textContent = `
      [data-inception-clone-root],
      [data-inception-clone-root] *,
      [data-inception-clone-root] *::before,
      [data-inception-clone-root] *::after {
        pointer-events: none !important;
        animation: none !important;
        animation-play-state: paused !important;
        transition: none !important;
        cursor: default !important;
      }
    `;
      clone.prepend(freezeStyle);

      return clone;
    };

    bgCloneRef.current = buildOptimizedClone();
    fgCloneRef.current = buildOptimizedClone();

    setIsPreDive(true);
    if (preDiveTimerRef.current) {
      clearTimeout(preDiveTimerRef.current);
    }
    preDiveTimerRef.current = setTimeout(() => {
      startDiveAnimation(rect);
    }, 500);
  };

  // Shared graph-paper background.
  const gridBg = {
    backgroundImage: `
      linear-gradient(rgba(44, 62, 80, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(44, 62, 80, 0.06) 1px, transparent 1px),
      linear-gradient(rgba(44, 62, 80, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(44, 62, 80, 0.025) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px, 50px 50px, 10px 10px, 10px 10px',
    backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
  };

  return (
    <div className="relative min-h-[150px] desk:min-h-0 w-full h-full" data-inception-card>
      
      {/* Portal: renders the dive animation outside the scaled container so it fills the true viewport. */}
      {isDiving && typeof document !== 'undefined' && createPortal(
        <>
          {/* Background: full-viewport DOM clone that zooms outward from the vanishing point */}
          <div style={bgStyle}>
            <div
              ref={bgPortalRef}
              style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
            />
          </div>

          {/* Foreground: card frame that morphs to fill the viewport, revealing the page clone beneath */}
          <div className="fixed overflow-hidden" style={diveBoxStyle}>
            <div ref={fgPortalRef} style={fgInnerStyle} />
          </div>
        </>,
        document.body
      )}

      {/* Original card in the grid. */}
      <div
        onClick={triggerDive}
        className={`absolute inset-0 cursor-pointer group overflow-hidden transition duration-200 ease-out rounded-3xl border-2 border-[#2c3e50] shadow-lg ${
          isCardHidden ? 'opacity-0' : 'opacity-100 hover:-translate-y-1'
        }`}
        style={gridBg}
      >
        <img
          src="/mini-portfolio.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          draggable={false}
        />

        {/* Hover prompt */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: (isDiving || isPreDive) ? 0 : 1 }}>
          <span className="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-md text-[#ffffff] font-mono text-[11px] px-4 py-2 rounded-full border border-[#2c3e50]/20 shadow-lg font-bold tracking-widest transition-opacity duration-300">
            [ CLICK TO DIVE ]
          </span>
        </div>

        {/* Pre-dive bridge (same style as click prompt) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: isPreDive ? 1 : 0 }}>
          <span className="bg-white/10 backdrop-blur-md text-[#ffffff] font-mono text-[11px] px-4 py-2 rounded-full border border-[#2c3e50]/20 shadow-lg font-bold tracking-widest transition-opacity duration-300">
            [ SCANNING VIEW ]
          </span>
        </div>
      </div>
      
    </div>
  );
};