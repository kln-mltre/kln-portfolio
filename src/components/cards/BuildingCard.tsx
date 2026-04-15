import React from 'react';

/* Tiny stick-figure worker — just a hat, head, body, two legs */
const Worker = ({ hat = '#f59e0b', body = '#ea580c' }: { hat?: string; body?: string }) => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" className="animate-[workerBob_0.4s_ease-in-out_infinite]">
    <rect x="2" y="0" width="6" height="2.5" rx="1" fill={hat} />
    <circle cx="5" cy="4" r="2" fill="#d4a574" />
    <rect x="3" y="6" width="4" height="5" rx="1" fill={body} />
    <rect x="3" y="11" width="1.5" height="5" rx="0.5" fill="#1e3a5f" />
    <rect x="5.5" y="11" width="1.5" height="5" rx="0.5" fill="#1e3a5f" />
  </svg>
);

export default function BuildingCard() {
  return (
    <div className="rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-b from-[#1a1207] to-[#2a1a08] col-span-2 flex flex-col overflow-hidden shadow-lg relative [container-type:inline-size]">

      {/* Hazard tape top */}
      <div className="h-3 w-full flex-none overflow-hidden relative">
        {/* An oversised inner wrapper allows GPU-accelerated translation to replace heavy CPU background repaints */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[calc(100%+46px)] animate-[stripeScroll_4s_linear_infinite]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 8px, #1c1917 8px, #1c1917 16px)', backgroundSize: '23px 23px' }}
        />
      </div>

      {/* Title */}
      <div className="flex-none flex items-center justify-center pt-3 pb-1 px-4 relative z-20">
        <span className="text-sm font-black text-amber-400/70 uppercase tracking-[0.3em] font-mono">
          Under Construction
          <span className="inline-flex gap-0.5 ml-1.5 align-middle">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-[dotBounce_1.4s_ease-in-out_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-[dotBounce_1.4s_ease-in-out_0.2s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-[dotBounce_1.4s_ease-in-out_0.4s_infinite]" />
          </span>
        </span>
      </div>

      {/* Scene */}
      <div className="flex-1 relative px-6 pb-6 overflow-hidden">

        {/* Crane silhouette */}
        <svg className="absolute left-[28%] bottom-4 opacity-40" width="60" height="90" viewBox="0 0 60 90">
          <rect x="27" y="8" width="5" height="78" fill="#78350f" />
          <rect x="5" y="5" width="50" height="4" rx="1" fill="#92400e" />
          <g className="animate-[cableSway_3s_ease-in-out_infinite]" style={{ transformOrigin: '15px 9px' }}>
            <line x1="15" y1="9" x2="15" y2="45" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" />
            <rect x="12" y="44" width="6" height="5" rx="1" fill="#d97706" opacity="0.8" />
          </g>
          <rect x="22" y="84" width="15" height="4" rx="1" fill="#78350f" />
        </svg>

        {/* Traffic cone left */}
        <svg className="absolute left-[10%] bottom-4 opacity-60" width="12" height="18" viewBox="0 0 12 18">
          <polygon points="6,1 11,16 1,16" fill="#ea580c" />
          <rect x="4" y="6" width="4" height="1.5" rx="0.5" fill="white" opacity="0.6" />
          <rect x="0" y="15.5" width="12" height="2.5" rx="1" fill="#78350f" />
        </svg>

        {/* Traffic cone right */}
        <svg className="absolute right-[10%] bottom-4 opacity-60" width="12" height="18" viewBox="0 0 12 18">
          <polygon points="6,1 11,16 1,16" fill="#ea580c" />
          <rect x="4" y="6" width="4" height="1.5" rx="0.5" fill="white" opacity="0.6" />
          <rect x="0" y="15.5" width="12" height="2.5" rx="1" fill="#78350f" />
        </svg>

        {/* Sand pile left */}
        <svg className="absolute left-[5%] bottom-4 opacity-50" width="28" height="14" viewBox="0 0 28 14">
          <ellipse cx="14" cy="12" rx="14" ry="4" fill="#92400e" />
          <ellipse cx="14" cy="10" rx="10" ry="6" fill="#b45309" />
        </svg>

        {/* Brick stack right */}
        <svg className="absolute right-[5%] bottom-4 opacity-45" width="20" height="16" viewBox="0 0 20 16">
          <rect x="0" y="10" width="9" height="5" rx="0.5" fill="#b45309" />
          <rect x="10" y="10" width="9" height="5" rx="0.5" fill="#92400e" />
          <rect x="3" y="5" width="9" height="5" rx="0.5" fill="#d97706" />
          <rect x="6" y="0" width="9" height="5" rx="0.5" fill="#b45309" />
        </svg>

        {/* Scaffolding center */}
        <svg className="absolute left-[48%] bottom-4 opacity-35" width="30" height="50" viewBox="0 0 30 50">
          <rect x="2" y="0" width="2" height="48" fill="#b45309" />
          <rect x="26" y="0" width="2" height="48" fill="#b45309" />
          <rect x="0" y="15" width="30" height="2" rx="0.5" fill="#92400e" />
          <rect x="0" y="30" width="30" height="2" rx="0.5" fill="#92400e" />
          <rect x="0" y="45" width="30" height="2" rx="0.5" fill="#92400e" />
          <line x1="4" y1="15" x2="26" y2="30" stroke="#78350f" strokeWidth="0.8" />
          <line x1="26" y1="15" x2="4" y2="30" stroke="#78350f" strokeWidth="0.8" />
        </svg>

        {/* Barrel center-left */}
        <svg className="absolute left-[38%] bottom-4 opacity-40" width="14" height="20" viewBox="0 0 14 20">
          <rect x="1" y="2" width="12" height="16" rx="3" fill="#78350f" stroke="#92400e" strokeWidth="0.8" />
          <rect x="0" y="5" width="14" height="1.5" rx="0.5" fill="#92400e" />
          <rect x="0" y="13" width="14" height="1.5" rx="0.5" fill="#92400e" />
          <ellipse cx="7" cy="2" rx="6" ry="2" fill="#5c3a1e" />
        </svg>

        {/* Traffic cone center */}
        <svg className="absolute left-[55%] bottom-4 opacity-50" width="10" height="14" viewBox="0 0 10 14">
          <polygon points="5,1 9,12 1,12" fill="#ea580c" />
          <rect x="3" y="5" width="4" height="1" rx="0.5" fill="white" opacity="0.5" />
          <rect x="0" y="11.5" width="10" height="2" rx="0.7" fill="#78350f" />
        </svg>

        {/* Walking workers */}
        <div className="absolute bottom-4 left-0 w-full h-[18px] pointer-events-none">
          <div className="absolute bottom-0 animate-[workerWalk_8s_linear_infinite]" style={{ animationDelay: '0s' }}><Worker hat="#f59e0b" body="#ea580c" /></div>
          <div className="absolute bottom-0 animate-[workerWalk_11s_linear_infinite]" style={{ animationDelay: '-4s' }}><Worker hat="#fbbf24" body="#2563eb" /></div>
          <div className="absolute bottom-0 animate-[workerWalk_14s_linear_infinite]" style={{ animationDelay: '-9s' }}><Worker hat="#ef4444" body="#16a34a" /></div>
        </div>

        {/* Ground line */}
        <div className="absolute bottom-4 left-4 right-4 h-[1px] bg-amber-800/25" />
      </div>

      {/* Hazard tape bottom */}
      <div className="h-3 w-full flex-none overflow-hidden relative">
        {/* Same technique for the bottom tape to ensure a 60fps reverse scroll */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[calc(100%+46px)] animate-[stripeScroll_4s_linear_infinite_reverse]"
          style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #f59e0b, #f59e0b 8px, #1c1917 8px, #1c1917 16px)', backgroundSize: '23px 23px' }}
        />
      </div>
      
    </div>
  );
}
