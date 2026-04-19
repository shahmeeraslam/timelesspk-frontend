import React from "react";

/**
 * @param {string} id - The section number (e.g., "02")
 * @param {string} label - The display name (e.g., "Highlights")
 * @param {object} data - The specific config object (e.g., config.lookbook)
 * @param {function} update - Function to update the parent state
 * @param {boolean} isLarge - If true, renders an additional subtitle textarea
 */

const ContentSection = ({ id, label, data, update, isLarge = false }) => {
  return (
    <section className="space-y-8 pt-8 border-t border-[var(--brand-border)] animate-in fade-in duration-500">
      {/* SECTION IDENTIFIER */}
      <div className="flex items-center gap-4 border-l-2 border-[var(--brand-main)] pl-6">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">
          Section_{id} // {label}_Metadata
        </h3>
      </div>

      {/* PRIMARY INPUTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Header_Title</label>
          <input 
            placeholder="SECTION_TITLE" 
            className="bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-serif italic text-xl focus:border-[var(--brand-main)] transition-colors" 
            value={data?.title || ""} 
            onChange={(e) => update({ ...data, title: e.target.value })} 
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Header_Tagline</label>
          <input 
            placeholder="SECTION_TAGLINE" 
            className="bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-mono text-[10px] tracking-widest uppercase focus:border-[var(--brand-main)] transition-colors" 
            value={data?.tagline || ""} 
            onChange={(e) => update({ ...data, tagline: e.target.value })} 
          />
        </div>
      </div>

      {/* OPTIONAL EXTENDED CONTENT (e.g., for Footwear Vision) */}
      {isLarge && (
        <div className="flex flex-col gap-2 pt-4">
          <label className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Extended_Description</label>
          <textarea 
            placeholder={`${label.toUpperCase()}_SUBTITLE_STATEMENT`} 
            rows={2} 
            className="w-full bg-black/20 border border-[var(--brand-border)] p-4 outline-none text-[10px] font-light tracking-wider focus:border-[var(--brand-main)] transition-colors" 
            value={data?.subtitle || ""} 
            onChange={(e) => update({ ...data, subtitle: e.target.value })} 
          />
        </div>
      )}
    </section>
  );
};

export default ContentSection;