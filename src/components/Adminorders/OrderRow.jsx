import React from 'react';
import { RiArrowRightUpLine } from '@remixicon/react';

const OrderRow = ({ order, getOrderId, getStatusTheme, onSelect }) => {
  const theme = getStatusTheme(order.status);
  const currentId = getOrderId(order);

  return (
    <div className="group relative grid grid-cols-1 lg:grid-cols-12 items-center bg-black hover:bg-white/[0.03] transition-all p-8 gap-6 border-b border-white/5 last:border-0">
      
      {/* 1. ID & DATE */}
      <div className="lg:col-span-2 space-y-1">
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">
          #{currentId.slice(-8).toUpperCase()}
        </p>
        <p className="text-[10px] text-white/40 font-mono italic">
          {new Date(order.createdAt).toLocaleDateString()}
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

      {/* 3. ITEM THUMBNAILS */}
      <div className="lg:col-span-3 flex -space-x-4">
        {order.items?.slice(0, 3).map((item, i) => (
          <div key={i} className="relative w-10 h-12 bg-zinc-900 border border-black overflow-hidden group/thumb">
            <img 
              src={item.productId?.image?.[0]?.url || item.img} 
              className="w-full h-full object-cover grayscale group-hover/thumb:grayscale-0 transition-all" 
              alt="" 
            />
            {item.color && (
              <div 
                className="absolute bottom-0 right-0 w-2 h-2 border-t border-l border-black" 
                style={{ backgroundColor: item.color }} 
              />
            )}
          </div>
        ))}
        {order.items?.length > 3 && (
          <div className="w-10 h-12 bg-white/5 border border-black flex items-center justify-center text-[8px] font-mono text-white/40 backdrop-blur-sm">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      {/* 4. STATUS BADGE */}
      <div className="lg:col-span-2">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 border ${theme.border} ${theme.bg} ${theme.color} text-[9px] font-mono uppercase tracking-widest`}>
          <span className="animate-pulse">●</span> {order.status}
        </div>
      </div>

      {/* 5. PRICING & ACTION */}
      <div className="lg:col-span-2 flex justify-end items-center gap-4">
        <div className="text-right mr-6">
          <p className="text-xs font-serif italic text-white/60">Value</p>
          <p className="text-sm font-bold tracking-tighter">
            {order.amount.toLocaleString()} PKR
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