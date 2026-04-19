// src/components/profile/SecurityTab.jsx
import React, { useState } from "react";
import API from "../../../api";

const SecurityTab = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [error, setError] = useState("");

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/api/auth/change-password", passwords);
      alert("Security Protocol Updated");
      setShowForm(false);
    } catch (err) { setError(err.response?.data?.message || "Auth Error"); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-[11px] uppercase tracking-[0.5em] border-b border-[var(--brand-border)] pb-4 text-[var(--brand-muted)]">Security Settings</h2>
      <div className="space-y-6 max-w-sm">
        {showForm ? (
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <input type="password" placeholder="Current Password" required className="w-full bg-transparent border-b border-[var(--brand-border)] py-2 text-sm outline-none" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} />
            <input type="password" placeholder="New Password" required className="w-full bg-transparent border-b border-[var(--brand-border)] py-2 text-sm outline-none" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
            {error && <p className="text-[10px] text-red-800 uppercase tracking-widest">{error}</p>}
            <button type="submit" className="w-full bg-[var(--brand-main)] text-[var(--brand-alt)] py-3 text-[9px] uppercase tracking-[0.3em]">Confirm Update</button>
            <button type="button" onClick={() => setShowForm(false)} className="w-full border border-[var(--brand-border)] py-3 text-[9px] uppercase tracking-[0.3em]">Cancel</button>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="w-full bg-[var(--brand-main)] text-[var(--brand-alt)] py-4 text-[10px] uppercase tracking-[0.4em]">Update Credentials</button>
        )}
      </div>
    </div>
  );
};

export default SecurityTab;