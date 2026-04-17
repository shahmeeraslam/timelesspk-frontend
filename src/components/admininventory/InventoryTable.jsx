import API from "../../../api"
import React from 'react';
import { 
  RiEditLine, 
  RiDeleteBin7Line, 
  RiEyeLine, 
  RiInboxArchiveLine, 
  RiQrCodeLine 
} from "@remixicon/react";

const InventoryTable = ({ products, loading, onEdit, onPreview, onShowQR, setProducts, setToast }) => {
  
  const handleDelete = async (id) => {
    const confirmRemoval = window.confirm(
      "CRITICAL_ACTION: This will permanently decommission this unit from the digital archive. Proceed?"
    );
    
    if (!confirmRemoval) return;
    
    try {
      await API.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      setToast("Unit_Decommissioned_Successfully");
    } catch (err) {
      console.error("Removal_Failure:", err);
      const errorMsg = err.response?.status === 403 
        ? "Security_Error: Insufficient_Clearance" 
        : "Terminal_Failure: Could_Not_Sync_Deletion";
      setToast(errorMsg);
    }
  };

  if (loading) return (
    <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-20">
      <div className="w-12 h-[1px] bg-white animate-pulse" />
      <span className="text-[9px] font-mono uppercase tracking-[0.8em]">Synchronizing_Archive...</span>
    </div>
  );

  return (
    <div className="w-full overflow-hidden border border-white/5 bg-[#050505]">
      <table className="w-full border-collapse text-white">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-6 px-8 text-left text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">Visual_ID</th>
            <th className="py-6 px-4 text-left text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">Classification</th>
            <th className="py-6 px-4 text-left text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">Piece_Identity</th>
            <th className="py-6 px-4 text-left text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">Valuation</th>
            <th className="py-6 px-4 text-left text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">System_Link</th>
            <th className="py-6 px-4 text-left text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">Availability</th>
            <th className="py-6 px-8 text-right text-[9px] font-mono uppercase tracking-[0.4em] text-white/30 font-normal">Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {products.map((product) => {
            const displayImage = product.image?.[0]?.url || product.img;

            return (
              <tr key={product._id} className="group hover:bg-white/[0.02] transition-colors duration-500">
                {/* IMAGE PREVIEW */}
                <td className="py-6 px-8">
                  <div 
                    onClick={() => onPreview(product)}
                    className="w-16 h-20 bg-black border border-white/5 overflow-hidden cursor-zoom-in relative group-hover:border-white/20 transition-all"
                  >
                    <img 
                      src={displayImage} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                      alt={product.name} 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <RiEyeLine size={14} className="text-white" />
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="py-6 px-4">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest italic">
                    {product.category}
                  </span>
                </td>

                {/* NAME */}
                <td className="py-6 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-serif italic text-white/90 group-hover:text-white transition-colors">
                      {product.name}
                    </span>
                    <span className="text-[8px] font-mono text-white/10 uppercase tracking-tighter">
                      UID: {product._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </td>

                {/* PRICE */}
                <td className="py-6 px-4">
                  <span className="text-xs font-light text-white/80 tracking-widest">
                    ${product.price?.toLocaleString()}.00
                  </span>
                </td>

                {/* QR TRIGGER COLUMN */}
                <td className="py-6 px-4">
                  <button 
                    onClick={() => onShowQR(product)}
                    className="group/qr flex items-center gap-2 px-3 py-1.5 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all"
                  >
                    <RiQrCodeLine size={14} className="opacity-20 group-hover/qr:opacity-100 transition-opacity" />
                    <span className="text-[8px] font-mono uppercase tracking-widest opacity-0 group-hover/qr:opacity-100 transition-opacity">Generate_Tag</span>
                  </button>
                </td>

                {/* STOCK */}
                <td className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1 h-1 rounded-full ${product.stock > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'}`} />
                    <span className="text-[10px] font-mono text-white/40">
                      {product.stock} Units
                    </span>
                  </div>
                </td>

                {/* ACTIONS */}
                <td className="py-6 px-8 text-right">
                  <div className="flex justify-end gap-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button 
                      onClick={() => onEdit(product)}
                      className="text-white/40 hover:text-white transition-colors"
                      title="Edit_Archive"
                    >
                      <RiEditLine size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="text-white/10 hover:text-red-500 transition-colors"
                      title="Decommission_Unit"
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
        <div className="py-32 flex flex-col items-center justify-center space-y-4 border-t border-white/5 bg-white/[0.01]">
          <RiInboxArchiveLine size={32} className="text-white/5" />
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20 italic">
            Search_Parameters_Yielded_Null
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;