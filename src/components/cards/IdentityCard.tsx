import React from 'react';

export default function IdentityCard() {
  return (
    <>
    {/* --- [A] Identity badge card Polaroid-style with animated photo and barcode --- */}
    <div className="relative rounded-3xl border-2 border-[#2c3e50] bg-gradient-to-br from-[#5b0a0a] to-[#3d0707] row-span-2 flex flex-col overflow-hidden shadow-lg order-1 desk:order-none">
    
    {/* Punch hole decoration */}
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-5 bg-[#fdf6e3] rounded-full border-2 border-[#2c3e50] z-20 shadow-inner" />

    {/* Text content layer */}
    <div className="flex-1 flex flex-col px-6 pt-14 pb-2 relative z-30 pointer-events-none">
        
        <div className="relative">
        <h2 className="text-4xl font-black uppercase text-white leading-none tracking-tight">Kylian</h2>
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
        <div className="absolute top-14.5 right-6 w-10 h-8 rounded-md bg-gradient-to-br from-[#c5a36e] to-[#a88a54] border border-black/20 p-1 flex items-center justify-center shadow-inner opacity-90 z-40">
        <div className="w-full h-full border border-black/10 rounded-sm grid grid-cols-2 grid-rows-3 gap-0.5 opacity-50">
            {[...Array(6)].map((_, i) => <div key={i} className="border-[0.5px] border-black/20" />)}
        </div>
        </div>

        {/* Handwritten signature overlay */}
        <div className="absolute bottom-[10px] left-[-3px] h-28 w-28 brightness-125">
        <img 
            src="/signature.png" 
            alt="Signature" 
            className="h-full w-full object-contain object-left opacity-70" 
        />
        </div>
    </div>

    {/* Polaroid photo with hover lift and shine effect */}
    <div tabIndex={0} className="absolute bottom-4 right-4 z-10 group cursor-pointer focus:outline-none">
        <div className="bg-[#fdf6e3] p-1.5 pb-6 shadow-2xl transform transition-all group-hover:-translate-y-4 group-focus:-translate-y-4 duration-500 overflow-hidden relative">
        
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
    </>
  );
}