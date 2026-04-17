import React from "react";
import { RiShoppingBagLine, RiFocus3Line, RiInformationLine } from "@remixicon/react";

const Lookbook = ({ products, activeArchive, setActiveArchive, onAdd }) => {
  // Guard: If DB hasn't returned data or active state isn't set, don't crash
  if (!products || products.length === 0 || !activeArchive) return null;

  return (
    <section className="bg-[#050505] text-white py-40 relative overflow-hidden">
      
      {/* --- VOID DEPTH: Ambient Nebular Glows --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[var(--brand-main)] opacity-[0.07] blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-white opacity-[0.05] blur-[100px] rounded-full" />

      <div className="px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* --- INTERACTIVE INDEX --- */}
        <div className="space-y-16 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 border border-white/10 rounded-full">
                    <RiFocus3Line size={14} className="text-[var(--brand-main)] animate-spin-slow" />
                </div>
                <span className="text-[9px] font-mono tracking-[0.5em] uppercase font-bold text-white/40">Archive_Resonance</span>
            </div>
            <h2 className="text-[10vw] font-serif italic tracking-tighter leading-[0.8] text-white">
                The <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Gallery</span>
            </h2>
          </div>

          <div className="space-y-4">
            {products.map((p) => {
              // 1. UNIVERSAL ID RESOLUTION: Handles MongoDB _id or standard id
              const pId = p._id?.$oid || p._id || p.id;
              const activeId = activeArchive._id?.$oid || activeArchive._id || activeArchive.id;
              const isActive = pId === activeId;

              return (
                <button 
                  key={pId} // Fixes "unique key" console warning
                  onMouseEnter={() => setActiveArchive(p)}
                  className={`flex items-center gap-8 w-full group transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] 
                    ${isActive ? 'translate-x-6 opacity-100' : 'opacity-10 hover:opacity-40'}`}
                >
                  <div className={`h-[2px] transition-all duration-700 shadow-[0_0_15px_white] ${isActive ? 'w-20 bg-white' : 'w-0 bg-transparent'}`} />
                  
                  <div className="flex flex-col items-start text-left">
                      <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-[var(--brand-main)]">
                      NODE_{String(pId).slice(-4).toUpperCase()}
                      </span>
                      <span className="text-4xl md:text-6xl font-serif italic uppercase tracking-tighter">
                      {p.name}
                      </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- POWERFUL VISUALIZER: The Floating Monolith --- */}
        <div className="relative aspect-[4/5] group overflow-hidden bg-black rounded-lg border border-white/5 shadow-2xl">
          
          <div className="absolute inset-0 z-20 pointer-events-none opacity-20" 
               style={{ backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

          {/* 2. IMAGE ARRAY RESOLUTION: Pulls first image from DB array or fallbacks to img/image string */}
          <img 
            key={activeArchive._id?.$oid || activeArchive._id} 
            src={activeArchive.img || (Array.isArray(activeArchive.image) ? activeArchive.image[0] : activeArchive.image)} 
            className="w-full h-full object-cover transition-all duration-1000 animate-vivid-reveal" 
            alt={activeArchive.name} 
          />

          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-30">
            <div className="relative overflow-hidden group/card bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 shadow-2xl transition-all duration-700 group-hover:bg-white/[0.07]">
              
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              
              <div className="flex items-center gap-2 mb-4 opacity-40">
                 <RiInformationLine size={12} />
                 <p className="text-[8px] font-mono font-black uppercase tracking-[0.4em]">Unit_Specs</p>
              </div>
              
              {/* Mapping category and curatorNote if material is missing from DB */}
              <h4 className="text-xl font-serif italic text-white mb-3">
                {activeArchive.category || activeArchive.material}
              </h4>
              <p className="text-3xl font-black tracking-tighter text-white">
                <span className="text-sm align-top mr-1 font-mono opacity-50">$</span>
                {activeArchive.price}
              </p>
            </div>

            <button 
              onClick={(e) => onAdd(e, activeArchive)} 
              className="w-24 h-24 bg-white text-black flex items-center justify-center hover:scale-105 active:scale-90 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.2)] group/btn"
            >
              <div className="relative">
                <RiShoppingBagLine size={32} className="relative z-10" />
                <div className="absolute inset-0 bg-black/10 blur-md scale-0 group-hover/btn:scale-150 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* ... style tag remains identical */}
    </section>
  );
};

export default Lookbook;