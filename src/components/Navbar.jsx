import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext"; 
import { 
  RiUserFill, 
  RiShoppingBagLine, 
  RiMenuLine, 
  RiCloseLine,
  RiArrowRightUpLine,
  RiCircleFill
} from '@remixicon/react';
import { assets } from "../assets/assets";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- AUDIO STATE & LOGIC ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); // Track browser block
  const audioRef = useRef(new Audio("/audio/Audio.mp3"));

  const { cart, user, handleLogout } = useCart(); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    
    // Configure initial audio settings
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.15; 

    return () => {
      window.removeEventListener("scroll", handleScroll);
      audio.pause();
    };
  }, []);

  const toggleAudio = () => {
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setIsBlocked(false);
    } else {
      // Attempting Playback Handshake
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsBlocked(false);
          console.log("Archive_Signal: Streaming_Established");
        })
        .catch((err) => {
          // Catches 'Interaction Required' error
          console.warn("Archive_Signal: Handshake_Required", err);
          setIsBlocked(true);
        });
    }
  };

  const onLogout = () => {
    setProfileOpen(false);
    handleLogout(); 
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Animation Variants
  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    closed: { x: "100%", transition: { type: "spring", stiffness: 100, damping: 20 } }
  };
 
  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <>
      <nav className={`fixed top-0 z-[100] w-full h-24 transition-all duration-700 flex items-center justify-between px-6 md:px-12 
        ${scrolled 
          ? 'bg-[var(--brand-alt)]/80 backdrop-blur-xl border-b border-[var(--brand-border)] h-20' 
          : 'bg-transparent h-24'}`}>
        
        {/* LOGO AREA */}
        <div className="flex-1">
          <Link to="/" className="inline-block">
            <motion.img 
              src={assets.logo} 
              alt="Vanguard Logo" 
              className="w-auto origin-left"
              animate={{ 
                height: scrolled ? "36px" : "32px",
                scale: scrolled ? 1.15 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex gap-12 items-center">
          {['/', '/collection', '/about', '/contact'].map((path) => (
            <NavLink key={path} to={path} className="group relative">
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <p className={`text-[10px] font-mono tracking-[0.4em] uppercase transition-all duration-500
                    ${isActive ? 'text-[var(--brand-main)]' : 'text-[var(--brand-muted)] group-hover:text-[var(--brand-main)]'}`}>
                    {path === '/' ? 'Index' : path.substring(1)}
                  </p>
                  {isActive && (
                    <motion.div layoutId="nav-dot" className="absolute -bottom-4">
                       <RiCircleFill size={3} className="text-[var(--brand-main)]" />
                    </motion.div>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </ul>

        {/* ACTIONS */}
        <div className="flex-1 flex items-center justify-end gap-6 md:gap-8">
          
          {/* ENHANCED AUDIO TOGGLE */}
          <button 
            onClick={toggleAudio}
            className="group flex flex-col items-center gap-1.5 min-w-[60px]"
          >
            <div className="flex gap-[2px] items-end h-3">
              {[1, 2, 3].map((bar) => (
                <motion.div
                  key={bar}
                  animate={{
                    height: isPlaying ? [4, 12, 6, 12, 4] : (isBlocked ? [2, 6, 2] : 2)
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isPlaying ? (0.6 + (bar * 0.2)) : 1.5,
                    ease: "easeInOut"
                  }}
                  className={`w-[2px] transition-colors duration-500 ${
                    isPlaying ? 'bg-[var(--brand-main)]' : (isBlocked ? 'bg-amber-500/50' : 'bg-[var(--brand-muted)] opacity-30')
                  }`}
                />
              ))}
            </div>
            <span className={`text-[7px] font-mono tracking-[0.2em] uppercase hidden lg:block transition-colors ${isBlocked ? 'text-amber-500' : 'text-[var(--brand-muted)]'}`}>
              {isPlaying ? "Signal_On" : (isBlocked ? "Retry_Signal" : "Signal_Off")}
            </span>
          </button>

          {/* USER PORTAL */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500
                ${profileOpen ? 'border-[var(--brand-main)] bg-[var(--brand-main)] text-[var(--brand-alt)]' : 'border-[var(--brand-border)] hover:border-[var(--brand-main)] text-[var(--brand-main)]'}`} 
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {user?.img ? (
                <img src={user.img} alt="User" className="w-full h-full object-cover rounded-full" />
              ) : (
                <RiUserFill size={18} className="opacity-80" />
              )}
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-6 bg-[var(--brand-alt)] border border-[var(--brand-border)] p-6 w-64 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] z-[110] backdrop-blur-3xl"
                >
                  <div className="space-y-6">
                    {user ? (
                      <>
                        <div className="pb-4 border-b border-[var(--brand-border)]">
                          <span className="text-[7px] font-mono text-[var(--brand-muted)] uppercase tracking-widest block mb-1 opacity-50">Authorized_Operator</span>
                          <p className="text-[11px] font-serif italic text-[var(--brand-main)] uppercase tracking-widest">{user.name}</p>
                        </div>
                        <div className="flex flex-col gap-4">
                          <Link to='/profile' onClick={() => setProfileOpen(false)} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)] transition-colors">Node_Specs</Link>
                          <Link to="/orders" onClick={() => setProfileOpen(false)} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)] transition-colors">Archive_Logs</Link>
                        </div>
                        <button onClick={onLogout} className="w-full pt-4 border-t border-[var(--brand-border)] text-[8px] font-mono text-red-500 uppercase tracking-[0.4em] text-left hover:brightness-150">
                          Terminate_Session
                        </button>
                      </>
                    ) : (
                      <div className="space-y-5">
                        <Link to="/login" onClick={() => setProfileOpen(false)} className="block py-3 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[9px] font-mono font-bold uppercase tracking-widest text-center hover:brightness-125">Authenticate</Link>
                        <Link to="/register" onClick={() => setProfileOpen(false)} className="block text-[8px] text-center uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">Initialize_New_Node</Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* BAG */}
          <Link to="/cart" className="relative group p-2">
            <RiShoppingBagLine size={22} className="text-[var(--brand-main)] opacity-80 group-hover:opacity-100 transition-opacity" />
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute top-0 right-0 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[7px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_var(--brand-main)]"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          <button className="md:hidden text-[var(--brand-main)] p-2" onClick={() => setMenuOpen(true)}>
            <RiMenuLine size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial="closed" animate="open" exit="closed"
            variants={sidebarVariants}
            className="fixed inset-0 bg-[var(--brand-alt)] z-[300] flex flex-col p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-20">
              <img src={assets.logo} alt="Logo" className="h-6" />
              <button onClick={() => setMenuOpen(false)} className="p-3 border border-[var(--brand-border)] rounded-full text-[var(--brand-main)]">
                <RiCloseLine size={24} />
              </button>
            </div>
            
            <div className="flex flex-col gap-12">
              {['/', '/collection', '/about', '/contact'].map((path, i) => (
                <motion.div key={path} custom={i} variants={linkVariants}>
                  <NavLink to={path} onClick={() => setMenuOpen(false)}
                    className="text-5xl font-serif italic uppercase tracking-tighter text-[var(--brand-main)] block">
                    {path === '/' ? 'Index' : path.substring(1)}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="transition-all duration-500">
        <Outlet />
      </main>
    </>
  );
};

export default Navbar;