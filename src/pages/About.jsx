import React from "react";
import PageTransition from "../components/PageTransition";
import { 
  RiArrowRightUpLine, 
  RiFocus2Line, 
  RiHistoryLine, 
  RiMicroscopeLine, 
  RiCornerDownRightLine,
  RiTerminalBoxLine,
  RiNodeTree
} from "@remixicon/react";

const About = () => {
  return (
    <PageTransition>
      {/* Container now uses your specific midnight navy: --brand-alt */}
      <div className="min-h-screen bg-[var(--brand-alt)] text-[var(--brand-main)] font-sans antialiased selection:bg-[var(--brand-accent)] selection:text-[var(--brand-alt)] overflow-x-hidden">
        
        {/* --- ATMOSPHERIC LAYERS --- */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Using your soft bg variable for the radial glows */}
          <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[var(--brand-soft-bg)] blur-[140px] rounded-full animate-pulse opacity-20" />
          <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[var(--brand-border)] blur-[100px] rounded-full opacity-30" />
          {/* Subtle Scanline Effect - Colorized to match the navy theme */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(2,11,25,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(212,175,55,0.01),rgba(26,46,71,0.02),rgba(212,175,55,0.01))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-40" />
        </div>

        {/* --- 1. HEADER: ORIGIN_LOG --- */}
        <section className="relative pt-48 pb-32 px-6 md:px-12 max-w-7xl mx-auto border-x border-[var(--brand-border)]">
          <div className="flex items-center gap-6 mb-16">
            <div className="flex items-center gap-2 px-3 py-1 border border-[var(--brand-border)] bg-[var(--brand-soft-bg)]">
              <RiHistoryLine size={12} className="text-[var(--brand-accent)]" />
              <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">Archive_Node_001</span>
            </div>
            <div className="h-[1px] flex-grow bg-gradient-to-r from-[var(--brand-border)] to-transparent" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-9">
              <h1 className="text-6xl md:text-9xl font-serif italic mb-12 leading-[0.85] uppercase tracking-tighter">
                Defining <br/> 
                <span className="relative inline-block hover:pl-10 transition-all duration-1000 ease-out group">
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-[1px] bg-[var(--brand-accent)] group-hover:w-8 transition-all duration-700" />
                  Quiet_Confidence.
                </span>
              </h1>
            </div>
            <div className="lg:col-span-3 space-y-8 lg:pt-8">
               <RiCornerDownRightLine size={32} className="text-[var(--brand-border)]" />
               <p className="text-[10px] font-mono text-[var(--brand-muted)] uppercase leading-relaxed tracking-[0.3em] pl-4 border-l border-[var(--brand-border)]">
                Bold_Comfort operates at the intersection of tactile luxury and digital precision. 
                We exist for the curator, not the consumer.
               </p>
            </div>
          </div>
        </section>

        {/* --- 2. MANIFESTO: TECHNICAL_DATA --- */}
        <section className="relative py-40 border-y border-[var(--brand-border)] bg-[var(--brand-soft-bg)]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group cursor-crosshair">
              <div className="absolute -top-6 -left-2 text-[8px] font-mono text-[var(--brand-muted)] uppercase tracking-[0.5em]">Frame_Ref: 882-P</div>
              
              <div className="overflow-hidden border border-[var(--brand-border)] bg-[var(--brand-alt)] shadow-2xl">
                <img
                  src="https://imgs.search.brave.com/deey3HdUAOm8jnKZ1gzlL99kloTejhqgiwIqF9aQri8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmxhbmllcmkuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzAzL2ZvcmJpY2kt/ZS1tZXRyby1zYXJ0/b3JpYWxlLTExNzB4/NTUwLmpwZw"
                  alt="Workshop Detail"
                  className="w-full h-[600px] object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[2s] ease-out"
                />
              </div>
              
              {/* Floating Data Point with Accent Details */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="p-6 bg-[var(--brand-alt)]/90 backdrop-blur-2xl border border-[var(--brand-accent)]/30 max-w-[240px] shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                  <RiTerminalBoxLine size={18} className="mb-4 text-[var(--brand-accent)]" />
                  <p className="text-[9px] font-mono uppercase tracking-widest leading-relaxed text-[var(--brand-main)]">
                    [System_Note]: Fiber density verified via mechanical tensioning. 100% Provenance.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <div className="space-y-8">
                <div className="flex items-center gap-4 text-[var(--brand-muted)]/30">
                    <RiNodeTree size={16} />
                    <span className="text-[10px] font-mono uppercase tracking-[0.5em]">Philosophy_Thread</span>
                </div>
                <h3 className="text-5xl font-serif italic tracking-tight">The "Slow" Manifesto</h3>
                <p className="text-sm font-light leading-loose text-[var(--brand-muted)] max-w-md">
                  In an era of disposable trends, we choose the difficult path. Our garments are released as <span className="text-[var(--brand-main)] italic underline underline-offset-8 decoration-[var(--brand-accent)]/40">Archives</span>, curated to withstand the erosion of time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-16 border-t border-[var(--brand-border)]">
                <div className="space-y-4 group">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[var(--brand-muted)] group-hover:text-[var(--brand-accent)] transition-colors flex items-center gap-3">
                    <RiFocus2Line size={12} /> Provenance
                  </h4>
                  <p className="text-[11px] font-light leading-relaxed text-[var(--brand-muted)]/60 group-hover:text-[var(--brand-main)] transition-colors">
                    Traceable materials from ethical, family-owned farms. Verified at the source.
                  </p>
                </div>
                <div className="space-y-4 group">
                  <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-[var(--brand-muted)] group-hover:text-[var(--brand-accent)] transition-colors flex items-center gap-3">
                    <RiMicroscopeLine size={12} /> Longevity
                  </h4>
                  <p className="text-[11px] font-light leading-relaxed text-[var(--brand-muted)]/60 group-hover:text-[var(--brand-main)] transition-colors">
                    Sartorial techniques meant to outlast the current digital epoch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. PILLARS: DISCIPLINE_GRID --- */}
        <section className="py-40 px-6 md:px-12 max-w-7xl mx-auto border-x border-[var(--brand-border)]">
          <div className="flex justify-between items-center mb-24">
            <h2 className="text-3xl font-serif italic">Core_Disciplines</h2>
            <span className="text-[9px] font-mono text-[var(--brand-muted)]/40 uppercase tracking-[0.6em]">Catalog_Index_01</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-[var(--brand-border)] border border-[var(--brand-border)]">
            {[
              { id: '01', title: 'Textiles', desc: 'Raw silk, Giza cotton, and Loro Piana cashmere.', img: 'https://imgs.search.brave.com/hiOV4FROFXliXVhsE8F1w7MX314g374GFEPcGUKdrd0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taW5p/bWFsdmludGFnZS5j/b20vY2RuL3Nob3Av/ZmlsZXMvMTNkMjVm/NjUtMWRjZC00ZGQx/LTg3MzAtYjA1Y2Nm/MjhiOTEyLmpwZz92/PTE3MjY2OTQyMTMm/d2lkdGg9NjAw' },
              { id: '02', title: 'Horology', desc: 'Mechanical movements with zero electronic interference.', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop' },
              { id: '03', title: 'Studio', desc: 'London-based. Minimal footprint. Operating globally.', img: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2071&auto=format&fit=crop' }
            ].map((pillar) => (
              <div key={pillar.id} className="bg-[var(--brand-alt)] p-10 group transition-all duration-700 hover:bg-[var(--brand-soft-bg)]">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-mono text-[var(--brand-muted)]/40 group-hover:text-[var(--brand-accent)] transition-colors">[{pillar.id}]</span>
                    <div className="w-8 h-[1px] bg-[var(--brand-border)] group-hover:w-12 group-hover:bg-[var(--brand-accent)] transition-all duration-700" />
                </div>
                <div className="aspect-[4/5] overflow-hidden grayscale opacity-30 group-hover:opacity-100 transition-all duration-[1.5s] mb-10 border border-[var(--brand-border)]">
                  <img src={pillar.img} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-[2s]" alt={pillar.title} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-[0.5em] font-black group-hover:tracking-[0.6em] transition-all duration-700">{pillar.title}</h4>
                  <p className="text-[10px] font-mono text-[var(--brand-muted)]/60 leading-loose uppercase tracking-widest">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. CTA: FINAL_REGISTRATION --- */}
        <section className="py-48 px-6 text-center border-t border-[var(--brand-border)] relative group cursor-pointer overflow-hidden">
          {/* Background Reveal now uses the clean brand-main (off-white) */}
          <div className="absolute inset-0 bg-[var(--brand-main)] translate-y-full group-hover:translate-y-0 transition-transform duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]" />
          
          <div className="relative z-10 space-y-16 mix-blend-difference">
            <h3 className="text-6xl md:text-8xl font-serif italic uppercase tracking-tighter text-[var(--brand-main)]">Join_The_Archive</h3>
            
            <div className="space-y-4">
               <div className="flex justify-center items-center gap-4">
                  <div className="w-1.5 h-1.5 bg-[var(--brand-accent)] rounded-full animate-ping" />
                  <p className="text-[10px] font-mono tracking-[0.8em] uppercase font-black text-[var(--brand-main)]">Open_Protocol</p>
               </div>
               <p className="text-[9px] font-mono opacity-60 uppercase tracking-widest leading-loose max-w-sm mx-auto text-[var(--brand-main)]">
                 Secure Access to private releases and prototype manifests.
               </p>
            </div>

            <button className="inline-flex items-center gap-8 border-b border-[var(--brand-accent)] pb-4 text-[12px] uppercase tracking-[0.8em] font-black hover:gap-16 transition-all duration-700 text-[var(--brand-main)]">
              Register Interest <RiArrowRightUpLine size={24} />
            </button>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default About;