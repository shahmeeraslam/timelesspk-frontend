import React from "react";
import { Link } from "react-router-dom";
import { RiAddLine, RiFocus3Line, RiPaletteLine } from "@remixicon/react";

const ProductCard = ({ item, addToCart }) => {
  const productId = item._id?.$oid || item._id || item.id;
  
  // --- UPDATED IMAGE LOGIC ---
  // Safely extract the first image URL from the new tagged structure
  const productImg = Array.isArray(item.image) 
    ? (typeof item.image[0] === 'object' ? item.image[0].url : item.image[0])
    : (item.image || item.img);

  // Count available color variations
  const colorCount = item.colors?.length || 0;

  return (
    <div className="group relative flex flex-col selection:bg-white selection:text-black">
      <Link to={`/product/${productId}`} className="relative block overflow-hidden">
        
        {/* --- IMAGE CONTAINER --- */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/5 transition-all duration-700 group-hover:border-white/20">
          
          {/* Blueprint Grid Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-700"
               style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

          {/* Product Image */}
          <img
            src={productImg || "https://via.placeholder.com/400x533?text=Archive_Unit"}
            alt={item.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-[1.01] group-hover:scale-110 transition-all duration-[1.5s] ease-out"
          />

          {/* Interactive UI Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top-Left: Unit ID */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
             <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
             <span className="text-[7px] font-mono uppercase text-white/60 tracking-[0.3em] backdrop-blur-md px-2 py-1 border border-white/10">
               ID_{String(productId).slice(-4).toUpperCase()}
             </span>
          </div>

          {/* Top-Right: Color Count Badge (New) */}
          {colorCount > 1 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
              <span className="text-[7px] font-mono uppercase text-white/40 tracking-widest">{colorCount}_FINISHES</span>
              <RiPaletteLine size={10} className="text-white/40" />
            </div>
          )}

          {/* Bottom-Left: Technical Specs (Category) */}
          <div className="absolute bottom-6 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
             <p className="text-[7px] font-mono text-white/40 uppercase tracking-[0.5em] mb-1 text-[8px]">Classification</p>
             <p className="text-[11px] font-serif italic text-white uppercase tracking-[0.2em]">{item.category}</p>
          </div>

          {/* Corner Brackets (Animated) */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150 group-hover:scale-100" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-700 scale-150 group-hover:scale-100" />
        </div>

        {/* --- METADATA FOOTER --- */}
        <div className="mt-6 flex justify-between items-end">
          <div className="space-y-1">
            <h4 className="text-sm font-serif italic uppercase tracking-tighter text-white group-hover:tracking-normal transition-all duration-500">
              {item.name}
            </h4>
            <div className="flex items-center gap-2 opacity-30">
               <RiFocus3Line size={10} className="text-white" />
               <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white">Deploy_Ready</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-mono text-white/20 line-through tracking-tighter">$ {Math.round(item.price * 1.2)}.00</span>
             <span className="text-lg font-serif italic text-white">${item.price?.toLocaleString()}.00</span>
          </div>
        </div>
      </Link>

      {/* --- ACTION BUTTON --- */}
      <div className="mt-6 relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            // Defaulting to first color/size if not selected via card
            addToCart({ 
              ...item, 
              color: item.colors?.[0] || "Neutral", 
              size: "M",
              img: productImg 
            });
          }}
          className="w-full group/btn relative overflow-hidden border border-white/10 py-4 flex items-center justify-center gap-3 transition-all duration-500 hover:border-white"
        >
          {/* Button Background Fill */}
          <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
          
          {/* Button Content */}
          <span className="relative z-10 text-[9px] font-mono uppercase tracking-[0.4em] text-white group-hover/btn:text-black transition-colors duration-500 flex items-center gap-2">
            <RiAddLine size={14} />
            Acquire_Unit
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;