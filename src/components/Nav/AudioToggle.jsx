import React from "react";
import { motion } from "framer-motion";

const AudioToggle = ({ isPlaying, isBlocked, toggleAudio }) => {
  return (
    <button onClick={toggleAudio} className="group flex flex-col items-center gap-1 min-w-[50px]">
      <div className="flex gap-[2px] items-end h-2.5">
        {[1, 2, 3].map((bar) => (
          <motion.div
            key={bar}
            animate={{ height: isPlaying ? [3, 10, 5, 10, 3] : (isBlocked ? [2, 6, 2] : 2) }}
            transition={{ repeat: Infinity, duration: isPlaying ? (0.6 + (bar * 0.2)) : 1.5 }}
            className={`w-[1.5px] transition-colors duration-500 ${
              isPlaying ? 'bg-[var(--brand-main)]' : (isBlocked ? 'bg-amber-500' : 'bg-[var(--brand-muted)] opacity-30')
            }`}
          />
        ))}
      </div>
      <span className="text-[7px] font-mono uppercase tracking-widest text-[var(--brand-muted)] group-hover:text-white transition-colors">
        {isPlaying ? "Live" : "Mute"}
      </span>
    </button>
  );
};

export default AudioToggle;