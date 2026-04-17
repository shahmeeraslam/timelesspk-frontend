import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CompleteTheLook = ({ allProducts, currentProduct }) => {
  if (!allProducts || !currentProduct || !Array.isArray(allProducts)) return null;

  // IMPROVED FILTER: Case-insensitive category matching
  const recommendations = allProducts.filter((item) => {
    const isSameCategory = 
      item.category?.toLowerCase().trim() === currentProduct.category?.toLowerCase().trim();
    const isNotCurrentProduct = item._id !== currentProduct._id;
    
    return isSameCategory && isNotCurrentProduct;
  }).slice(0, 4);

  // If no items in same category, show 4 most recent items from any category as a fallback
  const fallbackItems = allProducts
    .filter(item => item._id !== currentProduct._id)
    .slice(0, 4);

  const displayItems = recommendations.length > 0 ? recommendations : fallbackItems;

  if (displayItems.length === 0) return null;

  return (
    <section className="mt-40 border-t border-white/5 pt-24 pb-32">
      <div className="flex flex-col items-center mb-16 space-y-2 text-center">
        <span className="text-[10px] font-mono tracking-[0.5em] text-white/30 uppercase">
          {recommendations.length > 0 ? "Archive_Coordination" : "Editorial_Selection"}
        </span>
        <h3 className="text-3xl font-serif italic text-white tracking-tight">
          {recommendations.length > 0 ? "Complete the Look" : "You May Also Like"}
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {displayItems.map((item, idx) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.8 }}
          >
            <Link to={`/product/${item._id}`} className="group block space-y-5">
              <div className="aspect-[3/4] overflow-hidden bg-[#0a0a0a] relative border border-white/5">
                <img 
                  src={item.image?.[0] || item.img} 
                  alt={item.name}
                  className="w-full h-full object-cover object-[center_15%] grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1s] ease-out"
                />
              </div>

              <div className="text-center space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 group-hover:text-white transition-colors">
                  {item.name}
                </h4>
                <p className="text-[10px] font-mono text-white/30 italic">
                  ${item.price.toLocaleString()}.00
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CompleteTheLook;