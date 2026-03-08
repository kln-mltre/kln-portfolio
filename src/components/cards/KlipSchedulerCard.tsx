import React from 'react';
import { Terminal, Calendar, Database, Clock, Upload } from 'lucide-react';

export default function KlipSchedulerCard() {
  return (
    <>
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
    </>
  );
}