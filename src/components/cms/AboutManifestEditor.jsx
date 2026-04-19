import React from "react";
import { 
  RiHistoryLine, 
  RiMicroscopeLine, 
  RiImageAddLine, 
  RiNodeTree,
  RiFileList3Line
} from "@remixicon/react";

const AboutManifestEditor = ({ config, setConfig }) => {
  
  // Helper to update deep nested aboutPage state
  const updateAbout = (section, field, value) => {
    setConfig({
      ...config,
      aboutPage: {
        ...config.aboutPage,
        [section]: {
          ...config.aboutPage[section],
          [field]: value
        }
      }
    });
  };

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-left-4 duration-700">
      
      {/* SECTION 01: ORIGIN_HERO */}
      <section className="space-y-8">
        <div className="flex items-center gap-4 border-l-2 border-[var(--brand-main)] pl-6">
          <RiHistoryLine size={16} className="text-[var(--brand-main)]" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">
            About_Node_01 // Origin_Hero
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[8px] font-mono opacity-30 uppercase tracking-[0.3em]">Headline_Top</label>
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-serif italic text-3xl focus:border-[var(--brand-main)]" 
              value={config.aboutPage?.hero?.titleTop || ""} 
              onChange={(e) => updateAbout('hero', 'titleTop', e.target.value)} 
            />
          </div>
          <div className="space-y-4">
            <label className="text-[8px] font-mono opacity-30 uppercase tracking-[0.3em]">Headline_Bottom</label>
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-sans font-black text-3xl focus:border-[var(--brand-main)]" 
              value={config.aboutPage?.hero?.titleBottom || ""} 
              onChange={(e) => updateAbout('hero', 'titleBottom', e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[8px] font-mono opacity-30 uppercase tracking-[0.3em]">Side_Navigation_Note</label>
          <textarea 
            rows={2}
            className="w-full bg-black/20 border border-[var(--brand-border)] p-4 outline-none text-[10px] font-mono tracking-widest uppercase" 
            value={config.aboutPage?.hero?.sideNote || ""} 
            onChange={(e) => updateAbout('hero', 'sideNote', e.target.value)} 
          />
        </div>
      </section>

      {/* SECTION 02: THE_MANIFESTO */}
      <section className="space-y-8 pt-8 border-t border-[var(--brand-border)]">
        <div className="flex items-center gap-4 border-l-2 border-[var(--brand-main)] pl-6">
          <RiNodeTree size={16} className="text-[var(--brand-main)]" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">
            About_Node_02 // Philosophy_Thread
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Content Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <input 
              placeholder="Manifesto_Title"
              className="w-full bg-transparent border-b border-[var(--brand-border)] py-3 outline-none font-serif italic text-2xl focus:border-[var(--brand-main)]" 
              value={config.aboutPage?.manifesto?.title || ""} 
              onChange={(e) => updateAbout('manifesto', 'title', e.target.value)} 
            />
            <textarea 
              placeholder="Main_Philosophy_Text"
              rows={6}
              className="w-full bg-transparent border border-[var(--brand-border)] p-6 outline-none text-xs font-light leading-relaxed tracking-wide" 
              value={config.aboutPage?.manifesto?.text || ""} 
              onChange={(e) => updateAbout('manifesto', 'text', e.target.value)} 
            />
          </div>

          {/* Visual & System Note */}
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-video bg-black border border-[var(--brand-border)] relative group overflow-hidden">
               {config.aboutPage?.manifesto?.image && (
                 <img src={config.aboutPage?.manifesto?.image} className="w-full h-full object-cover opacity-40" />
               )}
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity cursor-pointer">
                  <RiImageAddLine size={24} />
                  <span className="text-[8px] font-mono mt-2 uppercase tracking-[0.3em]">Update_Workshop_Visual</span>
               </div>
            </div>
            <div className="p-4 bg-[var(--brand-main)]/5 border border-[var(--brand-main)]/20">
              <label className="text-[8px] font-mono opacity-50 uppercase mb-2 block">System_Provenance_Note</label>
              <input 
                className="w-full bg-transparent outline-none text-[9px] font-mono text-[var(--brand-main)]" 
                value={config.aboutPage?.manifesto?.systemNote || ""} 
                onChange={(e) => updateAbout('manifesto', 'systemNote', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: CORE_DISCIPLINES */}
      <section className="space-y-8 pt-8 border-t border-[var(--brand-border)]">
        <div className="flex items-center gap-4 border-l-2 border-[var(--brand-main)] pl-6">
          <RiMicroscopeLine size={16} className="text-[var(--brand-main)]" />
          <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">
            About_Node_03 // Discipline_Index
          </h3>
        </div>
        
        <p className="text-[9px] font-mono opacity-40 uppercase">Note: Disciplines are managed via the Discipline_Grid protocol. Currently viewing {config.aboutPage?.disciplines?.length || 0} nodes.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.aboutPage?.disciplines?.map((item, idx) => (
            <div key={idx} className="p-6 border border-[var(--brand-border)] bg-black/20 space-y-4 group hover:border-[var(--brand-main)] transition-colors">
              <div className="flex justify-between items-center opacity-30 group-hover:opacity-100">
                <span className="text-[10px] font-mono">[{item.id}]</span>
                <RiFileList3Line size={12} />
              </div>
              <h4 className="text-[11px] font-black uppercase tracking-widest">{item.title}</h4>
              <p className="text-[10px] opacity-50 leading-relaxed truncate">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutManifestEditor;