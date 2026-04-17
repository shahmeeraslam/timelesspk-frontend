import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiFocus3Line } from "@remixicon/react";

const CompleteTheLook = ({ allProducts, currentProduct }) => {
  // Memoize the filtering logic to prevent expensive recalculations on every render
  const displayItems = useMemo(() => {
    if (!allProducts || !currentProduct) return [];

    const currentCat = currentProduct.category?.toLowerCase().trim();
    
    // 1. Prioritize "Cross-Category" (e.g., Pants if current is Shirt)
    // This creates a better "Complete the Look" experience
    const crossCategory = allProducts.filter(item => 
      item._id !== currentProduct._id && 
      item.category?.toLowerCase().trim() !== currentCat
    );

    // 2. Secondary: Same Category
    const sameCategory = allProducts.filter(item => 
      item._id !== currentProduct._id && 
      item.category?.toLowerCase().trim() === currentCat
    );

    // Combine them: Take 2 from cross-category and fill the rest with same category
    const combined = [...crossCategory.slice(0, 2), ...sameCategory.slice(0, 4)];
    
    return combined.slice(0, 4);
  }, [allProducts, currentProduct]);

  if (displayItems.length === 0) return null;

  return (
    <section className="mt-32 md:mt-48 border-t border-white/5 pt-20 md:pt-32 pb-40 px-4 md:px-0">
      
      {/* HEADER CLUSTER */}
      <div className="max-w-7xl mx-auto flex flex-col items-center mb-16 md:mb-24 space-y-4 text-center">
        <div className="flex items-center gap-4 opacity-20">
            <div className="w-10 h-[1px] bg-white" />
            <RiFocus3Line size={14} className="animate-spin-slow" />
            <div className="w-10 h-[1px] bg-white" />
        </div>
        <div className="space-y-2">
            <span className="text-[8px] md:text-[10px] font-mono tracking-[0.6em] text-white/30 uppercase">
              Relational_Archive_Nodes
            </span>
            <h3 className="text-4xl md:text-5xl font-serif italic text-white tracking-tighter">
              Complete the Look
            </h3>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-16">
        {displayItems.map((item, idx) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                delay: idx * 0.15, 
                duration: 1.2, 
                ease: [0.19, 1, 0.22, 1] 
            }}
          >
            <Link to={`/product/${item._id}`} className="group block">
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white/[0.02] border border-white/5 transition-colors duration-700 group-hover:border-white/20">
                
                {/* ID Overlay */}
                <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1">
                        UN_{String(item._id).slice(-4).toUpperCase()}
                    </span>
                </div>

                <img 
                  src={item.image?.[0] || item.img} 
                  alt={item.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                />
                
                {/* Subtle bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </div>

              {/* METADATA */}
              <div className="mt-6 text-center space-y-2 px-2">
                <div className="overflow-hidden">
                    <h4 className="text-[10px] md:text-[11px] font-serif italic uppercase tracking-widest text-white/60 group-hover:text-white transition-all duration-500 group-hover:tracking-tight">
                    {item.name}
                    </h4>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[9px] font-mono text-white tracking-[0.2em]">
                    ${item.price.toLocaleString()}.00
                    </p>
                    <div className="w-0 group-hover:w-8 h-[1px] bg-[var(--brand-main)] transition-all duration-700 opacity-40" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>{`
        .animate-spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

export default CompleteTheLook;