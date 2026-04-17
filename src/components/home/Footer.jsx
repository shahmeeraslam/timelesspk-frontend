import React from "react";
import { Link } from "react-router-dom";
import { RiArrowUpLine, RiGithubLine, RiInstagramLine, RiTwitterXLine } from "@remixicon/react";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-32 px-6 md:px-20 bg-[var(--brand-alt)] border-t border-[var(--brand-border)] overflow-hidden">
      
      {/* --- BACKGROUND GRID DECOR --- */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(var(--brand-main) 1px, transparent 1px), linear-gradient(90deg, var(--brand-main) 1px, transparent 1px)`, backgroundSize: '100px 100px' }} />

      <div className="relative z-10 flex flex-col gap-24">
        
        {/* TOP ROW: Primary Data */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <h2 className="text-4xl font-serif italic uppercase tracking-tighter leading-none">
              Fragmented <br/> <span className="opacity-40">Minimalism</span>
            </h2>
            <div className="space-y-2">
               <p className="text-[8px] font-mono max-w-[280px] leading-relaxed uppercase tracking-[0.2em] opacity-40">
                 The information contained in this archive is proprietary. 
                 Digital assets synchronized for the {year} Global Archive.
               </p>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-[var(--brand-main)] animate-pulse rounded-full" />
                  <span className="text-[7px] font-mono uppercase tracking-[0.4em] opacity-60">Node_01_Live</span>
               </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24">
            
            {/* System Map */}
            <div className="space-y-6">
              <p className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-[var(--brand-main)]">Protocols</p>
              <div className="flex flex-col gap-3">
                {['Collection', 'About', 'Contact', 'Orders'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/${item.toLowerCase()}`} 
                    className="text-[9px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:translate-x-1 transition-all"
                  >
                    {item}.sys
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Matrix */}
            <div className="space-y-6">
              <p className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-[var(--brand-main)]">Network</p>
              <div className="flex flex-col gap-4">
                <a href="#" className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                  <RiInstagramLine size={12} /> Instagram
                </a>
                <a href="#" className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                  <RiTwitterXLine size={12} /> Terminal_X
                </a>
                <a href="#" className="flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                  <RiGithubLine size={12} /> Source_Code
                </a>
              </div>
            </div>

            {/* Back to Top Component */}
            <button 
              onClick={scrollToTop}
              className="hidden md:flex flex-col items-center gap-4 group"
            >
              <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--brand-main)] to-transparent opacity-20 group-hover:h-16 transition-all duration-700" />
              <div className="p-3 border border-[var(--brand-border)] rounded-full group-hover:border-[var(--brand-main)] transition-colors">
                <RiArrowUpLine size={16} className="group-hover:-translate-y-1 transition-transform" />
              </div>
              <span className="text-[7px] font-mono uppercase tracking-[0.5em] opacity-40">Return_to_Zenith</span>
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Metadata Footer */}
        <div className="pt-12 border-t border-[var(--brand-border)]/30 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-8 text-[7px] font-mono uppercase tracking-[0.4em] opacity-30">
             <a href="#" className="hover:text-[var(--brand-main)] transition-colors">Privacy_Policy</a>
             <a href="#" className="hover:text-[var(--brand-main)] transition-colors">Terms_of_Service</a>
             <a href="#" className="hover:text-[var(--brand-main)] transition-colors">Cookie_Settings</a>
          </div>
          
          <div className="text-[8px] font-mono tracking-[0.5em] opacity-20 uppercase">
             &copy; {year} VANGUARD_LABS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;