import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext'; 
import { 
  RiSaveLine, RiShieldKeyholeLine, RiGlobalLine, 
  RiPaletteLine, RiUserLine, RiMoonLine, RiSunLine, 
  RiCloseLine, RiLockPasswordLine 
} from '@remixicon/react';

const Settings = () => {
  // Pull Global State from Context
  const { adminImg, setAdminImg, isDarkMode, setIsDarkMode } = useStore();
  
  // Local UI State
  const [storeName, setStoreName] = useState("Bold_Comfort");
  const [showPassFields, setShowPassFields] = useState(false);
  const [tempAvatar, setTempAvatar] = useState(adminImg); // Preview state
  
  const fileInputRef = useRef(null);

  // Sync the data-theme attribute with the document root for your CSS
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDarkMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTempAvatar(imageUrl);
    }
  };

  const handleSave = () => {
    setAdminImg(tempAvatar);
    alert(`Settings for ${storeName} saved successfully.`);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-[var(--brand-border)] pb-8">
        <div>
          <h1 style={{ color: 'var(--brand-main)' }} className="text-4xl font-serif italic transition-colors duration-300">System Settings</h1>
          <p style={{ color: 'var(--brand-muted)' }} className="text-[10px] uppercase tracking-[0.5em] mt-2">Global control & preferences</p>
        </div>
        <button 
          onClick={handleSave}
          style={{ backgroundColor: 'var(--brand-main)', color: 'var(--brand-alt)' }}
          className="flex items-center gap-2 px-8 py-3 text-[10px] uppercase tracking-[0.3em] hover:opacity-90 active:scale-95 transition-all duration-300"
        >
          <RiSaveLine size={16} /> Save Changes
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-12">
          {/* Store Configuration */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--brand-border)] pb-2">
              <RiGlobalLine size={16} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--brand-main)' }}>Store Profile</h2>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-400">Public Store Name</label>
              <input 
                type="text" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={{ color: 'var(--brand-main)', borderColor: 'var(--brand-border)' }} 
                className="w-full bg-transparent border-b py-2 outline-none text-sm font-light focus:border-[var(--brand-main)] transition-colors duration-300" 
              />
            </div>
          </section>

          {/* Admin Profile & Image Upload */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--brand-border)] pb-2">
              <RiUserLine size={16} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--brand-main)' }}>Admin Credentials</h2>
            </div>
            
            <div className="flex items-center gap-6 pb-4">
              <div className="relative group w-20 h-20 rounded-full border border-[var(--brand-border)] flex items-center justify-center bg-[var(--brand-soft-bg)] overflow-hidden transition-colors duration-300">
                {tempAvatar ? (
                  <>
                    <img src={tempAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setTempAvatar(null)}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <RiCloseLine size={20} className="text-white" />
                    </button>
                  </>
                ) : (
                  <RiUserLine size={28} className="opacity-20" style={{ color: 'var(--brand-main)' }} />
                )}
              </div>
              
              <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              <button 
                onClick={() => fileInputRef.current.click()}
                style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-main)' }}
                className="text-[9px] uppercase tracking-widest border px-4 py-2 hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all duration-300"
              >
                {tempAvatar ? 'Replace Photo' : 'Upload Photo'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-gray-400">Email Address</label>
                <input type="email" defaultValue="admin@boldcomfort.com" style={{ color: 'var(--brand-main)', borderColor: 'var(--brand-border)' }} className="w-full bg-transparent border-b py-2 outline-none text-sm font-light focus:border-[var(--brand-main)] transition-colors duration-300" />
              </div>
              
              <button 
                onClick={() => setShowPassFields(!showPassFields)}
                style={{ color: 'var(--brand-main)' }}
                className="flex items-center gap-2 text-[10px] uppercase tracking-widest underline underline-offset-4 opacity-80 hover:opacity-100"
              >
                <RiLockPasswordLine size={14} /> 
                {showPassFields ? 'Cancel Update' : 'Change Password'}
              </button>

              {showPassFields && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <input type="password" placeholder="New Password" style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-main)' }} className="w-full bg-transparent border-b py-2 outline-none text-xs font-light" />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Theme & Technical */}
        <div className="space-y-12">
          {/* Visual Interface Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--brand-border)] pb-2">
              <RiPaletteLine size={16} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--brand-main)' }}>Visual Interface</h2>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Appearance Mode</span>
                <p className="text-[9px] italic opacity-60" style={{ color: 'var(--brand-main)' }}>
                  Currently: {isDarkMode ? 'Midnight' : 'Nishikigo'}
                </p>
              </div>
              <div className="flex border border-[var(--brand-border)] p-1 bg-[var(--brand-alt)] transition-colors duration-300">
                <button 
                  onClick={() => setIsDarkMode(false)}
                  className={`p-2 transition-all duration-300 ${!isDarkMode ? 'bg-[var(--brand-main)] text-[var(--brand-alt)]' : 'opacity-40 hover:opacity-100'}`}
                  style={{ color: !isDarkMode ? 'var(--brand-alt)' : 'var(--brand-main)' }}
                >
                  <RiSunLine size={16} />
                </button>
                <button 
                  onClick={() => setIsDarkMode(true)}
                  className={`p-2 transition-all duration-300 ${isDarkMode ? 'bg-[var(--brand-main)] text-[var(--brand-alt)]' : 'opacity-40 hover:opacity-100'}`}
                  style={{ color: isDarkMode ? 'var(--brand-alt)' : 'var(--brand-main)' }}
                >
                  <RiMoonLine size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* System Status Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--brand-border)] pb-2">
              <RiShieldKeyholeLine size={16} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-[11px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--brand-main)' }}>System Status</h2>
            </div>
            <div className="space-y-2">
              <label className="flex justify-between items-center py-3 border-b border-[var(--brand-border)] cursor-pointer hover:bg-[var(--brand-soft-bg)] px-1 transition-colors duration-300">
                <span className="text-[10px] uppercase tracking-widest text-gray-400">Maintenance Mode</span>
                <input type="checkbox" style={{ accentColor: 'var(--brand-main)' }} className="w-4 h-4 cursor-pointer" />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;