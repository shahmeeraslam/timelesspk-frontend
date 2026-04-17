import React from "react";
import { RiAddLine, RiInformationLine, RiCheckLine, RiStarFill, RiRuler2Line } from "@remixicon/react";

const ProductInfo = ({ product, selectedSize, setSelectedSize, selectedColor, setSelectedColor, onAdd }) => {
  const sizes = ["S", "M", "L", "XL", "XXL"];
  
  const getSwatchStyle = (color) => {
    if (color === "Neutral") return { background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)" };
    const isHex = /^#([A-Fa-f0-9]{3}){1,2}$/.test(color);
    return { backgroundColor: isHex ? color : color.toLowerCase() };
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-10 md:space-y-12 text-white selection:bg-white selection:text-black">
      
      {/* 1. BRANDING & IDENTIFICATION */}
      <header className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-[1px] bg-[var(--brand-main)]" />
            <span className="text-[8px] font-mono tracking-[0.5em] text-white/40 uppercase">
              SPEC_NO. {product._id?.slice(-6).toUpperCase() || "NEW"}
            </span>
          </div>

          {/* RATING METRICS */}
          <div className="flex items-center gap-3 group cursor-help">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <RiStarFill 
                  key={i} 
                  size={10} 
                  className={i < Math.round(product.rating || 0) ? "text-[var(--brand-main)]" : "text-white/10"} 
                />
              ))}
            </div>
            <span className="text-[7px] font-mono text-white/30 tracking-widest uppercase group-hover:text-white transition-colors">
              {product.numReviews || 0}_LOGS
            </span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif italic leading-none tracking-tighter uppercase">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4">
          <span className="text-2xl font-light tracking-tighter text-white">
            ${product.price?.toLocaleString()}.00
          </span>
          {isOutOfStock ? (
            <span className="text-[9px] font-mono uppercase text-red-500 tracking-widest px-2 py-1 bg-red-500/10 border border-red-500/20">
              DEPLETED
            </span>
          ) : (
             <span className="text-[9px] font-mono uppercase text-emerald-500/60 tracking-widest">
              Available_In_Vault
            </span>
          )}
        </div>
      </header>

      {/* 2. COLOR SELECTION ARCHIVE */}
      <div className="space-y-6">
        <div className="flex justify-between items-baseline">
          <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30">Surface_Finish</p>
          <span className="text-[10px] font-mono uppercase text-[var(--brand-main)] tracking-widest">
            {selectedColor ? selectedColor.replace("_", " ") : "Pending_Select"}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 md:gap-5">
          {/* NEUTRAL OPTION */}
          <button
            onClick={() => setSelectedColor("Neutral")}
            className={`group relative w-12 h-12 rounded-full border transition-all duration-500 flex items-center justify-center ${
              selectedColor === "Neutral" 
                ? 'border-white bg-white/5 scale-110' 
                : 'border-white/10 hover:border-white/30'
            }`}
          >
            <div 
              className="w-8 h-8 rounded-full shadow-2xl transition-transform group-hover:scale-90 duration-500" 
              style={getSwatchStyle("Neutral")} 
            />
            {selectedColor === "Neutral" && <RiCheckLine size={14} className="absolute text-white" />}
          </button>

          {/* DYNAMIC COLORS */}
          {product.colors?.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`group relative w-12 h-12 rounded-full border transition-all duration-500 flex items-center justify-center ${
                selectedColor === color 
                  ? 'border-white bg-white/5 scale-110' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full shadow-2xl transition-transform group-hover:scale-90 duration-500" 
                style={getSwatchStyle(color)} 
              />
              {selectedColor === color && <RiCheckLine size={14} className="absolute text-white mix-blend-difference" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DIMENSIONAL SELECTOR */}
      <div className="space-y-6">
        <div className="flex justify-between items-baseline">
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/30">Dimensions</span>
          <button className="flex items-center gap-2 text-[8px] font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors group">
            <RiRuler2Line size={12} className="group-hover:rotate-45 transition-transform" />
            Size_Guide
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`py-5 text-[10px] font-mono transition-all border duration-500 ${
                selectedSize === size 
                  ? 'bg-white text-black border-white' 
                  : 'border-white/10 text-white/30 hover:border-white/40 hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 4. PRIMARY ACTION */}
      <div className="pt-4 space-y-6">
        <button 
          onClick={onAdd}
          disabled={!selectedSize || !selectedColor || isOutOfStock}
          className="group relative w-full overflow-hidden bg-white py-7 text-black transition-all active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed"
        >
          {/* Slide-in Background */}
          <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          
          <div className="relative z-10 flex items-center justify-center gap-4">
            <RiAddLine size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-[11px] font-black uppercase tracking-[0.6em]">
              {isOutOfStock ? "UNIT_DEPLETED" : "Acquire_Unit"}
            </span>
          </div>
        </button>
        
        <div className="flex flex-col items-center gap-3">
            <p className="text-[7px] font-mono uppercase tracking-[0.4em] text-white/20">
              Encrypted_Transaction // Secure_Checkout_Node
            </p>
            {!isOutOfStock && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.03] border border-white/5">
                <div className="w-1 h-1 bg-[var(--brand-main)] rounded-full animate-pulse" />
                <span className="text-[7px] font-mono text-[var(--brand-main)] uppercase tracking-[0.3em]">Stock_Sync_Confirmed</span>
              </div>
            )}
        </div>
      </div>

      {/* 5. CURATORIAL DATA */}
      <div className="pt-10 border-t border-white/5">
        <div className="flex items-center gap-4 mb-4">
          <RiInformationLine size={14} className="text-[var(--brand-main)]" />
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Curator_Commentary</span>
        </div>
        <p className="text-sm leading-relaxed text-white/50 font-serif italic max-w-md">
          {product.curatorNote || "Every unit is a deliberate architectural study. Constructed for permanence using heritage-grade technical textiles."}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;