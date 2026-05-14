import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  RiFocus3Line, 
  RiPaletteLine, 
  RiInformationLine, 
  RiPercentLine,
  RiArrowRightUpLine 
} from "@remixicon/react";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const productId = item._id?.$oid || item._id || item.id;
  
  // Safe Image Extraction
  const productImg = Array.isArray(item.image) 
    ? (typeof item.image[0] === 'object' ? item.image[0].url : item.image[0])
    : (item.image || item.img);

  const colorCount = item.colors?.length || 0;
  const hasDiscount = item.discount > 0;

  // Handle Redirection for the Action Button
  const handleAccess = (e) => {
    e.preventDefault();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="group relative flex flex-col h-full selection:bg-white selection:text-black">
      {/* Clickable Image Area */}
      <Link to={`/product/${productId}`} className="relative block flex-grow">
        
        {/* --- IMAGE CONTAINER --- */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a] border border-white/5 md:group-hover:border-[var(--brand-main)]/30 transition-all duration-700">
          
          {/* Blueprint Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.01] md:opacity-0 md:group-hover:opacity-[0.04] pointer-events-none transition-opacity duration-700"
               style={{ backgroundImage: `radial-gradient(white 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

          <img
            src={productImg || "https://via.placeholder.com/400x533?text=Archive_Unit"}
            alt={item.name}
            className="w-full h-full object-cover grayscale opacity-80 md:group-hover:opacity-100 md:group-hover:grayscale-0 scale-[1.02] md:group-hover:scale-105 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
          />

          {/* --- SMART OVERLAYS --- */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-sm">
               <div className="w-1 h-1 bg-[var(--brand-main)] rounded-full animate-pulse" />
               <span className="text-[6px] font-mono uppercase text-white/80 tracking-widest">
                 NODE_{String(productId).slice(-4).toUpperCase()}
               </span>
            </div>
            
            {hasDiscount && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-sm">
                <RiPercentLine size={8} className="text-red-500" />
                <span className="text-[6px] font-mono uppercase text-red-500 tracking-widest">
                  OFFER_{item.discount}%
                </span>
              </div>
            )}
          </div>

          {/* Color Indicator */}
          {colorCount > 1 && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
              <span className="text-[6px] font-mono text-white tracking-widest uppercase">{colorCount}_VARIANTS</span>
              <RiPaletteLine size={10} className="text-[var(--brand-main)]" />
            </div>
          )}

          {/* Centered "View" HUD - Appears on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <RiArrowRightUpLine size={20} className="text-white" />
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-2 md:translate-y-4 opacity-100 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/90 to-transparent">
             <div className="flex items-center gap-2 mb-1 opacity-60">
                <RiInformationLine size={10} className="text-[var(--brand-main)]" />
                <p className="text-[7px] font-mono text-white uppercase tracking-[0.3em]">Technical_Archive</p>
             </div>
             <p className="text-[10px] md:text-[11px] font-serif italic text-white/80 uppercase tracking-[0.1em]">{item.category || "General Release"}</p>
          </div>
        </div>

        {/* --- METADATA FOOTER --- */}
        <div className="mt-5 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
                <h4 className="text-sm md:text-base font-serif italic uppercase tracking-tight text-white group-hover:text-[var(--brand-main)] transition-colors duration-500">
                {item.name.trim()}
                </h4>
                <div className="flex items-center gap-2 opacity-30">
                <RiFocus3Line size={10} className="animate-spin-slow" />
                <span className="text-[7px] font-mono uppercase tracking-[0.2em]">Ready_To_Deploy</span>
                </div>
            </div>
            
            <div className="flex flex-col items-end shrink-0">
                {hasDiscount ? (
                  <>
                    <span className="text-[9px] font-mono text-white/20 line-through tracking-tighter">
                      PKR {item.price?.toLocaleString()}
                    </span>
                    <span className="text-lg font-serif italic text-[var(--brand-main)]">
                      PKR {item.salePrice?.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-serif italic text-white">
                    PKR {item.price?.toLocaleString()}
                  </span>
                )}
            </div>
          </div>
        </div>
      </Link>

      {/* --- RECONFIGURED ACTION BUTTON --- */}
      <div className="mt-6">
        <button
          onClick={handleAccess}
          className="w-full group/btn relative overflow-hidden border border-white/10 py-3.5 flex items-center justify-center transition-all duration-500 hover:border-[var(--brand-main)]"
        >
          {/* Fill Effect */}
          <div className="absolute inset-0 bg-[var(--brand-main)] translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
          
          <span className="relative z-10 text-[9px] font-mono uppercase tracking-[0.4em] text-white group-hover/btn:text-black transition-colors duration-500 flex items-center gap-2">
            View_Item 
          </span>
        </button>
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProductCard;