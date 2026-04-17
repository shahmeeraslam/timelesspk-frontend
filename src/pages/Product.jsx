import API from "../../api"
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

// Components
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

  // -1 = Video, 0+ = Image Index
  const [activeMediaIndex, setActiveMediaIndex] = useState(-1);

  // 1. STRICT COLOR FILTER: Treats "Natural" as a standard color category.
  const visibleImages = useMemo(() => {
    if (!product || !product.image) return [];
    // Only show images that match the selected color exactly
    return product.image.filter(img => img.color === selectedColor);
  }, [product, selectedColor]);

  // 2. AUTO-RESET PREVIEW: Jump back to video capture when color selection changes
  useEffect(() => {
    setActiveMediaIndex(-1);
  }, [selectedColor]);

  const currentPreview = useMemo(() => {
    if (activeMediaIndex === -1 && product?.videoUrl) return { type: 'video', url: product.videoUrl };
    // Fallback to the first available image for that color if index is out of bounds
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

      // Set initial color from product data
      if (!selectedColor && res.data.colors?.length > 0) {
        setSelectedColor(res.data.colors[0]);
      }

      const history = JSON.parse(localStorage.getItem("recently_viewed") || "[]");
      const currentEntry = { 
        _id: res.data._id, 
        name: res.data.name, 
        img: res.data.image?.[0]?.url || res.data.img 
      };
      
      const newHistory = [currentEntry, ...history.filter(p => p._id !== res.data._id)].slice(0, 5);
      localStorage.setItem("recently_viewed", JSON.stringify(newHistory));
      setRecentlyViewed(newHistory);
    } catch (err) { 
      console.error("Sync_Failure:", err); 
    } finally { 
      if (!silent) setLoading(false); 
    }
  }, [id, selectedColor]);

  useEffect(() => { 
    fetchData(); 
    window.scrollTo(0, 0); 
  }, [id]);

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
          <div className="lg:w-[60%] flex flex-col gap-6">
            
            {/* MAIN PREVIEW SLOT */}
            <div className="relative w-full h-[60vh] lg:h-[75vh] bg-[#050505] border border-white/5 overflow-hidden flex items-center justify-center rounded-sm">
              
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
                      className="max-w-full max-h-full object-contain   transition-all duration-700" 
                      alt="Product Frame" 
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
                      className="max-w-full max-h-full object-contain  opacity-80" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-4 right-6 opacity-20 pointer-events-none">
                <span className="text-[7px] font-mono uppercase tracking-[0.5em]">Auto_Fit_Active</span>
              </div>
            </div>

            {/* THUMBNAIL TRACK - Always shows Video + Color-Specific Images */}
            <div className="flex flex-row gap-3 overflow-x-auto pb-4 no-scrollbar">
              {product.videoUrl && (
                <button 
                  onClick={() => setActiveMediaIndex(-1)}
                  className={`relative flex-shrink-0 w-16 lg:w-20 aspect-[3/4] border transition-all ${activeMediaIndex === -1 ? 'border-white scale-95 opacity-100' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <video src={product.videoUrl} className="w-full h-full object-cover " />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <RiPlayLine size={14} />
                  </div>
                </button>
              )}

              {visibleImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveMediaIndex(idx)}
                  className={`flex-shrink-0 w-16 lg:w-20 aspect-[3/4] border transition-all ${activeMediaIndex === idx ? 'border-white scale-95 opacity-100' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover " alt="Thumbnail" />
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
                addToCart({ 
                  ...product, 
                  size: selectedSize, 
                  color: selectedColor, 
                  img: visibleImages[0]?.url || product.image?.[0]?.url 
                });
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
                      <img src={p.img} className="w-full h-full object-cover " alt="Recent" />
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
          <div key={i} className="p-8 lg:p-10 bg-black flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, si) => (
                  <RiStarFill key={si} size={8} className={si < rev.rating ? "text-white" : "text-white/10"} />
                ))}
              </div>
              
              {/* REVIEW IMAGE - Added this block */}
              {rev.reviewImage && (
                <div 
                  className="relative group cursor-zoom-in overflow-hidden border border-white/5 aspect-square bg-[#050505]"
                  onClick={() => setFullscreenImg(rev.reviewImage)}
                >
                  <img 
                    src={rev.reviewImage} 
                    alt="Review Evidence" 
                    className="w-full h-full object-cover transition-all duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-40 transition-opacity">
                    <RiImageLine size={12} />
                  </div>
                </div>
              )}

              <p className="text-sm font-serif italic text-white/60 leading-relaxed">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Optional: User Avatar */}
              {rev.userImg && (
                <img src={rev.userImg} className="w-5 h-5 rounded-full  border border-white/10" alt="" />
              )}
              <p className="text-[9px] font-mono uppercase text-white/30 tracking-widest">
                — {rev.name || "Collector"}
              </p>
            </div>
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
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] bg-black/98 flex items-center justify-center p-6 cursor-zoom-out" 
            onClick={() => setFullscreenImg(null)}
          >
            <button className="absolute top-6 right-6 text-white/30 hover:text-white">
              <RiCloseLine size={40} />
            </button>
            <motion.img 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              src={fullscreenImg} 
              className="max-w-full max-h-full object-contain" 
              alt="Fullscreen" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Product;