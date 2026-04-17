import React from "react";
import { RiAddLine, RiInformationLine, RiCheckLine, RiStarFill } from "@remixicon/react";

const ProductInfo = ({ product, selectedSize, setSelectedSize, selectedColor, setSelectedColor, onAdd }) => {
  const sizes = ["S", "M", "L", "XL", "XXL"];
  
  const getSwatchStyle = (color) => {
    if (color === "Neutral") return { background: "linear-gradient(135deg, #222 0%, #444 100%)" };
    const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
    return { backgroundColor: isHex ? color : color.toLowerCase() };
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-12 text-white selection:bg-white selection:text-black">
      
      {/* 1. BRANDING & IDENTIFICATION */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-[1px] bg-white opacity-40" />
            <span className="text-[9px] font-mono tracking-[0.6em] text-white/30 uppercase italic">
              Archive_Spec_No. {product._id?.slice(-6).toUpperCase() || "NEW"}
            </span>
          </div>

          {/* --- NEW: RATING METRICS --- */}
          <div className="flex items-center gap-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <RiStarFill 
                  key={i} 
                  size={10} 
                  className={i < Math.round(product.rating || 0) ? "text-white" : "text-white/10"} 
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-white/40 tracking-widest uppercase">
              {product.numReviews || 0}_Impressions
            </span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-serif italic leading-[1.1] tracking-tighter">
          {product.name}
        </h1>
        
        <div className="flex items-baseline gap-4 pt-2">
          <span className="text-2xl font-light tracking-widest text-white/90">
            ${product.price?.toLocaleString()}.00
          </span>
          {isOutOfStock && (
            <span className="text-[10px] font-mono uppercase text-red-500 tracking-tighter italic px-2 py-0.5 border border-red-500/20 bg-red-500/5">
              [Unit_Depleted]
            </span>
          )}
        </div>
      </header>

      {/* 2. COLOR SELECTION ARCHIVE */}
      <div className="space-y-5">
        <div className="flex justify-between items-end">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 italic">Surface_Finish</p>
          <span className="text-[10px] font-mono uppercase text-white/60 tracking-widest animate-in fade-in slide-in-from-right-2">
            {selectedColor ? selectedColor.replace("_", " ") : "Initialization_Required"}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {/* NEUTRAL OPTION */}
          <button
            onClick={() => setSelectedColor("Neutral")}
            className={`group relative w-10 h-10 rounded-full border transition-all duration-700 flex items-center justify-center ${
              selectedColor === "Neutral" 
                ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                : 'border-white/10 hover:border-white/40'
            }`}
          >
            <div 
              className="w-7 h-7 rounded-full shadow-inner transition-transform group-hover:scale-90 duration-500 border border-white/5" 
              style={getSwatchStyle("Neutral")} 
            />
            {selectedColor === "Neutral" && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <RiCheckLine size={12} className="text-white" />
              </div>
            )}
          </button>

          {/* DYNAMIC COLORS */}
          {product.colors?.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`group relative w-10 h-10 rounded-full border transition-all duration-700 flex items-center justify-center ${
                selectedColor === color 
                  ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                  : 'border-white/10 hover:border-white/40'
              }`}
            >
              <div 
                className="w-7 h-7 rounded-full shadow-inner transition-transform group-hover:scale-90 duration-500" 
                style={getSwatchStyle(color)} 
              />
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <RiCheckLine size={12} className="text-white mix-blend-difference" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DIMENSIONAL SELECTOR */}
      <div className="space-y-5">
        <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 italic">
          <span>Dimensional_Grade</span>
          <button className="text-white/20 hover:text-white underline underline-offset-4 transition-colors">Size_Guide</button>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-4 text-[10px] font-mono transition-all border duration-300 ${
                selectedSize === size 
                  ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                  : 'border-white/10 text-white/40 hover:border-white/40 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PRIMARY ACTION */}
      <div className="pt-6 space-y-4">
        <button 
          onClick={onAdd}
          disabled={!selectedSize || !selectedColor || isOutOfStock}
          className="group relative w-full overflow-hidden bg-white py-6 text-black transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale"
        >
          <div className="relative z-10 flex items-center justify-center gap-3">
            <RiAddLine size={18} className="transition-transform group-hover:rotate-90 duration-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.5em]">
              {isOutOfStock ? "Archive_Unavailable" : "Acquire_Unit"}
            </span>
          </div>
          {!isOutOfStock && (
            <div className="absolute inset-0 bg-[#e5e5e5] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          )}
        </button>
        
        <div className="flex flex-col items-center gap-2">
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/20">
              Limited_Unit_Release • Secure_Checkout_Enabled
            </p>
            {!isOutOfStock && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[7px] font-mono text-emerald-500/50 uppercase tracking-widest">Archive_Stock_Verified</span>
              </div>
            )}
        </div>
      </div>

      {/* 5. CURATORIAL DATA */}
      <div className="pt-12 border-t border-white/5 space-y-6">
        <div className="flex items-center gap-4 group">
          <RiInformationLine size={14} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40">Curator_Commentary</span>
        </div>
        <p className="text-sm leading-relaxed text-white/50 font-serif italic max-w-md">
          {product.curatorNote || "Every stitch is a deliberate architectural decision. Crafted for permanence using heritage-grade textiles."}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;