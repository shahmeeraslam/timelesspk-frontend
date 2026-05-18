import React from "react";
import { RiArchiveLine } from "@remixicon/react";

const CheckoutManifest = ({ cart, totals }) => {
  return (
    <aside className="w-full lg:w-[40%]">
      <div className="lg:sticky lg:top-32 border border-white/10 p-10 space-y-12 bg-white/[0.01]">
        <div className="flex justify-between items-center">
          <h3 className="text-3xl font-serif italic">Manifest</h3>
          <RiArchiveLine size={24} className="text-white/20" />
        </div>

        <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {cart.map((item, i) => {
            const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
            const displayImg = pData.image?.[0]?.url || pData.img || item.img;
            const discountPercent = pData.discount || 0;
            const discountedPrice = pData.price * (1 - discountPercent / 100);

            return (
              <div key={i} className="flex gap-6 items-start border-b border-white/5 pb-6">
                <div className="w-16 h-20 bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                  <img src={displayImg} className="w-full h-full object-cover grayscale opacity-70" alt="" />
                </div>
                <div className="flex-grow space-y-2">
                  <p className="text-[10px] uppercase tracking-wider font-black leading-tight">{pData.name}</p>
                  <div className="flex flex-col gap-1 text-[8px] font-mono text-white/40 uppercase">
                    <span>Color: {item.color || "Standard"}</span>
                    <span>Size: {item.size}</span>
                    <span className="text-white/60">Qty: {item.quantity}</span>
                  </div>
                </div>
                <p className="font-serif italic text-sm">
                  PKR {(Math.round(discountedPrice) * item.quantity).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/30">Total_Due</span>
          <span className="text-4xl font-serif italic">PKR {Math.round(totals.total).toLocaleString()}</span>
        </div>
      </div>
    </aside>
  );
};

export default CheckoutManifest;