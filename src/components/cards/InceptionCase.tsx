import React, { useState } from 'react';

/**
 * Self-referencing inception card using the native View Transitions API.
 * We bypass heavy DOM cloning to prevent VRAM saturation during extreme scaling.
 * By capturing a GPU-level viewport screenshot, we can animate the transition
 * natively at 60fps regardless of the underlying DOM complexity.
 */
export default function InceptionCase() {
  const [isPreDive, setIsPreDive] = useState(false);

  const triggerDive = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPreDive) return;

    // Graceful degradation to avoid breaking the UI on unsupported engines
    if (!('startViewTransition' in document)) {
      console.warn("View Transitions API non supportee sur ce navigateur.");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setIsPreDive(true);

    setTimeout(async () => {
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const zoomFactor = Math.max(vw / rect.width, vh / rect.height) * 1.5;
      const coverScale = Math.max(rect.width / vw, rect.height / vh);
      const dx = originX - vw / 2;
      const dy = originY - vh / 2;

      // Insets are calculated against the raw 100vw/100vh screenshot to ensure
      // the clipping mask perfectly matches the physical card dimensions post-scale.
      const localInsetY = Math.max(0, (vh - (rect.height / coverScale)) / 2);
      const localInsetX = Math.max(0, (vw - (rect.width / coverScale)) / 2);
      const localRadius = 24 / coverScale;

      const styleId = 'inception-vt-style';
      let styleEl = document.getElementById(styleId);
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      // We hijack the native view-transition pseudo-elements.
      // 'old' represents the outgoing viewport scaling up, while 'new' 
      // scales the incoming viewport starting from the physical card bounds.
      styleEl.textContent = `
        ::view-transition-group(root) {
          animation: none;
        }

        ::view-transition-old(root) {
          animation: dive-out 1.35s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          transform-origin: ${originX}px ${originY}px;
          z-index: 1;
        }

        ::view-transition-new(root) {
          animation: dive-in 1.35s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          z-index: 2;
        }

        @keyframes dive-out {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(${zoomFactor});
            opacity: 0;
          }
        }

        @keyframes dive-in {
          0% {
            transform: translate3d(${dx}px, ${dy}px, 0) scale(${coverScale});
            clip-path: inset(${localInsetY}px ${localInsetX}px ${localInsetY}px ${localInsetX}px round ${localRadius}px);
          }
          100% {
            transform: translate3d(0px, 0px, 0) scale(1);
            clip-path: inset(0px 0px 0px 0px round 0px);
          }
        }
      `;

      // The callback is empty because we are visually transitioning the exact same 
      // DOM state over itself to create the inception illusion.
      const transition = (document as any).startViewTransition(() => {});

      try {
        await transition.finished;
      } finally {
        styleEl.remove();
        setIsPreDive(false);
      }
    }, 500);
  };

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
      <div
        onClick={triggerDive}
        className="absolute inset-0 cursor-pointer group overflow-hidden transition duration-200 ease-out rounded-3xl border-2 border-[#2c3e50] shadow-lg opacity-100 select-none"
        style={gridBg}
      >
        <img
          src="/mini-portfolio.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          draggable={false}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: isPreDive ? 0 : 1 }}>
          <span className="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-md text-[#ffffff] font-mono text-[11px] px-4 py-2 rounded-full border border-[#2c3e50]/20 shadow-lg font-bold tracking-widest transition-opacity duration-300">
            [ CLICK TO DIVE ]
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: isPreDive ? 1 : 0 }}>
          <span className="bg-white/10 backdrop-blur-md text-[#ffffff] font-mono text-[11px] px-4 py-2 rounded-full border border-[#2c3e50]/20 shadow-lg font-bold tracking-widest transition-opacity duration-300">
            [ SCANNING VIEW ]
          </span>
        </div>
      </div>
    </div>
  );
}