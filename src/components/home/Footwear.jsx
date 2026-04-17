import React from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowRightUpLine, RiFootprintLine } from "@remixicon/react";

const Footwear = ({ shoes }) => {
  const navigate = useNavigate();

  // Safety Guard: Handles empty database states
  if (!shoes || shoes.length === 0) return null;

  return (
    <section className="py-40 px-6 md:px-20 relative overflow-hidden">
      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute top-0 left-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_left,var(--brand-main)_0%,transparent_70%)] opacity-[0.03] pointer-events-none" />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[var(--brand-main)] opacity-60">
            <RiFootprintLine size={14} className="animate-pulse" />
            <span className="text-[8px] font-mono tracking-[0.4em] uppercase">Kinetic_Architecture</span>
          </div>
          <h3 className="text-6xl font-serif italic leading-none tracking-tighter uppercase">
            Technical <br/> Footwear
          </h3>
        </div>
        <p className="text-[9px] font-mono uppercase tracking-[0.4em] opacity-40 max-w-xs md:text-right leading-relaxed">
          [ 002—Footwear_Archive ] <br /> 
          Sculpted for ergonomic motion and structural integrity in urban environments.
        </p>
      </div>
      
      {/* --- PRODUCT GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {shoes.slice(0, 3).map((s) => {
          // Resolve IDs and Images for MongoDB structure
          const shoeId = s._id?.$oid || s._id || s.id;
          const shoeImg = Array.isArray(s.image) ? s.image[0] : (s.img || s.image);

          return (
            <div 
              key={shoeId} 
              className="group relative p-10 bg-[var(--brand-soft-bg)] border border-[var(--brand-border)] hover:border-[var(--brand-main)] transition-all duration-700 flex flex-col"
            >
              {/* Blueprint Grid Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none"
                   style={{ backgroundImage: `radial-gradient(circle, var(--brand-main) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

              {/* Top Serial Marker */}
              <div className="flex justify-between items-start mb-10">
                <span className="text-[7px] font-mono opacity-40 uppercase tracking-widest">
                  UNIT_{String(shoeId).slice(-4).toUpperCase()}
                </span>
                <div className="w-2 h-2 rounded-full border border-[var(--brand-main)] group-hover:bg-[var(--brand-main)] transition-all duration-500" />
              </div>

              {/* Image Container: Shoe specific scaling */}
              <div className="aspect-square flex items-center justify-center p-4 mb-10 relative">
                 <div className="absolute inset-0 border border-dashed border-[var(--brand-main)] opacity-0 group-hover:opacity-10 rounded-full scale-90 group-hover:scale-110 transition-all duration-1000" />
                 <img 
                   src={shoeImg} 
                   className="max-w-full max-h-full object-contain -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-1000 z-10" 
                   alt={s.name} 
                 />
              </div>

              {/* Footer Metadata */}
              <div className="mt-auto pt-8 border-t border-[var(--brand-border)]/50 group-hover:border-[var(--brand-main)]/30 transition-colors">
                <p className="text-[8px] font-mono opacity-40 uppercase mb-1">{s.category || "Silhouette"}</p>
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-serif italic uppercase tracking-tight">{s.name}</h4>
                  <button 
                    onClick={() => navigate(`/product/${shoeId}`)} 
                    className="w-10 h-10 rounded-full border border-[var(--brand-border)] group-hover:border-[var(--brand-main)] group-hover:bg-[var(--brand-main)] group-hover:text-[var(--brand-alt)] flex items-center justify-center transition-all duration-500"
                  >
                    <RiArrowRightUpLine size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Footwear;