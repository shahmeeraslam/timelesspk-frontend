import React from 'react';
import { 
  RiEditLine, 
  RiDeleteBin7Line, 
  RiEyeLine, 
  RiInboxArchiveLine, 
  RiQrCodeLine,
  RiPercentLine
} from "@remixicon/react";

const InventoryTable = ({ products, loading, onEdit, onPreview, onShowQR, onDelete }) => {
  
  if (loading) return (
    <div className="py-48 flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-white animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-white animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-white animate-bounce" />
      </div>
      <span className="text-[9px] font-mono uppercase tracking-[1em] opacity-20">Synchronizing_Archive</span>
    </div>
  );

  return (
    <div className="w-full overflow-x-auto no-scrollbar border border-white/5 bg-[#050505]">
      <table className="w-full border-collapse text-white">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.01]">
            <th className="py-5 px-8 text-left text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Ref_Visual</th>
            <th className="py-5 px-4 text-left text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Class</th>
            <th className="py-5 px-4 text-left text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Nomenclature</th>
            <th className="py-5 px-4 text-left text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Valuation</th>
            <th className="py-5 px-4 text-left text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Stock_Level</th>
            <th className="py-5 px-4 text-left text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Identity_Tag</th>
            <th className="py-5 px-8 text-right text-[8px] font-mono uppercase tracking-[0.5em] text-white/20 font-black">Operations</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {products.map((product) => {
            const displayImage = product.image?.[0]?.url || product.img;
            const isLowStock = product.stock > 0 && product.stock < 5;
            const isOutOfStock = product.stock <= 0;
            const hasDiscount = product.discount > 0;

            return (
              <tr key={product._id} className="group hover:bg-white/[0.02] transition-all duration-300">
                {/* IMAGE PREVIEW */}
                <td className="py-6 px-8">
                  <div 
                    onClick={() => onPreview(product)}
                    className="w-14 h-18 bg-[#0A0A0A] border border-white/10 overflow-hidden cursor-zoom-in relative transition-all group-hover:border-white/40"
                  >
                    <img 
                      src={displayImage} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                      alt="" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <RiEyeLine size={14} className="text-white" />
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="py-6 px-4">
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
                    {product.category}
                  </span>
                </td>

                {/* NAME & UID */}
                <td className="py-6 px-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black uppercase tracking-tight text-white/80 group-hover:text-white transition-colors">
                      {product.name}
                    </span>
                    <span className="text-[7px] font-mono text-white/10 uppercase tracking-widest">
                      ID: {product._id.slice(-12).toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* PRICE & DISCOUNT LOGIC */}
                <td className="py-6 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-mono font-bold ${hasDiscount ? 'text-[var(--brand-accent,#ffc107)]' : 'text-white/90'}`}>
                        PKR {product.salePrice?.toLocaleString() || product.price?.toLocaleString()}
                      </span>
                      {hasDiscount && (
                        <div className="flex items-center text-[7px] font-mono bg-red-500/10 text-red-500 border border-red-500/20 px-1 py-0.5">
                          <RiPercentLine size={8} /> {product.discount}
                        </div>
                      )}
                    </div>
                    {hasDiscount && (
                      <span className="text-[9px] font-mono text-white/20 line-through decoration-white/40">
                        PKR {product.price?.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>

                {/* STOCK STATUS */}
                <td className="py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-1 rounded-full ${
                      isOutOfStock ? 'bg-red-500 shadow-[0_0_8px_red]' : 
                      isLowStock ? 'bg-orange-500 shadow-[0_0_8px_orange]' : 
                      'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                    }`} />
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      isOutOfStock ? 'text-red-500/50' : 
                      isLowStock ? 'text-orange-500/50' : 
                      'text-white/30'
                    }`}>
                      {isOutOfStock ? 'Depleted' : `${product.stock} Units`}
                    </span>
                  </div>
                </td>

                {/* QR TAG BUTTON */}
                <td className="py-6 px-4">
                  <button 
                    onClick={() => onShowQR(product)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group/qr"
                  >
                    <RiQrCodeLine size={12} className="opacity-20 group-hover/qr:opacity-100" />
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-20 group-hover/qr:opacity-100">Asset_Tag</span>
                  </button>
                </td>

                {/* ACTIONS */}
                <td className="py-6 px-8 text-right">
                  <div className="flex justify-end items-center gap-5 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => onEdit(product)}
                      className="p-1 text-white/20 hover:text-white transition-all"
                      title="Modify_Archive"
                    >
                      <RiEditLine size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(product)}
                      className="p-1 text-white/10 hover:text-red-500 transition-all"
                      title="Purge_Entry"
                    >
                      <RiDeleteBin7Line size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* EMPTY STATE */}
      {products.length === 0 && !loading && (
        <div className="py-32 flex flex-col items-center justify-center space-y-4 border-t border-white/5">
          <RiInboxArchiveLine size={40} className="text-white/5 stroke-[1px]" />
          <div className="text-center">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/20">Archive_Empty</p>
            <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/10 mt-2 italic">Waiting for new nomenclature input...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;