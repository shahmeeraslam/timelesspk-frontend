import React, { useState, useEffect } from "react";
import { useStore } from "../context/StoreContext";

const SystemTicker = () => {
  const { cmsData } = useStore();
  const [index, setIndex] = useState(0);

  const messages = cmsData?.tickerMessages?.length > 0 
    ? cmsData.tickerMessages 
    : ["SYSTEM_OPERATIONAL", "ENCRYPTED_LINK", "NODE_PK_STABLE"];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="fixed top-0 left-0 w-full z-[110] pointer-events-none">
      {/* Ultra-thin hairline bar */}
      <div className="w-full bg-black/60 backdrop-blur-md border-b border-white/[0.05] h-[24px] flex items-center justify-between px-4">
        
        {/* Left: Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-[var(--brand-main)] rounded-full animate-pulse shadow-[0_0_8px_var(--brand-main)]" />
          <span className="text-[7px] font-mono tracking-[0.2em] text-white/40 uppercase">
            Protocol_Active
          </span>
        </div>

        {/* Center: Rotating Message */}
        <div className="flex-grow flex justify-center overflow-hidden">
          <p 
            key={index} 
            className="text-[8px] font-mono font-bold tracking-[0.3em] text-[var(--brand-main)] animate-mobile-slide uppercase"
          >
            {messages[index]}
          </p>
        </div>

        {/* Right: Time / Metadata */}
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-mono text-white/30 tabular-nums">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemTicker;