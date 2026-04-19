import React, { useState } from "react";
import API from "../../../api";
import { RiDeleteBin7Line, RiMapPinAddLine, RiPencilLine } from "@remixicon/react";

const AddressTab = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(user.shippingAddress || {});

  const PAKISTAN_STATES = [
    "Punjab", "Sindh", "KPK", "Balochistan", 
    "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory"
  ];

  const MAJOR_CITIES = [
    "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", 
    "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad"
  ].sort();

  const handleUpdate = async () => {
    try {
      const { data } = await API.put("/api/auth/update-address", { address });
      const updatedUser = { ...user, shippingAddress: data.shippingAddress };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to purge this shipping location?")) return;
    
    const emptyAddress = {
      street: "", city: "", state: "", zipCode: "", country: "", phone: ""
    };

    try {
      const { data } = await API.put("/api/auth/update-address", { address: emptyAddress });
      const updatedUser = { ...user, shippingAddress: data.shippingAddress };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setAddress(emptyAddress);
    } catch (err) {
      console.error("Purge failed", err);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-[var(--brand-border)] pb-4">
        <h2 className="text-[11px] uppercase tracking-[0.5em] text-[var(--brand-muted)]">Saved_Locations</h2>
        {!isEditing && user.shippingAddress?.street && (
          <div className="flex gap-6">
             <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[var(--brand-main)] hover:opacity-60 transition-all">
               <RiPencilLine size={12} /> Edit_Node
             </button>
             <button onClick={handleDelete} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-red-800 hover:text-red-500 transition-all">
               <RiDeleteBin7Line size={12} /> Purge_Data
             </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
          {/* Street Address - Full Width */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Street_Address</label>
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)]"
              value={address.street || ""}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              placeholder="House #, Street Name, Area"
            />
          </div>

          {/* City Dropdown */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">City_Node</label>
            <select 
              className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)] cursor-pointer"
              value={address.city || ""}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            >
              <option value="" disabled className="bg-black">Select City</option>
              {MAJOR_CITIES.map(city => <option key={city} value={city} className="bg-black">{city}</option>)}
            </select>
          </div>

          {/* State Dropdown */}
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Region_State</label>
            <select 
              className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)] cursor-pointer"
              value={address.state || ""}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            >
              <option value="" disabled className="bg-black">Select State</option>
              {PAKISTAN_STATES.map(state => <option key={state} value={state} className="bg-black">{state}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Postal_Code</label>
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)]"
              value={address.zipCode || ""}
              onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Country_Origin</label>
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none opacity-50"
              value="Pakistan"
              readOnly
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">Contact_Verification</label>
            <input 
              className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)]"
              placeholder="03XXXXXXXXX"
              value={address.phone || ""}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />
          </div>

          <div className="md:col-span-2 flex gap-4 mt-4">
            <button onClick={handleUpdate} className="bg-[var(--brand-main)] text-[var(--brand-alt)] px-12 py-4 text-[10px] uppercase tracking-[0.3em] hover:opacity-90 transition-all">
              Commit_Location
            </button>
            <button onClick={() => setIsEditing(false)} className="px-8 py-4 border border-[var(--brand-border)] text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 transition-all">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="p-10 border border-[var(--brand-border)] bg-[var(--brand-soft-bg)] group transition-all hover:border-[var(--brand-main)]/30">
          {user.shippingAddress?.street ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-1 h-4 bg-[var(--brand-main)]" />
                   <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Primary_Destination</p>
                </div>
                <div>
                  <p className="text-xl font-serif italic text-[var(--brand-main)]">{user.shippingAddress.street}</p>
                  <p className="text-sm opacity-70">{user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zipCode}</p>
                  <p className="text-[10px] tracking-[0.4em] opacity-40 uppercase mt-2 font-mono">{user.shippingAddress.country}</p>
                </div>
              </div>
              <div className="md:text-right space-y-4">
                <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Encrypted_Contact</p>
                <p className="text-sm font-mono tracking-tighter">{user.shippingAddress.phone || "UNAVAILABLE"}</p>
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center gap-6">
              <RiMapPinAddLine size={32} className="opacity-10" />
              <p className="text-xs italic opacity-40 font-serif">Registry contains no active shipping protocols.</p>
              <button onClick={() => setIsEditing(true)} className="px-10 py-3 border border-[var(--brand-main)] text-[9px] uppercase tracking-[0.5em] hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all">
                Initialize_Address
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressTab;