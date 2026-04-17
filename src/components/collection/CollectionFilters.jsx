import React, { useState, useMemo, useEffect } from "react";
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
  const [isSticky, setIsSticky] = useState(false);

  // --- STICKY OBSERVER ---
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- DYNAMIC CATEGORY EXTRACTION ---
  const dynamicCategories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [products]);

  return (
    <div className={`max-w-7xl mx-auto mb-12 md:mb-20 px-4 md:px-0 transition-all duration-500 z-[80] `}>
      <div className={`border border-white/10 bg-black/40 backdrop-blur-xl px-4 md:px-8 py-3 md:py-4 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 transition-all duration-500 ${isSticky ? 'shadow-2xl border-[var(--brand-main)]/20' : ''}`}>
        
        {/* --- LEFT: DYNAMIC CATEGORIES --- */}
        {/* On mobile, we use a custom scrollbar-hide to keep it clean */}
        <div className={`flex items-center gap-4 md:gap-6 w-full lg:w-auto transition-all duration-500 ${isSearchExpanded && window.innerWidth < 1024 ? 'hidden' : 'flex'}`}>
          <div className="hidden xl:flex items-center gap-3 shrink-0 border-r border-white/10 pr-6 mr-2">
             <div className="w-1 h-1 bg-[var(--brand-main)] rounded-full animate-pulse" />
             <span className="text-[7px] font-mono tracking-[0.3em] uppercase opacity-40">Frequency</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap scroll-smooth pb-1 lg:pb-0">
            {dynamicCategories.map((cat) => {
              const isActive = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="relative py-2 outline-none group/btn shrink-0"
                >
                  <span className={`text-[9px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 
                    ${isActive ? "text-white font-bold" : "text-white/30 hover:text-white/60"}`}>
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

        {/* --- RIGHT: CONTROL CLUSTER --- */}
        <div className={`flex items-center justify-between lg:justify-end gap-4 md:gap-8 w-full lg:w-auto ${isSearchExpanded && window.innerWidth < 1024 ? 'flex' : 'border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0'}`}>
          
          {/* SEARCH MODULE: Dynamic width with mobile override */}
          <div className={`relative flex items-center transition-all duration-500 bg-white/[0.03] rounded-sm px-3 py-2 border border-white/10 ${isSearchExpanded ? 'flex-grow lg:w-64 border-[var(--brand-main)]/40' : 'w-10 cursor-pointer hover:bg-white/5'}`}
               onClick={() => !isSearchExpanded && setIsSearchExpanded(true)}>
            <RiSearchLine 
              size={14} 
              className={`shrink-0 transition-colors ${isSearchExpanded ? 'text-[var(--brand-main)]' : 'opacity-30'}`}
            />
            {isSearchExpanded && (
              <input 
                autoFocus
                type="text"
                placeholder="TYPE_QUERY..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => !search && setIsSearchExpanded(false)}
                className="w-full bg-transparent outline-none text-[9px] font-mono uppercase tracking-widest text-white ml-3 placeholder:opacity-20"
              />
            )}
            {isSearchExpanded && (
              <RiCloseLine 
                size={14} 
                className="ml-2 cursor-pointer opacity-40 hover:opacity-100 shrink-0" 
                onClick={(e) => { e.stopPropagation(); setSearch(""); setIsSearchExpanded(false); }}
              />
            )}
          </div>

          {/* SORT + COUNT Group */}
          <div className={`flex items-center gap-4 md:gap-8 ${isSearchExpanded && window.innerWidth < 1024 ? 'hidden sm:flex' : 'flex'}`}>
            <div className="flex items-center gap-2 group/sort cursor-pointer">
               <RiListSettingsLine size={12} className="opacity-20 group-hover/sort:opacity-100 transition-opacity" />
               <div className="relative">
                  <select
                    className="appearance-none bg-transparent text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-white outline-none cursor-pointer pr-4 transition-colors"
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="newest" className="bg-[#0a0a0a]">Latest_Release</option>
                    <option value="low" className="bg-[#0a0a0a]">Val_Ascending</option>
                    <option value="high" className="bg-[#0a0a0a]">Val_Descending</option>
                  </select>
                  <RiExpandUpDownLine size={8} className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
               </div>
            </div>

            {/* COUNTER MODULE */}
            <div className="flex items-center gap-4 border-l border-white/10 pl-4 md:pl-6 h-6 md:h-8">
              <div className="flex flex-col items-end leading-none">
                <span className="text-[14px] md:text-[16px] font-serif italic text-white leading-none">
                  {String(activeCount || 0).padStart(2, '0')}
                </span>
                <span className="text-[6px] font-mono uppercase tracking-[0.2em] opacity-20">Units</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- CORNER ACCENTS --- */}
        <div className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-white/30" />
        <div className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-white/30" />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default CollectionFilters;