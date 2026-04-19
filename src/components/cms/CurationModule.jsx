import { RiSearchLine, RiFocus3Line, RiGalleryLine, RiFootprintLine, RiCheckLine } from "@remixicon/react";

const CurationModule = ({ allProducts, config, setConfig, searchQuery, setSearchQuery }) => {
  const toggleSelection = (id, field, limit) => {
    const currentSelected = config[field] || [];
    if (currentSelected.includes(id)) {
      setConfig({ ...config, [field]: currentSelected.filter(item => item !== id) });
    } else {
      if (currentSelected.length >= limit) return alert("LIMIT_REACHED");
      setConfig({ ...config, [field]: [...currentSelected, id] });
    }
  };

  const filtered = allProducts.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const SelectionGrid = ({ field, limit, icon: Icon, label, filterFn = (p) => p }) => (
    <div className="p-8 border border-[var(--brand-border)] bg-[var(--brand-soft-bg)] space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] flex items-center gap-2"><Icon size={14} /> {label}</h3>
        <span className="text-[8px] font-mono px-2 py-1 bg-[var(--brand-main)] text-black">{config[field]?.length || 0}/{limit}</span>
      </div>
      <div className="grid grid-cols-5 gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
        {filtered.filter(filterFn).map(p => (
          <div key={p._id} onClick={() => toggleSelection(p._id, field, limit)} 
            className={`relative aspect-square border cursor-pointer transition-all ${config[field]?.includes(p._id) ? 'border-[var(--brand-main)]' : 'border-white/10 opacity-30 grayscale hover:opacity-100'}`}>
            <img src={p.img || p.image} className="w-full h-full object-cover" />
            {config[field]?.includes(p._id) && <RiCheckLine size={10} className="absolute top-0 right-0 bg-[var(--brand-main)] text-black" />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-30 p-4 bg-[var(--brand-alt)] border border-[var(--brand-border)]">
        <div className="relative">
          <RiSearchLine size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
          <input type="text" placeholder="GLOBAL_SEARCH..." className="w-full bg-transparent border border-white/10 pl-10 py-2 text-[9px] font-mono outline-none focus:border-[var(--brand-main)]" 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <SelectionGrid field="featuredProducts" limit={3} icon={RiFocus3Line} label="Highlights" />
      <SelectionGrid field="lookbookProducts" limit={10} icon={RiGalleryLine} label="Lookbook" />
      <SelectionGrid field="footwearProducts" limit={3} icon={RiFootprintLine} label="Footwear" filterFn={p => p.category?.toLowerCase() === 'shoes'} />
    </div>
  );
};

export default CurationModule;