import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext'; 
import API from "../../../api"; 
import axios from "axios"; 
import { 
  RiSaveLine, RiShieldKeyholeLine, RiGlobalLine, 
  RiUserLine, RiLockPasswordLine, RiTerminalBoxLine,
  RiCameraLine, RiLoader5Line, RiVerifiedBadgeLine
} from '@remixicon/react';

const Settings = () => {
  // Pull Global State (Assuming user data is synced here or in a similar context)
  // If your user data is in a different context, import it here
  const { isDarkMode } = useStore();
  
  // Real Admin Data States
  const [adminData, setAdminData] = useState(null);
  const [newName, setNewName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showPassFields, setShowPassFields] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  
  const fileInputRef = useRef(null);

  // Initialize data from localStorage (similar to your Profile logic)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setAdminData(storedUser);
      setNewName(storedUser.name);
    }
  }, []);

  // --- IMAGE UPLOAD LOGIC (Cloudinary + Backend) ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bold_comfort_preset"); 

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/dbz4txs3f/image/upload", formData);
      const imageUrl = res.data.secure_url;
      
      const { data } = await API.put("/api/auth/update-image", { imgUrl: imageUrl });

      const updatedUser = { ...adminData, img: data.img || imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAdminData(updatedUser); 
    } catch (err) {
      console.error("Admin image upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  // --- IDENTITY UPDATE LOGIC ---
  const handleSaveIdentity = async () => {
    try {
      const { data } = await API.put("/api/auth/update-profile", { name: newName });
      const updatedUser = { ...adminData, name: data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setAdminData(updatedUser);
      alert("Identity Updated Successfully");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!adminData) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-8">
      
      {/* HUD HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-2 pb-10" style={{ borderColor: 'var(--brand-border)' }}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <RiTerminalBoxLine size={14} style={{ color: 'var(--brand-muted)' }} />
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.4em]" style={{ color: 'var(--brand-muted)' }}>Root_Configuration_Panel</p>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none" style={{ color: 'var(--brand-main)' }}>Settings</h1>
        </div>
        
        <button 
          onClick={handleSaveIdentity}
          className="group relative flex items-center gap-3 px-10 py-4 text-xs font-black uppercase italic transition-all active:scale-95 border"
          style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-alt)', borderColor: 'var(--brand-accent)' }}
        >
          <RiSaveLine size={18} className="group-hover:animate-pulse" />
          <span>Commit_Changes</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT COLUMN: IDENTITY & AUTH */}
        <div className="lg:col-span-7 space-y-16">
          
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--brand-border)' }}>
              <RiGlobalLine size={20} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>Core_Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-black uppercase" style={{ color: 'var(--brand-muted)' }}>Public_Alias</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ color: 'var(--brand-main)', borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-soft-bg)' }}
                  className="w-full border-2 p-4 text-sm font-bold uppercase outline-none focus:border-[var(--brand-accent)] transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono font-black uppercase" style={{ color: 'var(--brand-muted)' }}>System_Email</label>
                <div 
                  style={{ color: 'var(--brand-main)', borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-soft-bg)' }}
                  className="w-full border-2 p-4 text-sm font-bold uppercase opacity-50 select-none cursor-not-allowed"
                >
                  {adminData.email}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--brand-border)' }}>
              <RiUserLine size={20} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>Administrative_Auth</h2>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10 border-2 p-8 relative overflow-hidden" 
                 style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }}>
              
              <div className="relative group shrink-0">
                <div className="w-32 h-32 border-4 overflow-hidden relative" style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-alt)' }}>
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                      <RiLoader5Line className="animate-spin text-white" />
                    </div>
                  )}
                  {adminData.img ? (
                    <img src={adminData.img} alt={adminData.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10" style={{ color: 'var(--brand-main)' }}><RiUserLine size={48} /></div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute -bottom-2 -right-2 p-3 transition-transform shadow-lg z-20"
                  style={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-alt)' }}
                >
                  <RiCameraLine size={16} />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
              </div>
              
              <div className="space-y-5 flex-grow">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-mono font-black uppercase italic" style={{ color: 'var(--brand-accent)' }}>
                    {adminData.role} Profile
                  </p>
                  {adminData.isVerified && <RiVerifiedBadgeLine size={14} style={{ color: 'var(--brand-accent)' }} />}
                </div>
                <p className="text-[10px] font-mono font-bold leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
                  Update biometric visual data and security credentials. Account established: {new Date(adminData.createdAt).toLocaleDateString()}
                </p>
                
                <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setShowPassFields(!showPassFields)}
                      style={{ borderColor: 'var(--brand-accent)', color: 'var(--brand-accent)' }}
                      className="px-4 py-2 border-2 text-[10px] font-black uppercase italic hover:bg-[var(--brand-accent)] hover:text-[var(--brand-alt)] transition-all flex items-center gap-2"
                    >
                      <RiLockPasswordLine size={14} /> {showPassFields ? 'Close_Vault' : 'Reset_Key'}
                    </button>
                </div>
              </div>
            </div>

            {showPassFields && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-4 duration-300">
                    <input type="password" placeholder="CURRENT_KEY" 
                           style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-main)' }}
                           className="border-2 p-4 text-xs font-mono font-bold outline-none focus:border-[var(--brand-accent)]" />
                    <input type="password" placeholder="NEW_ENCRYPTION_KEY" 
                           style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)', color: 'var(--brand-main)' }}
                           className="border-2 p-4 text-xs font-mono font-bold outline-none focus:border-[var(--brand-accent)]" />
                </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: SYSTEM SPECS */}
        <div className="lg:col-span-5 space-y-16">
          
          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--brand-border)' }}>
              <RiShieldKeyholeLine size={20} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>System_Specs</h2>
            </div>
            
            <div className="p-8 border-2 relative" style={{ backgroundColor: 'var(--brand-soft-bg)', borderColor: 'var(--brand-border)' }}>
                <div className="space-y-6">
                    <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--brand-border)' }}>
                        <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--brand-muted)' }}>Internal_ID</span>
                        <span className="text-[10px] font-mono font-bold uppercase">{adminData._id}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--brand-border)' }}>
                        <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--brand-muted)' }}>Verified_Status</span>
                        <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--brand-accent)' }}>{adminData.isVerified ? "ACTIVE" : "PENDING"}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--brand-border)' }}>
                        <span className="text-[10px] font-mono uppercase" style={{ color: 'var(--brand-muted)' }}>Last_Sync</span>
                        <span className="text-[10px] font-mono font-bold uppercase">{new Date(adminData.updatedAt).toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>
          </section>

          <section className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--brand-border)' }}>
              <RiShieldKeyholeLine size={20} style={{ color: 'var(--brand-muted)' }} />
              <h2 className="text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--brand-main)' }}>System_Overlays</h2>
            </div>
            
            <div className="space-y-2">
                <label className="group flex justify-between items-center p-6 border-2 cursor-pointer transition-colors" 
                       style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-soft-bg)' }}>
                    <div>
                        <p className="text-[11px] font-black uppercase" style={{ color: 'var(--brand-main)' }}>Maintenance_Lock</p>
                        <p className="text-[9px] font-mono mt-1 uppercase" style={{ color: 'var(--brand-muted)' }}>Redirect public traffic to hold screen</p>
                    </div>
                    <input type="checkbox" style={{ accentColor: 'var(--brand-accent)' }} className="w-5 h-5 cursor-pointer" />
                </label>
            </div>
          </section>
        </div>
      </div>

      <footer className="pt-10 border-t text-center" style={{ borderColor: 'var(--brand-border)' }}>
        <p className="text-[9px] font-mono font-bold uppercase tracking-[1em]" style={{ color: 'var(--brand-muted)', opacity: 0.3 }}>Terminal_v2.0.4_Stable</p>
      </footer>
    </div>
  );
};

export default Settings;