import React, { useState, useEffect, useMemo } from "react";
import { RiCloseLine, RiFilmLine, RiArrowLeftSLine, RiArrowRightSLine, RiRecordCircleLine } from "@remixicon/react";

const ProductPreviewPortal = ({ item, onClose }) => {
  const [activeIdx, setActiveIdx] = useState(0); // -1 = Film Mode, 0+ = Gallery Index

  useEffect(() => { 
    if (item) setActiveIdx(0); 
  }, [item]);

  // Safely extract the current image URL
  const currentImageUrl = useMemo(() => {
    if (!item) return "";
    const imgData = item.image?.[activeIdx];
    return typeof imgData === 'object' ? imgData.url : (imgData || item.img);
  }, [item, activeIdx]);

  if (!item) return null;

  const images = item.image || [];

  return (
    <div className="fixed inset-0 z-[250] bg-black/98 flex items-center justify-center p-6 lg:p-12 animate-in fade-in zoom-in-95 duration-500 selection:bg-white selection:text-black">
      <button 
        onClick={onClose} 
        className="absolute top-10 right-10 text-white/40 hover:text-white hover:rotate-90 transition-all z-[300]"
      >
        <RiCloseLine size={48} strokeWidth={1} />
      </button>

      <div className="w-full h-full max-w-[1800px] flex flex-col lg:flex-row gap-16">
        
        {/* VISUAL STAGE */}
        <div className="flex-[2] bg-[#050505] border border-white/5 relative flex items-center justify-center overflow-hidden group/stage">
          
          {/* TOGGLE INTERFACE */}
          <div className="absolute top-10 left-10 flex gap-4 z-50">
             <button 
              onClick={() => setActiveIdx(-1)} 
              className={`text-[9px] font-mono uppercase tracking-widest px-6 py-2 border transition-all flex items-center gap-2 ${activeIdx === -1 ? 'bg-white text-black border-white' : 'text-white border-white/10 hover:border-white/40'}`}
             >
              <RiFilmLine size={12} /> Film_Archive
             </button>
             <button 
              onClick={() => setActiveIdx(0)} 
              className={`text-[9px] font-mono uppercase tracking-widest px-6 py-2 border transition-all ${activeIdx !== -1 ? 'bg-white text-black border-white' : 'text-white border-white/10 hover:border-white/40'}`}
             >
              Gallery_View
             </button>
          </div>

          {activeIdx === -1 ? (
            <div className="w-full h-full flex items-center justify-center p-10">
              {item.videoUrl ? (
                <video key={item.videoUrl} src={item.videoUrl} controls autoPlay muted className="max-h-[80vh] w-auto shadow-2xl" />
              ) : (
                <div className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em]">No_Film_Data_Linked</div>
              )}
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center p-12">
              <img 
                key={currentImageUrl}
                src={currentImageUrl} 
                className="max-h-[85vh] w-auto object-contain animate-in fade-in slide-in-from-bottom-4 duration-700" 
                alt="Archive View"
              />
              
              {/* NAVIGATION OVERLAYS */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveIdx(p => p <= 0 ? images.length - 1 : p - 1)} 
                    className="absolute left-8 p-4 text-white/10 hover:text-white transition-all -translate-x-4 group-hover/stage:translate-x-0 opacity-0 group-hover/stage:opacity-100"
                  >
                    <RiArrowLeftSLine size={48} strokeWidth={1} />
                  </button>
                  <button 
                    onClick={() => setActiveIdx(p => p >= images.length - 1 ? 0 : p + 1)} 
                    className="absolute right-8 p-4 text-white/10 hover:text-white transition-all translate-x-4 group-hover/stage:translate-x-0 opacity-0 group-hover/stage:opacity-100"
                  >
                    <RiArrowRightSLine size={48} strokeWidth={1} />
                  </button>
                </>
              )}

              {/* ACTIVE COLOR TAG OVERLAY */}
              {images[activeIdx]?.color && (
                <div className="absolute bottom-10 right-10 flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3">
                  <div className="size-2 rounded-full animate-pulse" style={{ backgroundColor: images[activeIdx].color.toLowerCase() }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">
                    Finish: {images[activeIdx].color}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR METADATA */}
        <div className="flex-1 flex flex-col justify-between py-12">
          <div className="space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-white/30 tracking-[0.6em] uppercase italic flex items-center gap-2">
                <RiRecordCircleLine size={10} className="animate-pulse text-emerald-500" />
                Live_Archive_Sync
              </span>
              <h2 className="text-6xl font-serif italic leading-tight tracking-tighter">{item.name}</h2>
              <div className="flex items-center gap-8 pt-4">
                <span className="text-4xl font-light tracking-tighter text-white/90">${item.price?.toLocaleString()}</span>
                <span className="px-4 py-1 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/40">
                  Units_In_Stock: {item.stock}
                </span>
              </div>
            </div>

            {/* ANGLE NAV */}
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20">Archive_Angles</p>
                <span className="text-[9px] font-mono text-white/10 uppercase italic">
                  Index: {activeIdx + 1} / {images.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((imgObj, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveIdx(i)}
                    className={`aspect-[3/4] border transition-all duration-500 overflow-hidden relative group/thumb ${activeIdx === i ? 'border-white' : 'border-white/5 opacity-30 hover:opacity-100'}`}
                  >
                    <img 
                      src={imgObj.url || imgObj} 
                      className="w-full h-full object-cover grayscale group-hover/thumb:grayscale-0 transition-all" 
                      alt={`Angle ${i}`}
                    />
                    {/* Tiny Color Indicator on Thumbnail */}
                    {imgObj.color && (
                      <div className="absolute bottom-1 left-1 size-1.5 rounded-full border border-black" style={{ backgroundColor: imgObj.color.toLowerCase() }} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {item.curatorNote && (
              <div className="space-y-4 pt-8 border-t border-white/5">
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Curator_Statement</span>
                <p className="text-sm font-serif italic text-white/60 leading-relaxed italic">"{item.curatorNote}"</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
             <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-white/10">Reference_UID: {item._id}</p>
             <p className="text-[8px] font-mono uppercase tracking-[0.5em] text-white/10">System_Class: {item.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewPortal;