import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  RiFocus3Line, 
  RiInformationLine, 
  RiArrowRightUpLine, 
  RiScan2Line,
  RiDatabaseLine
} from "@remixicon/react";
import { motion } from 'framer-motion';


const Lookbook = ({ cmsData, products, activeArchive, setActiveArchive }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0 || !activeArchive) return null;

  const sectionTitle = cmsData?.lookbook?.title || "The Gallery";
  const sectionTagline = cmsData?.lookbook?.tagline || "Archive_Resonance";

  const getImageUrl = (item) => {
    if (!item) return "";
    return item.img || (Array.isArray(item.image) ? (typeof item.image[0] === 'string' ? item.image[0] : item.image[0]?.url) : item.image);
  };

  const handleNavigate = () => {
    const pId = activeArchive._id?.toString() || activeArchive.id;
    navigate(`/product/${pId}`);
  };

  return (
    <section className="bg-[#030303] text-white py-24 md:py-40 relative overflow-hidden">
      
      {/* --- ATMOSPHERICS --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-20" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-20" />
      </div>

      <div className="px-6 md:px-12 lg:px-20 relative z-10 max-w-[1800px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <RiScan2Line size={14} className="text-[var(--brand-main)]" />
              <span className="text-[10px] font-mono tracking-[0.6em] uppercase text-[var(--brand-main)]">
                {sectionTagline}
              </span>
            </div>
            <h2 className="text-[12vw] lg:text-[7vw] font-serif italic tracking-tighter leading-[0.85] text-white">
              {sectionTitle.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "text-white/20" : ""}>{word} </span>
              ))}
            </h2>
          </div>
          
          <div className="hidden lg:block text-right max-w-xs">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 leading-relaxed">
              System_Status: Optimal <br />
              Encryption: Active <br />
              Displaying_Nodes: 00{products.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* --- LEFT: INTERACTIVE INDEX --- */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="flex flex-col gap-2">
              {products.map((p, index) => {
                const pId = p._id?.toString() || p.id;
                const activeId = activeArchive._id?.toString() || activeArchive.id;
                const isActive = pId === activeId;

                return (
                  <button 
                    key={pId}
                    onMouseEnter={() => window.innerWidth > 1024 && setActiveArchive(p)}
                    onClick={() => setActiveArchive(p)}
                    className={`group relative flex flex-col items-start py-8 transition-all duration-700
                      ${isActive ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-mono text-[9px] text-[var(--brand-main)]">0{index + 1}</span>
                      <h3 className="text-2xl md:text-4xl font-serif italic uppercase tracking-tight">
                        {p.name}
                      </h3>
                    </div>

                    {/* Progress Bar UX */}
                    <div className="mt-4 w-full h-[1px] bg-white/5 relative overflow-hidden">
                      {isActive && (
                        <motion.div 
                          layoutId="activeBar"
                          className="absolute inset-0 bg-[var(--brand-main)] origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- RIGHT: THE ARCHIVE VISUALIZER --- */}
          <div className="lg:col-span-8 order-1 lg:order-2 relative">
            <div 
              onClick={handleNavigate}
              className="relative aspect-[4/5] md:aspect-[16/10] group overflow-hidden cursor-none"
            >
              {/* Technical Scanlines Overlay */}
              <div className="absolute inset-0 z-20 pointer-events-none bg-scanlines opacity-[0.03]" />
              
              <img 
                key={activeArchive._id?.toString()} 
                src={getImageUrl(activeArchive)} 
                className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110 blur-0 group-hover:blur-[2px]" 
                alt={activeArchive.name} 
              />

              {/* OVERLAY HUD (Hidden until hover on desktop, always visible on mobile) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center z-30">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                     <RiArrowRightUpLine size={24} className="text-[var(--brand-main)] group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Access_Product_Core</span>
                </div>
              </div>

              {/* BOTTOM DATA HUD */}
              <div className="absolute bottom-0 left-0 right-0 z-40 p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[var(--brand-main)]">
                      <RiDatabaseLine size={12} />
                      <span className="text-[8px] font-mono uppercase tracking-widest">Technical_Specs</span>
                    </div>
                    <p className="text-xl md:text-3xl font-black uppercase tracking-tighter">
                      {activeArchive.category || "Standard_Issue"}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase">Valuation</span>
                    <p className="text-2xl font-serif italic text-[var(--brand-main)]">
                      ${activeArchive.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .bg-scanlines {
          background: linear-gradient(to bottom, transparent 50%, black 50%);
          background-size: 100% 4px;
        }
        @keyframes vivid-reveal {
          from { opacity: 0; filter: brightness(0.5) contrast(1.2); transform: translateY(20px); }
          to { opacity: 1; filter: brightness(1) contrast(1); transform: translateY(0); }
        }
        .animate-vivid-reveal { 
          animation: vivid-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
      `}</style>
    </section>
  );
};

export default Lookbook;