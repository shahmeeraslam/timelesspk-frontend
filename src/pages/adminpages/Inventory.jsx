import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "../../context/StoreContext";
import axios from "axios";
import { RiAddLine, RiSearchLine, RiLoader4Line } from "@remixicon/react";

// Modular Components
import InventoryTable from "../../components/admininventory/InventoryTable";
import AdminProductModal from "../../components/admininventory/AdminProductModal";
import ProductPreviewPortal from "../../components/admininventory/ProductPreviewPortal";

const API_URL = "http://localhost:5000/api/products";

const Inventory = () => {
  const { products, setProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  // Consistent with your store/database classification
  const CATEGORIES = ["Clothing", "T-Shirts", "Shoes", "Watches", "Accessories"];

  const fetchArchive = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (err) {
      setToast("Terminal_Connection_Error");
    } finally {
      setLoading(false);
    }
  }, [setProducts]);

  useEffect(() => { 
    fetchArchive(); 
  }, [fetchArchive]);

  // Unified Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle toast cleanup
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
              <span className="text-[10px] font-mono tracking-[0.5em] uppercase italic">System_v2.4_Color_Tagging_Active</span>
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
            setProducts={setProducts}
            setToast={setToast}
          />
        )}
      </div>

      {/* INTEGRATED MODAL WITH COLOR TAGGING */}
      <AdminProductModal 
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false); 
          setEditingProduct(null); 
        }}
        editingProduct={editingProduct}
        setProducts={setProducts}
        setToast={setToast}
        categories={CATEGORIES}
      />

      <ProductPreviewPortal 
        item={previewItem} 
        onClose={() => setPreviewItem(null)} 
      />

      {/* TOAST SYSTEM - ENHANCED VISIBILITY */}
      {toast && (
        <div className="fixed bottom-10 right-10 flex items-center gap-4 bg-white text-black px-10 py-5 text-[9px] font-mono uppercase tracking-[0.4em] z-[300] shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-black/10">
          <div className="size-2 bg-black animate-ping" />
          {toast}
        </div>
      )}
    </div>
  );
};

export default Inventory;