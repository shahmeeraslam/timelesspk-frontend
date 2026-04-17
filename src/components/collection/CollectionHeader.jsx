import React from "react";
import { RiFocus2Line, RiSeparator } from "@remixicon/react";

const CollectionHeader = ({ filter, totalItems }) => {
  return (
    <div className="max-w-7xl mx-auto mb-20 relative pt-10">
      
      {/* --- VOID ELEMENT: Large Ghost Text for Depth --- */}
      <div className="absolute top-0 left-0 text-[15vw] font-black opacity-[0.02] select-none pointer-events-none tracking-tighter leading-none uppercase">
        {filter === "All" ? "Archive" : filter}
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* --- BREADCRUMB: Technical Metadata Style --- */}
        <nav className="flex items-center gap-4 text-[8px] font-mono uppercase tracking-[0.5em] text-[var(--brand-muted)]">
          <span className="hover:text-[var(--brand-main)] cursor-pointer transition-colors">Core</span>
          <RiSeparator size={8} className="opacity-20" />
          <span className="hover:text-[var(--brand-main)] cursor-pointer transition-colors">Archive_Repository</span>
          <RiSeparator size={8} className="opacity-20" />
          <span className="text-[var(--brand-main)] font-bold">Node_{filter}</span>
        </nav>

        {/* --- MAIN TITLE: The Editorial Statement --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
               <RiFocus2Line size={14} className="text-[var(--brand-main)] animate-pulse" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40">System_Status: Online</span>
            </div>
            <h1 className="text-6xl md:text-9xl font-serif italic tracking-tighter leading-[0.8] text-[var(--brand-main)]">
              The <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[var(--brand-main)] to-[var(--brand-main)]/20">
                Collection
              </span>
            </h1>
          </div>

          {/* --- DATA COUNTER: Adds scarcity/volume psychological trigger --- */}
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[40px] font-serif italic leading-none">{String(totalItems).padStart(2, '0')}</span>
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] opacity-40">Available_Units</span>
            <div className="w-full h-[1px] bg-[var(--brand-main)] opacity-10 mt-2" />
          </div>
        </div>

      </div>

      {/* --- DECOR: Vertical Measurement Line --- */}
      <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--brand-main)] to-transparent opacity-10 hidden lg:block" />
    </div>
  );
};

export default CollectionHeader;