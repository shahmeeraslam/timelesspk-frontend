import React from "react";

const HUD = ({ mousePos, scrollProgress }) => (
  <>
    {/* --- AMBIENT TEXTURE --- */}
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] mix-blend-overlay" 
         style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} />
    
    {/* --- GUIDING CROSSHAIR (The "Seeker") --- */}
    <div 
      className="fixed pointer-events-none z-[100] mix-blend-difference hidden md:flex items-center justify-center"
      style={{ left: mousePos.x, top: mousePos.y, transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
    >
      {/* Dynamic Pulse Ring */}
      <div className="absolute w-12 h-12 border border-white/20 rounded-full animate-ping-slow" />
      
      {/* The Core Point */}
      <div className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
      
      {/* Coordinate Labels with Power-Up Vibe */}
      <div className="absolute top-6 left-6 flex flex-col gap-1">
        <span className="text-[6px] tracking-[0.4em] text-white font-mono uppercase opacity-40">
          VECTOR_ACTIVE
        </span>
        <span className="text-[7px] tracking-[0.2em] text-white font-mono uppercase whitespace-nowrap font-bold">
          {mousePos.x} : {mousePos.y}
        </span>
      </div>
    </div>

    {/* --- JOURNEY TRACKER (Top Right) --- */}
    <div className="fixed top-12 right-12 z-[100] mix-blend-difference flex items-center gap-6">
      <div className="text-right flex flex-col">
        <span className="text-[7px] font-mono tracking-[0.5em] uppercase opacity-40 mb-1">Journey_Status</span>
        <div className="text-[12px] font-mono tracking-[0.3em] uppercase font-black">
           {scrollProgress > 0.95 ? "DESTINATION_REACHED" : `SYNC_POINT_${Math.round(scrollProgress * 100)}%`}
        </div>
      </div>

      {/* Visual Progress Bar (Vertical) */}
      <div className="w-[2px] h-12 bg-white/10 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 w-full bg-white transition-all duration-300 ease-out shadow-[0_0_8px_white]"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>
    </div>

    {/* --- BOTTOM SYSTEM STATUS --- */}
    <div className="fixed bottom-12 left-12 z-[100] mix-blend-difference hidden lg:flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
        <span className="text-[8px] font-mono tracking-[0.6em] uppercase opacity-50">
            System_Resonance_Optimal
        </span>
    </div>

    <style>{`
      @keyframes ping-slow {
        0% { transform: scale(0.5); opacity: 0.8; }
        100% { transform: scale(2.5); opacity: 0; }
      }
      .animate-ping-slow {
        animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
      }
    `}</style>
  </>
);

export default HUD;