import API from "../../../api"; 
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext"; 
import { RiStarFill, RiSendPlaneLine, RiImageAddLine, RiCloseLine, RiCheckLine } from "@remixicon/react";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user: contextUser } = useCart(); 
  const fileInputRef = useRef(null);
  
  // Memoize auth to prevent unnecessary effect triggers
  const auth = useMemo(() => {
    const user = contextUser || JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    return { user, token };
  }, [contextUser]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("File_Size_Exceeded: Limit 5MB");
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("name", auth.user.name);
    formData.append("userImg", auth.user.img || ""); 
    if (imageFile) formData.append("image", imageFile);

    try {
      await API.post(`/api/products/${productId}/reviews`, formData);
      
      // Reset State
      setComment("");
      setRating(5);
      setImageFile(null);
      setPreview(null);
      setIsSuccess(true);
      
      if (onReviewAdded) onReviewAdded();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Transmission_Failure");
    } finally {
      setLoading(false);
    }
  };

  if (!auth.user) return (
    <div className="py-12 border-t border-white/5 opacity-40">
      <p className="text-[9px] font-mono uppercase tracking-[0.4em]">
        [Auth_Required_To_Archive_Impression]
      </p>
    </div>
  );

  return (
    <div className="py-16 border-t border-white/10 relative">
      
      {/* HEADER: User Context */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <div className="absolute inset-0 bg-[var(--brand-main)] blur-md opacity-0 group-hover:opacity-20 transition-opacity" />
            <img 
              src={auth.user.img || 'https://via.placeholder.com/40'} 
              className="w-14 h-14 rounded-full object-cover border border-white/10 grayscale group-hover:grayscale-0 transition-all duration-700" 
              alt="Profile"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#0a0a0a]" />
          </div>
          <div>
            <h3 className="text-[11px] uppercase tracking-[0.6em] font-black text-white/90">Impression_Upload</h3>
            <p className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] mt-1">Node: {auth.user.name}</p>
          </div>
        </div>
        
        {isSuccess && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
             <RiCheckLine className="text-emerald-500" size={16} />
             <span className="text-[8px] font-mono uppercase text-emerald-500 tracking-[0.3em]">Data_Synced</span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-4 space-y-12">
          {/* RATING */}
          <div className="space-y-4">
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 font-mono">01_Quality_Rank</p>
            <div className="flex gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="relative group/star"
                >
                  <RiStarFill
                    size={18}
                    className={`transition-all duration-500 ${
                      star <= (hover || rating) ? "text-[var(--brand-main)] drop-shadow-[0_0_8px_var(--brand-main)]" : "text-white/5"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* VISUAL REF */}
          <div className="space-y-4">
            <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 font-mono">02_Visual_Reference</p>
            <div 
              className="relative w-32 h-44 group cursor-pointer"
              onClick={() => !preview && fileInputRef.current.click()}
            >
              {!preview ? (
                <div className="w-full h-full border border-dashed border-white/10 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-white/[0.04] transition-all overflow-hidden">
                  <RiImageAddLine size={20} className="text-white/10 group-hover:text-white group-hover:scale-110 transition-all" />
                  <span className="text-[6px] uppercase mt-4 tracking-[0.4em] text-white/20">Attach_Ref</span>
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/5" />
                </div>
              ) : (
                <div className="w-full h-full relative border border-white/20 overflow-hidden">
                  <img src={preview} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Preview" />
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPreview(null); setImageFile(null); }}
                    className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white p-1.5 hover:text-red-500 transition-colors"
                  >
                    <RiCloseLine size={14} />
                  </button>
                </div>
              )}
            </div>
            <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        {/* RIGHT COLUMN: Analysis */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 font-mono">03_Subjective_Analysis</p>
                <span className={`text-[7px] font-mono ${comment.length > 400 ? 'text-red-500' : 'text-white/10'}`}>
                    {comment.length} / 500
                </span>
            </div>
            <textarea
              required
              maxLength={500}
              rows="5"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Material performance, architectural silhouette, or environmental endurance..."
              className="w-full bg-transparent border-l border-white/5 pl-6 py-2 focus:border-[var(--brand-main)] outline-none transition-all font-serif italic text-xl md:text-2xl leading-relaxed placeholder:text-white/5 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || comment.length < 10}
            className="w-fit flex items-center gap-8 py-4 px-2 group disabled:opacity-20"
          >
            <div className="flex flex-col items-start">
                <span className="text-[10px] uppercase tracking-[0.6em] font-black text-white group-hover:text-[var(--brand-main)] transition-colors">
                    {loading ? "ARCHIVING_DATA..." : "Archive_Impression"}
                </span>
                <div className="w-0 group-hover:w-full h-[1px] bg-[var(--brand-main)] transition-all duration-700 mt-1" />
            </div>
            <RiSendPlaneLine 
              size={18} 
              className="text-white/20 group-hover:text-[var(--brand-main)] group-hover:translate-x-3 transition-all duration-500" 
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;