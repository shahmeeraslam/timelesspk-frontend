import React, { useState, useMemo } from "react";
import { useShop } from "../../context/ShopContext";
import { 
  RiListSettingsLine, 
  RiExpandUpDownLine, 
  RiSearchLine, 
  RiCloseLine 
} from "@remixicon/react";

const CollectionFilters = ({ products, filter, setFilter, setSortOrder, activeCount }) => {
  const { search, setSearch } = useShop();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // --- DYNAMIC CATEGORY EXTRACTION ---
  // This extracts only categories that actually exist in your database
  const dynamicCategories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto mb-20 px-4 md:px-0">
      <div className="relative border border-white/10 bg-white/[0.02] backdrop-blur-md px-4 md:px-8 py-4 flex flex-col lg:flex-row items-center justify-between gap-6 transition-all duration-500">
        
        {/* --- LEFT: DYNAMIC CATEGORIES --- */}
        <div className={`flex items-center gap-6 w-full lg:w-auto transition-all duration-500 ${isSearchExpanded ? 'lg:opacity-40' : 'opacity-100'}`}>
          <div className="hidden xl:flex items-center gap-3 shrink-0 border-r border-white/10 pr-6 mr-2">
             <div className="w-1 h-1 bg-[var(--brand-main)] rounded-full animate-pulse" />
             <span className="text-[8px] font-mono tracking-[0.3em] uppercase opacity-40">Filter</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
            {dynamicCategories.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="relative py-2 outline-none shrink-0 group/btn"
                >
                  <span className={`text-[9px] font-mono uppercase tracking-[0.3em] transition-colors duration-300 
                    ${isActive ? "text-white" : "text-white/30 hover:text-white/60"}`}>
                    {cat}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--brand-main)] shadow-[0_0_8px_var(--brand-main)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- RIGHT: SEARCH + SORT + COUNT (The Control Cluster) --- */}
        <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 md:gap-8 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
          
          {/* SEARCH MODULE: Expandable Inline */}
          <div className={`relative flex items-center transition-all duration-500 bg-white/[0.03] rounded-full px-3 py-1.5 border border-white/5 ${isSearchExpanded ? 'w-full lg:w-64 border-white/20' : 'w-10'}`}>
            <RiSearchLine 
              size={16} 
              className={`cursor-pointer transition-colors ${isSearchExpanded ? 'text-[var(--brand-main)]' : 'opacity-30'}`}
              onClick={() => setIsSearchExpanded(true)}
            />
            {isSearchExpanded && (
              <input 
                autoFocus
                type="text"
                placeholder="Query..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => !search && setIsSearchExpanded(false)}
                className="w-full bg-transparent outline-none text-[9px] font-mono uppercase tracking-widest text-white ml-3"
              />
            )}
            {isSearchExpanded && (
              <RiCloseLine 
                size={14} 
                className="ml-2 cursor-pointer opacity-40 hover:opacity-100" 
                onClick={() => { setSearch(""); setIsSearchExpanded(false); }}
              />
            )}
          </div>

          {/* SORT MODULE */}
          <div className="flex items-center gap-3 shrink-0">
             <RiListSettingsLine size={14} className="opacity-20" />
             <div className="relative">
                <select
                  className="appearance-none bg-transparent text-[9px] font-bold uppercase tracking-[0.2em] text-white/80 outline-none cursor-pointer pr-4"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="newest" className="bg-[#0a0a0a]">Latest</option>
                  <option value="low" className="bg-[#0a0a0a]">Price_Asc</option>
                  <option value="high" className="bg-[#0a0a0a]">Price_Desc</option>
                </select>
                <RiExpandUpDownLine size={10} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
             </div>
          </div>

          {/* COUNTER MODULE */}
          <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-8">
            <div className="flex flex-col items-end leading-none">
              <span className="text-[16px] font-serif italic text-white">
                {String(activeCount || 0).padStart(2, '0')}
              </span>
              <span className="text-[6px] font-mono uppercase tracking-[0.3em] opacity-20">Units</span>
            </div>
          </div>
        </div>

        {/* --- DESIGNER ACCENTS --- */}
        <div className="absolute -top-px -left-px w-2 h-2 border-t border-l border-white/20" />
        <div className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-white/20" />
      </div>
    </div>
  );
};

export default CollectionFilters;