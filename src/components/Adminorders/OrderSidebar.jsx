import React from 'react';
import { motion } from 'framer-motion';
import { RiCloseLine, RiPrinterLine } from '@remixicon/react';

const OrderSidebar = ({ order, getOrderId, onClose, onUpdateStatus, onPrint }) => {
  if (!order) return null;

  // Helper to resolve the correct image from the snapshot or fallback
 const getDisplayImage = (item) => {
  // Priority 1: Check the snapshot image array (highest accuracy)
  if (Array.isArray(item.image) && item.image.length > 0) {
    // Attempt to find the specific color ordered by the customer
    const colorMatch = item.image.find(img => 
      img.color?.toLowerCase() === item.color?.toLowerCase()
    );
    // Return matching color URL, or fallback to the first image in the snapshot
    return colorMatch ? colorMatch.url : item.image[0].url;
  }
  
  // Priority 2: Fallback to populated productId (if available)
  if (item.productId?.image?.[0]?.url) return item.productId.image[0].url;
  
  // Priority 3: Fallback to the legacy 'img' property
  return item.img || "/placeholder-dark.png"; 
};

  return (
    <div className="fixed inset-0 z-[500] flex justify-end print:hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/90 backdrop-blur-2xl" 
        onClick={onClose} 
      />

      {/* Sidebar Panel */}
      <motion.div 
        initial={{ x: '100%' }} 
        animate={{ x: 0 }} 
        transition={{ type: 'spring', damping: 25, stiffness: 100 }} 
        exit={{ x: '100%' }} 
        className="relative w-full max-w-2xl bg-[#080808] border-l border-white/10 h-full p-8 md:p-16 overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,1)] custom-scrollbar"
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-16">
          <button 
            onClick={onPrint} 
            className="flex items-center gap-4 px-8 py-4 bg-white text-black text-[10px] font-mono font-bold uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
          >
            <RiPrinterLine size={16} />
            Generate_Official_Manifest
          </button>
          <button 
            onClick={onClose} 
            className="text-white/20 hover:text-white transition-colors"
          >
            <RiCloseLine size={40} />
          </button>
        </div>

        <div className="space-y-20">
          {/* Header Title */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.6em] text-emerald-400 uppercase">Process_Detail</span>
            <h2 className="text-6xl font-serif italic tracking-tighter leading-none">
              Record_{getOrderId(order).slice(-6).toUpperCase()}
            </h2>
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              Entry_Created: {new Date(order.date?.$date || order.date).toLocaleString()}
            </p>
          </div>

          {/* Status Update Controls */}
          <div className="space-y-6">
            <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Authority_Protocol: Change_Status</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["Pending Verification", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => onUpdateStatus(getOrderId(order), status)}
                  className={`p-4 text-[9px] font-mono uppercase tracking-widest border transition-all ${
                    order.status === status 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Inventory Manifest (Items) */}
          <div className="space-y-8">
            <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Inventory_Manifest</p>
            <div className="space-y-4">
              {order.items?.map((item, idx) => {
                const name = item.name || item.productId?.name || "Archive_Item";
                const price = item.price || item.productId?.price || 0;
                
                return (
                  <div key={idx} className="flex gap-8 p-6 bg-white/[0.02] border border-white/5 items-center group/item">
                    <div className="w-16 h-20 bg-zinc-900 overflow-hidden grayscale group-hover/item:grayscale-0 transition-all border border-white/5 shrink-0">
                      <img src={getDisplayImage(item)} className="w-full h-full object-cover" alt={name} />
                    </div>
                    <div className="flex-grow space-y-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] leading-tight">{name}</h4>
                      <div className="flex flex-wrap gap-6 items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                          <span className="text-[9px] font-mono uppercase text-white tracking-widest">{item.color || "Standard"}</span>
                        </div>
                        <div className="h-3 w-[1px] bg-white/10" />
                        <div className="flex gap-4 text-[9px] font-mono uppercase text-white/40 tracking-widest">
                          <span>Size: <b className="text-white">{item.size}</b></span>
                          <span>Qty: <b className="text-white">{item.quantity}</b></span>
                          <span className="text-white/20">{price.toLocaleString()} PKR</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-white/5">
            <div className="space-y-6">
              <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Consignee_Info</p>
              <div className="space-y-2">
                <p className="text-xl font-serif italic text-white">{order.address?.firstName} {order.address?.lastName}</p>
                <p className="text-[11px] font-mono text-white/60">{order.address?.phone}</p>
                <p className="text-[11px] font-mono text-white/30 truncate">{order.address?.email}</p>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/40">Drop_Site</p>
              <p className="text-[11px] font-mono leading-relaxed text-white/60 uppercase">
                {order.address?.street}<br />
                {order.address?.city}, {order.address?.state}<br />
                {order.address?.zipcode ? `Zip_${order.address.zipcode}` : "PK_Global_Node"}
              </p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white text-black p-10 flex flex-col gap-2 shadow-2xl mb-10">
            <span className="text-[9px] font-mono uppercase tracking-[0.5em] font-bold">Total_Archived_Value</span>
            <span className="text-5xl font-serif italic tracking-tighter">
              {Math.round(order.amount || 0).toLocaleString()} PKR
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSidebar;