import React from "react";
import { RiLoader4Line, RiShieldCheckLine } from "@remixicon/react";
import LogisticsSelector from "./LogisticsSelector";

const PAKISTAN_STATES = ["Punjab", "Sindh", "KPK", "Balochistan", "Gilgit-Baltistan", "Azad Kashmir", "Islamabad Capital Territory"];
const MAJOR_CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"].sort();

const CheckoutLogistics = ({ 
  formData, 
  onInputChange, 
  useProfileAddress, 
  setUseProfileAddress, 
  hasValidProfileAddress, 
  clearForm, 
  isProcessing 
}) => {
  return (
    <div className="w-full lg:w-[60%] space-y-16 border-l border-white/10 pl-8 md:pl-16">
      <header className="space-y-6">
        <div className="flex items-center gap-4">
          <RiShieldCheckLine size={14} className="text-emerald-500" />
          <span className="text-[9px] font-mono tracking-[0.5em] uppercase text-white/30">Secure_Node_Active</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter">Final_Step.</h1>
      </header>

      <LogisticsSelector 
        useProfileAddress={useProfileAddress}
        setUseProfileAddress={setUseProfileAddress}
        hasValidProfileAddress={hasValidProfileAddress}
        clearForm={clearForm}
      />

      <section className="space-y-12">
        <h2 className="text-[10px] text-white/30 uppercase tracking-[0.6em] flex items-center gap-4 font-black">
          01 — Logistics {useProfileAddress && <span className="text-emerald-500 text-[8px] font-mono tracking-normal">[VERIFIED_PROFILE_DATA]</span>} <div className="h-[1px] flex-grow bg-white/10" />
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
                type={field.type || "text"}
                readOnly={useProfileAddress}
                value={formData[field.name]}
                onChange={onInputChange}
                className={`bg-transparent border-b border-white/10 py-4 outline-none text-sm font-light focus:border-white transition-all uppercase tracking-widest ${useProfileAddress ? 'opacity-40 cursor-not-allowed border-dashed' : ''}`}
              />
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">City_Node</label>
            <select 
              name="city" required value={formData.city} onChange={onInputChange} disabled={useProfileAddress}
              className="bg-black border-b border-white/10 py-4 outline-none text-sm font-light uppercase tracking-widest disabled:opacity-40"
            >
              <option value="" disabled>Select_City</option>
              {MAJOR_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/30">State_Region</label>
            <select 
              name="state" required value={formData.state} onChange={onInputChange} disabled={useProfileAddress}
              className="bg-black border-b border-white/10 py-4 outline-none text-sm font-light uppercase tracking-widest disabled:opacity-40"
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
                className={`w-full bg-transparent border-b border-white/10 py-4 outline-none text-sm uppercase tracking-widest ${useProfileAddress ? 'opacity-40 border-dashed' : 'focus:border-white'}`} 
              />
              {useProfileAddress && <span className="absolute right-0 bottom-4 text-[7px] font-mono text-emerald-500/60 uppercase tracking-widest">Profile_Synced</span>}
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
  );
};

export default CheckoutLogistics;