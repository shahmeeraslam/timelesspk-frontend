import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { useCart } from "../context/CartContext"; 
import PageTransition from "../components/PageTransition";

// Component Architecture
import HUD from "../components/home/HUD";
import Hero from "../components/home/Hero";
import Highlights from "../components/home/Highlights";
import Lookbook from "../components/home/Lookbook";
import Footwear from "../components/home/Footwear"; // Renamed from Horology
import Footer from "../components/home/Footer";

const Home = () => {
  const { addToCart } = useCart(); 
  
  // State Management
  const [products, setProducts] = useState([]); 
  const [activeArchive, setActiveArchive] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Database Synchronization
  useEffect(() => {
    const syncDatabase = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        const data = response.data;
        setProducts(data);
        
        // Default the Lookbook to the first product in the list
        if (data.length > 0) {
          setActiveArchive(data[0]);
        }
      } catch (error) {
        console.error("Database_Sync_Failure:", error);
      } finally {
        setLoading(false);
      }
    };
    syncDatabase();
  }, []);

  // 2. Interaction Listeners
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(window.scrollY / total);
    };
    
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3. Shared Logic
  const onAdd = (e, item) => {
    e.stopPropagation();
    const priceNum = typeof item.price === 'string' 
      ? Number(item.price.replace(/[^0-9.-]+/g,"")) 
      : item.price;
    addToCart({ ...item, price: priceNum });
  };

  if (loading) return null;

  return (
    <PageTransition>
      {/* ROOT WRAPPER: Forced overflow-x-hidden to kill x-axis scrolling */}
      <div className="relative bg-[var(--brand-alt)] text-[var(--brand-main)] overflow-x-hidden max-w-full selection:bg-[var(--brand-main)] selection:text-[var(--brand-alt)]">
        
        <HUD mousePos={mousePos} scrollProgress={scrollProgress} />
        
        <main className="w-full relative z-10">
          <Hero scrollProgress={scrollProgress} />
          
          {/* Filters for 'featured' tag in DB */}
          <Highlights items={products.filter(p => p.featured).slice(0, 3)} />
          
          <Lookbook 
            products={products} 
            activeArchive={activeArchive} 
            setActiveArchive={setActiveArchive} 
            onAdd={onAdd} 
          />
          
          {/* UPDATED: Now passing shoes instead of watches */}
          <Footwear shoes={products.filter(p => p.category === "Shoes")} />
        </main>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;