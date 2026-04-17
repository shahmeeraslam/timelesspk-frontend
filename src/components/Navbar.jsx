import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext"; 
import { 
  RiUserFill, 
  RiShoppingBagLine, 
  RiMenuLine, 
  RiCloseLine,
  RiCircleFill,
  RiShieldUserLine,
  RiDashboardLine,
  RiListSettingsLine
} from '@remixicon/react';
import { assets } from "../assets/assets";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- AUDIO STATE & LOGIC ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false); 
  const audioRef = useRef(new Audio("/audio/Audio.mp3"));

  const { cart, user, handleLogout } = useCart(); 
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    
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
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setIsBlocked(false);
        })
        .catch(() => setIsBlocked(true));
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
      <nav className={`fixed top-0 z-[100] w-full transition-all duration-700 flex items-center justify-between px-6 md:px-12 
        ${scrolled 
          ? 'bg-[var(--brand-alt)]/90 backdrop-blur-2xl border-b border-[var(--brand-border)] h-20' 
          : 'bg-transparent h-24'}`}>
        
        {/* LOGO AREA */}
        <div className="flex-1">
          <Link to="/" className="inline-block">
            <motion.img 
              src={assets.logo} 
              alt="Vanguard Logo" 
              className="w-auto origin-left"
              animate={{ 
                height: scrolled ? "30px" : "34px",
                scale: scrolled ? 1.05 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </Link>
        </div>

        {/* DESKTOP NAV */}
        <ul className="hidden md:flex gap-10 items-center">
          {['/', '/collection', '/about', '/contact'].map((path) => (
            <NavLink key={path} to={path} className="group relative">
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  <p className={`text-[9px] font-mono tracking-[0.4em] uppercase transition-all duration-500
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
          
          {/* ADMIN TERMINAL LINK */}
          {isAdmin && (
            <NavLink to="/admin/dashboard" className="px-4 py-1 border border-red-500/20 hover:border-red-500 transition-colors">
              <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-red-500">Terminal_Access</span>
            </NavLink>
          )}
        </ul>

        {/* ACTIONS */}
        <div className="flex-1 flex items-center justify-end gap-5 md:gap-8">
          
          {/* AUDIO TOGGLE */}
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
          </button>

          {/* PORTAL GATEWAY */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-500 overflow-hidden
                ${profileOpen ? 'border-[var(--brand-main)] bg-[var(--brand-main)] text-[var(--brand-alt)]' : 'border-[var(--brand-border)] text-[var(--brand-main)]'}`} 
              onClick={() => setProfileOpen(!profileOpen)}
            >
              {user?.img ? (
                <img src={user.img} alt="User" className="w-full h-full object-cover" />
              ) : (
                isAdmin ? <RiShieldUserLine size={16} /> : <RiUserFill size={16} />
              )}
              {isAdmin && <div className="absolute top-0 right-0 w-2 h-2 bg-red-600 border border-black rounded-full" />}
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-5 bg-[var(--brand-alt)] border border-[var(--brand-border)] p-5 w-60 shadow-2xl z-[110] backdrop-blur-3xl"
                >
                  <div className="space-y-5">
                    {user ? (
                      <>
                        <div className="pb-3 border-b border-[var(--brand-border)]">
                          <span className="text-[7px] font-mono text-[var(--brand-muted)] uppercase tracking-widest block mb-1 opacity-50">
                            {isAdmin ? "System_Director" : "Authorized_User"}
                          </span>
                          <p className="text-[10px] font-serif italic text-[var(--brand-main)]">{user.name}</p>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          {isAdmin ? (
                            <>
                              <Link to='/admin/dashboard' onClick={() => setProfileOpen(false)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-red-500 hover:brightness-125">
                                <RiDashboardLine size={12}/> Root_Dashboard
                              </Link>
                              <Link to='/admin/inventory' onClick={() => setProfileOpen(false)} className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">
                                <RiListSettingsLine size={12}/> Inventory_Ctrl
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link to='/profile' onClick={() => setProfileOpen(false)} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">User_Node</Link>
                              <Link to="/orders" onClick={() => setProfileOpen(false)} className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)] hover:text-[var(--brand-main)]">Archive_Logs</Link>
                            </>
                          )}
                        </div>
                        
                        <button onClick={onLogout} className="w-full pt-4 border-t border-[var(--brand-border)] text-[8px] font-mono text-red-500 uppercase tracking-widest text-left hover:brightness-150">
                          Terminate_Session
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <Link to="/login" onClick={() => setProfileOpen(false)} className="block py-2 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[9px] font-mono text-center tracking-widest">Authenticate</Link>
                        <Link to="/register" onClick={() => setProfileOpen(false)} className="block text-[8px] text-center uppercase tracking-widest text-[var(--brand-muted)]">New_Node</Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SHOPPING BAG (Hidden for Admin) */}
          {!isAdmin && (
            <Link to="/cart" className="relative group p-2">
              <RiShoppingBagLine size={20} className="text-[var(--brand-main)] opacity-70 group-hover:opacity-100 transition-all" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-[var(--brand-main)] text-[var(--brand-alt)] text-[7px] w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]">
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

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial="closed" animate="open" exit="closed" variants={sidebarVariants}
            className="fixed inset-0 bg-[var(--brand-alt)] z-[300] flex flex-col p-8 overflow-hidden"
          >
            <div className="flex justify-between items-center mb-16">
              <img src={assets.logo} alt="Logo" className="h-5" />
              <button onClick={() => setMenuOpen(false)} className="p-2 border border-[var(--brand-border)] rounded-full text-[var(--brand-main)]">
                <RiCloseLine size={20} />
              </button>
            </div>
            
            <div className="flex flex-col gap-8">
              {['/', '/collection', '/about', '/contact'].map((path, i) => (
                <motion.div key={path} custom={i} variants={linkVariants}>
                  <Link to={path} onClick={() => setMenuOpen(false)} className="text-4xl font-serif italic text-[var(--brand-main)] uppercase tracking-tighter">
                    {path === '/' ? 'Index' : path.substring(1)}
                  </Link>
                </motion.div>
              ))}
              {isAdmin && (
                <motion.div custom={4} variants={linkVariants} className="pt-8 border-t border-white/5">
                  <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-4xl font-serif italic text-red-600 uppercase">
                    Terminal
                  </Link>
                </motion.div>
              )}
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