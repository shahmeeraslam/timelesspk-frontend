import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const AudioPortal = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const audioRef = useRef(null);
  
  // Use a ref to track play state internally for the event listener
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const audioPath = `${window.location.origin}/audio/Audio.mp3`;
    audioRef.current = new Audio(audioPath);
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.3;

    const handleVisibilityChange = () => {
      // Logic: If the tab is hidden AND the audio was playing...
      if (document.hidden) {
        if (isPlayingRef.current) {
          audio.pause();
          console.log("Archive_Protocol: Signal_Suspended_In_Background");
        }
      } else {
        // Logic: If the tab becomes visible AND it was playing before we left...
        if (isPlayingRef.current) {
          audio.play().catch(() => {
            setIsBlocked(true); // Handle browser blocking auto-resume
          });
          console.log("Archive_Protocol: Signal_Restored");
        }
      }
    };

    // Use 'visibilitychange' on the document level
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false; // Update the ref
      setIsBlocked(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          isPlayingRef.current = true; // Update the ref
          setIsBlocked(false);
        })
        .catch(err => {
          console.error("Auth_Required: Interaction_Missing", err);
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