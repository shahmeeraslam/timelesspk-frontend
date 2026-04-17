import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { RiLoader4Line, RiPhoneFill, RiWallet3Line } from "@remixicon/react";
import API from "../../api";

const PlaceOrder = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Locked to COD as per requirements
  const method = "cod";

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "Pakistan", phone: ""
  });

  // UX Options for Logistics
  const PAKISTAN_STATES = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory"];
  const MAJOR_CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"].sort();

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const orderData = {
        address: formData,
        items: cart,
        amount: cartTotal,
        paymentMethod: method
      };

      const response = await API.post("/api/orders/place", orderData);
      
      if (response.data.success) {
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order_Auth_Error:", err);
      alert("TERMINAL_FAILURE: Could not initiate order sequence.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-black text-white selection:bg-white selection:text-black">
        <form onSubmit={handlePlaceOrder} className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-24">
          
          {/* LEFT: Shipping and Verification Info */}
          <div className="w-full lg:w-[60%] space-y-20">
            <header className="space-y-4">
              <div className="flex items-center gap-3 opacity-40">
                <div className="w-12 h-[1px] bg-white" />
                <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white">Order_Verification_v4.2</span>
              </div>
              <h1 className="text-5xl font-serif italic tracking-tighter text-white">The Final Step</h1>
            </header>

            {/* Pillar I: Logistics with Enhanced Selection */}
            <section className="space-y-10">
              <h2 className="text-[10px] text-white uppercase tracking-[0.6em] flex items-center gap-4 font-bold">
                Pillar I — Logistics <div className="h-[1px] flex-grow bg-white/20" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Standard Inputs */}
                {[
                  { name: "firstName", placeholder: "First Name" },
                  { name: "lastName", placeholder: "Last Name" },
                  { name: "email", placeholder: "Email_Link", full: true, type: "email" },
                  { name: "street", placeholder: "Street_Address_House_No", full: true },
                ].map((field) => (
                  <div key={field.name} className={`flex flex-col gap-2 ${field.full ? "md:col-span-2" : ""}`}>
                    <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 pl-1">{field.placeholder}</label>
                    <input
                      required
                      name={field.name}
                      value={formData[field.name]}
                      onChange={onInputChange}
                      className="bg-transparent border-b border-white/30 py-3 outline-none text-sm font-light focus:border-white transition-all uppercase tracking-widest text-white"
                    />
                  </div>
                ))}

                {/* City Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 pl-1">City</label>
                  <select 
                    name="city" required value={formData.city} onChange={onInputChange}
                    className="bg-black border-b border-white/30 py-3 outline-none text-sm font-light focus:border-white transition-all uppercase tracking-widest text-white cursor-pointer"
                  >
                    <option value="" disabled>Select_City</option>
                    {MAJOR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    <option value="Other">Other...</option>
                  </select>
                </div>

                {/* State Selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 pl-1">State_Province</label>
                  <select 
                    name="state" required value={formData.state} onChange={onInputChange}
                    className="bg-black border-b border-white/30 py-3 outline-none text-sm font-light focus:border-white transition-all uppercase tracking-widest text-white cursor-pointer"
                  >
                    <option value="" disabled>Select_State</option>
                    {PAKISTAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>

                {/* ZIP & Country */}
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 pl-1">Zip_Code</label>
                  <input name="zipcode" required value={formData.zipcode} onChange={onInputChange} className="bg-transparent border-b border-white/30 py-3 outline-none text-sm text-white uppercase tracking-widest" />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 pl-1">Country</label>
                  <input name="country" readOnly value={formData.country} className="bg-transparent border-b border-white/10 py-3 outline-none text-sm text-white/40 uppercase tracking-widest cursor-not-allowed" />
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-[8px] font-mono uppercase tracking-widest text-white/50 pl-1">Mobile_Contact (Verification Required)</label>
                  <input name="phone" required type="tel" value={formData.phone} onChange={onInputChange} placeholder="03XXXXXXXXX" className="bg-transparent border-b border-white/30 py-3 outline-none text-sm text-white uppercase tracking-widest" />
                </div>
              </div>
            </section>

            {/* Pillar II: Transaction Protocol (COD Notice) */}
            <section className="space-y-10">
              <h2 className="text-[10px] text-white uppercase tracking-[0.6em] flex items-center gap-4 font-bold">
                Pillar II — Protocol <div className="h-[1px] flex-grow bg-white/20" />
              </h2>
              
              <div className="bg-white/5 border border-white/10 p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white text-black shrink-0"><RiPhoneFill size={20} /></div>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest mb-1">Verification_Protocol</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      After placing this order, you will receive a <span className="text-white font-bold italic">Verification Call</span> from our team. Your selection will not be dispatched until confirmed via telephone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 text-white shrink-0"><RiWallet3Line size={20} /></div>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest mb-1">Payment_Mode</h4>
                    <p className="text-xs text-white/70 leading-relaxed font-light">
                      Cash on Delivery is active. <span className="text-white font-bold">EasyPaisa</span> transfers will be available and facilitated during the confirmation call if you prefer digital settlement.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-6">
              <button
                disabled={isProcessing}
                type="submit"
                className="group flex items-center justify-center gap-4 w-full md:w-auto px-20 py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <RiLoader4Line className="animate-spin" size={16} />
                ) : (
                  <>Complete Order Selection</>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Summary Archive */}
          <aside className="w-full lg:w-[40%]">
            <div className="lg:sticky lg:top-32 bg-[#0A0A0A] border border-white/10 p-10 space-y-10 shadow-2xl">
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-white">Archive Summary</h3>
                <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Inventory_Check_Verified</p>
              </div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar">
                {cart.map((item, i) => {
                  const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
                  const displayImg = pData.image?.[0]?.url || pData.img || item.img;
                  return (
                    <div key={i} className="flex gap-6 items-center">
                      <div className="w-16 h-20 bg-black border border-white/10 flex-shrink-0 overflow-hidden">
                        <img src={displayImg} className="w-full h-full object-cover grayscale" alt="" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <p className="text-[11px] uppercase tracking-wider text-white font-bold leading-tight">{pData.name}</p>
                        <p className="text-[9px] font-mono text-white/60 italic uppercase">{item.size} — Qty {item.quantity}</p>
                      </div>
                      <p className="font-serif italic text-sm text-white">${(pData.price * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 pt-8 space-y-4">
                <div className="flex justify-between text-[10px] font-mono tracking-widest text-white/60">
                  <span>SUBTOTAL_VALUATION</span>
                  <span className="text-white">${cartTotal.toLocaleString()}.00</span>
                </div>
                <div className="flex justify-between items-baseline pt-6 border-t border-white/20">
                  <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/80">Total_Due</span>
                  <span className="text-3xl font-serif italic text-white">${cartTotal.toLocaleString()}.00</span>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </PageTransition>
  );
};

export default PlaceOrder;