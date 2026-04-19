import React from "react";
import { useNavigate } from "react-router-dom"; // Assumes you use react-router
import { RiShoppingBagLine, RiFocus3Line, RiInformationLine } from "@remixicon/react";

const Lookbook = ({ cmsData, products, activeArchive, setActiveArchive, onAdd }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0 || !activeArchive) return null;

  const sectionTitle = cmsData?.lookbook?.title || "The Gallery";
  const sectionTagline = cmsData?.lookbook?.tagline || "Archive_Resonance";

  const getImageUrl = (item) => {
    if (!item) return "";
    return item.img || (Array.isArray(item.image) ? (typeof item.image[0] === 'string' ? item.image[0] : item.image[0]?.url) : item.image);
  };

  // Navigates to the product detail page
  const handleNavigate = () => {
    const pId = activeArchive._id?.toString() || activeArchive.id;
    navigate(`/product/${pId}`);
  };

  return (
    <section className="bg-[#050505] text-white py-24 md:py-32 lg:py-48 relative overflow-hidden">
      
      {/* --- BACKGROUND ATMOSPHERICS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[var(--brand-main)] opacity-[0.04] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40vw] h-[40vw] bg-white opacity-[0.02] blur-[100px] rounded-full" />
      </div>

      <div className="px-6 md:px-12 lg:px-20 relative z-10 max-w-[1800px] mx-auto">
        
        {/* --- HEADER BLOCK --- */}
        <div className="mb-16 md:mb-24 space-y-4">
          <div className="flex items-center gap-3">
            <RiFocus3Line size={14} className="text-[var(--brand-main)] animate-spin-slow" />
            <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/40">
              {sectionTagline}
            </span>
          </div>
          <h2 className="text-[10vw] lg:text-[6vw] font-serif italic tracking-tighter leading-[0.9] text-white max-w-[15ch]">
            {sectionTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* --- LEFT: PRODUCT INDEX --- */}
          <div className="lg:col-span-5 order-2 lg:order-1 h-full">
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-1 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 scrollbar-hide snap-x pr-4">
              {products.map((p) => {
                const pId = p._id?.toString() || p.id;
                const activeId = activeArchive._id?.toString() || activeArchive.id;
                const isActive = pId === activeId;

                return (
                  <button 
                    key={pId}
                    onMouseEnter={() => window.innerWidth > 1024 && setActiveArchive(p)} // Only hover on desktop
                    onClick={() => setActiveArchive(p)}
                    className={`flex items-center gap-4 lg:gap-6 min-w-[75vw] lg:min-w-0 snap-center transition-all duration-500 py-6 border-b border-white/5 lg:border-none group
                      ${isActive ? 'opacity-100 lg:translate-x-4' : 'opacity-20 lg:hover:opacity-40 translate-x-0'}`}
                  >
                    <div className={`hidden lg:block h-[1px] transition-all duration-500 ${isActive ? 'w-12 bg-[var(--brand-main)]' : 'w-0 bg-white/20'}`} />
                    
                    <div className="flex flex-col items-start text-left overflow-hidden">
                        <span className="font-mono text-[8px] tracking-[0.3em] text-[var(--brand-main)] mb-1 uppercase">
                          ID_{String(pId).slice(-4)}
                        </span>
                        <h3 className="text-xl md:text-3xl lg:text-4xl font-serif italic uppercase tracking-tight truncate w-full transition-all">
                          {p.name}
                        </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- RIGHT: THE MONOLITH --- */}
          <div className="lg:col-span-7 order-1 lg:order-2 lg:pl-12">
            <div 
              onClick={handleNavigate}
              className="relative aspect-[10/12] lg:aspect-[4/5] group overflow-hidden bg-[#080808] rounded-sm border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.7)] cursor-pointer"
            >
              
              {/* Technical Overlay */}
              <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.15]" 
                   style={{ backgroundImage: `linear-gradient(#ffffff10 1px, transparent 1px), linear-gradient(90deg, #ffffff10 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

              <img 
                key={activeArchive._id?.toString()} 
                src={getImageUrl(activeArchive)} 
                className="w-full h-full object-cover transition-all duration-1000 scale-100 lg:group-hover:scale-105 animate-vivid-reveal" 
                alt={activeArchive.name} 
              />

              {/* PRODUCT HUD - Dynamic Visibility */}
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-30">
                <div className={`flex items-stretch gap-px bg-white/5 backdrop-blur-2xl border border-white/10 rounded-sm overflow-hidden transition-all duration-700 
                  /* Mobile: Always Visible | Desktop: Hidden until hover */
                  translate-y-0 opacity-100 lg:translate-y-4 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100`}>
                  
                  {/* Info Section */}
                  <div className="flex-grow p-6 flex flex-col justify-center bg-black/40">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 opacity-50">
                          <RiInformationLine size={12} />
                          <span className="text-[8px] font-mono uppercase tracking-[0.2em]">Data_Output</span>
                        </div>
                        <span className="text-[10px] font-mono text-[var(--brand-main)]">00{products.indexOf(activeArchive) + 1}</span>
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-mono text-white/60 uppercase mb-1">{activeArchive.category || "General_Release"}</h4>
                        <p className="text-2xl font-black tracking-tighter text-white">
                          <span className="text-xs mr-1 opacity-40 font-mono">$</span>
                          {activeArchive.price?.toLocaleString()}
                        </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents navigating to product page when adding to cart
                      onAdd(e, activeArchive);
                    }} 
                    className="w-20 md:w-28 bg-[var(--brand-main)] text-black flex flex-col items-center justify-center lg:hover:bg-white transition-all duration-500"
                  >
                    <RiShoppingBagLine size={24} />
                    <span className="text-[7px] font-black uppercase tracking-widest mt-2">Acquire</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vivid-reveal {
          from { opacity: 0; filter: brightness(0.2) blur(10px); transform: scale(1.1); }
          to { opacity: 1; filter: brightness(1) blur(0); transform: scale(1); }
        }
        .animate-vivid-reveal { animation: vivid-reveal 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Lookbook;