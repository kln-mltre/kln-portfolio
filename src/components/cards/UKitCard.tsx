'use client';

import React, { useEffect } from 'react';
import { tsParticles } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

const svgBlue = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" rx="25" ry="25" fill="#007AFF"/></svg>`
);
const svgPurple = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" rx="25" ry="25" fill="#5E5CE6"/></svg>`
);

export default function UKitCard() {
  useEffect(() => {
    let container: any;
    async function init() {
      await loadSlim(tsParticles);
      container = await tsParticles.load({
        id: 'ukit-card-particles',
        options: {
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          interactivity: {
            detectsOn: 'window',
            events: {
              onClick: { enable: true, mode: ['push', 'repulse'] },
              onHover: { enable: true, mode: ['grab', 'repulse'] },
            },
            modes: {
              push: { quantity: 2 },
              grab: { distance: 100, links: { opacity: 0.4 } },
              repulse: { distance: 80, duration: 0.4, factor: 2, speed: 1 },
            },
          },
          particles: {
            color: { value: ['#007AFF', '#5E5CE6'] },
            links: { color: '#5E5CE6', distance: 70, enable: true, opacity: 0.2, width: 1 },
            move: { enable: true, speed: 0.7, direction: 'none', random: true, straight: false, outModes: { default: 'out' } },
            number: { density: { enable: true, width: 400 }, value: 70, limit: { value: 120 } },
            opacity: { value: { min: 0.4, max: 0.5 } },
            shape: {
              type: 'image',
              options: {
                image: [
                  { src: svgBlue,   width: 100, height: 100 },
                  { src: svgPurple, width: 100, height: 100 },
                ],
              },
            },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        },
      });
    }
    init();
    return () => { container?.destroy(); };
  }, []);

  return (
    <div className="rounded-3xl border-2 border-[#2c3e50] bg-slate-50 min-h-[200px] desk:min-h-0 col-span-2 order-7 desk:order-none flex flex-col overflow-hidden shadow-lg relative">

      {/* Particle field background (scaled down) */}
      <div
        id="ukit-card-particles"
        className="absolute inset-0 z-0"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, rgba(0,0,0,0.5) 100%)',
          maskImage: 'linear-gradient(to bottom, black 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content container: restricted padding to stay within the grid row height */}
      <div className="flex-1 relative z-10 flex items-center px-8 py-4 desk:px-8">

        {/* Left: Identity & CTA */}
        <div className="flex flex-col justify-center gap-3 h-full relative z-20 max-w-[55%]">
          
          <div className="flex flex-col items-start gap-1">
            <img
              src="/logoUKit.png"
              alt="UKit"
              className="h-11 desk:h-11 w-auto object-contain object-left"
            />
            <p className="text-[14px] desk:text-[14px] font-bold text-slate-700 leading-tight">
              The survival kit for <br />
              <span className="text-[#5E5CE6]">Bordeaux students.</span>
            </p>
          </div>
            
          {/* Bigger store badges with direct links */}
          <div className="flex items-center gap-2">
            <a
              href="https://apps.apple.com/app/id1394708917"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-200 active:scale-95 origin-left"
            >
              <img src="/badge-app-store.svg" alt="App Store" className="h-8.5 desk:h-8.5 w-auto" />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.bordeaux1.emplois"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform duration-200 active:scale-95 origin-left"
            >
              <img src="/badge-google-play.svg" alt="Google Play" className="h-8.5 desk:h-8.5 w-auto" />
            </a>
          </div>
        </div>


        {/* Right Side: Phone Mockup */}
        <div tabIndex={0} className="absolute top-46 -translate-y-1/2 right-10 w-[150px] z-10 group cursor-pointer focus:outline-none">
          
          {/* Hardware Bezel */}
          <div className="relative w-full bg-slate-900 p-1 lg:p-1.25 shadow-2xl rounded-[1.25rem] lg:rounded-[1.5rem] transform transition-all group-hover:-translate-y-4 group-focus:-translate-y-4 duration-500">
            
            {/* Internal Screen */}
            <div className="relative w-full overflow-hidden rounded-[1rem] lg:rounded-[1.125rem] bg-white aspect-[9/19] grid">
              
              {/* Dynamic Island */}
              <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-[42%] h-2.75 bg-slate-900 rounded-b-md z-50 
                before:absolute before:content-[''] before:-left-1.5 before:top-0 before:w-1.5 before:h-1.5 before:bg-transparent before:rounded-tr-sm before:shadow-[1.5px_-1.5px_0_0_#0f172a] 
                after:absolute after:content-[''] after:-right-1.5 after:top-0 after:w-1.5 after:h-1.5 after:bg-transparent after:rounded-tl-sm after:shadow-[-1.5px_-1.5px_0_0_#0f172a]">
              </div>

              {/* Phone Content*/}
              <img 
                src="/EDT.png" 
                alt="UKit Preview" 
                className="w-full h-full object-cover transform-gpu"
                style={{ 
                  imageRendering: '-webkit-optimize-contrast',
                  transform: 'translateZ(0)' 
                }} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}