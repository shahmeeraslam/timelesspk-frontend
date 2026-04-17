import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api"; 
import { RiArrowRightUpLine, RiFlashlightLine, RiLoader4Line } from "@remixicon/react";

const Highlights = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await API.get("/api/products?featured=true");
        setItems(response.data.slice(0, 3)); 
      } catch (error) {
        console.error("Extraction_Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  if (loading) return <HighlightSkeleton />;

  return (
    <section className="py-24 md:py-40 px-6 md:px-20 relative bg-[var(--brand-alt)]">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <RiFlashlightLine size={16} className="text-[var(--brand-main)]" />
            <h2 className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] md:tracking-[0.6em] text-[var(--brand-main)] font-bold">
              Real_Time_Assets
            </h2>
          </div>
          <h3 className="text-4xl md:text-6xl font-serif italic tracking-tighter uppercase leading-none text-center md:text-left">
            The Vanguard <br /> <span className="not-italic font-light opacity-50">Series</span>
          </h3>
        </div>
        <div className="hidden md:flex items-center gap-4 opacity-40">
            <span className="text-[8px] font-mono uppercase tracking-widest text-[var(--brand-main)]">Live_Database_Sync</span>
            <div className="w-20 h-[1px] bg-[var(--brand-main)]" />
        </div>
      </div>

      {/* --- BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {items.map((item, idx) => (
          <div 
            key={item._id || item.id}
            onClick={() => navigate(`/product/${item._id || item.id}`)}
            className={`group relative overflow-hidden bg-white border border-[var(--brand-border)] cursor-pointer transition-all duration-700 shadow-sm hover:shadow-2xl 
              ${idx === 0 
                ? 'md:col-span-8 aspect-[4/3] md:aspect-[16/9]' 
                : 'md:col-span-4 aspect-[4/5] md:aspect-[4/5]'}`}
          >
            {/* Visual Overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-main)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-alt)]/90 via-[var(--brand-alt)]/20 to-transparent z-10" />

            <img 
              src={item.img || item.image} 
              className="w-full h-full object-cover saturate-[0.8] brightness-[0.9] group-hover:saturate-100 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-105" 
              alt={item.name} 
            />
            
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 z-20">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <span className="text-[7px] md:text-[8px] font-mono py-1 px-2 md:px-3 bg-[var(--brand-main)] text-[var(--brand-alt)] font-bold uppercase">
                  {item.category || "New_Arrival"}
                </span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.4em] text-[var(--brand-main)] font-bold italic">
                  {item.brand || "Authentic"}
                </span>
              </div>
              
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-1">
                    <p className="text-[7px] font-mono opacity-40 uppercase tracking-[0.3em] hidden md:block">REF: {String(item._id || item.id).slice(-6)}</p>
                    <h3 
                      className="font-serif italic uppercase leading-[0.85] tracking-tighter text-[var(--brand-main)]"
                      style={{ fontSize: "clamp(1.75rem, 8vw, 3rem)" }}
                    >
                      {item.name || item.title}
                    </h3>
                </div>
                
                <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full border border-[var(--brand-main)] flex items-center justify-center bg-transparent group-hover:bg-[var(--brand-main)] group-hover:text-[var(--brand-alt)] transition-all duration-500 transform group-hover:rotate-45">
                  <RiArrowRightUpLine className="size-5 md:size-6" />
                </div>
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-power-sweep" />
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
          animation: power-sweep 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
      `}</style>
    </section>
  );
};

const HighlightSkeleton = () => (
    <section className="py-24 md:py-40 px-6 md:px-20 bg-[var(--brand-alt)]">
        <div className="flex items-center gap-4 mb-20 animate-pulse">
            <RiLoader4Line className="animate-spin text-[var(--brand-main)]" />
            <div className="h-4 w-48 bg-[var(--brand-border)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 aspect-[4/3] md:aspect-[16/9] bg-[var(--brand-border)] overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
            <div className="hidden md:block md:col-span-4 aspect-[4/5] bg-[var(--brand-border)]" />
        </div>
    </section>
);

export default Highlights;