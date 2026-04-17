import API from "../../api"
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

// Components
import ProductInfo from "../components/productpage/ProductInfo";
import ReviewForm from "../components/productpage/ReviewForm";
import CompleteTheLook from "../components/productpage/CompleteTheLook";

import { RiStarFill, RiHistoryLine, RiCloseLine, RiPlayLine, RiImageLine, RiExpandDiagonalLine } from "@remixicon/react";

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
  const [activeMediaIndex, setActiveMediaIndex] = useState(-1); // -1 = Video

  // --- OPTIMIZED IMAGE PIPELINE ---
  const visibleImages = useMemo(() => {
    if (!product?.image) return [];
    // Only show images matching selected color. If none match, fallback to all images.
    const filtered = product.image.filter(img => img.color === selectedColor);
    return filtered.length > 0 ? filtered : product.image;
  }, [product, selectedColor]);

  // Sync media index when color changes (reset to video or first image)
  useEffect(() => {
    setActiveMediaIndex(product?.videoUrl ? -1 : 0);
  }, [selectedColor, product?.videoUrl]);

  const currentPreview = useMemo(() => {
    if (activeMediaIndex === -1 && product?.videoUrl) return { type: 'video', url: product.videoUrl };
    const img = visibleImages[activeMediaIndex] || visibleImages[0];
    return { type: 'image', url: img?.url };
  }, [activeMediaIndex, visibleImages, product]);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [res, allRes] = await Promise.all([
        API.get(`/api/products/${id}`),
        API.get(`/api/products`)
      ]);

      setProduct(res.data);
      setAllProducts(allRes.data); 

      if (!selectedColor && res.data.colors?.length > 0) {
        setSelectedColor(res.data.colors[0]);
      }

      // Session History Logic
      const history = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      const currentEntry = { 
        _id: res.data._id, 
        name: res.data.name, 
        img: res.data.image?.[0]?.url || res.data.img 
      };
      const newHistory = [currentEntry, ...history.filter(p => p._id !== res.data._id)].slice(0, 6);
      localStorage.setItem("recently_viewed", JSON.stringify(newHistory));
      setRecentlyViewed(newHistory);
    } catch (err) { 
      console.error("Archive_Sync_Error:", err); 
    } finally { 
      if (!silent) setLoading(false); 
    }
  }, [id, selectedColor]);

  useEffect(() => { 
    fetchData(); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [id]);

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-[1px] bg-[var(--brand-main)] animate-[loading_1.5s_infinite]" />
        <span className="text-[7px] font-mono tracking-[0.5em] text-white/20 uppercase">Syncing_Archive</span>
      </div>
      <style>{`@keyframes loading { 0% { transform: scaleX(0); } 50% { transform: scaleX(1); } 100% { transform: scaleX(0); } }`}</style>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-12 text-white selection:bg-white selection:text-black">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-20">
          
          {/* --- MEDIA MODULE --- */}
          <div className="lg:w-[62%] space-y-6">
            <div className="relative group w-full aspect-[4/5] md:aspect-auto md:h-[80vh] bg-black border border-white/5 overflow-hidden flex items-center justify-center">
              
              {/* Technical Status HUD */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-3 mix-blend-difference">
                <div className={`w-1 h-1 rounded-full ${currentPreview.type === 'video' ? 'bg-red-500 animate-pulse' : 'bg-[var(--brand-main)]'}`} />
                <span className="text-[8px] font-mono tracking-[0.4em] uppercase opacity-60">
                  {currentPreview.type === 'video' ? "V_CAPTURE_LIVE" : `F_IMG_0${activeMediaIndex + 1}`}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPreview.url}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full relative"
                >
                  {currentPreview.type === 'image' ? (
                    <div className="w-full h-full flex items-center justify-center p-4 cursor-zoom-in" onClick={() => setFullscreenImg(currentPreview.url)}>
                      <img src={currentPreview.url} className="max-w-full max-h-full object-contain" alt="Technical Frame" />
                      <RiExpandDiagonalLine size={20} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity" />
                    </div>
                  ) : (
                    <video src={currentPreview.url} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* THUMBNAIL TRACK */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {product.videoUrl && (
                <button 
                  onClick={() => setActiveMediaIndex(-1)}
                  className={`relative shrink-0 w-20 aspect-[3/4] border transition-all duration-500 overflow-hidden ${activeMediaIndex === -1 ? 'border-[var(--brand-main)] opacity-100' : 'border-white/5 opacity-30 hover:opacity-60'}`}
                >
                  <video src={product.videoUrl} className="w-full h-full object-cover grayscale" />
                  <RiPlayLine className="absolute inset-0 m-auto text-white" size={16} />
                </button>
              )}
              {visibleImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`shrink-0 w-20 aspect-[3/4] border transition-all duration-500 ${activeMediaIndex === idx ? 'border-[var(--brand-main)] opacity-100' : 'border-white/5 opacity-30 hover:opacity-60'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* --- INFO MODULE --- */}
          <div className="lg:w-[38%] lg:sticky lg:top-32 h-fit space-y-12">
            <ProductInfo 
              product={product}
              selectedSize={selectedSize} setSelectedSize={setSelectedSize}
              selectedColor={selectedColor} setSelectedColor={setSelectedColor}
              onAdd={() => {
                if (!selectedSize) return alert("DIMENSIONAL_GRADE_MISSING");
                addToCart({ 
                  ...product, 
                  size: selectedSize, 
                  color: selectedColor, 
                  img: currentPreview.type === 'image' ? currentPreview.url : visibleImages[0]?.url 
                });
              }}
            />

            {/* HISTORY TRACK */}
            {recentlyViewed.length > 1 && (
              <div className="pt-10 border-t border-white/5">
                <span className="text-[8px] font-mono tracking-[0.5em] text-white/20 uppercase block mb-6">Recent_Syncs</span>
                <div className="flex flex-wrap gap-4">
                  {recentlyViewed.filter(p => p._id !== id).map((p) => (
                    <Link key={p._id} to={`/product/${p._id}`} className="w-12 h-16 border border-white/5 hover:border-[var(--brand-main)]/40 transition-all overflow-hidden bg-black group">
                      <img src={p.img} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" alt="" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- RECOMMENDATIONS --- */}
        <CompleteTheLook allProducts={allProducts} currentProduct={product} />

        {/* --- IMPRESSIONS MODULE --- */}
        <section className="mt-32 md:mt-48 border-t border-white/10 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            <div className="lg:col-span-4 space-y-6">
                <div className="space-y-2">
                    <span className="text-[9px] font-mono text-[var(--brand-main)] tracking-[0.4em] uppercase">Data_Feedback</span>
                    <h2 className="text-5xl md:text-6xl font-serif italic text-white tracking-tighter leading-none">Verified <br /> Impressions</h2>
                </div>
                <ReviewForm productId={id} onReviewAdded={() => fetchData(true)} />
            </div>
            
            <div className="lg:col-span-8">
              {product.reviews?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 gap-px bg-white/10 border border-white/10 overflow-hidden">
                  {product.reviews.map((rev, i) => (
                    <div key={i} className="p-10 bg-black space-y-8 hover:bg-white/[0.01] transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, si) => (
                            <RiStarFill key={si} size={10} className={si < rev.rating ? "text-[var(--brand-main)]" : "text-white/5"} />
                          ))}
                        </div>
                        <span className="text-[7px] font-mono text-white/20 tracking-widest uppercase">LOG_0{i+1}</span>
                      </div>
                      
                      {rev.reviewImage && (
                        <div className="relative group aspect-square border border-white/5 overflow-hidden cursor-zoom-in" onClick={() => setFullscreenImg(rev.reviewImage)}>
                          <img src={rev.reviewImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="" />
                          <RiImageLine size={14} className="absolute bottom-4 right-4 text-white/20" />
                        </div>
                      )}

                      <div className="space-y-4">
                        <p className="text-sm font-serif italic text-white/60 leading-relaxed italic">"{rev.comment}"</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                          {rev.userImg && <img src={rev.userImg} className="w-6 h-6 rounded-full border border-white/10 grayscale" alt="" />}
                          <span className="text-[9px] font-mono uppercase text-white/40 tracking-[0.3em]">— {rev.name || "Collector_Node"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[400px] border border-dashed border-white/5 flex items-center justify-center">
                  <span className="text-[10px] font-mono uppercase tracking-[0.6em] opacity-10">Waiting_For_Initial_Data</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* --- FULLSCREEN MODAL --- */}
      <AnimatePresence>
        {fullscreenImg && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out" 
            onClick={() => setFullscreenImg(null)}
          >
            <button className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
              <RiCloseLine size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              src={fullscreenImg} className="max-w-full max-h-full object-contain shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;