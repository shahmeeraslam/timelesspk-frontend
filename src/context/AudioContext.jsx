import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

const AudioContext = createContext();

// Create the actual Audio object ONCE, outside the component tree
const globalAudio = typeof window !== 'undefined' ? new Audio("/audio/Audio.mp3") : null;
if (globalAudio) {
  globalAudio.loop = true;
  globalAudio.volume = 0.15;
}

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const manualPause = useRef(true);

  const toggleAudio = () => {
    if (!globalAudio) return;
    if (isPlaying) {
      globalAudio.pause();
      manualPause.current = true;
      setIsPlaying(false);
    } else {
      globalAudio.play()
        .then(() => {
          manualPause.current = false;
          setIsPlaying(true);
          setIsBlocked(false);
        })
        .catch(() => setIsBlocked(true));
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden || !document.hasFocus()) {
        globalAudio?.pause();
        setIsPlaying(false);
      } else if (!manualPause.current) {
        globalAudio?.play().then(() => setIsPlaying(true)).catch(() => setIsBlocked(true));
      }
    };

    window.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, isBlocked, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);