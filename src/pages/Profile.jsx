// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import { RiUserLine, RiMapPinLine, RiShieldLine, RiLogoutBoxRLine, RiLoader5Line } from "@remixicon/react";
import PageTransition from "../components/PageTransition";

// Sub-components
import IdentityTab from "../components/UserProfile/IdentityTab";
import AddressTab from "../components/UserProfile/AddressTab";
import SecurityTab from "../components/UserProfile/SecurityTab";
import API from "../../api";
import axios from "axios";

const Profile = () => {
  const { user, setUser, handleLogout } = useCart(); 
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user && !localStorage.getItem("user")) navigate("/login");
  }, [user, navigate]);

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
      const updatedUser = { ...user, img: data.img || imageUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser); 
    } catch (err) {
      console.error("Upload failed", err);
    } finally { setIsUploading(false); }
  };

  if (!user) return null;

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-[var(--brand-alt)] text-[var(--brand-main)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full lg:w-1/4 space-y-8 border-r border-[var(--brand-border)] pr-8">
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
              <h1 className="text-3xl font-serif italic uppercase tracking-tighter">{user.name}</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] mt-2 text-[var(--brand-muted)]">
                {user.role === 'admin' ? "System_Administrator" : "Authenticated_Member"}
              </p>
            </div>

            <nav className="flex flex-col gap-6">
              {[
                { id: "personal", icon: RiUserLine, label: "Identity_Manifest" },
                { id: "address", icon: RiMapPinLine, label: "Shipping_Node" },
                { id: "security", icon: RiShieldLine, label: "Security_Auth" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] transition-all ${activeTab === tab.id ? "text-[var(--brand-main)] font-black" : "text-[var(--brand-muted)] hover:text-[var(--brand-main)]"}`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-red-800 mt-10 hover:opacity-70 transition-opacity">
                <RiLogoutBoxRLine size={18} /> Terminate_Session
              </button>
            </nav>
          </div>

          {/* DYNAMIC CONTENT COMPONENT */}
          <div className="w-full lg:w-3/4">
            {activeTab === "personal" && <IdentityTab user={user} setUser={setUser} />}
            {activeTab === "address" && <AddressTab user={user} setUser={setUser} />}
            {activeTab === "security" && <SecurityTab user={user} />}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;