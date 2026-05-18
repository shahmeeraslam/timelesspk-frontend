import React from "react";
import { RiUserLine, RiDraftLine } from "@remixicon/react";

const LogisticsSelector = ({ useProfileAddress, setUseProfileAddress, hasValidProfileAddress, clearForm }) => {
  return (
    <div className="flex gap-4 p-1 border border-white/10 w-fit bg-white/[0.02]">
      <button 
        type="button"
        disabled={!hasValidProfileAddress}
        onClick={() => setUseProfileAddress(true)}
        className={`flex items-center gap-3 px-6 py-3 text-[9px] font-mono tracking-widest transition-all 
          ${!hasValidProfileAddress ? 'opacity-20 cursor-not-allowed' : ''} 
          ${useProfileAddress ? 'bg-white text-black font-black' : 'text-white/30 hover:text-white'}`}
      >
        <RiUserLine size={12} /> PROFILE_IDENTITY
      </button>
      <button 
         type="button"
         onClick={() => {
           setUseProfileAddress(false);
           if (hasValidProfileAddress) clearForm();
         }}
         className={`flex items-center gap-3 px-6 py-3 text-[9px] font-mono tracking-widest transition-all ${!useProfileAddress ? 'bg-white text-black font-black' : 'text-white/30 hover:text-white'}`}
      >
        <RiDraftLine size={12} /> CUSTOM_MANIFEST
      </button>
    </div>
  );
};

export default LogisticsSelector;