import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { RiArrowUpLine, RiGithubLine, RiInstagramLine, RiTwitterXLine, RiShieldFlashLine } from "@remixicon/react";

const Footer = () => {
  const { cmsData } = useStore();
  const year = new Date().getFullYear();
  
  // CMS Fallbacks
  const footerData = cmsData?.footer || {};
  const brandTop = footerData.brandTitleTop || "Fragmented";
  const brandBottom = footerData.brandTitleBottom || "Minimalism";
  const mission = footerData.missionStatement || `Digital assets synchronized for the ${year} Global Archive.`;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative py-24 md:py-40 px-6 md:px-20 bg-[var(--brand-alt)] border-t border-[var(--brand-border)] overflow-hidden">
      {/* Background Decor (Grid & Scanline) stays same */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(var(--brand-main) 1px, transparent 1px), linear-gradient(90deg, var(--brand-main) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--brand-main)]/5 to-transparent h-[2px] w-full animate-scanline pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-20 md:gap-32">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-32">
          
          {/* Brand Identity consuming CMS */}
          <div className="space-y-10 w-full lg:w-1/3">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif italic uppercase tracking-tighter leading-none text-white">
                {brandTop} <br/> <span className="opacity-30">{brandBottom}</span>
              </h2>
              <p className="text-[9px] font-mono max-w-[320px] leading-relaxed uppercase tracking-[0.2em] opacity-40">
                {mission}
              </p>
            </div>

            {/* Live metrics (Fixed) */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-white/5 bg-white/[0.01] backdrop-blur-sm">
                <div className="space-y-1">
                    <p className="text-[6px] font-mono opacity-30 uppercase">Latency</p>
                    <p className="text-[10px] font-mono text-[var(--brand-main)] uppercase">24ms_stable</p>
                </div>
                <div className="space-y-1">
                    <p className="text-[6px] font-mono opacity-30 uppercase">Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-mono text-green-500/80 uppercase">Node_Active</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-20">
            {/* Protocols */}
            <div className="space-y-8">
              <p className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-[var(--brand-main)] flex items-center gap-2">
                <span className="w-1 h-4 bg-[var(--brand-main)]" /> Protocols
              </p>
              <div className="flex flex-col gap-4">
                {['Collection', 'About', 'Contact', 'Orders'].map((item) => (
                  <Link key={item} to={`/${item.toLowerCase()}`} className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-[var(--brand-main)] transition-all">
                    {item}.sys
                  </Link>
                ))}
              </div>
            </div>

            {/* Social Matrix using CMS URLs */}
            <div className="space-y-8">
              <p className="text-[10px] font-mono font-bold tracking-[0.5em] uppercase text-[var(--brand-main)] flex items-center gap-2">
                 <span className="w-1 h-4 bg-[var(--brand-main)]" /> Network
              </p>
              <div className="flex flex-col gap-5">
                {[
                  { name: 'Instagram', icon: <RiInstagramLine size={14} />, url: footerData.socials?.instagram },
                  { name: 'Terminal_X', icon: <RiTwitterXLine size={14} />, url: footerData.socials?.twitter },
                  { name: 'Source_Code', icon: <RiGithubLine size={14} />, url: footerData.socials?.github }
                ].map((social) => (
                  <a key={social.name} href={social.url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-white transition-all">
                    {social.icon} {social.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Scroll to top */}
            <div className="hidden md:flex flex-col items-center justify-center border-l border-white/5 pl-10">
                <button onClick={scrollToTop} className="flex flex-col items-center gap-4 group">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--brand-main)] to-transparent opacity-30 group-hover:h-20 transition-all duration-700" />
                    <span className="text-[8px] font-mono uppercase tracking-[0.4em] opacity-30">Top_Level</span>
                </button>
            </div>
          </div>
        </div>

        {/* Legal Row */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-[8px] font-mono tracking-[0.3em] opacity-20 uppercase">
             &copy; {year} VANGUARD_LABS_INDUSTRIES // ALL_ASSETS_RESERVED
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono tracking-[0.4em] opacity-40 uppercase">
             <RiShieldFlashLine size={12} className="text-[var(--brand-main)]" />
             ESTABLISHED_2026_PROTOCOL
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;