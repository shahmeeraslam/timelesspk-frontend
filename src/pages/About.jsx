import React, { useState } from "react";
import PageTransition from "../components/PageTransition";
import { useStore } from "../context/StoreContext";
import { 
  RiArrowRightUpLine, 
  RiHistoryLine, 
  RiFocus3Line,
  RiPulseLine,
  RiCompass3Line,
  RiHexagonLine
} from "@remixicon/react";

const About = () => {
  const { cmsData, loading } = useStore();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (loading || !cmsData) {
    return (
      <div className="min-h-screen bg-[var(--brand-alt)] flex flex-col items-center justify-center font-mono text-[9px] tracking-[0.8em] text-[var(--brand-accent)] uppercase">
        <RiPulseLine size={20} className="mb-4 animate-pulse" />
        <span>Syncing_Archive_Data...</span>
        <div className="w-32 h-[1px] bg-[var(--brand-border)] mt-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-[var(--brand-accent)] animate-loading-bar" />
        </div>
      </div>
    );
  }

  const { aboutPage } = cmsData;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--brand-alt)] text-[var(--brand-main)] font-sans antialiased selection:bg-[var(--brand-accent)] selection:text-[var(--brand-alt)] overflow-x-hidden">
        
        {/* --- DYNAMIC BACKGROUND SYSTEM --- */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-1/2 h-screen bg-[radial-gradient(circle_at_70%_20%,rgba(212,175,55,0.05)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.01)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
        </div>

        {/* --- 01. THE ARCHITECTURAL HERO --- */}
        <section className="relative min-h-[85vh] md:h-screen flex flex-col justify-center px-6 md:px-12 border-b border-[var(--brand-border)] py-20 md:py-0">
          <div className="absolute top-8 md:top-12 left-6 md:left-12 flex items-center gap-3">
             <RiHexagonLine size={14} className="text-[var(--brand-accent)] animate-spin-slow" />
             <span className="text-[7px] md:text-[10px] font-mono uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">System_Node // About_v02</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
            <div className="lg:col-span-10">
              <h1 className="text-[14vw] md:text-[12vw] lg:text-[10vw] font-serif italic leading-[0.9] md:leading-[0.85] uppercase tracking-tighter mix-blend-difference">
                {aboutPage?.hero?.titleTop || "Pure"} <br/>
                <span className="text-[var(--brand-accent)] not-italic font-sans font-black tracking-[-0.03em] flex items-center gap-3 md:gap-8">
                  {aboutPage?.hero?.titleBottom || "Aesthetic"}
                  <div className="hidden md:block h-[1px] md:h-[2px] flex-grow bg-[var(--brand-accent)] origin-left animate-grow-x" />
                </span>
              </h1>
            </div>
            
            <div className="lg:col-span-2 flex lg:flex-col gap-6 md:gap-12 justify-between lg:justify-end lg:text-right mt-10 md:mt-0">
              <div className="space-y-1">
                <span className="text-[6px] md:text-[8px] font-mono opacity-30 block uppercase">Established</span>
                <span className="text-[9px] md:text-xs font-mono tracking-wider">PK_2026</span>
              </div>
              <div className="space-y-1">
                <span className="text-[6px] md:text-[8px] font-mono opacity-30 block uppercase">Coordinates</span>
                <span className="text-[9px] md:text-xs font-mono tracking-wider">33.6844° N</span>
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-24 max-w-lg border-l border-[var(--brand-accent)] pl-5 md:pl-8">
             <p className="text-[10px] md:text-sm font-mono uppercase tracking-widest leading-relaxed opacity-70 md:opacity-60 italic">
               {aboutPage?.hero?.sideNote || "Operating at the intersection of tactile luxury and digital precision."}
             </p>
          </div>
        </section>

        {/* --- 02. MANIFESTO: THE BORDERLESS GRID --- */}
        <section className="relative border-b border-[var(--brand-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[3/4] md:aspect-square lg:aspect-auto h-full border-b lg:border-b-0 lg:border-r border-[var(--brand-border)] group overflow-hidden bg-[var(--brand-soft-bg)]">
              <img 
                src={aboutPage?.manifesto?.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"} 
                className="w-full h-full object-cover grayscale opacity-60 lg:opacity-50 md:group-hover:opacity-100 md:group-hover:scale-105 transition-all duration-1000"
                alt="Archive Concept"
              />
              <div className="absolute inset-0 bg-black/20 md:group-hover:bg-transparent transition-colors" />
              <div className="absolute top-5 left-5 md:top-8 md:left-8">
                <div className="bg-[var(--brand-alt)] border border-[var(--brand-border)] p-3 md:p-4 backdrop-blur-xl">
                  <RiCompass3Line size={16} className="text-[var(--brand-accent)] mb-2" />
                  <span className="text-[6px] md:text-[8px] font-mono uppercase tracking-widest block opacity-50">Archive_Ref</span>
                  <span className="text-[8px] md:text-[10px] font-mono uppercase">
                    {aboutPage?.manifesto?.systemNote || "PROVENANCE_LOG_00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center space-y-10 md:space-y-16">
              <div className="space-y-5">
                <span className="text-[8px] md:text-[10px] font-mono text-[var(--brand-accent)] uppercase tracking-[0.4em] block underline underline-offset-4 decoration-1">The_Philosophy</span>
                <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif italic leading-tight">
                  {aboutPage?.manifesto?.title || "Quiet Confidence."}
                </h2>
                <p className="text-sm md:text-lg font-light leading-relaxed opacity-80 md:opacity-70 max-w-sm md:max-w-md whitespace-pre-line">
                  {aboutPage?.manifesto?.text || "In a world of constant noise, we choose the weight of silence."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 border-t border-[var(--brand-border)] pt-8 md:pt-12">
                 <div className="space-y-3">
                    <RiFocus3Line size={16} className="text-[var(--brand-accent)]" />
                    <h4 className="text-[9px] md:text-xs font-black uppercase tracking-widest">Structural Integrity</h4>
                    <p className="text-[8px] md:text-[10px] font-mono opacity-50 leading-relaxed uppercase">
                      Fiber density verified via mechanical tensioning.
                    </p>
                 </div>
                 <div className="space-y-3">
                    <RiHistoryLine size={16} className="text-[var(--brand-accent)]" />
                    <h4 className="text-[9px] md:text-xs font-black uppercase tracking-widest">Epochal Design</h4>
                    <p className="text-[8px] md:text-[10px] font-mono opacity-50 leading-relaxed uppercase">
                      Curated to withstand the erosion of digital cycles.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 03. THE HORIZONTAL CATALOG --- */}
        <section className="py-16 md:py-32 px-6 md:px-12 bg-[var(--brand-soft-bg)] overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12 md:mb-24">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none opacity-5 select-none">
              Disciplines
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[7px] md:text-[9px] font-mono uppercase tracking-[0.4em] opacity-40">Core_Methodology</span>
              <div className="w-6 md:w-12 h-[1px] bg-[var(--brand-accent)]" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[var(--brand-border)] border border-[var(--brand-border)]">
            {aboutPage?.disciplines?.length > 0 ? (
              aboutPage.disciplines.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[var(--brand-alt)] p-8 md:p-12 group transition-all duration-700 relative overflow-hidden h-[350px] md:h-[500px] flex flex-col justify-end"
                >
                  <div className="absolute top-8 left-8 md:top-12 md:left-12 opacity-15 md:opacity-10 md:group-hover:opacity-100 transition-opacity z-20">
                    <span className="text-3xl md:text-6xl font-serif italic text-[var(--brand-accent)]">0{idx + 1}</span>
                  </div>
                  
                  {item.image && (
                    <img 
                      src={item.image} 
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-25 md:opacity-0 md:group-hover:opacity-20 md:group-hover:scale-110 transition-all duration-1000" 
                      alt={item.title}
                    />
                  )}

                  <div className="relative z-10 space-y-3 md:space-y-6">
                    <h4 className="text-lg md:text-2xl font-black uppercase tracking-tight md:group-hover:text-[var(--brand-accent)] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[9px] md:text-xs font-mono uppercase tracking-widest leading-relaxed opacity-60 md:opacity-40 md:group-hover:opacity-100 transition-all">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center opacity-20 font-mono text-[8px] uppercase tracking-widest">
                No_Disciplines_Found
              </div>
            )}
          </div>
        </section>

        {/* --- 04. THE MINIMALIST CTA --- */}
        <section className="py-32 md:py-64 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden group">
           <div className="relative z-10 space-y-8 md:space-y-12">
              <h2 className="text-4xl md:text-8xl font-serif italic uppercase tracking-tighter mix-blend-difference">
                Join_The_Archive
              </h2>
              <button className="inline-flex items-center gap-5 md:gap-12 border border-[var(--brand-accent)] text-[var(--brand-accent)] px-8 md:px-16 py-3 md:py-6 text-[8px] md:text-[10px] font-mono font-black uppercase tracking-[0.4em] md:tracking-[1em] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-alt)] transition-all duration-700">
                Establish_Connection <RiArrowRightUpLine size={16} />
              </button>
           </div>
           
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] md:group-hover:opacity-[0.05] transition-opacity duration-1000">
              <span className="text-[60vw] md:text-[40vw] font-black whitespace-nowrap leading-none select-none uppercase">
                {cmsData?.footer?.brandTitleTop || "TIMELESS"}
              </span>
           </div>
        </section>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes grow-x {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
        .animate-grow-x {
          animation: grow-x 1.5s cubic-bezier(0.85, 0, 0.15, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </PageTransition>
  );
};

export default About;