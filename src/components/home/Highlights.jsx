import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed
import { RiArrowRightUpLine, RiFlashlightLine, RiLoader4Line } from "@remixicon/react";

const Highlights = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        // Replace with your actual API endpoint
        // e.g., fetching featured products or products by category
        const response = await axios.get("http://localhost:5000/api/products?featured=true");
        setItems(response.data.slice(0, 3)); // Taking first 3 for the Bento Grid
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
    <section className="py-40 px-6 md:px-20 relative bg-[var(--brand-alt)]">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <RiFlashlightLine size={16} className="text-[var(--brand-main)]" />
            <h2 className="text-[10px] font-mono uppercase tracking-[0.6em] text-[var(--brand-main)] font-bold">
              Real_Time_Assets
            </h2>
          </div>
          <h3 className="text-5xl md:text-6xl font-serif italic tracking-tighter uppercase leading-none">
            The Vanguard <br /> <span className="not-italic font-light opacity-50">Series</span>
          </h3>
        </div>
        <div className="flex items-center gap-4 opacity-40">
            <span className="text-[8px] font-mono uppercase tracking-widest text-[var(--brand-main)]">Live_Database_Sync</span>
            <div className="w-20 h-[1px] bg-[var(--brand-main)]" />
        </div>
      </div>

      {/* --- BENTO GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {items.map((item, idx) => (
          <div 
            key={item._id || item.id}
            onClick={() => navigate(`/product/${item._id || item.id}`)}
            className={`group relative overflow-hidden bg-white border border-[var(--brand-border)] cursor-pointer transition-all duration-700 shadow-sm hover:shadow-2xl hover:-translate-y-2
              ${idx === 0 ? 'md:col-span-8 aspect-[16/9]' : 'md:col-span-4 aspect-[4/5]'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-main)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

            {/* Image Source now from Database */}
            <img 
              src={item.img || item.image} 
              className="w-full h-full object-cover saturate-[0.8] brightness-[0.9] group-hover:saturate-100 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-105" 
              alt={item.name} 
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-alt)]/80 via-transparent to-transparent opacity-100 group-hover:opacity-40 transition-opacity duration-700" />

            <div className="absolute bottom-10 left-10 right-10 z-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[8px] font-mono py-1 px-3 bg-[var(--brand-main)] text-[var(--brand-alt)] font-bold uppercase tracking-tighter">
                  {item.category || "New_Arrival"}
                </span>
                <span className="text-[9px] uppercase tracking-[0.4em] text-[var(--brand-main)] font-bold italic">
                  {item.brand || "Authentic"}
                </span>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="text-[7px] font-mono opacity-40 uppercase tracking-[0.3em]">REF: {String(item._id || item.id).slice(-6)}</p>
                    <h3 className="text-4xl md:text-5xl font-serif italic uppercase leading-[0.85] tracking-tighter text-[var(--brand-main)]">
                    {item.name || item.title}
                    </h3>
                </div>
                
                <div className="w-14 h-14 rounded-full border-2 border-[var(--brand-main)] flex items-center justify-center bg-transparent group-hover:bg-[var(--brand-main)] group-hover:text-[var(--brand-alt)] transition-all duration-500 transform group-hover:rotate-45">
                  <RiArrowRightUpLine size={24} />
                </div>
              </div>
            </div>

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

/* --- LOADING SKELETON: Keeps the UI powerful even while loading --- */
const HighlightSkeleton = () => (
    <section className="py-40 px-6 md:px-20 bg-[var(--brand-alt)]">
        <div className="flex items-center gap-4 mb-20 animate-pulse">
            <RiLoader4Line className="animate-spin text-[var(--brand-main)]" />
            <div className="h-4 w-48 bg-[var(--brand-border)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-8 aspect-[16/9] bg-[var(--brand-border)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
            <div className="md:col-span-4 aspect-[4/5] bg-[var(--brand-border)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
            </div>
        </div>
        <style>{`
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            .animate-shimmer { animation: shimmer 2s infinite; }
        `}</style>
    </section>
);

export default Highlights;