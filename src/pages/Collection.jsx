import API from "../../api";
import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import PageTransition from "../components/PageTransition";
import { RiLoader4Line, RiCheckboxBlankCircleLine } from "@remixicon/react";

// Modular Components
import CollectionHeader from "../components/collection/CollectionHeader";
import CollectionFilters from "../components/collection/CollectionFilters";
import ProductCard from "../components/collection/ProductCard";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const { search } = useShop(); 
  const { addToCart } = useCart();

  // --- ARCHIVE SYNCHRONIZATION ---
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/api/products");
        if (isMounted) setProducts(data);
      } catch (error) {
        console.error("Critical_Database_Error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { isMounted = false; }; // Cleanup to prevent memory leaks
  }, []);

  // --- OPTIMIZED DATA PROCESSING ---
  // useMemo ensures we only re-filter when search, filter, sort, or products change
  const filteredItems = useMemo(() => {
    return products
      .filter((item) => {
        const matchesCategory = filter === "All" || item.category === filter;
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "low") return a.price - b.price;
        if (sortOrder === "high") return b.price - a.price;
        if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
  }, [products, filter, search, sortOrder]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--brand-alt)] text-[var(--brand-main)] pt-24 md:pt-32 px-4 md:px-12">
        
        <CollectionHeader 
          filter={filter} 
          totalItems={products.length} 
        />
        
        <CollectionFilters 
          products={products}
          filter={filter} 
          setFilter={setFilter} 
          setSortOrder={setSortOrder} 
          activeCount={filteredItems.length}
        />

        <div className="max-w-7xl mx-auto pb-32 mt-12">
          {loading ? (
            /* --- SKELETON GRID --- */
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-20">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-6 animate-pulse">
                  <div className="aspect-[3/4] bg-white/[0.03] border border-white/5" />
                  <div className="h-4 w-2/3 bg-white/[0.03]" />
                  <div className="h-3 w-1/3 bg-white/[0.03]" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-10 gap-y-20 md:gap-y-32">
                {filteredItems.map((item) => (
                  <ProductCard 
                    key={item._id} 
                    item={item} 
                    addToCart={addToCart} 
                  />
                ))}
              </div>

              {/* Null State */}
              {filteredItems.length === 0 && (
                <div className="py-40 flex flex-col items-center justify-center text-center border border-white/5 bg-white/[0.01]">
                  <RiCheckboxBlankCircleLine className="opacity-10 mb-6" size={48} />
                  <p className="font-serif italic text-xl md:text-2xl opacity-40 max-w-md px-6">
                    Archive_Zero: No matching units detected in this frequency.
                  </p>
                  <button 
                    onClick={() => {setFilter("All"); window.location.reload();}}
                    className="mt-8 text-[9px] font-mono uppercase tracking-[0.5em] border border-white/20 px-8 py-3 hover:bg-[var(--brand-main)] hover:text-[var(--brand-alt)] transition-all"
                  >
                    Reset_System_Parameters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Collection;