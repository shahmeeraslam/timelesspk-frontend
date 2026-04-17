import API from "../../api"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useShop } from "../context/ShopContext";
import PageTransition from "../components/PageTransition";

// Updated Modular Components
import CollectionHeader from "../components/collection/CollectionHeader";
import CollectionFilters from "../components/collection/CollectionFilters";
import ProductCard from "../components/collection/ProductCard";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  
  const { search } = useShop(); // Search state is managed via ShopContext and triggered in Filters
  const { addToCart } = useCart();

  // --- ARCHIVE SYNCHRONIZATION (Fetch) ---
 useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Use the API instance and relative path
        const { data } = await API.get("/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Critical_Database_Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  // --- DATA PROCESSING (Filter & Sort) ---
  const filteredItems = products
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-[var(--brand-alt)] text-[var(--brand-main)] pt-24 px-6 md:px-12">
        
        {/* Header: Displays total available count for psychological impact */}
        <CollectionHeader 
          filter={filter} 
          totalItems={products.length} 
        />
        
        {/* Filters: Derives categories from database and manages search/sort UI */}
        <CollectionFilters 
          products={products}
          filter={filter} 
          setFilter={setFilter} 
          setSortOrder={setSortOrder} 
          activeCount={filteredItems.length}
        />

        <div className="max-w-7xl mx-auto pb-32">
          {loading ? (
            <div className="py-60 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-[1px] bg-[var(--brand-main)] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.8em] animate-pulse opacity-50">
                Synchronizing_Archive...
              </span>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-10 gap-y-24 md:gap-y-32">
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
                <div className="py-40 text-center border border-dashed border-white/10">
                  <p className="font-serif italic text-[var(--brand-muted)] text-xl opacity-40">
                    Search_Zero: No matching units detected in the repository.
                  </p>
                  <button 
                    onClick={() => {setFilter("All"); window.location.reload();}}
                    className="mt-6 text-[8px] font-mono uppercase tracking-[0.4em] border-b border-[var(--brand-main)] pb-1"
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