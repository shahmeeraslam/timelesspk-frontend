import React, { useState } from "react";
import API from "../../../api";
import { toast } from "react-hot-toast";
import { RiLockPasswordLine, RiShieldKeyholeLine, RiLoader4Line } from "@remixicon/react";

const SecurityTab = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put("/api/auth/change-password", passwords);
      
      toast.success("CREDENTIALS_REWRITTEN: SECURITY_PROTOCOL_UPDATED", {
        icon: <RiShieldKeyholeLine size={16} className="text-emerald-500" />,
      });
      
      setPasswords({ oldPassword: "", newPassword: "" });
      setShowForm(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "AUTHENTICATION_FAILURE";
      
      toast.error(errorMessage.toUpperCase(), {
        icon: <RiLockPasswordLine size={16} className="text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-[11px] uppercase tracking-[0.5em] border-b border-white/10 pb-4 text-white/40">
        Access_Control_Systems
      </h2>
      
      <div className="space-y-6 max-w-sm">
        {showForm ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-8">
            <div className="space-y-4">
              <input 
                type="password" 
                placeholder="CURRENT_KEY" 
                required 
                className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] font-mono tracking-widest outline-none focus:border-white transition-colors uppercase" 
                value={passwords.oldPassword} 
                onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} 
              />
              <input 
                type="password" 
                placeholder="NEW_KEY_SPECIFICATION" 
                required 
                className="w-full bg-transparent border-b border-white/10 py-3 text-[10px] font-mono tracking-widest outline-none focus:border-white transition-colors uppercase" 
                value={passwords.newPassword} 
                onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} 
              />
            </div>

            <div className="space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-white text-black py-4 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <RiLoader4Line size={16} className="animate-spin" />
                ) : (
                  "Initiate_Update"
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                className="w-full border border-white/10 py-4 text-[9px] font-mono uppercase tracking-[0.3em] text-white/30 hover:text-white hover:border-white/30 transition-all"
              >
                Abort_Sequence
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 border border-white/5 bg-white/[0.01] space-y-6">
            <p className="text-[10px] font-mono text-white/20 leading-relaxed uppercase tracking-widest">
              Security_Status: Verified <br />
              Last_Key_Rotation: Managed_By_User
            </p>
            <button 
              onClick={() => setShowForm(true)} 
              className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-neutral-200 transition-colors"
            >
              Update_Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityTab;