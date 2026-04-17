// src/components/SearchBar.jsx
import React from 'react';
import { useShop } from '../context/ShopContext';
import { RiSearchLine, RiCloseLine } from '@remixicon/react';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useShop();

  if (!showSearch) return null;

  return (
   <div className="bg-[var(--brand-alt)] border-b border-[var(--brand-border)] py-4 m-2 px-6 md:px-12 animate-in slide-in-from-top duration-300">
  <div className="max-w-3xl mx-auto flex items-center gap-4">
    <RiSearchLine className="text-[var(--brand-muted)] text-lg" />
    <input 
      autoFocus
      type="text" 
      placeholder="Search the Archive..." 
      className="w-full bg-transparent outline-none text-sm font-serif italic tracking-wide text-[var(--brand-main)] placeholder:text-[var(--brand-border)]"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
    <RiCloseLine 
      className="text-[var(--brand-muted)] cursor-pointer hover:text-[var(--brand-main)] transition"
      onClick={() => setShowSearch(false)}
    />
  </div>
</div>
  );
};

export default SearchBar;