import React, { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import API from "../../api";
import { RiLoader4Line, RiTimeLine, RiWhatsappLine, RiRefreshLine, RiVerifiedBadgeLine } from "@remixicon/react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/orders/userorders");
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Archive_Fetch_Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RiLoader4Line className="animate-spin text-white/20" size={32} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 md:pt-32 pb-20 px-4 sm:px-8 md:px-12 bg-black text-white selection:bg-white selection:text-black">
        <div className="max-w-7xl mx-auto">
          
          {/* --- HEADER --- */}
          <header className="border-b border-white/10 pb-8 md:pb-10 mb-12 flex justify-between items-end">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-serif italic tracking-tighter">The_Archive</h1>
              <p className="text-[7px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/30 font-mono">
                Historical_Acquisitions_Registry
              </p>
            </div>
            <button 
              onClick={fetchOrders} 
              className="group p-2 md:p-3 border border-white/5 hover:border-white/20 transition-all rounded-full"
            >
              <RiRefreshLine size={16} className="text-white/40 group-hover:text-white group-hover:rotate-180 transition-all duration-700" />
            </button>
          </header>

          {/* --- ORDERS LIST --- */}
          <div className="space-y-20 md:space-y-32">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="relative group">
                  {/* Container: Vertical on mobile, Horizontal on LG+ */}
                  <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 border-l border-white/5 pl-6 md:pl-12 transition-all group-hover:border-white/20">
                    
                    {/* LEFT: Items Map */}
                    <div className="flex-grow space-y-10">
                      {order.items.map((item, i) => {
                        const product = item.productId;
                        const name = product?.name || item.name || "UNIDENTIFIED_PIECE";
                        const basePrice = product?.price || item.price || 0;
                        const discount = product?.discount || 0;
                        const salePrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
                        const displayImg = product?.img || product?.image?.[0]?.url || item.image?.[0]?.url;
                        
                        return (
                          <div key={i} className="flex flex-col sm:flex-row gap-6 md:gap-8 items-start">
                            {/* Image: Scaled down slightly on very small screens */}
                            <div className="w-24 h-32 md:w-28 md:h-36 bg-zinc-900 shrink-0 overflow-hidden border border-white/10 group-hover:border-white/30 transition-all duration-500">
                              <img 
                                src={displayImg} 
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                                alt={name} 
                              />
                            </div>
                            <div className="space-y-3 md:space-y-4 w-full">
                              <div className="space-y-1">
                                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight max-w-sm">
                                  {name}
                                </h3>
                                <p className="text-[9px] md:text-[10px] font-serif italic text-white/40">
                                  {product?.curatorNote || "Exclusively curated for the bold."}
                                </p>
                              </div>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-2 text-[7px] md:text-[8px] text-white/30 uppercase font-mono tracking-tighter">
                                <span>Size_ {item.size}</span>
                                <span>Qty_ {item.quantity}</span>
                                <span>Hex_ {item.color}</span>
                              </div>

                              <div className="flex items-baseline gap-3">
                                <span className="text-xs md:text-sm font-serif italic">PKR {Math.round(salePrice).toLocaleString()}</span>
                                {discount > 0 && (
                                  <span className="text-[8px] md:text-[9px] text-white/20 line-through font-mono">
                                    {basePrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* RIGHT: Status & Registry Metadata */}
                    <div className="lg:w-[380px] xl:w-[420px] shrink-0">
                      <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 space-y-8 md:space-y-10 backdrop-blur-sm">
                        {/* Grid: 2 columns even on small mobile */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-8">
                          <div className="space-y-1 md:space-y-2">
                            <p className="text-[6px] md:text-[7px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30">Registry_ID</p>
                            <p className="text-[9px] md:text-[10px] font-mono uppercase truncate">#{order._id.slice(-8)}</p>
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <p className="text-[6px] md:text-[7px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30">Registry_Date</p>
                            <p className="text-[9px] md:text-[10px] uppercase">{new Date(order.date).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <p className="text-[6px] md:text-[7px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30">Status_Node</p>
                            <div className="flex items-center gap-2">
                              <div className={`size-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-orange-500 animate-pulse'}`} />
                              <p className="text-[8px] font-black uppercase tracking-widest">{order.status}</p>
                            </div>
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <p className="text-[6px] md:text-[7px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30">Valuation</p>
                            <p className="text-base md:text-xl font-serif italic text-white">PKR {order.amount.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="pt-6 md:pt-8 border-t border-white/5 space-y-3">
                          <p className="text-[6px] md:text-[7px] font-mono uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30">Logistics_Point</p>
                          <p className="text-[8px] md:text-[9px] text-white/60 leading-relaxed uppercase tracking-widest">
                            {order.address.street}, {order.address.city}<br />
                            {order.address.state}
                          </p>
                        </div>

                        {/* WhatsApp Verification Action */}
                        {order.status === "Pending Verification" && (
                          <a 
                            href={`https://wa.me/923182349545?text=VERIFICATION_REQUEST: Confirming order #${order._id.slice(-6)} for PKR ${order.amount}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 border border-white text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
                          >
                            <RiWhatsappLine size={14} /> Authorize_Dispatch
                          </a>
                        )}

                        {order.status === "Delivered" && (
                          <div className="flex items-center justify-center gap-2 py-4 border border-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-widest">
                            <RiVerifiedBadgeLine size={14} /> Acquisition_Complete
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 md:py-40 text-center border border-dashed border-white/10">
                <p className="font-serif italic text-white/20 text-lg md:text-xl tracking-tighter">The Archive_is_Empty.</p>
                <button 
                   onClick={() => window.location.href = '/collection'}
                   className="mt-8 px-8 md:px-12 py-3 md:py-4 border border-white/10 text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white hover:bg-white hover:text-black transition-all"
                >
                  Start_First_Acquisition
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Orders;