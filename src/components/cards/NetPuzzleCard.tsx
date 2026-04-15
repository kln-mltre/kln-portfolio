import React from 'react';
import localFont from 'next/font/local';

// Pixel art display font
const pixelFont = localFont({ 
  src: '../../app/fonts/PixelFont.ttf', 
  variable: '--font-pixel' 
});

export default function NetPuzzleCard() {
  return (
    <>
      {/* --- [D] Net puzzle game interactive pixel-art grid showcase --- */}
          <div className="relative rounded-3xl border-2 border-[#2c3e50] min-h-[200px] row-span-3 overflow-hidden shadow-sm group order-8 desk:order-none">
            
            {/* Pixel-art background rendering set to nearest-neighbor */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/BACKGROUND.png"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ imageRendering: 'pixelated' }}
            />

            {/* Game title (uses the custom pixel font) */}
            <div className={`absolute top-8 inset-x-0 z-10 flex flex-col items-center justify-center leading-none select-none pointer-events-none ${pixelFont.className}`}>
              <a 
                href="https://github.com/kln-mltre/net-a22" 
                target="_blank" 
                rel="noopener noreferrer"
                className="pointer-events-auto cursor-pointer hover:scale-110 origin-center"
              >
                <h3 className="text-[38px] text-[#ffffff] uppercase">
                  Net Puzzle
                </h3>
              </a>
            </div>

            {/* Puzzle grid each cell is aspect-square for consistent tile alignment */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full grid grid-cols-4 grid-rows-6 scale-143 translate-y-10 row-scale-143" style={{ gap: 0 }}>
                
                {/* Row 1 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/e90_3 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/e90_3:opacity-0 group-focus/e90_3:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/End180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/e90_3:opacity-100 group-focus/e90_3:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/e90_1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/e90_1:opacity-0 group-focus/e90_1:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/End180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/e90_1:opacity-100 group-focus/e90_1:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 2 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/t1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Tee90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/t1:opacity-0 group-focus/t1:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Tee180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/t1:opacity-100 group-focus/t1:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/c1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Corner270.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/c1:opacity-0 group-focus/c1:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Corner.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/c1:opacity-100 group-focus/c1:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 3 */}
                <div tabIndex={0} className="group/s_bot1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_bot1:opacity-0 group-focus/s_bot1:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_bot1:opacity-100 group-focus/s_bot1:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/t2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Tee270.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/t2:opacity-0 group-focus/t2:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Tee.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/t2:opacity-100 group-focus/t2:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/c2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Corner90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/c2:opacity-0 group-focus/c2:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Corner270.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/c2:opacity-100 group-focus/c2:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/s_top relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_top:opacity-0 group-focus/s_top:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_top:opacity-100 group-focus/s_top:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>

                {/* Row 4 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/s2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s2:opacity-0 group-focus/s2:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s2:opacity-100 group-focus/s2:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/s1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s1:opacity-0 group-focus/s1:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s1:opacity-100 group-focus/s1:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 5 */}
                <div className="relative aspect-square overflow-hidden"></div>
                
                <div tabIndex={0} className="group/s3 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s3:opacity-0 group-focus/s3:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s3:opacity-100 group-focus/s3:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/e90_2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/e90_2:opacity-0 group-focus/e90_2:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/End.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/e90_2:opacity-100 group-focus/e90_2:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div className="relative aspect-square overflow-hidden"></div>

                {/* Row 6 */}
                <div tabIndex={0} className="group/s_bot2 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_bot2:opacity-0 group-focus/s_bot2:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_bot2:opacity-100 group-focus/s_bot2:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>
                
                <div tabIndex={0} className="group/c3 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Corner270.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/c3:opacity-0 group-focus/c3:opacity-0 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                  <img src="/Corner.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/c3:opacity-100 group-focus/c3:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/ep1 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Endpoint90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/ep1:opacity-0 group-focus/ep1:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/End90.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/ep1:opacity-100 group-focus/ep1:opacity-100 transition-none" style={{ imageRendering: 'pixelated' }} />
                </div>
                
                <div tabIndex={0} className="group/s_top6 relative aspect-square overflow-hidden cursor-pointer focus:outline-none">
                  <img src="/Segment90.png" alt="" className="absolute inset-0 w-full h-full object-fill group-hover/s_top6:opacity-0 group-focus/s_top6:opacity-0 transition-none" style={{ imageRendering: 'pixelated' }} />
                  <img src="/Segment180.png" alt="" className="absolute inset-0 w-full h-full object-fill opacity-0 group-hover/s_top6:opacity-100 group-focus/s_top6:opacity-100 transition-none" style={{ imageRendering: 'pixelated', transformOrigin: 'center' }} />
                </div>

                </div>
            </div>
          </div>
    </>
  );
}