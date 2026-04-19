import React, { useRef, useState } from "react";
import axios from "axios";
import { 
  RiImageAddLine, 
  RiLoader5Line, 
  RiBroadcastLine 
} from "@remixicon/react";
import toast from "react-hot-toast";

const VisualHUD = ({ config, setConfig }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bold_comfort_preset");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbz4txs3f/image/upload", 
        formData
      );
      
      // Update only the hero background image in the global config
      setConfig({ 
        ...config, 
        hero: { ...config.hero, bgImage: res.data.secure_url } 
      });
    } catch (err) {
      console.error("ASSET_UPLOAD_FAILED", err);
      toast.error("UPLOAD_ERROR: Check console for logs.");
    } finally {
      setIsUploading(false);
    }
  };

  const toggleAnnouncement = () => {
    setConfig({
      ...config,
      announcement: { 
        ...config.announcement, 
        isVisible: !config.announcement.isVisible 
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* HERO PREVIEW RENDERER */}
      <div className="relative group aspect-video bg-black border border-[var(--brand-border)] overflow-hidden">
        {config.hero.bgImage ? (
          <img 
            src={config.hero.bgImage} 
            className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" 
            alt="Hero Preview" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <RiImageAddLine size={40} />
          </div>
        )}

        {/* UPLOAD OVERLAY */}
        <div 
          onClick={() => fileInputRef.current.click()} 
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
        >
          {isUploading ? (
            <RiLoader5Line className="animate-spin text-[var(--brand-main)]" size={32} />
          ) : (
            <>
              <RiImageAddLine size={24} className="text-white mb-2" />
              <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Replace_Hero_Asset</span>
            </>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          className="hidden" 
          accept="image/*" 
        />
      </div>

      {/* HUD BROADCASTER (ANNOUNCEMENT BAR) */}
      <div className="p-8 border border-[var(--brand-border)] bg-[var(--brand-soft-bg)] space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-[10px] font-mono uppercase tracking-[0.4em] flex items-center gap-2">
            <RiBroadcastLine size={14} className="text-[var(--brand-main)]" /> 
            HUD_Broadcaster
          </h3>
          
          {/* STYLIZED TOGGLE SWITCH */}
          <div 
            onClick={toggleAnnouncement} 
            className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${
              config.announcement.isVisible ? 'bg-green-600/40 border-green-500' : 'bg-zinc-800 border-zinc-700'
            } border`}
          >
            <div className={`absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-lg ${
              config.announcement.isVisible 
                ? 'left-5 bg-green-400 shadow-green-500/50' 
                : 'left-1 bg-zinc-500'
            }`} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[8px] font-mono opacity-30 uppercase tracking-widest">Global_Message_String</label>
          <input 
            className="w-full bg-transparent border-b border-[var(--brand-border)] py-2 text-[10px] font-bold uppercase outline-none text-white focus:border-[var(--brand-main)] transition-colors" 
            value={config.announcement.text || ""} 
            onChange={(e) => setConfig({
              ...config, 
              announcement: { ...config.announcement, text: e.target.value }
            })} 
          />
        </div>

        {/* STATUS INDICATOR */}
        <div className="pt-2 flex items-center gap-2">
           <div className={`w-1.5 h-1.5 rounded-full ${config.announcement.isVisible ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
           <span className="text-[8px] font-mono opacity-40 uppercase tracking-tighter">
             System_Status: {config.announcement.isVisible ? 'Broadcasting_Active' : 'Signal_Offline'}
           </span>
        </div>
      </div>
    </div>
  );
};

export default VisualHUD;