import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightUpLine, RiFlashlightLine } from "@remixicon/react";

const Highlights = ({ items, cmsData }) => {
  const navigate = useNavigate();

  // Optimized fallback logic for CMS data
  const sectionTitle = cmsData?.highlights?.title || "The Vanguard";
  const sectionSubtitle = cmsData?.highlights?.subtitle || "Series";
  const tagline = cmsData?.highlights?.tagline || "Real_Time_Assets";

  // Guard clause: Hide section if no featured items exist
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 md:py-40 px-6 md:px-20 relative bg-[var(--brand-alt)] border-t border-[var(--brand-border)]">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <RiFlashlightLine size={16} className="text-[var(--brand-main)] animate-pulse" />
            <h2 className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] md:tracking-[0.6em] text-[var(--brand-main)] font-bold">
              {tagline}
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-serif italic tracking-tighter uppercase leading-[0.9] text-center md:text-left">
            {sectionTitle} <br /> 
            <span className="not-italic font-light opacity-40">{sectionSubtitle}</span>
          </h3>
        </div>
        
        {/* Decorative Data Line */}
        <div className="hidden md:flex items-center gap-4 opacity-40">
            <span className="text-[8px] font-mono uppercase tracking-widest text-[var(--brand-main)]">
              Protocol: Alpha_Visuals
            </span>
            <div className="w-24 h-[1px] bg-[var(--brand-main)]" />
        </div>
      </div>

      {/* --- BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {items.slice(0, 3).map((item, idx) => (
          <div 
            key={item._id || idx}
            onClick={() => navigate(`/product/${item._id || item.id}`)}
            className={`group relative overflow-hidden bg-[var(--brand-soft-bg)] border border-[var(--brand-border)] cursor-pointer transition-all duration-700 shadow-sm hover:shadow-2xl 
              ${idx === 0 
                ? 'md:col-span-8 aspect-[4/3] md:aspect-[16/9]' 
                : 'md:col-span-4 aspect-[4/5] md:aspect-[4/5]'}`}
          >
            {/* Visual Overlays: Texture & Depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-main)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-alt)]/90 via-[var(--brand-alt)]/10 to-transparent z-10" />

            {/* Product Image */}
            <img 
              src={item.img || item.image || item.thumbnail} 
              className="w-full h-full object-cover saturate-[0.7] brightness-[0.8] group-hover:saturate-100 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-110" 
              alt={item.name} 
              loading="lazy"
            />
            
            {/* Content Layer */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-20">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <span className="text-[7px] md:text-[8px] font-mono py-1 px-2 md:px-3 bg-[var(--brand-main)] text-[var(--brand-alt)] font-black uppercase">
                  {item.category || "General_Archive"}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[var(--brand-main)] font-bold italic opacity-60">
                  {item.brand || "Limited_Edition"}
                </span>
              </div>
              
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-1">
                    <p className="text-[7px] font-mono opacity-30 uppercase tracking-[0.3em] hidden md:block">
                      ID_CORE: {String(item._id || "000000").slice(-6)}
                    </p>
                    <h3 
                      className="font-serif italic uppercase leading-[0.85] tracking-tighter text-[var(--brand-main)]"
                      style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)" }}
                    >
                      {item.name}
                    </h3>
                </div>
                
                {/* Interactive Icon */}
                <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full border border-[var(--brand-main)]/30 flex items-center justify-center bg-transparent group-hover:bg-[var(--brand-main)] group-hover:text-[var(--brand-alt)] group-hover:border-[var(--brand-main)] transition-all duration-500 transform group-hover:rotate-45">
                  <RiArrowRightUpLine className="size-5 md:size-6" />
                </div>
              </div>
            </div>

            {/* High-End Shine Effect */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:animate-power-sweep" />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes power-sweep {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(250%) skewX(-12deg); }
        }
        .animate-power-sweep {
          animation: power-sweep 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default Highlights;