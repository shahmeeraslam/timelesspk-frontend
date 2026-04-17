import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

// Components
import ProductBuilderSlot from "../components/productpage/ProductBuilderSlot";
import ProductInfo from "../components/productpage/ProductInfo";
import ReviewForm from "../components/productpage/ReviewForm";
import CompleteTheLook from "../components/productpage/CompleteTheLook";

import { RiStarFill, RiHistoryLine, RiCloseLine, RiPlayLine, RiImageLine } from "@remixicon/react";

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [fullscreenImg, setFullscreenImg] = useState(null);

  // Switch between Video (-1) or specific image index (0, 1, 2...)
  const [activeMediaIndex, setActiveMediaIndex] = useState(-1);

  const visibleImages = useMemo(() => {
    if (!product || !product.image) return [];
    return selectedColor 
      ? product.image.filter(img => img.color === selectedColor || img.color === "Neutral")
      : product.image;
  }, [product, selectedColor]);

  const currentPreview = useMemo(() => {
    // If index is -1 or video exists and we haven't picked an image yet, show video
    if (activeMediaIndex === -1 && product?.videoUrl) return { type: 'video', url: product.videoUrl };
    // Otherwise show selected image (fallback to first image if index is out of bounds)
    const img = visibleImages[activeMediaIndex] || visibleImages[0];
    return { type: 'image', url: img?.url };
  }, [activeMediaIndex, visibleImages, product]);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [res, allRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/products/${id}`),
        axios.get(`http://localhost:5000/api/products`)
      ]);
      setProduct(res.data);
      setAllProducts(allRes.data); 

      if (!selectedColor) {
        const hasNeutral = res.data.image?.some(img => img.color === "Neutral");
        setSelectedColor(hasNeutral ? "Neutral" : res.data.colors?.[0] || "");
      }

      const history = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      const currentEntry = { _id: res.data._id, name: res.data.name, img: res.data.img || res.data.image?.[0]?.url };
      const newHistory = [currentEntry, ...history.filter(p => p._id !== res.data._id)].slice(0, 5);
      localStorage.setItem("recently_viewed", JSON.stringify(newHistory));
      setRecentlyViewed(newHistory);
    } catch (err) { console.error("Sync_Failure:", err); } 
    finally { if (!silent) setLoading(false); }
  }, [id, selectedColor]);

  useEffect(() => { 
    fetchData(); 
    window.scrollTo(0, 0); 
    setActiveMediaIndex(-1); // Default to Video on load
  }, [fetchData]);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-[1px] bg-white animate-pulse" />
    </div>
  );

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 px-6 lg:px-12 text-white selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT: MEDIA SECTION */}
          {/* LEFT: MEDIA SECTION */}
          <div className="lg:w-[60%] flex flex-col gap-6">
            
            {/* MAIN PREVIEW SLOT - Height Constrained to Viewport */}
            <div className="relative w-full h-[60vh] lg:h-[75vh] bg-[#050505] border border-white/5 overflow-hidden flex items-center justify-center rounded-sm">
              
              {/* Technical Indicator */}
              <div className="absolute top-6 left-6 z-10 flex items-center gap-3 mix-blend-difference opacity-60">
                <div className={`w-1.5 h-1.5 rounded-full ${currentPreview.type === 'video' ? 'bg-red-600 animate-pulse' : 'bg-white'}`} />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase">
                  {currentPreview.type === 'video' ? "Live_Capture" : "Frame_Isolated"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {currentPreview.type === 'image' ? (
                  <motion.div 
                    key={currentPreview.url} 
                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center cursor-zoom-in p-4 lg:p-8" 
                    onClick={() => setFullscreenImg(currentPreview.url)}
                  >
                    <img 
                      src={currentPreview.url} 
                      className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-700" 
                      alt="Product" 
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="video" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full h-full flex items-center justify-center p-4 lg:p-8"
                  >
                    <video 
                      src={currentPreview.url} 
                      autoPlay loop muted playsInline 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="absolute bottom-4 right-6 opacity-20 pointer-events-none">
                <span className="text-[7px] font-mono uppercase tracking-[0.5em]">Auto_Fit_Active</span>
              </div>
            </div>

            {/* THUMBNAIL TRACK */}
            <div className="flex flex-row gap-3 overflow-x-auto pb-4 no-scrollbar">
              {product.videoUrl && (
                <button 
                  onClick={() => setActiveMediaIndex(-1)}
                  className={`relative flex-shrink-0 w-16 lg:w-20 aspect-[3/4] border transition-all ${activeMediaIndex === -1 ? 'border-white scale-95' : 'border-white/5 opacity-40'}`}
                >
                  <video src={product.videoUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <RiPlayLine size={14} />
                  </div>
                </button>
              )}

              {visibleImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`flex-shrink-0 w-16 lg:w-20 aspect-[3/4] border transition-all ${activeMediaIndex === idx ? 'border-white scale-95' : 'border-white/5 opacity-40'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover grayscale" alt="Thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:w-[40%] lg:sticky lg:top-32 h-fit">
            <ProductInfo 
              product={product}
              selectedSize={selectedSize} setSelectedSize={setSelectedSize}
              selectedColor={selectedColor} setSelectedColor={setSelectedColor}
              onAdd={() => {
                if (!selectedSize) return alert("Archive_Error: Dimensional_Grade_Required");
                addToCart({ ...product, size: selectedSize, color: selectedColor, img: visibleImages[0]?.url || product.img });
              }}
            />

            {/* RECENT SESSIONS */}
            {recentlyViewed.filter(p => p._id !== id).length > 0 && (
              <div className="mt-16 lg:mt-24 pt-10 border-t border-white/5">
                <div className="flex items-center gap-2 mb-6 opacity-20">
                  <RiHistoryLine size={12} />
                  <span className="text-[9px] font-mono tracking-widest uppercase">Previous_Sessions</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {recentlyViewed.filter(p => p._id !== id).map((p) => (
                    <Link key={p._id} to={`/product/${p._id}`} className="w-14 h-18 border border-white/5 hover:border-white transition-all overflow-hidden bg-[#0A0A0A]">
                      <img src={p.img} className="w-full h-full object-cover grayscale" alt="Recent" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <CompleteTheLook allProducts={allProducts} currentProduct={product} />

        {/* VERIFIED IMPRESSIONS */}
        <section className="mt-32 lg:mt-40 border-t border-white/5 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <h2 className="text-4xl lg:text-5xl font-serif italic text-white mb-8">Verified <br /> Impressions</h2>
              <ReviewForm productId={id} onReviewAdded={() => fetchData(true)} />
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {product.reviews?.length > 0 ? (
                product.reviews.map((rev, i) => (
                  <div key={i} className="p-8 lg:p-10 bg-black flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex gap-1">{[...Array(5)].map((_, si) => (<RiStarFill key={si} size={8} className={si < rev.rating ? "text-white" : "text-white/10"} />))}</div>
                      <p className="text-sm font-serif italic text-white/60 leading-relaxed">"{rev.comment}"</p>
                    </div>
                    <p className="mt-8 text-[9px] font-mono uppercase text-white/30 tracking-widest">— {rev.name || "Collector"}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-24 text-center bg-black">
                  <p className="text-[10px] font-mono uppercase tracking-widest opacity-20">No_Data_Point</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* FULLSCREEN PORTAL */}
      <AnimatePresence>
        {fullscreenImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-6 cursor-zoom-out" onClick={() => setFullscreenImg(null)}>
            <button className="absolute top-6 right-6 text-white/30 hover:text-white"><RiCloseLine size={40} /></button>
            <motion.img initial={{ scale: 0.95 }} animate={{ scale: 1 }} src={fullscreenImg} className="max-w-full max-h-full object-contain" alt="Fullscreen" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;