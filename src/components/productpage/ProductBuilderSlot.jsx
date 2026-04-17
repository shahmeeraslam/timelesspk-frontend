import React from "react";
import { motion } from "framer-motion";

const ProductBuilderSlot = ({ img, idx, setFullscreen }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: idx * 0.1 }}
      className={`relative bg-[#0a0a0a] overflow-hidden group ${idx === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}
    >
      <img 
        src={img} 
        alt="Archive Detail"
        // RL-style crop: focus on garment, hide face
        className="w-full h-full object-cover object-[center_15%] cursor-zoom-in brightness-[0.85] group-hover:brightness-100 transition-all duration-700"
        onClick={() => setFullscreen(img)}
      />
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase">View_Detail_0{idx + 1}</span>
      </div>
    </motion.div>
  );
};

export default ProductBuilderSlot;