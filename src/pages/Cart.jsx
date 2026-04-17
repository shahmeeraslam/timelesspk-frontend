import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { RiCloseLine, RiExpandDiagonalLine, RiShoppingBagLine } from "@remixicon/react";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, changeSize, cartTotal } = useCart();
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const getSizeOptions = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("shoes")) return ["40", "41", "42", "43", "44", "45"];
    if (cat.includes("pants")) return ["28", "30", "32", "34", "36"];
    if (cat.includes("watch") || cat.includes("accessory")) return ["One Size"];
    return ["S", "M", "L", "XL"];
  };

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-12 relative bg-[var(--brand-alt)] text-[var(--brand-main)]">
      
      {/* --- FULLSCREEN PREVIEW --- */}
      {fullscreenImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setFullscreenImg(null)}>
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform p-2">
            <RiCloseLine size={32} />
          </button>
          <img 
            src={fullscreenImg} 
            className="max-w-full max-h-[80vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Preview" 
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header with Item Count */}
        <div className="flex items-baseline justify-between mb-8 md:mb-12 border-b border-white/5 pb-6">
            <h1 className="text-3xl md:text-4xl font-serif italic uppercase tracking-tighter">Your Selection</h1>
            <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">{cart.length} UNITS_LOGGED</span>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mb-6 flex justify-center opacity-10">
                <RiShoppingBagLine size={64} />
            </div>
            <p className="font-mono mb-8 text-[10px] tracking-[0.4em] uppercase opacity-40">The archive is currently empty.</p>
            <Link to="/collection" className="inline-block px-10 py-4 border border-[var(--brand-main)] text-[10px] uppercase tracking-widest font-bold hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all">
              Initialize Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            
            {/* --- ITEM LIST --- */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">
              {cart.map((item) => {
                const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
                const pId = pData._id || item.productId;
                const displayImg = pData.img || pData.image?.[0];

                return (
                  <div key={`${pId}-${item.size}`} className="flex flex-col sm:flex-row gap-6 pb-8 md:pb-10 border-b border-white/5 relative group">
                    
                    {/* Image Box */}
                    <div className="w-full sm:w-32 h-48 sm:h-44 flex-shrink-0 bg-white/[0.03] overflow-hidden relative group/img">
                      <img 
                        src={displayImg} 
                        alt={pData.name} 
                        className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover/img:scale-105 group-hover/img:opacity-100" 
                      />
                      <button 
                        onClick={() => setFullscreenImg(displayImg)}
                        className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md text-white rounded-full opacity-100 sm:opacity-0 group-hover/img:opacity-100 transition-all"
                      >
                        <RiExpandDiagonalLine size={16} />
                      </button>
                    </div>

                    {/* Content Box */}
                    <div className="flex flex-col justify-between w-full py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-[13px] md:text-[11px] uppercase tracking-[0.2em] font-black">{pData.name}</h3>
                            <p className="text-[9px] font-mono mt-1 uppercase tracking-widest opacity-40">CAT_{pData.category || "UNCLASSIFIED"}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(pId, item.size)}
                            className="p-2 -mr-2 text-[9px] uppercase tracking-[0.2em] opacity-30 hover:opacity-100 hover:text-red-500 transition-all"
                          >
                            [Remove]
                          </button>
                        </div>
                        
                        {/* Size Selection - Larger touch targets for mobile */}
                        <div className="mt-4">
                            <span className="text-[7px] font-mono uppercase tracking-widest opacity-30 mb-2 block">Variant_Selector</span>
                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                              {getSizeOptions(pData.category).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => changeSize && changeSize(pId, item.size, s)}
                                  className={`text-[9px] min-w-[32px] md:min-w-[40px] py-2 border transition-all font-mono ${
                                    item.size === s 
                                    ? 'bg-[var(--brand-main)] text-[var(--brand-alt)] border-[var(--brand-main)]' 
                                    : 'border-white/10 hover:border-white/30 opacity-40'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex justify-between items-center mt-8 pt-4 border-t border-white/[0.02]">
                        <div className="flex items-center bg-white/[0.03] border border-white/10">
                          <button onClick={() => updateQuantity(pId, item.size, -1)} className="w-10 h-8 flex items-center justify-center text-lg hover:bg-white/5 transition-colors">-</button>
                          <span className="w-10 h-8 flex items-center justify-center text-[10px] font-mono border-x border-white/10">{item.quantity}</span>
                          <button onClick={() => updateQuantity(pId, item.size, 1)} className="w-10 h-8 flex items-center justify-center text-lg hover:bg-white/5 transition-colors">+</button>
                        </div>
                        <div className="text-right">
                            <span className="text-[8px] block font-mono opacity-30 uppercase tracking-widest mb-1">Unit_Total</span>
                            <span className="text-lg md:text-xl font-serif italic leading-none">${(pData.price || 0) * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- SUMMARY STICKY --- */}
            <div className="lg:col-span-1">
                <div className="p-6 md:p-8 sticky top-32 bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-8 opacity-60">
                        <div className="w-1 h-3 bg-[var(--brand-main)]" />
                        <h2 className="text-[10px] uppercase tracking-[0.4em] font-black">Transaction_Summary</h2>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase">
                            <span className="opacity-40">Subtotal_Val</span>
                            <span>${cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono tracking-widest uppercase">
                            <span className="opacity-40">Transit_Fee</span>
                            <span className="text-[var(--brand-main)]">0.00</span>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                            <span className="text-[11px] uppercase tracking-[0.4em] font-black">Final_Sum</span>
                            <span className="font-serif italic text-2xl md:text-3xl">${cartTotal}</span>
                        </div>
                    </div>

                    <Link to='/place-order' className="block">
                        <button className="w-full py-6 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[11px] uppercase tracking-[0.6em] font-black hover:brightness-110 transition-all active:scale-[0.97] shadow-2xl">
                        Authorize Payment
                        </button>
                    </Link>
                    
                    <p className="mt-6 text-[7px] text-center font-mono opacity-30 uppercase tracking-[0.2em]">
                        Secure_Protocol_Encrypted // AES_256
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .fade-in-img { opacity: 0; transition: opacity 1s ease-in; }
        .fade-in-img.loaded { opacity: 0.8; }
      `}</style>
    </div>
  );
};

export default Cart;