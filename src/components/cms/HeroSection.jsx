const HeroSection = ({ data, update }) => (
  <section className="space-y-8">
    <div className="flex items-center gap-4 border-l-2 border-[var(--brand-main)] pl-6">
      <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-50">Section_01 // Hero_Identity</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <input placeholder="Headline_Top" className="bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-serif italic text-2xl focus:border-[var(--brand-main)]" 
        value={data.titleTop} onChange={(e) => update({...data, titleTop: e.target.value})} />
      <input placeholder="Headline_Bottom" className="bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-sans font-black text-2xl focus:border-[var(--brand-main)]" 
        value={data.titleBottom} onChange={(e) => update({...data, titleBottom: e.target.value})} />
    </div>
    <input placeholder="HORIZON_TAGLINE" className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none text-[10px] font-mono tracking-[0.4em] uppercase" 
      value={data.tagline} onChange={(e) => update({...data, tagline: e.target.value})} />
    <textarea placeholder="VISION_STATEMENT" rows={3} className="w-full bg-transparent border border-[var(--brand-border)] p-5 outline-none text-xs font-light tracking-wider" 
      value={data.subtitle} onChange={(e) => update({...data, subtitle: e.target.value})} />
  </section>
);

export default HeroSection;