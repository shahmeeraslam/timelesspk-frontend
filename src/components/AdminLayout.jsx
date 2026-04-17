import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiDashboardLine, RiArchiveDrawerLine, RiShoppingBag3Line, 
  RiGroupLine, RiSettings4Line, RiLogoutBoxRLine, RiMenu2Line,
  RiMoonLine, RiSunLine, RiCloseLine,
  RiUserLine
} from '@remixicon/react';

import { useStore } from '../context/StoreContext';

const AdminLayout = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null); // State to hold logged in user
  
  const location = useLocation();
  const navigate = useNavigate();
  const { adminImg } = useStore();

  useEffect(() => {
    // 1. Get user data from localStorage on load
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      // Safety: If no user info, kick back to login
      navigate('/login');
    }

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, navigate]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: RiDashboardLine },
    { name: 'Inventory', path: '/admin/inventory', icon: RiArchiveDrawerLine },
    { name: 'Orders', path: '/admin/orders', icon: RiShoppingBag3Line },
    { name: 'Customers', path: '/admin/customers', icon: RiGroupLine },
    { name: 'Settings', path: '/admin/settings', icon: RiSettings4Line },
  ];

  const pageVariants = {
    initial: { opacity: 0, scale: 0.99 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
    exit: { opacity: 0, scale: 1.01, transition: { duration: 0.3 } }
  };

  return (
    <div style={{ backgroundColor: 'var(--brand-alt)', color: 'var(--brand-main)' }} className="min-h-screen flex transition-colors duration-500 overflow-x-hidden">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileMenu && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenu(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside 
        style={{ backgroundColor: 'var(--brand-alt)', borderColor: 'var(--brand-border)' }} 
        className={`fixed inset-y-0 left-0 z-[70] border-r w-[260px] transition-transform duration-300 lg:translate-x-0 ${isMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-12">
          <Link to='/'>
            <h2 className="text-lg font-serif italic tracking-tighter">
              B_C <span className="text-[10px] uppercase tracking-[0.3em] not-italic ml-2 opacity-50 text-[var(--brand-muted)]">Control</span>
            </h2>
          </Link>
            <button className="lg:hidden" onClick={() => setIsMobileMenu(false)}>
              <RiCloseLine size={20} />
            </button>
          </div>

          <nav className="flex-grow space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} to={item.path} onClick={() => setIsMobileMenu(false)}
                  style={{ 
                    color: isActive ? 'var(--brand-main)' : 'var(--brand-muted)',
                    backgroundColor: isActive ? 'var(--brand-soft-bg)' : 'transparent'
                  }}
                  className={`flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-all group hover:text-[var(--brand-main)] ${isActive ? 'font-bold border-l-2 border-[var(--brand-main)]' : ''}`}
                >
                  <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <button 
            onClick={handleLogout}
            style={{ color: 'var(--brand-muted)' }} 
            className="flex items-center gap-4 px-4 py-3 text-[10px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors mt-auto"
          >
            <RiLogoutBoxRLine size={18} /> Exit Portal
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-[260px] flex flex-col min-w-0">
        <header style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-alt)' }} className="h-20 border-b flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-opacity-80">
          <button onClick={() => setIsMobileMenu(true)} className="lg:hidden text-[var(--brand-main)]">
            <RiMenu2Line size={24} />
          </button>
          
          <div className="flex items-center gap-6 ml-auto">
            <motion.button 
              whileTap={{ scale: 0.9 }} onClick={toggleTheme}
              className="p-2 border border-[var(--brand-border)] rounded-full text-[var(--brand-main)] hover:bg-[var(--brand-soft-bg)] transition-colors"
            >
              {theme === 'light' ? <RiMoonLine size={18} /> : <RiSunLine size={18} />}
            </motion.button>

            {/* DYNAMIC USER INFO */}
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-[var(--brand-main)]">
                {user?.name || "Admin User"}
              </p>
              <p className="text-[9px] uppercase tracking-widest text-[var(--brand-muted)]">
                {user?.role === 'admin' ? "Master Admin" : "Staff"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[var(--brand-border)] overflow-hidden bg-[var(--brand-soft-bg)] flex items-center justify-center">
                {/* Priority: Google Image -> Store Image -> Default Icon */}
                {user?.img ? (
                  <img src={user.img} alt="Profile" className="w-full h-full object-cover" />
                ) : adminImg ? (
                  <img src={adminImg} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <RiUserLine size={18} className="opacity-50" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* PAGE TRANSITION CONTAINER */}
        <div className="p-6 lg:p-10 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit"
              style={{ willChange: "opacity, transform" }}
            >
              <Outlet /> 
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;