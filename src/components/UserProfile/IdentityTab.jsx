// src/components/profile/IdentityTab.jsx
import React, { useState } from "react";
import API from "../../../api";

const IdentityTab = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const handleUpdate = async () => {
    try {
      const { data } = await API.put("/api/auth/update-profile", { name: newName });
      const updatedUser = { ...user, name: data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <h2 className="text-[11px] uppercase tracking-[0.5em] border-b border-[var(--brand-border)] pb-4 text-[var(--brand-muted)]">Identity Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-widest font-bold opacity-60">Full Name</label>
          {isEditing ? (
            <input className="w-full bg-transparent border-b border-[var(--brand-main)] text-sm outline-none" value={newName} onChange={(e) => setNewName(e.target.value)} />
          ) : (
            <p className="text-sm border-b border-[var(--brand-border)] pb-2">{user.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-widest font-bold opacity-60">Email Address</label>
          <p className="text-sm border-b border-[var(--brand-border)] pb-2 opacity-50">{user.email}</p>
        </div>
      </div>
      <button onClick={isEditing ? handleUpdate : () => setIsEditing(true)} className="px-12 py-4 border border-[var(--brand-main)] text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all">
        {isEditing ? "Save Identity" : "Edit Information"}
      </button>
    </div>
  );
};

export default IdentityTab;