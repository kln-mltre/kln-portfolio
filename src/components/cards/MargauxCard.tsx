'use client';

import React from 'react';

export default function MargauxCard() {
  return (
    <div 
      tabIndex={0}
      className="group rounded-3xl border-2 border-[#2c3e50] w-full h-full flex flex-col relative shadow-sm hover:z-50 focus:outline-none transition-transform duration-300 bg-[#fcfcfd] overflow-hidden"
      style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
    >
      {/* --- Aurora Background Animation (Bottom Band) --- */}
      <div className="absolute bottom-[-30px] left-[-20%] right-[-20%] h-[100px] z-0 pointer-events-none opacity-80 transform-gpu backface-hidden">
        <div 
          className="w-full h-full transform-gpu backface-hidden"
          style={{
            backgroundImage: 'repeating-linear-gradient(100deg, #bae6fd 10%, #7dd3fc 15%, #38bdf8 20%, #60a5fa 25%, #3b82f6 30%)',
            backgroundSize: '200% 200%',
            backgroundPosition: '50% 50%',
            filter: 'blur(40px)',
            WebkitFilter: 'blur(40px)',
            animation: 'liquid-aurora 25s linear infinite',
          }}
        />
      </div>
      
      {/* --- Noise Overlay --- */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* --- Card Content --- */}
      <div className="relative z-10 flex flex-col justify-between h-full p-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
        
        {/* Top Section */}
        <div className="flex justify-between items-start w-full gap-2 relative z-20 pointer-events-none">
          <div className="flex flex-col text-left pt-1 pointer-events-auto">
            <div 
              onClick={(e) => {
                e.stopPropagation();
                window.open('https://www.margauxcarol.com', '_blank', 'noopener,noreferrer');
              }}
              className="group/link cursor-pointer w-fit block"
              role="link"
              tabIndex={0}
            >
              <h1 
                className="text-[22px] font-bold text-[#0f172a] leading-[1.05] tracking-tight mb-2 group-hover/link:text-[#2563eb] transition-colors"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {'RÉPARER L\u2019INCURABLE'}
                <br />
                {'À LOURDES'}
              </h1>
            </div>
            <h2 className="text-[10px] font-bold text-[#2563eb] uppercase tracking-[2px]">
              Le miracle comme fait social
            </h2>
          </div>
        </div>

        {/* Absolute Photo Grid (Bottom-right, staggered diagonal) */}
        <div className="absolute -right-3 -bottom-8 flex flex-row items-end gap-2 z-10 pointer-events-none">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-2 w-[70px] mb-[0px]">
            <img src="/margaux/IMG_2174-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
            <img src="/margaux/IMG_1918-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
          </div>
          
          {/* Col 2 */}
          <div className="flex flex-col gap-2 w-[90px] mb-[0px]">
            <img src="/margaux/IMG_1834-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
            <img src="/margaux/IMG_1931-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
            <img src="/margaux/IMG_2155-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-2 w-[90px] mb-[-110px]">
            <img src="/margaux/IMG_9596-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
            <img src="/margaux/IMG_1936-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
            <img src="/margaux/IMG_9541-thumb.webp" alt="" className="w-full h-auto rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.15)]" />
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-end w-full relative z-20 pointer-events-none">
          <div className="text-left flex-1 pr-3">
            <div className="text-[11px] font-medium text-[#475569] leading-tight">
              Photographic appendix of
              <br />
              <strong 
                className="font-bold text-[#0f172a] text-[13px] block mt-[3px]"
                style={{ fontFamily: "'Lora', serif" }}
              >
                {"Margaux Carol\u2019s thesis"}
              </strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
