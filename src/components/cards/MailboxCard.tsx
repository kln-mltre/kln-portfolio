import React from 'react';
import { Mail } from 'lucide-react';

export default function MailboxCard() {
  return (
    <>
      {/* --- [B] Contact card 3D mailbox with flag and interactive letter --- */}
        <div tabIndex={0} className="group relative rounded-4xl border-2 border-[#2c3e50] bg-gradient-to-br from-[#681212] to-[#450505] min-h-[150px] desk:min-h-0 overflow-visible shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] cursor-pointer z-10 hover:z-50 focus:z-50 order-2 desk:order-none focus:outline-none">
        
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
                <p className="text-[15px] font-semibold text-gray-600 mt-1">kylian.malartre@gmail.com</p>
            </div>
            </div>
        </div>

        </div>
    </>
  );
}