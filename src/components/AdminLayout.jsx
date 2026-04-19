import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiDashboardLine, RiArchiveDrawerLine, RiShoppingBag3Line, 
  RiGroupLine, RiSettings4Line, RiLogoutBoxRLine, RiMenu2Line,
  RiCloseLine, RiUserLine, RiVerifiedBadgeLine, RiTerminalBoxLine
} from '@remixicon/react';

const AdminLayout = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const syncUserData = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    syncUserData();
    window.addEventListener('storage', syncUserData);
    return () => window.removeEventListener('storage', syncUserData);
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // ADDED: "Interface" node to handle CMS/Home Page updates
  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: RiDashboardLine },
    { name: 'Inventory', path: '/admin/inventory', icon: RiArchiveDrawerLine },
    { name: 'Interface', path: '/admin/interface', icon: RiTerminalBoxLine }, // The CMS Node
    { name: 'Orders', path: '/admin/orders', icon: RiShoppingBag3Line },
    { name: 'Customers', path: '/admin/customers', icon: RiGroupLine },
    { name: 'Settings', path: '/admin/settings', icon: RiSettings4Line },
  ];

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <div 
      style={{ backgroundColor: 'var(--brand-alt)', color: 'var(--brand-main)' }} 
      className="min-h-screen flex overflow-x-hidden font-sans selection:bg-[var(--brand-main)] selection:text-[var(--brand-alt)]"
    >
      
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
        className={`fixed inset-y-0 left-0 z-[70] border-r w-[280px] transition-transform duration-500 lg:translate-x-0 ${isMobileMenu ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-16">
            <Link to='/' className="group">
              <h2 className="text-xl font-black italic tracking-tighter uppercase">
                B_C <span style={{ color: 'var(--brand-accent)' }} className="text-[10px] uppercase tracking-[0.4em] not-italic ml-2 opacity-70">Control</span>
              </h2>
            </Link>
            <button className="lg:hidden p-2 text-[var(--brand-muted)]" onClick={() => setIsMobileMenu(false)}>
              <RiCloseLine size={24} />
            </button>
          </div>

          <nav className="flex-grow space-y-2">
            <p className="text-[9px] font-mono uppercase tracking-[0.3em] mb-6 opacity-30">Navigation_Nodes</p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.name} to={item.path} onClick={() => setIsMobileMenu(false)}
                  style={{ 
                    color: isActive ? 'var(--brand-alt)' : 'var(--brand-muted)',
                    backgroundColor: isActive ? 'var(--brand-main)' : 'transparent'
                  }}
                  className={`flex items-center gap-4 px-5 py-4 text-[10px] uppercase tracking-[0.2em] transition-all group relative ${isActive ? 'font-black' : 'hover:bg-white/5 hover:text-[var(--brand-main)]'}`}
                >
                  <item.icon size={18} className={`${isActive ? 'scale-110' : 'opacity-40 group-hover:opacity-100'} transition-all`} />
                  {item.name}
                  {isActive && <div className="absolute right-0 w-1 h-full bg-[var(--brand-accent)]" />}
                </Link>
              );
            })}
          </nav>

          {/* SIDEBAR FOOTER */}
          <div className="mt-auto pt-8 border-t" style={{ borderColor: 'var(--brand-border)' }}>
            <button 
              onClick={handleLogout}
              style={{ color: 'var(--brand-muted)' }} 
              className="flex items-center gap-4 px-2 py-3 text-[10px] uppercase tracking-[0.2em] hover:text-red-500 transition-colors w-full group"
            >
              <RiLogoutBoxRLine size={18} className="group-hover:rotate-12 transition-transform" /> Exit_Protocol
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-[280px] flex flex-col min-w-0">
        <header 
          style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-alt)' }} 
          className="h-24 border-b flex items-center justify-between px-8 sticky top-0 z-40 bg-opacity-95 backdrop-blur-xl"
        >
          <button onClick={() => setIsMobileMenu(true)} className="lg:hidden p-2" style={{ color: 'var(--brand-main)' }}>
            <RiMenu2Line size={24} />
          </button>
          
          <div className="flex items-center gap-6 ml-auto">
            {/* STATUS INDICATOR */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 border rounded-full" style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-soft-bg)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--brand-accent)' }}></span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest opacity-60">System_Online</span>
            </div>

            <div className="h-10 w-[1px] mx-2 hidden sm:block" style={{ backgroundColor: 'var(--brand-border)' }}></div>

            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-2">
                <p className="text-xs font-black uppercase tracking-tight" style={{ color: 'var(--brand-main)' }}>
                  {user?.name || "Accessing..."}
                </p>
                {user?.isVerified && <RiVerifiedBadgeLine size={14} className="text-[var(--brand-accent)]" />}
              </div>
              <p className="text-[9px] font-mono uppercase tracking-widest opacity-40">
                {user?.role || "Auth_Level_0"}
              </p>
            </div>

            <div className="relative group">
              <div 
                className="w-12 h-12 border-2 p-0.5 transition-transform group-hover:rotate-6" 
                style={{ borderColor: 'var(--brand-border)', backgroundColor: 'var(--brand-alt)' }}
              >
                <div className="w-full h-full overflow-hidden bg-[var(--brand-soft-bg)] flex items-center justify-center">
                  {user?.img ? (
                    <img src={user.img} alt="Admin" className="w-full h-full object-cover" />
                  ) : (
                    <RiUserLine size={20} className="opacity-20" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <div className="p-8 lg:p-12 w-full max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit"
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