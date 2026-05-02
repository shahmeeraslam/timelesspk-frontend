import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine } from "@remixicon/react";

const MobileNav = ({ menuOpen, setMenuOpen }) => {
  const navLinks = [
    { path: '/', label: 'Index' },
    { path: '/collection', label: 'Collection' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  const sidebarVariants = {
    open: { 
      x: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    },
    closed: { 
      x: "100%", 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div 
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className="fixed inset-0 z-[200] bg-[var(--brand-alt)]/95 backdrop-blur-xl p-8 flex flex-col"
        >
          {/* Close Button */}
          <div className="flex justify-end mb-16">
            <button 
              onClick={() => setMenuOpen(false)} 
              className="text-[var(--brand-main)] p-2 hover:rotate-90 transition-transform duration-300"
            >
              <RiCloseLine size={32} />
            </button>
          </div>
          
          {/* Links */}
          <div className="flex flex-col gap-10 items-center">
            {navLinks.map(({ path, label }, i) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <NavLink 
                  to={path} 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `
                    text-3xl font-mono uppercase tracking-[0.3em] transition-colors
                    ${isActive ? 'text-[var(--brand-main)]' : 'text-[var(--brand-muted)] hover:text-[var(--brand-main)]'}
                  `}
                >
                  {label}
                </NavLink>
              </motion.div>
            ))}
          </div>

          {/* Bottom Branding/Decoration */}
          <div className="mt-auto text-center">
            <p className="text-[8px] font-mono text-[var(--brand-muted)] uppercase tracking-[0.5em] opacity-30">
              Vanguard_System_v3.0
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileNav;