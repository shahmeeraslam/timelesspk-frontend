import React from "react";
import { RiShoppingBagLine, RiFocus3Line, RiInformationLine } from "@remixicon/react";

const Lookbook = ({ products, activeArchive, setActiveArchive, onAdd }) => {
  if (!products || products.length === 0 || !activeArchive) return null;

  // Helper to safely get image URL from your DB structure
  const getImageUrl = (item) => {
    if (!item) return "";
    if (item.img) return item.img;
    if (Array.isArray(item.image)) {
      // Handles both [ "url" ] and [ { url: "url" } ]
      return typeof item.image[0] === 'string' ? item.image[0] : item.image[0]?.url;
    }
    return item.image;
  };

  return (
    <section className="bg-[#050505] text-white py-24 md:py-40 relative overflow-hidden">
      
      {/* --- VOID DEPTH --- */}
      <div className="absolute top-[-5%] left-[-5%] w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] bg-[var(--brand-main)] opacity-[0.05] blur-[120px] rounded-full" />

      <div className="px-6 md:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* --- INTERACTIVE INDEX --- */}
        <div className="space-y-10 md:space-y-16 relative z-10 order-2 lg:order-1">
          <div className="space-y-4 text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="p-2 border border-white/10 rounded-full">
                    <RiFocus3Line size={14} className="text-[var(--brand-main)] animate-spin-slow" />
                </div>
                <span className="text-[8px] md:text-[9px] font-mono tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold text-white/40">Archive_Resonance</span>
            </div>
            <h2 className="text-[18vw] lg:text-[10vw] font-serif italic tracking-tighter leading-[0.8] text-white">
                The <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">Gallery</span>
            </h2>
          </div>

          {/* Scrollable list on mobile, static on desktop */}
          <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto lg:overflow-visible pr-2 scrollbar-hide">
            {products.map((p) => {
              const pId = p._id?.$oid || p._id || p.id;
              const activeId = activeArchive._id?.$oid || activeArchive._id || activeArchive.id;
              const isActive = pId === activeId;

              return (
                <button 
                  key={pId}
                  onMouseEnter={() => setActiveArchive(p)}
                  onClick={() => setActiveArchive(p)} // Essential for touch devices
                  className={`flex items-center gap-4 md:gap-8 w-full group transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] 
                    ${isActive ? 'translate-x-2 md:translate-x-6 opacity-100' : 'opacity-20 hover:opacity-50'}`}
                >
                  <div className={`h-[1px] md:h-[2px] transition-all duration-700 shadow-[0_0_15px_white] ${isActive ? 'w-10 md:w-20 bg-white' : 'w-0 bg-transparent'}`} />
                  
                  <div className="flex flex-col items-start text-left">
                      <span className="font-mono text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-[var(--brand-main)]">
                        NODE_{String(pId).slice(-4).toUpperCase()}
                      </span>
                      <h3 className="text-2xl md:text-5xl lg:text-6xl font-serif italic uppercase tracking-tighter whitespace-nowrap">
                        {p.name}
                      </h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- VISUALIZER: The Monolith --- */}
        <div className="relative aspect-[4/5] order-1 lg:order-2 group overflow-hidden bg-black rounded-sm border border-white/5 shadow-2xl w-full max-w-md mx-auto lg:max-w-none">
          
          <div className="absolute inset-0 z-20 pointer-events-none opacity-10" 
               style={{ backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />

          <img 
            key={activeArchive._id?.$oid || activeArchive._id} 
            src={getImageUrl(activeArchive)} 
            className="w-full h-full object-cover transition-all duration-1000 animate-vivid-reveal" 
            alt={activeArchive.name} 
          />

          {/* Specs Card and Add Button */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex justify-between items-end z-30 gap-4">
            <div className="relative overflow-hidden flex-grow bg-black/40 backdrop-blur-xl border border-white/10 p-4 md:p-8 transition-all duration-700 group-hover:bg-black/60">
              <div className="flex items-center gap-2 mb-2 md:mb-4 opacity-40">
                 <RiInformationLine size={10} />
                 <p className="text-[7px] md:text-[8px] font-mono font-black uppercase tracking-[0.3em]">Unit_Specs</p>
              </div>
              
              <h4 className="text-sm md:text-xl font-serif italic text-white mb-1 md:mb-3 truncate">
                {activeArchive.category || "Authentic Piece"}
              </h4>
              <p className="text-xl md:text-3xl font-black tracking-tighter text-white">
                <span className="text-[10px] md:text-sm align-top mr-0.5 font-mono opacity-50">$</span>
                {activeArchive.price.toLocaleString()}
              </p>
            </div>

            <button 
              onClick={(e) => onAdd(e, activeArchive)} 
              className="w-16 h-16 md:w-24 md:h-24 bg-white text-black flex items-center justify-center hover:scale-105 active:scale-90 transition-all duration-500 shadow-xl group/btn shrink-0"
            >
              <RiShoppingBagLine size={24} className="md:size-8 relative z-10" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vivid-reveal {
          from { opacity: 0; filter: brightness(0.5) contrast(1.2); transform: scale(1.05); }
          to { opacity: 1; filter: brightness(1) contrast(1); transform: scale(1); }
        }
        .animate-vivid-reveal { animation: vivid-reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Lookbook;