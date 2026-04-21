import React from 'react';
import { RiArrowRightUpLine } from '@remixicon/react';

const OrderRow = ({ order, getOrderId, getStatusTheme, onSelect }) => {
  const theme = getStatusTheme(order.status);
  const currentId = getOrderId(order);

  // DEFENSIVE LOGIC: Safely extract thumbnail for any data state
  const getThumbnail = (item) => {
    // 1. Check for the snapshot image array (highest priority)
    if (item?.image && Array.isArray(item.image) && item.image.length > 0) {
      const colorMatch = item.image.find(img => 
        img.color?.toLowerCase() === item.color?.toLowerCase()
      );
      return colorMatch ? colorMatch.url : item.image[0].url;
    }

    // 2. Check for populated productId object
    if (item?.productId && typeof item.productId === 'object' && item.productId.image?.[0]?.url) {
      return item.productId.image[0].url;
    }

    // 3. Last resort fallback (prevents 'undefined' crash)
    return item?.img || "https://placehold.co/400x500/000000/333333?text=NO_IMAGE";
  };

  return (
    <div className="group relative grid grid-cols-1 lg:grid-cols-12 items-center bg-black hover:bg-white/[0.03] transition-all p-8 gap-6 border-b border-white/5 last:border-0">
      
      {/* 1. ID & DATE */}
      <div className="lg:col-span-2 space-y-1">
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
          #{currentId.slice(-8).toUpperCase()}
        </p>
        <p className="text-[10px] text-white/40 font-mono italic">
          {new Date(order.date?.$date || order.date).toLocaleDateString()}
        </p>
      </div>

      {/* 2. CUSTOMER INFO */}
      <div className="lg:col-span-3">
        <h3 className="text-sm font-medium uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
          {order.address?.firstName} {order.address?.lastName}
        </h3>
        <p className="text-[9px] font-mono text-white/30 truncate uppercase mt-1">
          {order.address?.email}
        </p>
      </div>

      {/* 3. ITEM THUMBNAILS (FIXED FOR MULTIPLE ORDERS) */}
      <div className="lg:col-span-3 flex -space-x-4">
        {order.items && order.items.length > 0 ? (
          order.items.slice(0, 3).map((item, i) => (
            <div 
              key={`${currentId}-item-${i}`} 
              className="relative w-10 h-12 bg-zinc-900 border border-black overflow-hidden group/thumb z-[1] hover:z-[10] transition-transform hover:scale-110"
            >
              <img 
                src={getThumbnail(item)} 
                className="w-full h-full object-cover grayscale group-hover/thumb:grayscale-0 transition-all" 
                alt="" 
                // Immediate fallback if the URL itself is broken (404/expired)
                onError={(e) => { e.target.src = "https://placehold.co/400x500/000000/333333?text=ERR"; }}
              />
              {item.color && (
                <div 
                  className="absolute bottom-0 right-0 w-2 h-2 border-t border-l border-black" 
                  style={{ backgroundColor: item.color }} 
                />
              )}
            </div>
          ))
        ) : (
          <div className="text-[8px] font-mono text-white/10 uppercase tracking-widest">Null_Manifest</div>
        )}
        
        {order.items?.length > 3 && (
          <div className="w-10 h-12 bg-white/5 border border-black flex items-center justify-center text-[8px] font-mono text-white/40 backdrop-blur-sm z-[5]">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      {/* 4. STATUS BADGE */}
      <div className="lg:col-span-2">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 border ${theme.border} ${theme.bg} ${theme.color} text-[9px] font-mono uppercase tracking-widest`}>
          <span className={order.status === "Pending Verification" ? "animate-pulse" : ""}>●</span> {order.status}
        </div>
      </div>

      {/* 5. PRICING & ACTION */}
      <div className="lg:col-span-2 flex justify-end items-center gap-4">
        <div className="text-right mr-6">
          <p className="text-xs font-serif italic text-white/60">Value</p>
          <p className="text-sm font-bold tracking-tighter">
            {Math.round(order.amount || 0).toLocaleString()} PKR
          </p>
        </div>
        <button 
          onClick={() => onSelect(order)} 
          className="p-4 bg-white/5 hover:bg-white hover:text-black transition-all border border-white/5"
        >
          <RiArrowRightUpLine size={20} />
        </button>
      </div>
    </div>
  );
};

export default OrderRow;