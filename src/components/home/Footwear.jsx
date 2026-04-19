import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightUpLine, RiFootprintLine } from "@remixicon/react";

const Footwear = ({ cmsData, shoes }) => {
  const navigate = useNavigate();

  // 1. Logic to handle empty states
  if (!shoes || shoes.length === 0) return null;

  // 2. CMS Dynamic Text
  const sectionTitle = cmsData?.footwear?.title || "Technical Footwear";
  const sectionSubtitle = cmsData?.footwear?.subtitle || "Sculpted for ergonomic motion and structural integrity.";
  const sectionTagline = cmsData?.footwear?.tagline || "Kinetic_Architecture";

  const getShoeImage = (s) => {
    if (!s) return "";
    return s.img || (Array.isArray(s.image) ? (typeof s.image[0] === 'string' ? s.image[0] : s.image[0]?.url) : s.image);
  };

  return (
    <section className="py-24 md:py-40 px-6 md:px-20 relative overflow-hidden bg-black">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_left,var(--brand-main)_0%,transparent_70%)] opacity-[0.05] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[var(--brand-main)] opacity-60">
            <RiFootprintLine size={14} className="animate-pulse" />
            <span className="text-[8px] font-mono tracking-[0.4em] uppercase">{sectionTagline}</span>
          </div>
          <h3 className="text-4xl md:text-6xl font-serif italic leading-none tracking-tighter uppercase text-white">
            {/* Allowing for <br/> if the title has multiple words */}
            {sectionTitle.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === 0 && sectionTitle.split(' ').length > 1 && <br/>}
              </React.Fragment>
            ))}
          </h3>
        </div>
        <div className="max-w-xs md:text-right space-y-2">
           <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/40 leading-relaxed">
            [ 002—Archive ] 
          </p>
          <p className="text-[10px] text-white/60 font-serif italic">
            {sectionSubtitle}
          </p>
        </div>
      </div>
      
      {/* --- PRODUCT GRID --- */}
      <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 scrollbar-hide snap-x snap-mandatory relative z-10">
        {shoes.map((s) => {
          const shoeId = s._id?.toString() || s.id;
          const shoeImg = getShoeImage(s);

          return (
            <div 
              key={shoeId} 
              className="group relative p-8 md:p-10 bg-white/[0.02] border border-white/5 hover:border-[var(--brand-main)] transition-all duration-700 flex flex-col min-w-[85vw] md:min-w-0 snap-center rounded-sm"
            >
              {/* Blueprint Grid Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none"
                   style={{ backgroundImage: `radial-gradient(circle, var(--brand-main) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

              <div className="flex justify-between items-start mb-8 md:mb-10">
                <span className="text-[7px] font-mono opacity-40 uppercase tracking-widest text-white">
                  UNIT_{String(shoeId).slice(-4).toUpperCase()}
                </span>
                <div className="w-1.5 h-1.5 rounded-full border border-[var(--brand-main)] group-hover:bg-[var(--brand-main)] transition-all duration-500" />
              </div>

              <div className="aspect-square flex items-center justify-center p-4 mb-8 md:mb-10 relative">
                 <div className="absolute inset-0 border border-dashed border-[var(--brand-main)] opacity-0 group-hover:opacity-10 rounded-full scale-90 group-hover:scale-110 transition-all duration-1000" />
                 <img 
                   src={shoeImg} 
                   className="max-w-[120%] md:max-w-full max-h-full object-contain -rotate-12 group-hover:rotate-0 group-hover:scale-125 md:group-hover:scale-110 transition-all duration-1000 z-10 will-change-transform" 
                   alt={s.name} 
                 />
              </div>

              <div className="mt-auto pt-6 md:pt-8 border-t border-white/10 group-hover:border-[var(--brand-main)]/30 transition-colors">
                <p className="text-[7px] md:text-[8px] font-mono opacity-40 uppercase mb-1 text-white">{s.category || "Silhouette"}</p>
                <div className="flex justify-between items-center gap-4">
                  <h4 className="text-lg md:text-xl font-serif italic uppercase tracking-tight text-white truncate">
                    {s.name}
                  </h4>
                  <button 
                    onClick={() => navigate(`/product/${shoeId}`)} 
                    className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-white/10 group-hover:border-[var(--brand-main)] group-hover:bg-[var(--brand-main)] group-hover:text-black flex items-center justify-center transition-all duration-500"
                  >
                    <RiArrowRightUpLine size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Footwear;