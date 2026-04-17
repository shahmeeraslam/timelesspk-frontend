import API from "../../../api"
import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "../../context/StoreContext";
import { AnimatePresence, motion } from "framer-motion";
import { 
  RiSearchLine, 
  RiLoader4Line, 
  RiCloseLine, 
  RiDownloadLine, 
  RiQrCodeLine 
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
  const [qrItem, setQrItem] = useState(null); // Added for QR logic
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

  // QR Asset Download Logic
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
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 lg:px-12 selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto space-y-16">
        
        {/* EDITORIAL HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 opacity-30">
              <div className="w-8 h-[1px] bg-white" />
              <span className="text-[10px] font-mono tracking-[0.5em] uppercase italic">System_v2.4_QR_Integration_Live</span>
            </div>
            <h1 className="text-6xl font-serif italic tracking-tighter leading-none">The Inventory</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative group">
              <RiSearchLine className="absolute left-0 top-1/2 -translate-y-1/2 size-4 opacity-20 group-focus-within:opacity-100 transition-opacity" />
              <input 
                type="text" 
                placeholder="SEARCH_BY_NOMENCLATURE" 
                className="bg-transparent border-b border-white/10 py-2 pl-8 outline-none text-[10px] font-mono tracking-widest w-64 focus:border-white transition-all placeholder:opacity-20 uppercase"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
              className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#e5e5e5] active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Add New Piece +
            </button>
          </div>
        </header>

        {/* CATEGORY NAVIGATION */}
        <nav className="flex items-center gap-10 overflow-x-auto no-scrollbar pb-4 border-b border-white/5">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[9px] font-mono uppercase tracking-[0.4em] whitespace-nowrap transition-all flex items-center gap-2 ${
                activeCategory === cat ? "text-white opacity-100" : "opacity-20 hover:opacity-100"
              }`}
            >
              {cat} {activeCategory === cat && <span className="size-1 bg-white rounded-full animate-pulse" />}
            </button>
          ))}
        </nav>

        {/* LOADING STATE */}
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4 border border-white/5 bg-white/[0.02]">
            <RiLoader4Line className="animate-spin text-white/20" size={32} />
            <span className="text-[9px] font-mono uppercase tracking-[0.5em] text-white/20">Syncing_Records...</span>
          </div>
        ) : (
          <InventoryTable 
            products={filteredProducts}
            loading={loading}
            onEdit={(item) => {
              setEditingProduct(item);
              setIsModalOpen(true);
            }}
            onPreview={(item) => setPreviewItem(item)}
            onShowQR={(item) => setQrItem(item)} // FIXED: Passed the function here
            setProducts={setProducts}
            setToast={setToast}
          />
        )}
      </div>

      {/* QR MODAL PORTAL */}
      <AnimatePresence>
        {qrItem && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
              onClick={() => setQrItem(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#0A0A0A] border border-white/10 p-12 max-w-sm w-full text-center space-y-8 shadow-2xl"
            >
              <button onClick={() => setQrItem(null)} className="absolute top-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
                <RiCloseLine size={24} />
              </button>

              <div className="space-y-2">
                <p className="text-[10px] font-mono tracking-[0.3em] opacity-30 uppercase">Product_Asset_Tag</p>
                <h3 className="text-xl font-serif italic text-white/90">{qrItem.name}</h3>
              </div>

              <div className="bg-white p-4 inline-block mx-auto rounded-sm">
                <QRCodeSVG 
                  id="product-qr"
                  value={`${window.location.origin}/product/${qrItem._id}`} 
                  size={200}
                  level={"H"}
                />
              </div>

              <div className="space-y-3">
                <button 
                  onClick={downloadQR}
                  className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 text-[9px] font-mono font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-all"
                >
                  <RiDownloadLine size={14} /> Export_PNG
                </button>
                <p className="text-[7px] font-mono opacity-20 tracking-tighter break-all">
                  PATH: {window.location.origin}/product/{qrItem._id}
                </p>
              </div>
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

      {/* TOAST SYSTEM */}
      {toast && (
        <div className="fixed bottom-10 right-10 flex items-center gap-4 bg-white text-black px-10 py-5 text-[9px] font-mono uppercase tracking-[0.4em] z-[300] border border-black/10">
          <div className="size-2 bg-black animate-ping" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default Inventory;