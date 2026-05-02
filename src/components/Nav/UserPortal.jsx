import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiShieldUserLine, RiUserFill, RiDashboardLine, RiListSettingsLine } from "@remixicon/react";

const UserPortal = ({ user, isAdmin, profileOpen, setProfileOpen, onLogout }) => {
  return (
    <div className="relative">
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 overflow-hidden
          ${profileOpen ? 'border-[var(--brand-main)] bg-[var(--brand-main)] text-[var(--brand-alt)]' : 'border-[var(--brand-border)] text-[var(--brand-main)]'}`} 
        onClick={() => setProfileOpen(!profileOpen)}
      >
        {user?.img ? (
          <img src={user.img} alt="User" className="w-full h-full object-cover" />
        ) : (
          isAdmin ? <RiShieldUserLine size={16} /> : <RiUserFill size={16} />
        )}
        {isAdmin && <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 border border-black rounded-full" />}
      </motion.button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-5 bg-[var(--brand-alt)] border border-[var(--brand-border)] p-5 w-60 shadow-2xl z-[110] backdrop-blur-3xl"
          >
            <div className="space-y-5">
              {user ? (
                <>
                  <div className="pb-3 border-b border-[var(--brand-border)]">
                    <span className="text-[7px] font-mono text-[var(--brand-muted)] uppercase tracking-widest block mb-1 opacity-50">
                      {isAdmin ? "System_Director" : "Authorized_User"}
                    </span>
                    <p className="text-[10px] font-serif italic text-[var(--brand-main)]">{user.name}</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {isAdmin ? (
                      <>
                        <Link to='/admin/dashboard' onClick={() => setProfileOpen(false)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-red-500 hover:brightness-125">
                          <RiDashboardLine size={12}/> Root_Dashboard
                        </Link>
                        <Link to='/admin/inventory' onClick={() => setProfileOpen(false)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">
                          <RiListSettingsLine size={12}/> Inventory_Ctrl
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to='/profile' onClick={() => setProfileOpen(false)} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">User_Node</Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">Archive_Logs</Link>
                      </>
                    )}
                  </div>
                  
                  <button onClick={onLogout} className="w-full pt-4 border-t border-[var(--brand-border)] text-[8px] font-mono text-red-500 uppercase tracking-widest text-left hover:brightness-150">
                    Terminate_Session
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <Link to="/login" onClick={() => setProfileOpen(false)} className="block py-2 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[9px] font-mono text-center tracking-widest">Authenticate</Link>
                  <Link to="/register" onClick={() => setProfileOpen(false)} className="block text-[8px] text-center uppercase tracking-widest text-[var(--brand-muted)]">New_Node</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserPortal;