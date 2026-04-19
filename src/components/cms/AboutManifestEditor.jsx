import React from "react";
import { 
  RiHistoryLine, 
  RiMicroscopeLine, 
  RiImageAddLine, 
  RiNodeTree,
  RiFileList3Line,
  RiCompass3Line,
  RiFocus3Line,
  RiLayoutGridLine,
  RiAddLine,
  RiDeleteBinLine // Added for DB cleanup
} from "@remixicon/react";

const AboutManifestEditor = ({ config, setConfig }) => {
  
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

  const updateDiscipline = (index, field, value) => {
    const currentDisciplines = config.aboutPage?.disciplines || [];
    const updatedDisciplines = [...currentDisciplines];
    updatedDisciplines[index] = { ...updatedDisciplines[index], [field]: value };
    
    setConfig({
      ...config,
      aboutPage: {
        ...config.aboutPage,
        disciplines: updatedDisciplines
      }
    });
  };

  const addDiscipline = () => {
    const currentDisciplines = config.aboutPage?.disciplines || [];
    const newNode = { title: "NEW_DISCIPLINE", description: "", image: "" };
    
    setConfig({
      ...config,
      aboutPage: {
        ...config.aboutPage,
        disciplines: [...currentDisciplines, newNode]
      }
    });
  };

  const deleteDiscipline = (index) => {
    const updatedDisciplines = config.aboutPage?.disciplines.filter((_, i) => i !== index);
    setConfig({
      ...config,
      aboutPage: {
        ...config.aboutPage,
        disciplines: updatedDisciplines
      }
    });
  };

  return (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* SECTION 01: HERO */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-[var(--brand-border)] flex items-center justify-center text-[var(--brand-main)]">
            <RiHistoryLine size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em]">Hero_Configuration</h3>
            <p className="text-[9px] font-mono opacity-40 uppercase mt-1">Update_DB_Fields // Hero</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pl-14">
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[9px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-2">
                <RiCompass3Line size={12} /> Headline_Top
              </label>
              <input 
                className="w-full bg-black/40 border-l-2 border-[var(--brand-border)] px-4 py-3 outline-none font-serif italic text-2xl focus:border-[var(--brand-main)]" 
                value={config.aboutPage?.hero?.titleTop || ""} 
                onChange={(e) => updateAbout('hero', 'titleTop', e.target.value)} 
              />
            </div>
            <div className="space-y-4">
              <label className="text-[9px] font-mono opacity-50 uppercase tracking-widest flex items-center gap-2">
                <RiFocus3Line size={12} /> Headline_Bottom
              </label>
              <input 
                className="w-full bg-black/40 border-l-2 border-[var(--brand-border)] px-4 py-3 outline-none font-sans font-black text-2xl focus:border-[var(--brand-main)] uppercase" 
                value={config.aboutPage?.hero?.titleBottom || ""} 
                onChange={(e) => updateAbout('hero', 'titleBottom', e.target.value)} 
              />
            </div>
          </div>
          <div className="lg:col-span-4">
            <label className="text-[9px] font-mono opacity-50 uppercase tracking-widest block mb-4">Side_Navigation_Note</label>
            <textarea 
              rows={4}
              className="w-full bg-black/20 border border-[var(--brand-border)] p-4 outline-none text-[10px] font-mono tracking-widest leading-loose uppercase" 
              value={config.aboutPage?.hero?.sideNote || ""} 
              onChange={(e) => updateAbout('hero', 'sideNote', e.target.value)} 
            />
          </div>
        </div>
      </section>

      {/* SECTION 02: MANIFESTO */}
      <section className="space-y-10 pt-10 border-t border-[var(--brand-border)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-[var(--brand-border)] flex items-center justify-center text-[var(--brand-main)]">
            <RiNodeTree size={18} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em]">Philosophy_Manifesto</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pl-14">
          <div className="lg:col-span-7 space-y-8">
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] py-4 outline-none font-serif italic text-4xl" 
              placeholder="Manifesto Title"
              value={config.aboutPage?.manifesto?.title || ""} 
              onChange={(e) => updateAbout('manifesto', 'title', e.target.value)} 
            />
            {/* Matches 'text' in Schema */}
            <textarea 
              rows={8}
              className="w-full bg-black/10 border border-[var(--brand-border)] p-8 outline-none text-sm font-light leading-relaxed" 
              placeholder="Manifesto Text Content..."
              value={config.aboutPage?.manifesto?.text || ""} 
              onChange={(e) => updateAbout('manifesto', 'text', e.target.value)} 
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="aspect-[4/5] bg-black border border-[var(--brand-border)] relative group overflow-hidden">
               {config.aboutPage?.manifesto?.image && <img src={config.aboutPage?.manifesto?.image} className="w-full h-full object-cover opacity-50" />}
               <input 
                  type="text"
                  placeholder="MANIFESTO_IMAGE_URL"
                  className="absolute bottom-4 left-4 right-4 bg-black border border-[var(--brand-main)] p-3 text-[9px] font-mono outline-none opacity-0 group-hover:opacity-100 transition-all"
                  value={config.aboutPage?.manifesto?.image || ""}
                  onChange={(e) => updateAbout('manifesto', 'image', e.target.value)}
               />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: DISCIPLINES GRID */}
      <section className="space-y-10 pt-10 border-t border-[var(--brand-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 pl-14">
            <RiLayoutGridLine size={18} />
            <h3 className="text-xs font-black uppercase tracking-[0.3em]">Discipline_Index</h3>
          </div>
          <button 
            onClick={addDiscipline}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--brand-main)] text-[10px] font-mono text-[var(--brand-main)] hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)]"
          >
            <RiAddLine size={14} /> ADD_ENTRY
          </button>
        </div>
        
        <div className="pl-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.aboutPage?.disciplines?.map((item, idx) => (
            <div key={idx} className="p-8 border border-[var(--brand-border)] bg-black/20 space-y-6 group relative">
              <button 
                onClick={() => deleteDiscipline(idx)}
                className="absolute top-4 right-4 text-red-500/30 hover:text-red-500 transition-colors"
              >
                <RiDeleteBinLine size={16} />
              </button>
              
              <div className="space-y-4 pt-4">
                <input 
                  className="w-full bg-transparent border-b border-[var(--brand-border)] pb-2 outline-none text-xs font-black uppercase"
                  placeholder="Title"
                  value={item.title || ""}
                  onChange={(e) => updateDiscipline(idx, 'title', e.target.value)}
                />
                <textarea 
                  rows={3}
                  className="w-full bg-transparent outline-none text-[10px] font-mono opacity-60 uppercase"
                  placeholder="Description"
                  value={item.description || ""}
                  onChange={(e) => updateDiscipline(idx, 'description', e.target.value)}
                />
                <input 
                  className="w-full bg-transparent border-b border-[var(--brand-border)] pb-2 outline-none text-[8px] font-mono"
                  placeholder="Image URL"
                  value={item.image || ""}
                  onChange={(e) => updateDiscipline(idx, 'image', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default AboutManifestEditor;