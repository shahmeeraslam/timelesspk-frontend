import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30); // Adjust speed here
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center font-mono"
    >
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-[10px] text-white/50 tracking-widest uppercase">
          <span>Initializing_System</span>
          <span>{progress}%</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-[2px] w-full bg-white/10 overflow-hidden relative">
          <motion.div 
            className="h-full bg-white shadow-[0_0_10px_#fff]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-[9px] text-white/30 uppercase tracking-tighter animate-pulse">
          Establishing_Secure_Link_To_Archive...
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;