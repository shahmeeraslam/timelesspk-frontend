import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

// GLOBAL SINGLETON: Initialized once outside the component.
// This ensures the audio object persists even if this component re-renders or unmounts briefly.
const globalAudio = typeof window !== 'undefined' ? new Audio(`${window.location.origin}/audio/Audio.mp3`) : null;
if (globalAudio) {
  globalAudio.loop = true;
  globalAudio.volume = 0.3;
}

const AudioPortal = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  
  // High-priority state tracking to handle background/foreground transitions
  const state = useRef({
    isPlaying: false,
    manualPause: true 
  });

  useEffect(() => {
    if (!globalAudio) return;

    // Sync local state with global audio status on mount
    const currentIsPlaying = !globalAudio.paused;
    setIsPlaying(currentIsPlaying);
    state.current.isPlaying = currentIsPlaying;
    state.current.manualPause = globalAudio.paused;

    const suspendSignal = () => {
      if (state.current.isPlaying) {
        globalAudio.pause();
        setIsPlaying(false);
        console.log("Protocol_Delta: Signal_Suspended_In_Background");
      }
    };

    const resumeSignal = () => {
      // ONLY resume if it was playing before the user left AND they didn't manually mute it
      if (state.current.isPlaying && !state.current.manualPause) {
        globalAudio.play().then(() => setIsPlaying(true)).catch(() => setIsBlocked(true));
        console.log("Protocol_Delta: Signal_Restored_To_Foreground");
      }
    };

    const handleVisibility = () => {
      if (document.hidden) suspendSignal();
      else resumeSignal();
    };

    // Use blur/focus to handle window switching (Alt+Tab)
    const handleBlur = () => suspendSignal();
    const handleFocus = () => resumeSignal();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      // NOTE: We do NOT call globalAudio.pause() here. 
      // This allows the sound to keep flowing during page navigation.
    };
  }, []);

  const togglePlayback = () => {
    if (!globalAudio) return;

    if (isPlaying) {
      globalAudio.pause();
      setIsPlaying(false);
      state.current.isPlaying = false;
      state.current.manualPause = true; // Mark that the user chose to stop it
      setIsBlocked(false);
    } else {
      globalAudio.play()
        .then(() => {
          setIsPlaying(true);
          state.current.isPlaying = true;
          state.current.manualPause = false; // User chose to start it
          setIsBlocked(false);
        })
        .catch(() => {
          setIsBlocked(true);
        });
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 border-x border-white/5 h-full">
      <button 
        onClick={togglePlayback}
        className="group flex items-center gap-3 transition-all outline-none"
      >
        <div className="flex gap-[2px] items-end h-3 w-4">
          {[1, 2, 3].map((bar) => (
            <motion.div
              key={bar}
              animate={{
                height: isPlaying ? [4, 12, 8, 12, 4] : (isBlocked ? [2, 4, 2] : 2)
              }}
              transition={{
                repeat: Infinity,
                duration: isPlaying ? (0.5 + (bar * 0.15)) : 1,
                ease: "linear"
              }}
              className={`w-[2px] transition-colors duration-300 ${
                isPlaying ? 'bg-white' : (isBlocked ? 'bg-amber-500/50' : 'bg-white/20')
              }`}
            />
          ))}
        </div>
        
        <span className={`text-[9px] font-mono tracking-[0.3em] uppercase transition-colors hidden sm:block ${
          isBlocked ? 'text-amber-500' : 'text-white/30 group-hover:text-white'
        }`}>
          {isPlaying ? "Signal_Active" : (isBlocked ? "Resume_Handshake" : "Signal_Muted")}
        </span>
      </button>
    </div>
  );
};

export default AudioPortal;