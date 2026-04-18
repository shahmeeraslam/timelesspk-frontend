import API from "../../../api"
import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "../../context/StoreContext";
import { AnimatePresence, motion } from "framer-motion";
import { 
  RiSearchLine, 
  RiLoader4Line, 
  RiCloseLine, 
  RiDownloadLine, 
  RiDeleteBin7Line,
  RiCheckboxCircleLine
} from "@remixicon/react";
import { QRCodeSVG } from "qrcode.react";

// Modular Components
import InventoryTable from "../../components/admininventory/InventoryTable";
import AdminProductModal from "../../components/admininventory/AdminProductModal";
import ProductPreviewPortal from "../../components/admininventory/ProductPreviewPortal";

const Inventory = () => {
  const { products, setProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [qrItem, setQrItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Confirmation state
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const CATEGORIES = ["Clothing", "T-Shirts", "Shoes", "Watches", "Accessories"];

  const fetchArchive = useCallback(async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Archive_Fetch_Error:", err);
      setToast("Terminal_Connection_Error");
    } finally {
      setLoading(false);
    }
  }, [setProducts]);

  useEffect(() => { 
    fetchArchive(); 
  }, [fetchArchive]);

  // DELETE LOGIC
  const handleDelete = async (id) => {
    try {
      setToast("Purging_Record...");
      const response = await API.delete(`/api/products/${id}`);
      if (response.status === 200) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setToast("Piece_Successfully_Purged");
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Delete_Error:", err);
      setToast("Authorization_Failure");
    }
  };

  const downloadQR = () => {
    const svg = document.getElementById("product-qr");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `${qrItem.name}_QR.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 lg:px-12 selection:bg-white selection:text-black font-sans">
      <div className="max-w-[1600px] mx-auto space-y-16">
        
        {/* EDITORIAL HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-8 h-[1px] bg-white" />
              <span className="text-[10px] font-mono tracking-[0.5em] uppercase italic">Inventory_Nodes: {products.length} Units</span>
            </div>
            <h1 className="text-6xl font-serif italic tracking-tighter leading-none">Archive</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative group border-b border-white/10 focus-within:border-white transition-all">
              <RiSearchLine className="absolute left-0 top-1/2 -translate-y-1/2 size-4 opacity-20 group-focus-within:opacity-100" />
              <input 
                type="text" 
                placeholder="FIND_NOMENCLATURE" 
                className="bg-transparent py-2 pl-8 outline-none text-[10px] font-mono tracking-widest w-64 uppercase"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[var(--brand-accent)] transition-all"
            >
              Add_Entry +
            </button>
          </div>
        </header>

        {/* CATEGORY NAV */}
        <nav className="flex items-center gap-10 overflow-x-auto no-scrollbar border-b border-white/5 pb-4">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[9px] font-mono uppercase tracking-[0.4em] transition-all flex items-center gap-2 ${
                activeCategory === cat ? "text-white" : "opacity-20 hover:opacity-100"
              }`}
            >
              {cat} {activeCategory === cat && <div className="size-1 bg-white animate-pulse" />}
            </button>
          ))}
        </nav>

        {/* TABLE COMPONENT */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white/[0.01] border border-white/5">
            <RiLoader4Line className="animate-spin text-white/20" size={32} />
            <span className="text-[8px] font-mono uppercase tracking-[1em] text-white/20">Accessing_Data...</span>
          </div>
        ) : (
          <InventoryTable 
            products={filteredProducts}
            onEdit={(item) => { setEditingProduct(item); setIsModalOpen(true); }}
            onPreview={(item) => setPreviewItem(item)}
            onShowQR={(item) => setQrItem(item)}
            onDelete={(item) => setDeleteConfirm(item)} // Trigger confirmation modal
          />
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="bg-[#0D0D0D] border border-red-900/50 p-10 max-w-md w-full text-center space-y-8"
            >
              <RiDeleteBin7Line className="mx-auto text-red-600 animate-bounce" size={40} />
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-[0.3em]">Confirm_Purge</h3>
                <p className="text-[10px] font-mono opacity-40 leading-relaxed italic uppercase">
                   Warning: Removing "{deleteConfirm.name}" will permanently erase all associated inventory logs. This action cannot be undone.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  className="py-4 border border-white/10 text-[9px] font-black uppercase hover:bg-white/5 transition-all"
                >
                  Abort_Cycle
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm._id)}
                  className="py-4 bg-red-600 text-white text-[9px] font-black uppercase hover:bg-red-700 transition-all"
                >
                  Confirm_Removal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR MODAL (UNCHANGED LOGIC, UPDATED STYLING) */}
      <AnimatePresence>
        {qrItem && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative bg-[#0A0A0A] border border-white/10 p-12 max-w-sm w-full text-center space-y-8"
            >
              <button onClick={() => setQrItem(null)} className="absolute top-4 right-4 opacity-30 hover:opacity-100">
                <RiCloseLine size={24} />
              </button>
              <p className="text-[9px] font-mono tracking-[0.5em] opacity-30 uppercase">Digital_Asset_Tag</p>
              <div className="bg-white p-4 inline-block mx-auto">
                <QRCodeSVG id="product-qr" value={`${window.location.origin}/product/${qrItem._id}`} size={200} level="H" />
              </div>
              <button onClick={downloadQR} className="w-full bg-white text-black py-4 text-[9px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">
                 Download_Identity_Map
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AdminProductModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
        editingProduct={editingProduct}
        setProducts={setProducts}
        setToast={setToast}
        categories={CATEGORIES}
      />

      <ProductPreviewPortal item={previewItem} onClose={() => setPreviewItem(null)} />

      {/* SYSTEM TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-10 right-10 flex items-center gap-6 bg-white text-black px-10 py-5 text-[9px] font-black uppercase tracking-[0.5em] z-[800] border-l-8 border-black"
          >
            <RiCheckboxCircleLine size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;