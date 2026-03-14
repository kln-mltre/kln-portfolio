import React from 'react';
import { Scissors, Download, Wand2, Video } from 'lucide-react';

export default function KlipMachineCard() {
  return (
    <>
      {/* --- [E] KlipMachine card AI clip generation pipeline visualization --- */}
          <div tabIndex={0} className="group rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 min-h-[200px] desk:min-h-0 col-span-2 order-7 desk:order-none flex flex-col overflow-hidden shadow-lg relative cursor-pointer focus:outline-none">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1 flex-none">
              <a 
                href="https://github.com/kln-mltre/KlipMachine" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 group/title cursor-pointer transition-transform duration-200 hover:translate-x-1"
              >
                <Scissors className="text-cyan-400 group-hover/title:text-cyan-300 transition-colors" size={22} />
                <h3 className="font-bold text-lg text-white group-hover/title:text-cyan-300 group-hover/title:underline underline-offset-4 decoration-cyan-400/50 transition-all leading-tight">
                  KlipMachine
                </h3>
              </a>
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
    </>
  );
}