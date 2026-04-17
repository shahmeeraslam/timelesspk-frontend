import React from "react";
import { useNavigate } from "react-router-dom";
import { RiSparkling2Line, RiCompass3Line } from "@remixicon/react";

const Hero = ({ scrollProgress }) => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex flex-col justify-center px-6 md:px-20 overflow-hidden">
      {/* --- BACKGROUND LAYER: VIBRANT & ENERGETIC --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070" 
          className="w-full h-full object-cover grayscale-0 opacity-60 transition-transform duration-500 ease-out"
          style={{ 
            transform: `scale(${1.2 - scrollProgress * 0.15})`,
            filter: `contrast(1.1) brightness(1.1)` 
          }}
          alt="Visionary Fashion"
        />
        {/* Dynamic Light Gradient: Shifts from clinical teal to a powerful dawn-gold or bright white */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-alt)] via-transparent to-[var(--brand-main)]/20 mix-blend-overlay opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,transparent_0%,var(--brand-alt)_100%)] opacity-70" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--brand-main)] text-[var(--brand-alt)] animate-pulse">
               <RiSparkling2Line size={12} />
            </div>
            <span className="text-[10px] font-mono tracking-[0.6em] uppercase font-bold text-[var(--brand-main)]">
              Horizon_Found_2026
            </span>
          </div>

          <h1 className="text-[11.001vw] leading-[0.75] font-serif italic tracking-tighter uppercase relative">
            <span className="block overflow-hidden">
                <span className="block animate-slide-up bg-gradient-to-r from-[var(--brand-main)] via-[var(--brand-muted)] to-[var(--brand-main)] bg-[length:200%_auto] text-transparent bg-clip-text animate-shine">
                  Infinite
                </span>
            </span>
            <span className="font-sans not-italic font-black block overflow-hidden text-[var(--brand-main)]">
                <span className="block animate-slide-up" style={{ animationDelay: '0.15s' }}>
                  Potential   
                </span>
            </span>
            
            {/* Visual Power Element: Replaced QR with a Compass for "Direction" */}
            <div className="absolute top-0 right-[-2vw] hidden lg:flex flex-col items-center gap-2 opacity-30">
               <RiCompass3Line size={60} className="animate-spin-slow" />
               <span className="text-[8px] font-mono tracking-widest">TRUE_NORTH</span>
            </div>
          </h1>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-end gap-12 border-l-2 border-[var(--brand-main)] pl-10">
          <div className="space-y-6">
            <p className="text-xl md:text-2xl font-serif italic leading-tight text-[var(--brand-main)]">
              Crafting the artifacts of a future <br/> defined by purpose and elegance.
            </p>
            <div className="font-mono text-[9px] space-y-2 opacity-60 uppercase tracking-[0.2em]">
              <p className="flex justify-between"><span>Core_Drive:</span> <span>Optimism</span></p>
              <p className="flex justify-between"><span>Output:</span> <span>High_Excellence</span></p>
            </div>
          </div>

          <button 
            onClick={() => navigate('/collection')}
            className="group relative overflow-hidden bg-[var(--brand-main)] text-[var(--brand-alt)] px-10 py-7 text-[11px] uppercase tracking-[0.8em] font-black shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Explore Horizon</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] group-hover:animate-sweep" />
          </button>
        </div>
      </div>

      {/* --- OPTIMISTIC DECOR --- */}
      <div className="absolute bottom-10 right-20 hidden lg:block">
         <div className="flex items-baseline gap-4">
            <span className="text-[10px] font-mono font-bold">LIT_SCENE_01</span>
            <div className="w-20 h-[2px] bg-[var(--brand-main)]" />
         </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(110%); }
          to { transform: translateY(0); }
        }
        @keyframes shine {
          to { background-position: 200% center; }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-shine { animation: shine 3s linear infinite; }
        .animate-sweep { animation: sweep 0.75s ease-in-out forwards; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </section>
  );
};

export default Hero;