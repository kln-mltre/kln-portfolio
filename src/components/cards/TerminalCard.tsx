import React, { useState, useEffect } from 'react';

/**
 * Animated ASCII network activity trace for the terminal card.
 * Rotates RX/TX block-character strings to simulate live packet flow.
 *
 * Returns:
 *   A decorative RX/TX readout element with a continuous character rotation.
 */
const NetworkTrace = () => {
  const [rx, setRx] = useState("▄▅▃▂▅▇▄▃");
  const [tx, setTx] = useState("▂▃▅▇▃▂▄▅");

  useEffect(() => {
    const id = setInterval(() => {
      setRx(prev => {
        const chars = Array.from(prev);
        return chars.slice(1).join('') + chars[0];
      });
      setTx(prev => {
        const chars = Array.from(prev);
        return chars.slice(1).join('') + chars[0];
      });
    }, 100); 
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col text-emerald-500/40 leading-tight">
       <span className="tracking-widest">RX: {rx}</span>
       <span className="tracking-widest">TX: {tx}</span>
    </div>
  );
};

export default function TerminalCard() {

    // --- Terminal card state (uptime counter, system data) ---
    const [uptime, setUptime] = useState(0);
    const [pid] = useState(() => Math.floor(Math.random() * 8000) + 1000);
  
    useEffect(() => {
      const timer = setInterval(() => {
        setUptime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }, []);
  
    /**
     * Formats a duration in seconds as MM:SS with zero-padding.
     *
     * Args:
     *   seconds: Total elapsed seconds.
     *
     * Returns:
     *   Formatted time string (e.g., "02:37").
     */
    const formatUptime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    const [sysData, setSysData] = useState({
      ip: "FETCHING...",
      isp: "SCANNING...",
      net: "DETECTING...",
      sys: "ANALYZING..."
    });
  
    useEffect(() => {
      // Measures round-trip latency with a double HEAD request (first warms the connection)
      const calculatePing = async () => {
        try {
          const targetUrl = `/?t=${new Date().getTime()}`;
          await fetch(targetUrl, { method: 'HEAD', cache: 'no-store' });
          const start = performance.now();
          await fetch(targetUrl, { method: 'HEAD', cache: 'no-store' });
          const end = performance.now();
          return Math.round(end - start);
        } catch (e) {
          return null;
        }
      };
  
      // Fetches visitor IP data with session caching and a fallback API
      const fetchIpData = async () => {
      const cachedData = sessionStorage.getItem('sysIpData');
      if (cachedData) return JSON.parse(cachedData);
  
      try {
        const res = await fetch('https://ipinfo.io/json');
        if (!res.ok) throw new Error("Rate limit");
        const data = await res.json();
        sessionStorage.setItem('sysIpData', JSON.stringify(data));
        return data;
      } catch (e) {
          try {
            // Fallback: ipapi.co when ipinfo.io rate-limits or fails
            const res2 = await fetch('https://ipapi.co/json/');
            return await res2.json();
          } catch (e2) {
            return {}; // Graceful degradation: ad-blockers or offline
          }
        }
      };
  
      // Run IP lookup and ping measurement concurrently
      Promise.all([
        fetchIpData(),
        calculatePing()
      ]).then(([ipData, measuredPing]) => {
        // --- IP & ISP ---
        const ip = ipData.ip || "127.0.0.1";
        let isp = "UNKNOWN ISP";
        
        if (ipData.org) {
          // Strip the "AS<number> " prefix that ipinfo.io prepends to the ISP name
          isp = ipData.org.replace(/^AS\d+\s/, '').toUpperCase();
        }
  
        // --- Network & Ping ---
        const nav = navigator as any;
        const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
        let type = "WIFI/LAN"; 
        
        if (conn && conn.effectiveType) {
          type = conn.effectiveType.toUpperCase();
        }
  
        let finalPing = "42ms";
        if (measuredPing) {
          finalPing = `${measuredPing}ms`;
        } else if (conn && conn.rtt) {
          finalPing = `${conn.rtt}ms`;
        }
  
        // --- OS & Browser detection ---
        const ua = navigator.userAgent;
        let os = "UNIX";
        if (ua.includes("Win")) os = "WINDOWS";
        if (ua.includes("Mac")) os = "MACOS";
        if (ua.includes("Linux")) os = "LINUX";
        
        let browser = "WEBKIT";
        if (ua.includes("Firefox")) browser = "FIREFOX";
        else if (ua.includes("Edg")) browser = "EDGE";
        else if (ua.includes("Chrome")) browser = "CHROME";
        else if (ua.includes("Safari")) browser = "SAFARI";
  
        setSysData({ 
          ip, 
          isp,
          net: `${type} / ${finalPing}`,
          sys: `${os} [${browser}]`
        });
      });
    }, []);

  return (
    <>
      {/* --- [I] Terminal card live system info with CRT scanline effect --- */}
          <div tabIndex={0} className="group relative rounded-3xl border-2 border-[#2c3e50] bg-[#121212] p-4 min-h-[150px] flex flex-col overflow-hidden shadow-inner font-mono text-[10px] focus:outline-none cursor-pointer order-3 desk:order-none">
            
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] opacity-50" />

            {/* Terminal Header */}
            <div className="flex gap-1.5 mb-[9px] opacity-40 group-hover:opacity-100 transition-opacity flex-none">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
            </div>

            {/* Idle state: live system logs and animated network trace */}
            <div className="flex flex-col h-full text-emerald-500/80 group-hover:opacity-0 group-focus:opacity-0 transition-all duration-300 pointer-events-none">
              
              {/* Log header: process ID and live uptime counter */}
              <div className="flex justify-between border-b border-emerald-900/30 pb-1 mb-1.5 flex-none font-bold text-[11px] tracking-tighter">
                <span suppressHydrationWarning>PROC[P:{pid || '----'}]</span>
                <span suppressHydrationWarning>Uptime[{formatUptime(uptime)}]</span>
              </div>
              
              {/* System data readout */}
              <div className="space-y-1 flex-none">
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> IP: {sysData.ip}</p>
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> ISP: {sysData.isp}</p>
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> NET: {sysData.net}</p>
                <p className="truncate"><span className="text-emerald-300/40">{'>'}</span> OP: {sysData.sys}</p>
              </div>

              {/* Animated network activity trace (pushed to bottom of card) */}
              <div className="mt-auto pt-2 border-t border-emerald-900/30 flex justify-between items-end w-full text-[9px]">
                
                <NetworkTrace />

                {/* Blinking terminal cursor */}
                <span className="animate-pulse text-emerald-400 text-xs font-black">_</span>
              </div>

            </div>
            {/* Hover state: portfolio scan overlay */}
            <div className="absolute inset-x-4 top-9 space-y-1.5 text-cyan-400 opacity-0 scale-95 group-hover:opacity-100 group-focus:opacity-100 group-hover:scale-100 group-focus:scale-100 transition-all duration-300 z-10 pointer-events-none">
              <p className="text-white font-bold bg-cyan-900/40 px-1 w-fit mb-2">PORTFOLIO_SCAN</p>
              <p className="flex justify-between"><span>PROBING:</span> <span className="text-white">kylianmalartre.com</span></p>
              <p className="flex justify-between"><span>FOUND:</span> <span className="text-white text-[9px]">ALL_PROJECTS</span></p>
              <p className="flex justify-between"><span>DETECTED:</span> <span className="text-white text-[9px]">ABSOLUTE_FLOW</span></p>
              <p className="flex justify-between"><span>COPYRIGHT:</span> <span className="text-white text-[9px]">©_KLN_2026</span></p>
              <div className="mt-2 h-1 w-full bg-cyan-900/50 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 animate-[electricPulse_1.5s_infinite]" style={{ width: '100%' }} />
              </div>
              <p className="text-[9px] text-center font-bold text-white mt-1">STATUS: OPERATIONAL</p>
            </div>

            {/* Subtle glow overlay on hover */}
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
    </>
  );
}