import React, { useEffect, useState, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { RiShoppingBagLine, RiMenuLine } from '@remixicon/react';

// Context & Assets
import { useCart } from "../context/CartContext"; 
import { assets } from "../assets/assets";

// Sub-Components
import DesktopNav from "./Nav/DesktopNav";
import AudioToggle from "./Nav/AudioToggle";
import UserPortal from "./Nav/UserPortal";
import MobileNav from "./Nav/MobileNav";

const globalAudio = typeof window !== 'undefined' ? new Audio("/audio/Audio.mp3") : null;
if (globalAudio) {
  globalAudio.loop = true;
  globalAudio.volume = 0.15;
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(globalAudio ? !globalAudio.paused : false);
  const [isBlocked, setIsBlocked] = useState(false); 
  const manualPause = useRef(globalAudio ? globalAudio.paused : true);

  const { cart, user, handleLogout } = useCart(); 
  const isAdmin = user?.role === 'admin';
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    const handleBackground = () => {
      if (document.hidden || !document.hasFocus()) {
        if (!globalAudio.paused) { globalAudio.pause(); setIsPlaying(false); }
      } else {
        if (!manualPause.current && globalAudio.paused) {
          globalAudio.play().then(() => setIsPlaying(true)).catch(() => setIsBlocked(true));
        }
      }
    };

    document.addEventListener("visibilitychange", handleBackground);
    window.addEventListener("blur", handleBackground);
    window.addEventListener("focus", handleBackground);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleBackground);
      window.removeEventListener("blur", handleBackground);
      window.removeEventListener("focus", handleBackground);
    };
  }, []);

  const toggleAudio = () => {
    if (!globalAudio) return;
    if (isPlaying) {
      globalAudio.pause(); manualPause.current = true; setIsPlaying(false);
    } else {
      globalAudio.play().then(() => {
        manualPause.current = false; setIsPlaying(true); setIsBlocked(false);
      }).catch(() => setIsBlocked(true));
    }
  };

  return (
    <>
      <nav className={`fixed top-0 z-[100] w-full transition-all duration-700 flex items-center justify-between px-6 md:px-12 
        ${scrolled ? 'bg-[var(--brand-alt)]/90 backdrop-blur-2xl border-b border-[var(--brand-border)] h-20' : 'bg-transparent h-24'}`}>
        
        <div className="flex-1">
          <Link to="/" className="inline-block">
            <motion.img 
              src={assets.logo} 
              alt="Logo"
              className="w-auto origin-left"
              animate={{ height: scrolled ? "30px" : "34px", scale: scrolled ? 1.05 : 1 }}
            />
          </Link>
        </div>

        <DesktopNav isAdmin={isAdmin} />

        <div className="flex-1 flex items-center justify-end gap-5 md:gap-8">
          <AudioToggle isPlaying={isPlaying} isBlocked={isBlocked} toggleAudio={toggleAudio} />
          
          <UserPortal 
            user={user} 
            isAdmin={isAdmin} 
            profileOpen={profileOpen} 
            setProfileOpen={setProfileOpen} 
            onLogout={() => { setProfileOpen(false); handleLogout(); }} 
          />

          {!isAdmin && (
            <Link to="/cart" className="relative group p-2">
              <RiShoppingBagLine size={20} className="text-[var(--brand-main)] opacity-70 group-hover:opacity-100 transition-all" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[7px] w-3.5 h-3.5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          <button className="md:hidden text-[var(--brand-main)]" onClick={() => setMenuOpen(true)}>
            <RiMenuLine size={24} />
          </button>
        </div>
      </nav>
        
       <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> 

      <main className="transition-all duration-500">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;