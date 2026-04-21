import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { 
  RiLoader4Line, 
  RiArchiveLine, 
  RiShieldCheckLine,
  RiUserLine,
  RiDraftLine
} from "@remixicon/react";
import API from "../../api";
import toast from "react-hot-toast";

const PlaceOrder = () => {
  const { cart, setCart, user } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [useProfileAddress, setUseProfileAddress] = useState(true);
  
  const method = "cod";

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "Pakistan", phone: ""
  });

  useEffect(() => {
    if (useProfileAddress && user) {
      const nameParts = user.name ? user.name.split(" ") : ["", ""];
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        street: user.shippingAddress?.street || "",
        city: user.shippingAddress?.city || "",
        state: user.shippingAddress?.state || "",
        zipcode: user.shippingAddress?.zipCode || "",
        country: user.shippingAddress?.country || "Pakistan",
        phone: user.shippingAddress?.phone || ""
      });
    }
  }, [useProfileAddress, user]);

  const totals = useMemo(() => {
    return cart.reduce((acc, item) => {
      const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
      const basePrice = pData.price || 0;
      const discountPercent = pData.discount || 0;
      const originalItemTotal = basePrice * item.quantity;
      const discountedItemPrice = basePrice * (1 - discountPercent / 100);
      const discountedItemTotal = discountedItemPrice * item.quantity;
      
      acc.subtotal += originalItemTotal;
      acc.total += discountedItemTotal;
      return acc;
    }, { subtotal: 0, total: 0 });
  }, [cart]);

  const PAKISTAN_STATES = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory"];
  const MAJOR_CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"].sort();

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("MANIFEST_EMPTY");

    setIsProcessing(true);
    try {
const orderData = {
    address: formData,
    items: cart.map(item => {
      const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
      
      return {
        productId: pData._id || item.productId,
        name: pData.name || item.name || "Archive_Item",
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: pData.price || item.price || 0,
        // SNAPSHOT FIXES:
        image: pData.image || [], // Full array for Admin
        category: pData.category || "General", // Fixes category issue
        img: pData.img || (pData.image?.[0]?.url) || "" // Fixes image display issue
      };
    }),
    amount: Math.round(totals.total), 
    paymentMethod: method
  };
      const response = await API.post("/api/orders/place", orderData);
      if (response.data.success) {
        toast.success("MANIFEST_LOGGED: ARCHIVE_UPDATED");
        if (setCart) setCart([]); 
        navigate("/orders");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "TERMINAL_FAILURE");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-black text-white">
        <form onSubmit={handlePlaceOrder} className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-24">
          
          <div className="w-full lg:w-[60%] space-y-16 border-l border-white/10 pl-8 md:pl-16">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <RiShieldCheckLine size={14} className="text-emerald-500" />
                <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/30">Secure_Node_Active</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter">Final_Step.</h1>
            </header>

            <div className="flex gap-4 p-1 border border-white/10 w-fit bg-white/[0.02]">
                <button 
                  type="button"
                  onClick={() => setUseProfileAddress(true)}
                  className={`flex items-center gap-3 px-6 py-3 text-[9px] font-mono tracking-widest transition-all ${useProfileAddress ? 'bg-white text-black font-black' : 'text-white/30 hover:text-white'}`}
                >
                  <RiUserLine size={12} /> PROFILE_IDENTITY
                </button>
                <button 
                   type="button"
                   onClick={() => setUseProfileAddress(false)}
                   className={`flex items-center gap-3 px-6 py-3 text-[9px] font-mono tracking-widest transition-all ${!useProfileAddress ? 'bg-white text-black font-black' : 'text-white/30 hover:text-white'}`}
                >
                  <RiDraftLine size={12} /> CUSTOM_MANIFEST
                </button>
            </div>

            <section className="space-y-12">
              <h2 className="text-[10px] text-white/30 uppercase tracking-[0.6em] flex items-center gap-4 font-black">
                01 — Logistics <div className="h-[1px] flex-grow bg-white/10" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { name: "firstName", placeholder: "First_Name" },
                  { name: "lastName", placeholder: "Last_Name" },
                  { name: "email", placeholder: "Electronic_Mail", full: true, type: "email" },
                  { name: "street", placeholder: "Full_Street_Address", full: true },
                ].map((field) => (
                  <div key={field.name} className={`flex flex-col gap-3 group ${field.full ? "md:col-span-2" : ""}`}>
                    <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">{field.placeholder}</label>
                    <input
                      required
                      name={field.name}
                      readOnly={useProfileAddress}
                      value={formData[field.name]}
                      onChange={onInputChange}
                      className={`bg-transparent border-b border-white/10 py-4 outline-none text-sm font-light focus:border-white transition-all uppercase tracking-widest ${useProfileAddress ? 'opacity-30 cursor-not-allowed border-dashed' : ''}`}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-3">
                  <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">City_Node</label>
                  <select 
                    name="city" required value={formData.city} onChange={onInputChange} disabled={useProfileAddress}
                    className="bg-black border-b border-white/10 py-4 outline-none text-sm font-light uppercase tracking-widest disabled:opacity-30"
                  >
                    <option value="" disabled>Select_City</option>
                    {MAJOR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">State_Region</label>
                  <select 
                    name="state" required value={formData.state} onChange={onInputChange} disabled={useProfileAddress}
                    className="bg-black border-b border-white/10 py-4 outline-none text-sm font-light uppercase tracking-widest disabled:opacity-30"
                  >
                    <option value="" disabled>Select_State</option>
                    {PAKISTAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">Verification_Phone</label>
                  <div className="relative">
                    <input 
                      name="phone" required type="tel" pattern="[0-9]{11}" readOnly={useProfileAddress}
                      value={formData.phone} onChange={onInputChange} placeholder="03XXXXXXXXX" 
                      className={`w-full bg-transparent border-b border-white/10 py-4 outline-none text-sm uppercase tracking-widest ${useProfileAddress ? 'opacity-30 border-dashed' : 'focus:border-white'}`} 
                    />
                    {useProfileAddress && <span className="absolute right-0 bottom-4 text-[7px] font-mono text-white/20 uppercase">Encrypted_from_Profile</span>}
                  </div>
                </div>
              </div>
            </section>

            <button
              disabled={isProcessing}
              type="submit"
              className="group flex items-center justify-center gap-8 w-full md:w-fit px-20 py-6 border border-white text-white text-[10px] font-black uppercase tracking-[0.6em] hover:bg-white hover:text-black transition-all duration-500 disabled:opacity-50"
            >
              {isProcessing ? <RiLoader4Line className="animate-spin" /> : "Commit_Acquisition"}
            </button>
          </div>

          <aside className="w-full lg:w-[40%]">
            <div className="lg:sticky lg:top-32 border border-white/10 p-10 space-y-12 bg-white/[0.01]">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-serif italic">Manifest</h3>
                <RiArchiveLine size={24} className="text-white/20" />
              </div>

              <div className="space-y-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, i) => {
                  const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
                  const displayImg = pData.image?.[0]?.url || pData.img || item.img;
                  const discountPercent = pData.discount || 0;
                  const discountedPrice = pData.price * (1 - discountPercent / 100);

                  return (
                    <div key={i} className="flex gap-6 items-start border-b border-white/5 pb-6">
                      <div className="w-16 h-20 bg-zinc-900 border border-white/10 overflow-hidden shrink-0">
                        <img src={displayImg} className="w-full h-full object-cover grayscale opacity-70" alt="" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <p className="text-[10px] uppercase tracking-wider font-black leading-tight">{pData.name}</p>
                        <div className="flex flex-col gap-1 text-[8px] font-mono text-white/40 uppercase">
                          <span>Color: {item.color || "Standard"}</span>
                          <span>Size: {item.size}</span>
                          <span className="text-white/60">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="font-serif italic text-sm">
                        PKR {(Math.round(discountedPrice) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/30">Total_Due</span>
                <span className="text-4xl font-serif italic">PKR {Math.round(totals.total).toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </PageTransition>
  );
};

export default PlaceOrder;