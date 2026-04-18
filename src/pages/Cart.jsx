import React, { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { 
  RiCloseLine, 
  RiExpandDiagonalLine, 
  RiShoppingBagLine, 
  RiPercentLine, 
  RiShieldCheckLine, 
  RiQuillPenLine,
  RiArrowRightUpLine,
  RiDeleteBin7Line
} from "@remixicon/react";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, changeSize } = useCart();
  const [fullscreenImg, setFullscreenImg] = useState(null);

  const getSizeOptions = (category = "") => {
    const cat = category.toLowerCase();
    if (cat.includes("shoes")) return ["40", "41", "42", "43", "44", "45"];
    if (cat.includes("pants")) return ["28", "30", "32", "34", "36"];
    if (cat.includes("watch") || cat.includes("accessory")) return ["One Size"];
    return ["S", "M", "L", "XL"];
  };

  const { grossSubtotal, totalSavings, netTotal } = useMemo(() => {
    return cart.reduce((acc, item) => {
      const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
      const originalPrice = pData.price || 0;
      const discountPercent = pData.discount || 0;
      const unitSavings = (originalPrice * discountPercent) / 100;
      const unitNetPrice = originalPrice - unitSavings;

      return {
        grossSubtotal: acc.grossSubtotal + (originalPrice * item.quantity),
        totalSavings: acc.totalSavings + (unitSavings * item.quantity),
        netTotal: acc.netTotal + (unitNetPrice * item.quantity)
      };
    }, { grossSubtotal: 0, totalSavings: 0, netTotal: 0 });
  }, [cart]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-12 relative bg-[#050505] text-white selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* Decorative Background Element */}
      <div className="fixed -top-[10%] -right-[10%] w-[50%] h-[50%] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* --- FULLSCREEN PREVIEW --- */}
      {fullscreenImg && (
        <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-3xl transition-all duration-500" onClick={() => setFullscreenImg(null)}>
          <button className="absolute top-12 right-12 text-white/40 hover:text-white transition-all hover:rotate-90">
            <RiCloseLine size={40} strokeWidth={1} />
          </button>
          <img 
            src={fullscreenImg} 
            className="max-w-full max-h-[80vh] object-contain shadow-[0_0_100px_rgba(255,255,255,0.05)] animate-in fade-in zoom-in-95 duration-500" 
            alt="Preview" 
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-[1px] bg-white/20" />
                 <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em]">User_Inventory_Manifest</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-serif italic uppercase tracking-tighter leading-none">
                The_Queue
              </h1>
            </div>
            <div className="flex items-center gap-6 border-l border-white/10 pl-6 h-fit">
               <div className="text-right">
                  <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Active_Payload</p>
                  <p className="text-sm font-mono tracking-tighter">{cart.length} UNITS</p>
               </div>
               <RiShoppingBagLine size={24} className="opacity-20" />
            </div>
        </header>

        {cart.length === 0 ? (
          <div className="py-48 text-center border border-white/5 bg-white/[0.01] backdrop-blur-sm relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
            <p className="font-mono mb-12 text-[12px] tracking-[0.6em] uppercase opacity-20 relative">Archive_Buffer_Null</p>
            <Link to="/collection" className="relative inline-flex items-center gap-4 px-16 py-6 bg-white text-black text-[10px] uppercase tracking-[0.6em] font-black hover:pr-20 transition-all duration-700">
              Reload_Manifest <RiArrowRightUpLine size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* --- ITEM LIST --- */}
            <div className="lg:col-span-8 space-y-16">
              {cart.map((item) => {
                const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
                const pId = pData._id?.$oid || pData._id || item.productId;
                const displayImg = item.img || pData.img || pData.image?.[0]?.url;
                const discountPercent = pData.discount || 0;
                const originalPrice = pData.price || 0;
                const activePrice = originalPrice - (originalPrice * discountPercent / 100);

                return (
                  <div key={`${pId}-${item.size}`} className="flex flex-col sm:flex-row gap-10 pb-16 border-b border-white/5 group">
                    
                    {/* Visual Interface */}
                    <div className="w-full sm:w-52 h-72 sm:h-64 shrink-0 bg-[#080808] border border-white/5 relative overflow-hidden group/img">
                      <img 
                        src={displayImg} 
                        alt={pData.name} 
                        className="w-full h-full object-cover grayscale opacity-40 transition-all duration-[1.5s] ease-out group-hover/img:scale-110 group-hover/img:opacity-100 group-hover/img:grayscale-0" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                      <button 
                        onClick={() => setFullscreenImg(displayImg)}
                        className="absolute bottom-6 right-6 p-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-full translate-y-4 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-500 hover:bg-white hover:text-black"
                      >
                        <RiExpandDiagonalLine size={18} />
                      </button>
                    </div>

                    {/* Data Interface */}
                    <div className="flex flex-col justify-between w-full py-1">
                      <div className="space-y-8">
                        <div className="flex justify-between items-start">
                          <div className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-serif italic uppercase tracking-tight leading-none group-hover:pl-2 transition-all duration-500">{pData.name}</h3>
                            
                            <div className="flex flex-wrap items-center gap-4">
                              <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-white/30 px-3 py-1 border border-white/5 bg-white/[0.02]">
                                ID: {pId.slice(-6)}
                              </span>
                              {discountPercent > 0 && (
                                <div className="flex items-center gap-2 text-red-500 font-mono text-[7px] uppercase tracking-[0.4em] bg-red-500/5 px-2 py-1 border border-red-500/20">
                                  <RiPercentLine size={10}/> Applied_{discountPercent}%
                                </div>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(pId, item.size)}
                            className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/5 transition-all duration-500 rounded-sm"
                          >
                            <RiDeleteBin7Line size={16} strokeWidth={1} />
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                            <span className="text-[7px] font-mono uppercase tracking-[0.6em] text-white/20 block">Configuration</span>
                            <div className="flex flex-wrap gap-2">
                              {getSizeOptions(pData.category).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => changeSize && changeSize(pId, item.size, s)}
                                  className={`text-[9px] min-w-[50px] py-3 border transition-all duration-700 font-mono tracking-widest ${
                                    item.size === s 
                                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                                    : 'border-white/5 text-white/20 hover:border-white/20 hover:text-white hover:bg-white/[0.02]'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mt-12">
                        <div className="flex items-center border border-white/5 bg-white/[0.01]">
                          <button onClick={() => updateQuantity(pId, item.size, -1)} className="w-14 h-12 flex items-center justify-center text-sm hover:bg-white/5 transition-colors border-r border-white/5">-</button>
                          <span className="w-14 h-12 flex items-center justify-center text-[10px] font-mono tracking-widest">{item.quantity}</span>
                          <button onClick={() => updateQuantity(pId, item.size, 1)} className="w-14 h-12 flex items-center justify-center text-sm hover:bg-white/5 transition-colors border-l border-white/5">+</button>
                        </div>
                        <div className="text-right">
                            {discountPercent > 0 && (
                              <span className="text-[10px] font-mono text-white/20 line-through block uppercase tracking-widest mb-1">
                                PKR {(originalPrice * item.quantity).toLocaleString()}
                              </span>
                            )}
                            <span className="text-3xl font-serif italic leading-none tracking-tighter">
                              PKR {(activePrice * item.quantity).toLocaleString()}
                            </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- SUMMARY STICKY --- */}
            <div className="lg:col-span-4">
                <div className="p-10 sticky top-32 bg-white/[0.02] border border-white/10 backdrop-blur-3xl space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-6 bg-white" />
                        <h2 className="text-[11px] uppercase tracking-[0.6em] font-black italic">Final_Settlement</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
                            <span>Subtotal</span>
                            <span className="text-white">PKR {grossSubtotal.toLocaleString()}</span>
                        </div>
                        
                        {totalSavings > 0 && (
                          <div className="flex justify-between text-[10px] font-mono tracking-[0.3em] uppercase text-red-500/80">
                              <span>Reduction</span>
                              <span>- PKR {totalSavings.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-[10px] font-mono tracking-[0.3em] uppercase text-white/40">
                            <span>Logistics</span>
                            <span className="text-emerald-500 underline decoration-dotted underline-offset-4">Complimentary</span>
                        </div>

                        <div className="pt-10 border-t border-white/10 flex justify-between items-end">
                            <div className="space-y-2">
                              <span className="text-[12px] uppercase tracking-[0.6em] font-black block">Net_Total</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-emerald-500 animate-pulse rounded-full" />
                                <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Protocol_Ready</span>
                              </div>
                            </div>
                            <span className="font-serif italic text-4xl text-white tracking-tighter">
                              PKR {netTotal.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                      <Link to='/place-order' className="block">
                          <button className="group relative w-full overflow-hidden bg-white py-7 text-black transition-all active:scale-[0.98] shadow-[0_20px_40px_rgba(255,255,255,0.05)]">
                            <div className="absolute inset-0 bg-neutral-200 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                            <span className="relative z-10 text-[11px] uppercase tracking-[0.8em] font-black flex items-center justify-center gap-4">
                              Authenticate <RiArrowRightUpLine size={16} />
                            </span>
                          </button>
                      </Link>
                      
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <div className="flex items-center gap-3">
                          <RiShieldCheckLine size={14} className="text-emerald-500" />
                          <span className="text-[7px] font-mono uppercase tracking-[0.4em]">
                            Encrypted_Archive_Node_0419
                          </span>
                        </div>
                        <p className="text-[6px] text-center font-mono leading-relaxed uppercase tracking-[0.2em]">
                          By authorizing, you agree to the protocol’s <br/> data retention and exchange mandates.
                        </p>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;