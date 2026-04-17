import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const AudioPortal = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // New state for security lockout
  const audioRef = useRef(null);

  useEffect(() => {
    // Ensuring the path points exactly to your public folder asset
    const audioPath = `${window.location.origin}/audio/Audio.mp3`;
    audioRef.current = new Audio(audioPath);
    
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.3;

    console.log("Archival_Audio_Initialized:", audioPath);

    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsBlocked(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsBlocked(false);
          console.log("Signal_Established: Audio_Active");
        })
        .catch(err => {
          console.error("Signal_Blocked: Interaction_Required", err);
          // If browser blocks, update UI to prompt second click
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
                // If blocked, bars slightly jitter to show they are "stuck"
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
          {isPlaying 
            ? "Signal_Active" 
            : (isBlocked ? "Resume_Handshake" : "Signal_Muted")
          }
        </span>
      </button>
    </div>
  );
};

export default AudioPortal;