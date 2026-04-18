import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { 
  RiLoader4Line, 
  RiPhoneFill, 
  RiWallet3Line, 
  RiArchiveLine, 
  RiShieldCheckLine,
  RiDiscountPercentLine 
} from "@remixicon/react";
import API from "../../api";

const PlaceOrder = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const method = "cod";

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "Pakistan", phone: ""
  });

  // --- ARCHIVE VALUATION LOGIC (Synced with Backend Rounding) ---
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
      acc.savings += (originalItemTotal - discountedItemTotal);
      
      return acc;
    }, { subtotal: 0, total: 0, savings: 0 });
  }, [cart]);

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
        // Match backend Math.round integrity check
        amount: Math.round(totals.total), 
        paymentMethod: method
      };

      const response = await API.post("/api/orders/place", orderData);
      
      if (response.data.success) {
        if (setCart) setCart([]); 
        window.scrollTo(0, 0); // Reset scroll for next view
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order_Auth_Error:", err);
      alert("TERMINAL_FAILURE: Could not initiate order sequence. Please check connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-[var(--brand-alt)] text-[var(--brand-main)] font-sans antialiased selection:bg-[var(--brand-accent)] selection:text-[var(--brand-alt)] overflow-x-hidden">
        
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--brand-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--brand-border)_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-10" />
        </div>

        <form onSubmit={handlePlaceOrder} className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-24">
          
          {/* LEFT: Shipping and Verification Info */}
          <div className="w-full lg:w-[60%] space-y-20 border-l border-[var(--brand-border)] pl-8 md:pl-16">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <RiShieldCheckLine size={14} className="text-[var(--brand-accent)] animate-pulse" />
                <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-[var(--brand-muted)]">Checkout_Protocol_v4.2</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-[var(--brand-main)]">
                Final_Step<span className="text-[var(--brand-accent)]">.</span>
              </h1>
            </header>

            <section className="space-y-12">
              <h2 className="text-[10px] text-[var(--brand-muted)] uppercase tracking-[0.6em] flex items-center gap-4 font-black">
                01 — Logistics <div className="h-[1px] flex-grow bg-[var(--brand-border)]" />
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  { name: "firstName", placeholder: "First_Name" },
                  { name: "lastName", placeholder: "Last_Name" },
                  { name: "email", placeholder: "Electronic_Mail", full: true, type: "email" },
                  { name: "street", placeholder: "Full_Street_Address", full: true },
                ].map((field) => (
                  <div key={field.name} className={`flex flex-col gap-3 group ${field.full ? "md:col-span-2" : ""}`}>
                    <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)] group-focus-within:text-[var(--brand-accent)] transition-colors">
                      {field.placeholder}
                    </label>
                    <input
                      required
                      name={field.name}
                      value={formData[field.name]}
                      onChange={onInputChange}
                      className="bg-transparent border-b border-[var(--brand-border)] py-4 outline-none text-sm font-light focus:border-[var(--brand-accent)] transition-all uppercase tracking-widest text-[var(--brand-main)] placeholder:text-[var(--brand-muted)]/20"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-3">
                  <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">City_Node</label>
                  <select 
                    name="city" required value={formData.city} onChange={onInputChange}
                    className="bg-[var(--brand-alt)] border-b border-[var(--brand-border)] py-4 outline-none text-sm font-light focus:border-[var(--brand-accent)] transition-all uppercase tracking-widest text-[var(--brand-main)] cursor-pointer"
                  >
                    <option value="" disabled>Select_City</option>
                    {MAJOR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">State_Region</label>
                  <select 
                    name="state" required value={formData.state} onChange={onInputChange}
                    className="bg-[var(--brand-alt)] border-b border-[var(--brand-border)] py-4 outline-none text-sm font-light focus:border-[var(--brand-accent)] transition-all uppercase tracking-widest text-[var(--brand-main)] cursor-pointer"
                  >
                    <option value="" disabled>Select_State</option>
                    {PAKISTAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-[var(--brand-muted)]">Verification_Phone</label>
                  <input 
                    name="phone" 
                    required 
                    type="tel" 
                    pattern="[0-9]{11}"
                    title="Please enter a valid 11-digit mobile number"
                    value={formData.phone} 
                    onChange={onInputChange} 
                    placeholder="03XXXXXXXXX" 
                    className="bg-transparent border-b border-[var(--brand-border)] py-4 outline-none text-sm text-[var(--brand-main)] uppercase tracking-widest focus:border-[var(--brand-accent)]" 
                  />
                </div>
              </div>
            </section>

            <section className="space-y-10">
              <h2 className="text-[10px] text-[var(--brand-muted)] uppercase tracking-[0.6em] flex items-center gap-4 font-black">
                02 — Protocol <div className="h-[1px] flex-grow bg-[var(--brand-border)]" />
              </h2>
              
              <div className="bg-[var(--brand-soft-bg)] border border-[var(--brand-border)] p-10 space-y-8">
                <div className="flex items-start gap-6">
                  <div className="p-3 border border-[var(--brand-accent)] text-[var(--brand-accent)] shrink-0"><RiPhoneFill size={18} /></div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--brand-main)]">Voice_Verification</h4>
                    <p className="text-[11px] text-[var(--brand-muted)] leading-relaxed font-light uppercase tracking-tighter">
                      A human agent will contact you shortly to authorize this dispatch.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="p-3 border border-[var(--brand-border)] text-[var(--brand-muted)] shrink-0"><RiWallet3Line size={18} /></div>
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[var(--brand-main)]">Settlement_Mode</h4>
                    <p className="text-[11px] text-[var(--brand-muted)] leading-relaxed font-light uppercase tracking-tighter">
                      Cash on Delivery is standard. Digital settlement via <span className="text-[var(--brand-accent)] italic">EasyPaisa</span> is supported upon request.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <button
              disabled={isProcessing}
              type="submit"
              className="group relative flex items-center justify-center gap-8 w-full md:w-auto px-20 py-6 border border-[var(--brand-accent)] text-[var(--brand-accent)] text-[10px] font-black uppercase tracking-[0.6em] hover:bg-[var(--brand-accent)] hover:text-[var(--brand-alt)] transition-all duration-500 disabled:opacity-30"
            >
              {isProcessing ? <RiLoader4Line className="animate-spin" /> : "Commit Selection"}
            </button>
          </div>

          {/* RIGHT: Summary Archive */}
          <aside className="w-full lg:w-[40%]">
            <div className="lg:sticky lg:top-32 bg-[var(--brand-alt)] border border-[var(--brand-border)] p-10 space-y-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif italic text-[var(--brand-main)]">Manifest</h3>
                  <p className="text-[8px] font-mono text-[var(--brand-muted)] uppercase tracking-widest">Archive_ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <RiArchiveLine size={24} className="text-[var(--brand-border)]" />
              </div>

              <div className="space-y-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
                {cart.map((item, i) => {
                  const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
                  const displayImg = pData.image?.[0]?.url || pData.img || item.img;
                  const discountPercent = pData.discount || 0;
                  const discountedPrice = pData.price * (1 - discountPercent / 100);

                  return (
                    <div key={i} className="flex gap-6 items-start border-b border-[var(--brand-border)]/30 pb-6 group">
                      <div className="w-16 h-20 bg-[var(--brand-alt)] border border-[var(--brand-border)] overflow-hidden shrink-0">
                        <img src={displayImg} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                      </div>
                      <div className="flex-grow space-y-1">
                        <p className="text-[11px] uppercase tracking-wider text-[var(--brand-main)] font-black leading-tight">{pData.name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] font-mono text-[var(--brand-muted)] uppercase">[{item.size}] × {item.quantity}</p>
                          {discountPercent > 0 && (
                            <span className="text-[8px] bg-[var(--brand-accent)] text-[var(--brand-alt)] px-1 font-bold">-{discountPercent}%</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-serif italic text-sm ${discountPercent > 0 ? 'text-[var(--brand-accent)]' : 'text-[var(--brand-main)]'}`}>
                          PKR {(Math.round(discountedPrice) * item.quantity).toLocaleString()}
                        </p>
                        {discountPercent > 0 && (
                          <p className="text-[8px] font-mono text-[var(--brand-muted)] line-through opacity-50">
                            PKR {(pData.price * item.quantity).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6 pt-6">
                <div className="flex justify-between text-[9px] font-mono tracking-widest text-[var(--brand-muted)]">
                  <span>GROSS_VALUATION</span>
                  <span>PKR {totals.subtotal.toLocaleString()}</span>
                </div>
                {totals.savings > 0 && (
                  <div className="flex justify-between text-[9px] font-mono tracking-widest text-[var(--brand-accent)]">
                    <span className="flex items-center gap-2 uppercase"><RiDiscountPercentLine size={10}/> Archive_Discount</span>
                    <span>-PKR {Math.round(totals.savings).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-8 border-t border-[var(--brand-border)]">
                  <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-[var(--brand-main)]">Total_Due</span>
                  <span className="text-4xl font-serif italic text-[var(--brand-accent)]">PKR {Math.round(totals.total).toLocaleString()}</span>
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