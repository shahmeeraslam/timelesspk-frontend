import API from "../../api";
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import PageTransition from "../components/PageTransition";

// Component Architecture
import HUD from "../components/home/HUD";
import Hero from "../components/home/Hero";
import Highlights from "../components/home/Highlights";
import Lookbook from "../components/home/Lookbook";
import Footwear from "../components/home/Footwear";
import Footer from "../components/home/Footer";

const Home = () => {
  const { addToCart } = useCart();

  // State Management
  const [products, setProducts] = useState([]);
  const [cmsData, setCmsData] = useState(null);
  const [activeArchive, setActiveArchive] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);

  // 1. Dual Synchronization
  useEffect(() => {
    const syncSystemData = async () => {
      try {
        setLoading(true);

        const [productRes, cmsRes] = await Promise.all([
          API.get("/api/products"),
          API.get("/api/public/home-config"),
        ]);

        setProducts(productRes.data);
        if (productRes.data.length > 0) {
          setActiveArchive(productRes.data[0]);
        }

        setCmsData(cmsRes.data || {});
      } catch (error) {
        console.error("System_Sync_Failure:", error);
      } finally {
        setLoading(false);
      }
    };
    syncSystemData();
  }, []);

  // 2. Interaction Listeners
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(window.scrollY / total);
    };

    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const onAdd = (e, item) => {
    e.stopPropagation();
    const priceNum =
      typeof item.price === "string"
        ? Number(item.price.replace(/[^0-9.-]+/g, ""))
        : item.price;
    addToCart({ ...item, price: priceNum });
  };

  if (loading) return null;

  // --- CURATION LOGIC ENGINE ---

  // A. Highlights (Bento Grid)
  const featuredItems = (cmsData?.featuredProducts || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean);
  const displayHighlights = featuredItems.length > 0 ? featuredItems : products.slice(0, 3);

  // B. Lookbook (Gallery)
  const lookbookItems = (cmsData?.lookbookProducts || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean);
  const displayLookbook = lookbookItems.length > 0 ? lookbookItems : products.slice(0, 6);

  // C. Footwear (Architecture Section)
  const footwearItems = (cmsData?.footwearProducts || [])
    .map((id) => products.find((p) => p._id === id))
    .filter(Boolean);
  
  // Footwear Fallback: If no curation, filter by category "Shoes"
  const displayFootwear = footwearItems.length > 0 
    ? footwearItems 
    : products.filter(p => p.category?.toLowerCase() === "shoes" || p.category?.toLowerCase() === "footwear").slice(0, 3);

  return (
    <PageTransition>
      <div className="relative bg-[var(--brand-alt)] text-[var(--brand-main)] overflow-x-hidden max-w-full selection:bg-[var(--brand-main)] selection:text-[var(--brand-alt)]">
        <HUD
          mousePos={mousePos}
          scrollProgress={scrollProgress}
          announcement={cmsData?.announcement}
        />

        <main className="w-full relative z-10">
          <Hero scrollProgress={scrollProgress} data={cmsData} />

          <Highlights 
            cmsData={cmsData} 
            items={displayHighlights} 
          />

          <Lookbook
            cmsData={cmsData}
            products={displayLookbook}
            activeArchive={activeArchive || displayLookbook[0]}
            setActiveArchive={setActiveArchive}
            onAdd={onAdd}
          />

          <Footwear 
            cmsData={cmsData} 
            shoes={displayFootwear} 
          />
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Home;