import React from "react";
import { RiFocus2Line, RiSeparator } from "@remixicon/react";

const CollectionHeader = ({ filter, totalItems }) => {
  return (
    <div className="max-w-7xl mx-auto mb-16 md:mb-24 relative pt-12 md:pt-20">
      
      {/* --- VOID ELEMENT: Refined Ghost Text --- */}
      {/* Added 'overflow-hidden' to parent or 'max-w-full' here to prevent mobile layout break */}
      <div className="absolute top-0 left-[-2%] text-[22vw] md:text-[15vw] font-black opacity-[0.03] select-none pointer-events-none tracking-tighter leading-none uppercase truncate w-full z-0">
        {filter === "All" ? "Archive" : filter}
      </div>

      <div className="relative z-10 space-y-6 md:space-y-10">
        
        {/* --- BREADCRUMB: Metadata Style --- */}
        <nav className="flex items-center gap-3 md:gap-4 text-[7px] md:text-[8px] font-mono uppercase tracking-[0.4em] md:tracking-[0.5em] text-white/40">
          <span className="hover:text-white cursor-pointer transition-colors">Vanguard</span>
          <RiSeparator size={8} className="opacity-20 shrink-0" />
          <span className="hover:text-white cursor-pointer transition-colors">Repository</span>
          <RiSeparator size={8} className="opacity-20 shrink-0" />
          <span className="text-[var(--brand-main)] font-bold">Node_{filter}</span>
        </nav>

        {/* --- MAIN TITLE: Editorial Statement --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
               <div className="relative flex items-center justify-center">
                  <RiFocus2Line size={14} className="text-[var(--brand-main)]" />
                  <div className="absolute inset-0 bg-[var(--brand-main)] blur-sm opacity-40 animate-pulse" />
               </div>
               <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40">Frequency_Locked</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter leading-[0.85] text-white">
              The <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
                Collection
              </span>
            </h1>
          </div>

          {/* --- DATA COUNTER --- */}
          <div className="flex flex-col items-start md:items-end group">
            <div className="overflow-hidden">
                <span className="block text-[48px] md:text-[60px] font-serif italic leading-none transition-transform duration-700 group-hover:-translate-y-1">
                    {String(totalItems).padStart(2, '0')}
                </span>
            </div>
            <span className="text-[8px] font-mono uppercase tracking-[0.4em] opacity-30 mt-1">Units_Detected</span>
            <div className="w-full md:w-24 h-[1px] bg-white/20 mt-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--brand-main)] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </div>
          </div>
        </div>

      </div>

      {/* --- DECOR: Vertical Measurement Line --- */}
      <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
    </div>
  );
};

export default CollectionHeader;