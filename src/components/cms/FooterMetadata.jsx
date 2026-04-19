import React from "react";
import { 
  RiInstagramLine, 
  RiTwitterXLine, 
  RiGithubLine,
  RiInformationLine 
} from "@remixicon/react";

const FooterMetadata = ({ config, setConfig }) => {
  
  // Helper to update nested social fields
  const handleSocialChange = (platform, value) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        socials: {
          ...config.footer.socials,
          [platform]: value
        }
      }
    });
  };

  // Helper for top-level footer fields
  const handleFooterUpdate = (field, value) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [field]: value
      }
    });
  };

  const socialPlatforms = [
    { id: 'instagram', label: 'Instagram', icon: RiInstagramLine },
    { id: 'twitter', label: 'Twitter_X', icon: RiTwitterXLine },
    { id: 'github', label: 'GitHub', icon: RiGithubLine },
  ];

  return (
    <section className="p-8 border border-[var(--brand-border)] bg-[var(--brand-soft-bg)] space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 border-l-2 border-[var(--brand-main)] pl-6">
        <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] text-[var(--brand-muted)]">
          Section_05 // Footer_Metadata
        </h3>
      </div>

      {/* BRAND IDENTITY */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Brand_Display_Archive</label>
            <input 
              placeholder="BRAND_TITLE_TOP" 
              className="w-full bg-transparent border-b border-[var(--brand-border)] py-2 outline-none font-serif italic text-xl focus:border-[var(--brand-main)] transition-colors" 
              value={config.footer?.brandTitleTop || ""} 
              onChange={(e) => handleFooterUpdate('brandTitleTop', e.target.value)} 
            />
            <input 
              placeholder="BRAND_TITLE_BOTTOM" 
              className="w-full bg-transparent border-b border-[var(--brand-border)] py-2 outline-none font-sans font-black text-xl focus:border-[var(--brand-main)] transition-colors" 
              value={config.footer?.brandTitleBottom || ""} 
              onChange={(e) => handleFooterUpdate('brandTitleBottom', e.target.value)} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[8px] font-mono opacity-30 uppercase tracking-widest text-right">Mission_Statement_Protocol</label>
          <textarea 
            placeholder="SYSTEM_MISSION_STATEMENT" 
            rows={3} 
            className="w-full bg-black/20 border border-[var(--brand-border)] p-4 outline-none text-[10px] font-mono tracking-widest focus:border-[var(--brand-main)] transition-colors" 
            value={config.footer?.missionStatement || ""} 
            onChange={(e) => handleFooterUpdate('missionStatement', e.target.value)} 
          />
        </div>
      </div>

      {/* SOCIAL CONNECTIVITY NODE */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        <h4 className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
          <RiInformationLine size={12} /> Social_Connectivity_Nodes
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {socialPlatforms.map((platform) => (
            <div key={platform.id} className="group flex items-center gap-3 bg-black/20 border border-white/5 p-1 pr-3 focus-within:border-[var(--brand-main)] transition-colors">
              <div className="bg-white/5 p-2 text-white/40 group-focus-within:text-[var(--brand-main)] transition-colors">
                <platform.icon size={16} />
              </div>
              <input 
                placeholder={`${platform.label.toUpperCase()}_URL`}
                className="w-full bg-transparent py-2 text-[10px] font-mono outline-none text-white/80"
                value={config.footer?.socials?.[platform.id] || ""}
                onChange={(e) => handleSocialChange(platform.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterMetadata;