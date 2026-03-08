import React, { useState, useEffect } from 'react';
import localFont from 'next/font/local';

// Handwritten display font
const handwrittenFont = localFont({ 
  src: '../../app/fonts/HandwrittenFont.ttf', 
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

export default function ValentineCard() {
  
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
    <>
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
    </>
  );
}