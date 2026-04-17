import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { RiCloseLine, RiExpandDiagonalLine } from "@remixicon/react";

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
    <div style={{ backgroundColor: 'var(--brand-alt)', color: 'var(--brand-main)' }} className="min-h-screen pt-32 pb-20 px-6 md:px-12 relative">
      
      {fullscreenImg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullscreenImg(null)}>
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform">
            <RiCloseLine size={32} />
          </button>
          <img 
            src={fullscreenImg} 
            className="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300" 
            alt="Preview" 
          />
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif italic mb-12">Your Selection</h1>

        {cart.length === 0 ? (
          <div className="py-20 text-center border-t border-[var(--brand-border)]">
            <p className="font-light mb-8 text-sm tracking-[0.4em] uppercase opacity-40">The bag is currently empty.</p>
            <Link to="/collection" className="text-xs border-b border-[var(--brand-main)] pb-1 uppercase tracking-widest font-bold">
              Continue Browsing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-10">
              {cart.map((item) => {
                // IMPORTANT: Handle populated vs non-populated productId
                const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
                const pId = pData._id || item.productId;
                const displayImg = pData.img || pData.image?.[0];

                return (
                  <div key={`${pId}-${item.size}`} className="flex gap-6 pb-10 border-b border-[var(--brand-border)]">
                    
                    <div className="w-28 h-36 flex-shrink-0 bg-[var(--brand-soft-bg)] overflow-hidden relative group">
                      <img 
                        src={displayImg} 
                        alt={pData.name} 
                        className="fade-in-img w-full h-full object-cover grayscale transition-all duration-700 md:group-hover:scale-105" 
                        onLoad={(e) => e.target.classList.add('loaded')}
                      />
                      <button 
                        onClick={() => setFullscreenImg(displayImg)}
                        className="absolute top-2 left-2 p-1.5 bg-white/90 text-black rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
                      >
                        <RiExpandDiagonalLine size={14} />
                      </button>
                    </div>

                    <div className="flex flex-col justify-between w-full">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-[11px] uppercase tracking-[0.2em] font-bold">{pData.name}</h3>
                          <p className="text-[9px] mt-1 uppercase tracking-widest opacity-40">{pData.category}</p>
                          
                          <div className="mt-4 flex flex-col gap-2">
                            <span className="text-[8px] uppercase tracking-widest opacity-60">Edit Size:</span>
                            <div className="flex flex-wrap gap-2">
                              {getSizeOptions(pData.category).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => changeSize && changeSize(pId, item.size, s)}
                                  className={`text-[9px] px-2 py-1 border transition-all ${
                                    item.size === s 
                                    ? 'bg-[var(--brand-main)] text-[var(--brand-alt)] border-[var(--brand-main)]' 
                                    : 'border-[var(--brand-border)] hover:border-[var(--brand-main)] opacity-50'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(pId, item.size)}
                          className="text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-red-800 transition-all"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-6">
                        <div className="flex items-center border border-[var(--brand-border)]">
                          <button onClick={() => updateQuantity(pId, item.size, -1)} className="px-3 py-1 text-sm">-</button>
                          <span className="px-4 py-1 text-xs border-x border-[var(--brand-border)]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(pId, item.size, 1)} className="px-3 py-1 text-sm">+</button>
                        </div>
                        <span className="text-base font-serif italic">${(pData.price || 0) * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8 h-fit sticky top-32 bg-[var(--brand-soft-bg)] border border-[var(--brand-border)] shadow-sm">
              <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold mb-8 opacity-70">Summary</h2>
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-xs tracking-widest">
                  <span className="opacity-50">Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="flex justify-between text-xs tracking-widest">
                  <span className="opacity-50">Shipping</span>
                  <span className="text-[9px] font-bold">COMPLIMENTARY</span>
                </div>
                <div className="border-t border-[var(--brand-border)] pt-5 flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest font-bold">Total</span>
                  <span className="font-serif italic text-xl">${cartTotal}</span>
                </div>
              </div>

              <Link to='/place-order'>
                <button className="w-full py-5 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[10px] uppercase tracking-[0.5em] hover:brightness-125 transition-all active:scale-[0.98]">
                  Confirm & Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;