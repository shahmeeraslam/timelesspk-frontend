import API from "../../../api"
import React, { useState, useEffect } from "react";
import { 
  RiCloseLine, RiLink, RiImageAddLine, RiFilmLine, 
  RiHashtag, RiPriceTag3Line, RiArchiveDrawerLine, RiPaletteLine,
  RiPercentLine, RiCalculatorLine
} from "@remixicon/react";

const FAMOUS_COLORS = ["Black", "White", "Grey", "Navy", "Beige", "Red", "Olive"];

const AdminProductModal = ({ isOpen, onClose, editingProduct, setProducts, setToast, categories }) => {
  const initialProductState = {
    name: "",
    category: "Clothing",
    price: "",
    discount: 0, // NEW: Discount field
    stock: "",
    image: [], 
    colors: [], 
    videoUrl: "",
    curatorNote: "",
  };

  const [formData, setFormData] = useState(initialProductState);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [selectedTagColor, setSelectedTagColor] = useState("Neutral");

  // --- CALCULATED VALUES ---
  const discountedPrice = formData.price && formData.discount 
    ? formData.price - (formData.price * (formData.discount / 100))
    : formData.price;

  useEffect(() => {
    if (editingProduct) {
      setFormData({ 
        ...initialProductState, 
        ...editingProduct,
        image: Array.isArray(editingProduct.image) ? editingProduct.image : [] 
      });
    } else {
      setFormData(initialProductState);
    }
  }, [editingProduct, isOpen]);

  const handleAddColor = (colorValue) => {
    const color = colorValue || colorInput;
    if (!color.trim() || formData.colors.includes(color)) return;
    setFormData(prev => ({ 
      ...prev, 
      colors: [...prev.colors, color.trim()] 
    }));
    setColorInput("");
  };

  const removeColor = (colorToRemove) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== colorToRemove),
      image: prev.image.map(img => img.color === colorToRemove ? { ...img, color: "Neutral" } : img)
    }));
  };

  const processImage = (source) => {
    setFormData(prev => ({
      ...prev,
      image: [...prev.image, { url: source, color: selectedTagColor }]
    }));
  };

  const handleAddImageLink = () => {
    if (!imageUrlInput.trim()) return;
    processImage(imageUrlInput);
    setImageUrlInput("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => processImage(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await API.put(`/api/products/${editingProduct._id}`, formData);
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data : p));
        setToast("Archive_Updated_Success");
      } else {
        const res = await API.post(`/api/products`, formData);
        setProducts(prev => [res.data, ...prev]);
        setToast("New_Unit_Archived");
      }
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Terminal_Sync_Error";
      setToast(errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 lg:p-12 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-7xl bg-[#080808] border border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-black/40">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-[0.5em] text-white/30 uppercase italic">Control_Panel: Product_Logic</span>
            <h2 className="text-2xl font-serif italic text-white">
              {editingProduct ? "Modify_Existing_Record" : "Initialize_New_Archive"}
            </h2>
          </div>
          <button onClick={onClose} className="p-3 hover:rotate-90 transition-all text-white/40 hover:text-white">
            <RiCloseLine size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 h-[75vh] overflow-y-auto no-scrollbar">
          
          {/* LEFT: VISUAL & COLOR TERMINAL */}
          <div className="p-10 bg-black/20 space-y-10 border-r border-white/5">
            {/* [Existing Color Registry and Tagged Media code remains the same as your input] */}
            <div className="space-y-6">
              <label className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase block">01_Surface_Color_Registry</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select 
                  className="bg-transparent border border-white/10 py-3 px-4 text-[10px] font-mono uppercase outline-none text-white cursor-pointer"
                  onChange={(e) => handleAddColor(e.target.value)}
                  value=""
                >
                  <option value="" className="bg-black">Famous_Presets...</option>
                  {FAMOUS_COLORS.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <input 
                    type="text" value={colorInput} placeholder="Custom_Color"
                    className="flex-1 bg-transparent border border-white/10 py-3 px-4 text-[11px] font-mono outline-none text-white"
                    onChange={(e) => setColorInput(e.target.value)}
                  />
                  <button type="button" onClick={() => handleAddColor()} className="bg-white/10 px-4 hover:bg-white hover:text-black transition-all text-white">
                    <RiPaletteLine size={14}/>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors?.map((c, i) => (
                  <span key={i} className="px-3 py-1 border border-white/20 text-[9px] font-mono uppercase text-white/60 flex items-center gap-2">
                    {c} <RiCloseLine size={10} className="cursor-pointer" onClick={() => removeColor(c)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-10 border-t border-white/5">
               <label className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase block">02_Tagged_Visual_Archive</label>
               {/* [Include your existing image mapping logic here] */}
               <div className="grid grid-cols-3 gap-3">
                {formData.image.map((img, idx) => (
                  <div key={idx} className="aspect-[3/4] relative border border-white/10 group bg-black overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image: formData.image.filter((_, i) => i !== idx)})} 
                      className="absolute top-1 right-1 bg-black text-white p-1 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RiCloseLine size={10} />
                    </button>
                  </div>
                ))}
                <label className="aspect-[3/4] border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all">
                  <RiImageAddLine size={20} className="text-white/20" />
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT: METADATA & DISCOUNT LOGIC */}
          <div className="p-10 space-y-12 flex flex-col justify-between">
            <div className="space-y-10">
              <InputGroup label="Unit_Nomenclature" icon={<RiArchiveDrawerLine size={14}/>}>
                <input 
                  type="text" required value={formData.name}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-xl font-serif italic text-white outline-none focus:border-white"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </InputGroup>

              {/* VALUATION & DISCOUNT TERMINAL */}
              <div className="bg-white/[0.02] border border-white/5 p-8 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <InputGroup label="Base_Valuation (PKR)" icon={<RiPriceTag3Line size={14}/>}>
                    <input 
                      type="number" required value={formData.price}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-light text-white outline-none focus:border-white"
                      onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    />
                  </InputGroup>
                  <InputGroup label="Seasonal_Discount (%)" icon={<RiPercentLine size={14}/>}>
                    <input 
                      type="number" min="0" max="99" value={formData.discount}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-light text-[var(--brand-accent,#ffc107)] outline-none focus:border-[var(--brand-accent)]"
                      onChange={(e) => setFormData({...formData, discount: Number(e.target.value)})}
                    />
                  </InputGroup>
                </div>

                {/* REAL-TIME CALCULATION FEED */}
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-[8px] font-mono uppercase text-white/20">
                      <RiCalculatorLine size={12}/> Adjusted_Market_Price:
                    </p>
                    <p className="text-2xl font-black italic tracking-tighter text-white">
                      PKR {discountedPrice?.toLocaleString()}
                    </p>
                  </div>
                  {formData.discount > 0 && (
                    <span className="px-3 py-1 bg-red-950/30 border border-red-500/50 text-red-500 text-[9px] font-mono uppercase tracking-widest">
                      Active_Markdown: {formData.discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <InputGroup label="Classification" icon={<RiHashtag size={14}/>}>
                  <select 
                    className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] uppercase tracking-widest text-white outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                  </select>
                </InputGroup>
                <InputGroup label="Availability_Count">
                  <input 
                    type="number" value={formData.stock}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-xs text-white outline-none font-mono"
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Curator_Commentary">
                <textarea 
                  className="w-full bg-transparent border border-white/10 p-4 text-xs font-serif italic text-white outline-none focus:border-white h-32 resize-none"
                  placeholder="Architectural silhouette notes..."
                  value={formData.curatorNote}
                  onChange={(e) => setFormData({...formData, curatorNote: e.target.value})}
                />
              </InputGroup>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-6 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-[var(--brand-accent,#ccc)] transition-all"
            >
              {editingProduct ? "Sync_Archive_Record" : "Finalize_Archive_Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 opacity-30">
      {icon}
      <label className="text-[9px] font-mono tracking-[0.4em] uppercase text-white">{label}</label>
    </div>
    {children}
  </div>
);

export default AdminProductModal;