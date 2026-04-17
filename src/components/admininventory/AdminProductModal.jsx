import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  RiCloseLine, RiLink, RiImageAddLine, RiFilmLine, 
  RiHashtag, RiPriceTag3Line, RiArchiveDrawerLine, RiPaletteLine 
} from "@remixicon/react";

const FAMOUS_COLORS = ["Black", "White", "Grey", "Navy", "Beige", "Red", "Olive"];

const AdminProductModal = ({ isOpen, onClose, editingProduct, setProducts, setToast, categories }) => {
  const initialProductState = {
    name: "",
    category: "Clothing",
    price: "",
    stock: "",
    image: [], // Final structure: [{ url: string, color: string }]
    colors: [], 
    videoUrl: "",
    curatorNote: "",
  };

  const [formData, setFormData] = useState(initialProductState);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [selectedTagColor, setSelectedTagColor] = useState("Neutral");

  // --- SYNC STATE ---
  useEffect(() => {
    if (editingProduct) {
      // Ensure existing images/colors match the new structure if coming from old DB data
      setFormData({ 
        ...initialProductState, 
        ...editingProduct,
        image: Array.isArray(editingProduct.image) ? editingProduct.image : [] 
      });
    } else {
      setFormData(initialProductState);
    }
  }, [editingProduct, isOpen]);

  // --- COLOR REGISTRY MANAGEMENT ---
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
      // Clean up images that were tagged with this color (optional: move to Neutral)
      image: prev.image.map(img => img.color === colorToRemove ? { ...img, color: "Neutral" } : img)
    }));
  };

  // --- ASSET PROCESSING (TAGGED) ---
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

  // --- PERSISTENCE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingProduct) {
        const res = await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, formData, config);
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? res.data : p));
        setToast("Archive_Updated_Success");
      } else {
        const res = await axios.post(`http://localhost:5000/api/products`, formData, config);
        setProducts(prev => [res.data, ...prev]);
        setToast("New_Unit_Archived");
      }
      onClose();
    } catch (err) {
      setToast("Terminal_Sync_Error: Payload_Likely_Too_Large");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 lg:p-12 bg-black/90 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
      <div className="w-full max-w-7xl bg-[#080808] border border-white/10 relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-black/40">
          <div className="space-y-1">
            <span className="text-[9px] font-mono tracking-[0.5em] text-white/30 uppercase italic">Security_Level: Admin_Access</span>
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
            
            {/* COLOR REGISTRY */}
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
                    className="flex-1 bg-transparent border border-white/10 py-3 px-4 text-[11px] font-mono outline-none text-white focus:border-white/30 transition-all"
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                  />
                  <button type="button" onClick={() => handleAddColor()} className="bg-white/10 px-4 hover:bg-white hover:text-black transition-all text-white">
                    <RiPaletteLine size={14}/>
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors?.map((c, i) => (
                  <span key={i} className="px-3 py-1 border border-white/20 text-[9px] font-mono uppercase text-white/60 flex items-center gap-2 bg-white/5">
                    {c} <RiCloseLine size={10} className="cursor-pointer hover:text-red-500" onClick={() => removeColor(c)} />
                  </span>
                ))}
              </div>
            </div>

            {/* TAGGED MEDIA ASSETS */}
            <div className="space-y-6 pt-10 border-t border-white/5">
              <label className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase block">02_Tagged_Visual_Archive</label>
              
              <div className="bg-white/5 p-5 border border-white/5 space-y-4">
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest italic">Active_Target_Tag:</p>
                <div className="flex flex-wrap gap-2">
                  {["Neutral", ...formData.colors].map(c => (
                    <button 
                      key={c} type="button" onClick={() => setSelectedTagColor(c)}
                      className={`px-4 py-1.5 text-[8px] font-mono border transition-all ${selectedTagColor === c ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-white/10 text-white/40 hover:opacity-100 hover:border-white/30'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <RiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                  <input 
                    type="text" value={imageUrlInput} placeholder="URL_SOURCE_LINK"
                    className="w-full bg-transparent border border-white/10 py-3 pl-10 pr-4 text-[11px] font-mono outline-none text-white focus:border-white/40 transition-all"
                    onChange={(e) => setImageUrlInput(e.target.value)}
                  />
                </div>
                <button type="button" onClick={handleAddImageLink} className="bg-white text-black px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-[var(--brand-accent,#ccc)] transition-colors">Link</button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {formData.image.map((img, idx) => (
                  <div key={idx} className="aspect-[3/4] relative border border-white/10 group bg-black overflow-hidden shadow-inner">
                    <img src={img.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/90 py-1.5 px-2 border-t border-white/5">
                      <p className="text-[7px] font-mono uppercase text-white/40 tracking-tighter truncate">{img.color}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image: formData.image.filter((_, i) => i !== idx)})} 
                      className="absolute top-1 right-1 bg-black text-white p-1 border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RiCloseLine size={10} />
                    </button>
                  </div>
                ))}
                <label className="aspect-[3/4] border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group">
                  <RiImageAddLine size={20} className="text-white/20 group-hover:text-white transition-colors" />
                  <span className="text-[8px] font-mono text-white/20 mt-2 uppercase">Upload_Local</span>
                  <input type="file" multiple className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            {/* CINEMA ENTRY */}
            <div className="space-y-4 pt-10 border-t border-white/5">
              <label className="text-[10px] font-mono tracking-[0.4em] text-white/40 uppercase flex items-center gap-2">
                <RiFilmLine size={14} /> 03_Cinema_Archive (URL)
              </label>
              <input 
                type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-xs outline-none text-white focus:border-white transition-all font-mono"
                placeholder="https://cloudinary.com/video/..."
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
              />
            </div>
          </div>

          {/* RIGHT: METADATA & PERSISTENCE */}
          <div className="p-10 space-y-12 flex flex-col justify-between">
            <div className="space-y-8">
              <InputGroup label="Unit_Nomenclature" icon={<RiArchiveDrawerLine size={14}/>}>
                <input 
                  type="text" required value={formData.name}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-xl font-serif italic text-white outline-none focus:border-white"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </InputGroup>

              <div className="grid grid-cols-2 gap-8">
                <InputGroup label="Classification" icon={<RiHashtag size={14}/>}>
                  <select 
                    className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] uppercase tracking-widest text-white outline-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                  </select>
                </InputGroup>
                <InputGroup label="Valuation_USD" icon={<RiPriceTag3Line size={14}/>}>
                  <input 
                    type="number" required value={formData.price}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-lg font-light text-white outline-none focus:border-white"
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </InputGroup>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <InputGroup label="Availability_Count">
                  <input 
                    type="number" value={formData.stock}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-xs text-white outline-none focus:border-white font-mono"
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </InputGroup>
              </div>

              <InputGroup label="Curator_Commentary">
                <textarea 
                  className="w-full bg-transparent border border-white/10 p-4 text-xs font-serif italic text-white outline-none focus:border-white h-40 resize-none leading-relaxed"
                  placeholder="Draft the architectural silhouette and fabric composition..."
                  value={formData.curatorNote}
                  onChange={(e) => setFormData({...formData, curatorNote: e.target.value})}
                />
              </InputGroup>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black py-6 text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-[#ccc] active:scale-[0.99] transition-all"
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