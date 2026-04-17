import API from "../../api"; // Path to your api.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios"; // Keep for Cloudinary only
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import {
  RiUserLine,
  RiMapPinLine,
  RiShieldLine,
  RiLogoutBoxRLine,
  RiLoader5Line,
} from "@remixicon/react";
import PageTransition from "../components/PageTransition";

const Profile = () => {
  const { user, setUser, handleLogout } = useCart(); 
  const [activeTab, setActiveTab] = useState("personal");
  
  // --- PERSONAL INFO STATES ---
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // --- SHIPPING ADDRESS STATES ---
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // --- PASSWORD STATES ---
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [passError, setPassError] = useState("");
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Sync state with user context
  useEffect(() => {
    if (user) {
      setNewName(user.name);
      if (user.shippingAddress) {
        setAddress({
          street: user.shippingAddress.street || "",
          city: user.shippingAddress.city || "",
          state: user.shippingAddress.state || "",
          zipCode: user.shippingAddress.zipCode || "",
          country: user.shippingAddress.country || "",
          phone: user.shippingAddress.phone || "",
        });
      }
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) navigate("/login");
    }
  }, [user, navigate]);

  // --- IMAGE UPLOAD LOGIC ---
  // --- IMAGE UPLOAD LOGIC ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bold_comfort_preset"); 

    try {
      // External call (Cloudinary) stays as raw axios
      const res = await axios.post("https://api.cloudinary.com/v1_1/dbz4txs3f/image/upload", formData);
      const imageUrl = res.data.secure_url;
      
      // Internal call (Backend) switches to API instance
      const { data } = await API.put("/api/auth/update-image", { imgUrl: imageUrl });

      const updatedUser = { ...user, img: data.img || imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); 
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  // --- NAME UPDATE LOGIC ---
  const handleUpdateName = async () => {
    try {
      // No need to manually grab token/headers anymore! API instance does it.
      const { data } = await API.put("/api/auth/update-profile", { name: newName });
      
      const updatedUser = { ...user, name: data.name };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // --- ADDRESS UPDATE LOGIC ---
  const handleAddressUpdate = async () => {
    try {
      const { data } = await API.put("/api/auth/update-address", { address });
      
      const updatedUser = { ...user, shippingAddress: data.shippingAddress };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingAddress(false);
    } catch (err) {
      console.error("Address update failed", err);
    }
  };

  // --- PASSWORD UPDATE LOGIC ---
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPassError("");
    try {
      const { data } = await API.put("/api/auth/change-password", passwords);
      alert(data.message);
      setShowPasswordForm(false);
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setPassError(err.response?.data?.message || "Error updating password");
    }
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div style={{ backgroundColor: "var(--brand-alt)", color: "var(--brand-main)" }} className="min-h-screen pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* NAVIGATION SIDEBAR */}
          <div style={{ borderColor: "var(--brand-border)" }} className="w-full lg:w-1/4 space-y-8 border-r pr-8">
            <div className="mb-12">
              <div className="relative group w-24 h-24 mb-6">
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                <div className="w-full h-full rounded-full border border-[var(--brand-border)] overflow-hidden bg-[var(--brand-soft-bg)] flex items-center justify-center relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center rounded-full">
                      <RiLoader5Line className="animate-spin text-white" />
                    </div>
                  )}
                  {user.img ? (
                    <img src={user.img} alt={user.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <RiUserLine size={32} className="opacity-20" />
                  )}
                </div>
                <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <p className="text-[8px] uppercase tracking-widest text-white">Change</p>
                </div>
              </div>
              <h1 className="text-3xl font-serif italic">{user.name}</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] mt-2 text-[var(--brand-muted)]">
                {user.role === 'admin' ? "Master Admin" : "Private Archive Member"}
              </p>
            </div>

            <nav className="flex flex-col gap-6">
              {[
                { id: "personal", icon: RiUserLine, label: "Personal Details" },
                { id: "address", icon: RiMapPinLine, label: "Shipping Book" },
                { id: "security", icon: RiShieldLine, label: "Security" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ color: activeTab === tab.id ? "var(--brand-main)" : "var(--brand-muted)" }}
                  className={`flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? "font-bold" : "hover:text-[var(--brand-main)]"}`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-red-800 mt-10 hover:opacity-70 transition-opacity">
                <RiLogoutBoxRLine size={18} /> Terminate Session
              </button>
            </nav>
          </div>

          {/* CONTENT AREA */}
          <div className="w-full lg:w-3/4">
            
            {/* PERSONAL TAB */}
            {activeTab === "personal" && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <h2 style={{ color: "var(--brand-muted)", borderColor: "var(--brand-border)" }} className="text-[11px] uppercase tracking-[0.5em] border-b pb-4">Identity Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-2">
                    <label style={{ color: "var(--brand-muted)" }} className="text-[9px] uppercase tracking-widest font-bold opacity-60">Full Name</label>
                    {isEditing ? (
                      <input 
                        className="w-full bg-transparent border-b border-[var(--brand-main)] text-sm outline-none text-[var(--brand-main)]"
                        value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus
                      />
                    ) : (
                      <p style={{ color: "var(--brand-main)", borderColor: "var(--brand-border)" }} className="text-sm border-b pb-2">{user.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label style={{ color: "var(--brand-muted)" }} className="text-[9px] uppercase tracking-widest font-bold opacity-60">Email Address</label>
                    <p style={{ color: "var(--brand-main)", borderColor: "var(--brand-border)" }} className="text-sm border-b pb-2 opacity-50">{user.email}</p>
                  </div>
                </div>
                <button onClick={isEditing ? handleUpdateName : () => setIsEditing(true)} style={{ borderColor: "var(--brand-main)", color: "var(--brand-main)" }} className="px-12 py-4 border text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all">
                  {isEditing ? "Save Identity" : "Edit Information"}
                </button>
              </div>
            )}

            {/* SHIPPING ADDRESS TAB */}
            {activeTab === "address" && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <div className="flex justify-between items-end border-b border-[var(--brand-border)] pb-4">
                  <h2 style={{ color: "var(--brand-muted)" }} className="text-[11px] uppercase tracking-[0.5em]">Saved Locations</h2>
                  {!isEditingAddress && (
                    <button onClick={() => setIsEditingAddress(true)} className="text-[9px] uppercase tracking-widest border-b border-[var(--brand-main)] pb-1">
                      {user.shippingAddress?.street ? "Edit Address" : "Add Address"}
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4">
                    {[
                      { label: "Street", key: "street" },
                      { label: "City", key: "city" },
                      { label: "State / Province", key: "state" },
                      { label: "Zip Code", key: "zipCode" },
                      { label: "Country", key: "country" },
                      { label: "Phone", key: "phone" },
                    ].map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-bold opacity-40">{field.label}</label>
                        <input 
                          className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)] text-[var(--brand-main)]"
                          value={address[field.key]}
                          onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                        />
                      </div>
                    ))}
                    <div className="md:col-span-2 flex gap-4 mt-4">
                      <button onClick={handleAddressUpdate} style={{ backgroundColor: "var(--brand-main)", color: "var(--brand-alt)" }} className="px-12 py-4 text-[10px] uppercase tracking-[0.3em]">
                        Save Location
                      </button>
                      <button onClick={() => setIsEditingAddress(false)} className="px-8 py-4 border border-[var(--brand-border)] text-[10px] uppercase tracking-[0.3em]">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: "var(--brand-soft-bg)", borderColor: "var(--brand-border)" }} className="p-10 border">
                    {user.shippingAddress?.street ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                        <div className="space-y-1">
                          <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Primary Destination</p>
                          <p className="text-sm font-serif italic">{user.shippingAddress.street}</p>
                          <p className="text-sm">{user.shippingAddress.city}, {user.shippingAddress.state} {user.shippingAddress.zipCode}</p>
                          <p className="text-[10px] tracking-widest opacity-60 uppercase mt-2">{user.shippingAddress.country}</p>
                        </div>
                        <div className="md:text-right">
                          <p className="text-[9px] uppercase tracking-widest font-bold opacity-40">Contact</p>
                          <p className="text-sm">{user.shippingAddress.phone || "N/A"}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center">
                        <p className="text-xs italic opacity-40 mb-6">No shipping destination on file.</p>
                        <button onClick={() => setIsEditingAddress(true)} style={{ borderColor: "var(--brand-main)" }} className="px-10 py-3 border text-[9px] uppercase tracking-widest">
                          Add Residence
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === "security" && (
              <div className="space-y-12 animate-in fade-in duration-500">
                <h2 style={{ color: "var(--brand-muted)", borderColor: "var(--brand-border)" }} className="text-[11px] uppercase tracking-[0.5em] border-b pb-4">Security Settings</h2>
                <div className="space-y-6 max-w-sm">
                  <p style={{ color: "var(--brand-muted)" }} className="text-xs italic">
                    Auth Method: {user.img?.includes('google') ? "Google Auth" : "Standard Credentials"}
                  </p>
                  {!user.img?.includes('google') && (
                    <>
                      {showPasswordForm ? (
                        <form onSubmit={handlePasswordUpdate} className="space-y-4 animate-in slide-in-from-top-2">
                          <input type="password" placeholder="Current Password" className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)] text-[var(--brand-main)]" value={passwords.oldPassword} onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} required />
                          <input type="password" placeholder="New Password" className="w-full bg-transparent border-b border-[var(--brand-border)] text-sm py-2 outline-none focus:border-[var(--brand-main)] text-[var(--brand-main)]" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} required />
                          {passError && <p className="text-[10px] text-red-800 uppercase tracking-widest">{passError}</p>}
                          <div className="flex gap-4 pt-2">
                            <button type="submit" style={{ backgroundColor: "var(--brand-main)", color: "var(--brand-alt)" }} className="flex-1 py-3 text-[9px] uppercase tracking-[0.3em]">Confirm</button>
                            <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 text-[9px] uppercase tracking-[0.3em] border border-[var(--brand-border)]">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <button onClick={() => setShowPasswordForm(true)} style={{ backgroundColor: "var(--brand-main)", color: "var(--brand-alt)" }} className="w-full py-4 text-[10px] uppercase tracking-[0.4em]">Update Password</button>
                      )}
                    </>
                  )}
                  <button style={{ borderColor: "var(--brand-border)", color: "var(--brand-main)" }} className="w-full py-4 border text-[10px] uppercase tracking-[0.4em] opacity-40">Enable 2FA</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;