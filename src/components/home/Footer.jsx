import React from "react";
import { Link } from "react-router-dom";
import { RiArrowUpLine, RiGithubLine, RiInstagramLine, RiTwitterXLine, RiShieldFlashLine } from "@remixicon/react";

const Footer = () => {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-24 md:py-40 px-6 md:px-20 bg-[var(--brand-alt)] border-t border-[var(--brand-border)] overflow-hidden">
      
      {/* --- BACKGROUND DECOR: High-precision Grid & Scanline --- */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(var(--brand-main) 1px, transparent 1px), linear-gradient(90deg, var(--brand-main) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--brand-main)]/5 to-transparent h-[2px] w-full animate-scanline pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-20 md:gap-32">
        
        {/* TOP ROW: Primary Data & Fillers */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-32">
          
          {/* Brand Identity & System Metrics (The Filler) */}
          <div className="space-y-10 w-full lg:w-1/3">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif italic uppercase tracking-tighter leading-none text-white">
                Fragmented <br/> <span className="opacity-30">Minimalism</span>
              </h2>
              <p className="text-[9px] font-mono max-w-[320px] leading-relaxed uppercase tracking-[0.2em] opacity-40">
                The information contained in this archive is proprietary. 
                Digital assets synchronized for the {year} Global Archive.
              </p>
            </div>

            {/* --- NEW FILLER: LIVE SYSTEM METRICS --- */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-white/5 bg-white/[0.01] backdrop-blur-sm">
                <div className="space-y-1">
                    <p className="text-[6px] font-mono opacity-30 uppercase">Latency</p>
                    <p className="text-[10px] font-mono text-[var(--brand-main)]">24MS</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[6px] font-mono opacity-30 uppercase">Encryption</p>
                    <p className="text-[10px] font-mono text-[var(--brand-main)]">AES_256</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[6px] font-mono opacity-30 uppercase">Node_Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-mono text-green-500/80 uppercase">Active</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[6px] font-mono opacity-30 uppercase">Protocol</p>
                    <p className="text-[10px] font-mono opacity-60 uppercase">V_0.82</p>
                </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
            
            {/* System Map */}
            <div className="space-y-8">
              <p className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-[var(--brand-main)] flex items-center gap-2">
                <span className="w-1 h-4 bg-[var(--brand-main)]" /> Protocols
              </p>
              <div className="flex flex-col gap-4">
                {['Collection', 'About', 'Contact', 'Orders'].map((item) => (
                  <Link 
                    key={item} 
                    to={`/${item.toLowerCase()}`} 
                    className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-[var(--brand-main)] hover:translate-x-1 transition-all"
                  >
                    {item}.sys
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Matrix */}
            <div className="space-y-8">
              <p className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-[var(--brand-main)] flex items-center gap-2">
                 <span className="w-1 h-4 bg-[var(--brand-main)]" /> Network
              </p>
              <div className="flex flex-col gap-5">
                {[
                  { name: 'Instagram', icon: <RiInstagramLine size={14} /> },
                  { name: 'Terminal_X', icon: <RiTwitterXLine size={14} /> },
                  { name: 'Source_Code', icon: <RiGithubLine size={14} /> }
                ].map((social) => (
                  <a key={social.name} href="#" className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-white transition-all group">
                    <span className="group-hover:rotate-12 transition-transform">{social.icon}</span>
                    {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Back to Top Component */}
            <div className="hidden md:flex flex-col items-center justify-center gap-6 border-l border-white/5 pl-10">
                <button 
                onClick={scrollToTop}
                className="flex flex-col items-center gap-4 group"
                >
                <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--brand-main)] to-transparent opacity-30 group-hover:h-20 group-hover:opacity-100 transition-all duration-700" />
                <div className="p-4 border border-white/10 rounded-full group-hover:border-[var(--brand-main)] group-hover:bg-[var(--brand-main)] group-hover:text-black transition-all duration-500">
                    <RiArrowUpLine size={20} className="group-hover:-translate-y-1 transition-transform" />
                </div>
                <span className="text-[8px] font-mono uppercase tracking-[0.4em] opacity-30 group-hover:opacity-100 transition-opacity">Top_Level</span>
                </button>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Metadata Footer */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[8px] font-mono uppercase tracking-[0.3em] opacity-30">
             <a href="#" className="hover:text-[var(--brand-main)] transition-colors">Privacy_Policy</a>
             <a href="#" className="hover:text-[var(--brand-main)] transition-colors">Terms_of_Service</a>
             <a href="#" className="hover:text-[var(--brand-main)] transition-colors">Global_Shipment</a>
          </div>
          
          <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.4em] opacity-20 uppercase">
             <RiShieldFlashLine size={12} />
             &copy; {year} VANGUARD_LABS_INDUSTRIES
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;