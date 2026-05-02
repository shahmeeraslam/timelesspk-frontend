import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { RiCircleFill } from "@remixicon/react";

const DesktopNav = ({ isAdmin }) => {
  const navLinks = [
    { path: '/', label: 'Index' },
    { path: '/collection', label: 'Collection' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <ul className="hidden md:flex gap-10 items-center">
      {navLinks.map(({ path, label }) => (
        <NavLink key={path} to={path} className="group relative">
          {({ isActive }) => (
            <div className="flex flex-col items-center">
              <p className={`text-[9px] font-mono tracking-[0.4em] uppercase transition-all duration-500
                ${isActive ? 'text-[var(--brand-main)]' : 'text-[var(--brand-muted)] group-hover:text-[var(--brand-main)]'}`}>
                {label}
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
      
      {isAdmin && (
        <NavLink to="/admin/dashboard" className="px-4 py-1 border border-red-500/20 hover:border-red-500 transition-colors">
          <span className="text-[8px] font-mono tracking-[0.4em] uppercase text-red-500">Terminal_Access</span>
        </NavLink>
      )}
    </ul>
  );
};

export default DesktopNav;