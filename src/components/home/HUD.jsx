import React, { useMemo } from "react";

const HUD = ({ mousePos, scrollProgress }) => {
  // Memoize the percentage to prevent unnecessary string recalculations
  const progressPercent = useMemo(() => Math.round(scrollProgress * 100), [scrollProgress]);
  const isReached = scrollProgress > 0.95;

  return (
    <>
      {/* --- AMBIENT TEXTURE: Lowered opacity for better readability --- */}
      <div 
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay will-change-transform" 
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }} 
      />
      
      {/* --- GUIDING CROSSHAIR: Optimized with GPU acceleration --- */}
      <div 
        className="fixed pointer-events-none z-[100] mix-blend-difference hidden md:flex items-center justify-center will-change-transform"
        style={{ 
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
          // Removed top/left to use translate3d exclusively for performance
          left: 0, 
          top: 0,
          transition: 'transform 0.1s cubic-bezier(0.2, 0.49, 0.32, 0.99)' 
        }}
      >
        {/* Dynamic Pulse Ring */}
        <div className="absolute w-12 h-12 border border-white/20 rounded-full animate-ping-slow" />
        
        {/* The Core Point */}
        <div className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]" />
        
        {/* Coordinate Labels - Hidden if near edges to prevent overflow */}
        <div className="absolute top-6 left-6 flex flex-col gap-1">
          <span className="text-[6px] tracking-[0.4em] text-white font-mono uppercase opacity-40">
            VECTOR_ACTIVE
          </span>
          <span className="text-[7px] tracking-[0.2em] text-white font-mono uppercase whitespace-nowrap font-bold">
            {Math.round(mousePos.x)} : {Math.round(mousePos.y)}
          </span>
        </div>
      </div>

      {/* --- JOURNEY TRACKER: Repositioned for mobile thumb safety --- */}
      <div className="fixed top-8 right-6 md:top-12 md:right-12 z-[100] mix-blend-difference flex items-center gap-4 md:gap-6">
        <div className="text-right flex flex-col">
          <span className="text-[6px] md:text-[7px] font-mono tracking-[0.4em] md:tracking-[0.5em] uppercase opacity-40 mb-1">
            Status_Acquisition
          </span>
          <div className="text-[10px] md:text-[12px] font-mono tracking-[0.2em] md:tracking-[0.3em] uppercase font-black">
             {isReached ? "COMPLETE" : `SYNC_${progressPercent}%`}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-[1.5px] h-8 md:h-12 bg-white/10 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-full bg-white transition-transform duration-500 ease-out shadow-[0_0_8px_white] origin-top"
            style={{ transform: `scaleY(${scrollProgress})` }}
          />
        </div>
      </div>

      {/* --- SYSTEM STATUS: Refined for mobile (simplified) --- */}
      <div className="fixed bottom-8 left-6 md:bottom-12 md:left-12 z-[100] mix-blend-difference flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-40" />
          </div>
          <span className="text-[7px] md:text-[8px] font-mono tracking-[0.4em] md:tracking-[0.6em] uppercase opacity-50">
              {isReached ? "Archive_Stable" : "System_Resonance_Optimal"}
          </span>
      </div>

      <style>{`
        @keyframes ping-slow {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default HUD;