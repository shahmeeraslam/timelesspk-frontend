import React, { useEffect, useState } from "react";
import PageTransition from "../components/PageTransition";
import API from "../../api";
import { RiLoader4Line, RiTimeLine, RiWhatsappLine, RiRefreshLine } from "@remixicon/react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/api/orders/userorders");
      if (response.data.success) {
        setOrders(response.data.orders.sort((a, b) => b.date - a.date));
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
        <RiLoader4Line className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-black text-white selection:bg-white selection:text-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="border-b border-white/10 pb-10 mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif italic mb-2">The Archive</h1>
              <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">
                Purchase History & Acquisitions
              </p>
            </div>
            <button onClick={fetchOrders} className="p-2 hover:rotate-180 transition-transform duration-700">
              <RiRefreshLine size={20} className="text-white/40 hover:text-white" />
            </button>
          </header>

          {/* Orders List */}
          <div className="space-y-16">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order._id} className="border-b border-white/5 pb-12 group">
                  <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Items Section - Updated for your latest JSON structure */}
                    <div className="flex-grow space-y-8">
                      {order.items.map((item, i) => {
                        // Fallback logic: check for item properties directly first, then productId
                        const name = item.name || item.productId?.name || "Premium Piece";
                        const price = item.price || item.productId?.price;
                        const displayImg = item.image?.[0]?.url || item.img || item.productId?.image?.[0]?.url;
                        
                        return (
                          <div key={i} className="flex gap-8 items-start">
                            <div className="w-24 h-32 bg-zinc-900 shrink-0 overflow-hidden border border-white/5 group-hover:border-white/20 transition-colors">
                              <img 
                                src={displayImg} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                alt={name} 
                              />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs">
                                {name}
                              </h3>
                              <div className="flex gap-4 text-[9px] text-white/40 uppercase font-mono">
                                <span>Size: {item.size}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>Color: {item.color}</span>
                              </div>
                              <p className="text-sm font-serif italic pt-2">
                                ${price?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 lg:w-[45%] bg-white/[0.02] p-8 border border-white/5">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-white/30">Registry_Date</p>
                        <p className="text-xs font-light">
                          {new Date(order.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-white/30">Protocol_Status</p>
                        <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' : 'bg-white animate-pulse'}`} />
                          <p className="text-[9px] uppercase tracking-widest font-bold italic">{order.status}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-widest text-white/30">Valuation</p>
                        <p className="text-lg font-serif italic">${order.amount.toLocaleString()}</p>
                      </div>

                      <div className="col-span-full pt-4 border-t border-white/5">
                        <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2">Shipping_Destination</p>
                        <p className="text-[10px] text-white/60 leading-relaxed uppercase tracking-tighter">
                          {order.address.street}, {order.address.city}, {order.address.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* COD & Verification Notice */}
                  {order.status === "Pending Verification" && (
                    <div className="mt-8 p-6 bg-white text-black flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                        <RiTimeLine size={20} className="animate-pulse" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Telephonic Confirmation</p>
                          <p className="text-[9px] uppercase tracking-tighter opacity-70">Logistics will call {order.address.phone} shortly.</p>
                        </div>
                      </div>
                      <a 
                        href={`https://wa.me/03182349545?text=Hi, I want to confirm my order for $${order.amount}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 bg-black text-white px-6 py-3 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-800 transition-all w-full md:w-auto justify-center"
                      >
                        <RiWhatsappLine size={16} /> Confirm via WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-40 text-center border border-dashed border-white/10">
                <p className="font-serif italic text-white/20 text-xl tracking-tighter">The archive remains untouched.</p>
                <button 
                   onClick={() => window.location.href = '/collection'}
                   className="mt-8 text-[9px] uppercase tracking-[0.4em] text-white hover:tracking-[0.6em] transition-all"
                >
                  Begin First Acquisition
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