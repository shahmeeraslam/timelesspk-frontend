import React, { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext"; 
import { RiStarFill, RiSendPlaneLine, RiImageAddLine, RiCloseLine } from "@remixicon/react";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user: contextUser } = useCart(); 
  const fileInputRef = useRef(null);
  
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

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.user || !auth.token) {
      alert("Authentication required to archive impression.");
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("name", auth.user.name);
    formData.append("userImg", auth.user.img || ""); 
    
    if (imageFile) formData.append("image", imageFile);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`, 
        },
      };

      await axios.post(
        `http://localhost:5000/api/products/${productId}/reviews`,
        formData,
        config
      );

      setComment("");
      setRating(5);
      setImageFile(null);
      setPreview(null);
      
      if (onReviewAdded) onReviewAdded(); 
    } catch (error) {
      console.error("Archive Error:", error.response?.data);
      alert(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!auth.user) return (
    <div className="py-10 border-t border-white/5">
      <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">
        Authentication_Required_To_Archive_Impression
      </p>
    </div>
  );

  return (
    <div className="py-12 border-t border-white/5">
      <div className="flex items-center gap-4 mb-10">
        <div className="relative">
          <img 
            src={auth.user.img || 'https://via.placeholder.com/40'} 
            className="w-12 h-12 rounded-full object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-500" 
            alt="Profile"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
        </div>
        <div>
          <h3 className="text-[10px] uppercase tracking-[0.5em] font-mono text-white/80">Leave_an_Impression</h3>
          <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] mt-1 italic">Verified_User: {auth.user.name}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-12">
        {/* RATING SECTION */}
        <div className="space-y-3">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono italic">Quality_Rank</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90"
              >
                <RiStarFill
                  size={16}
                  className={`transition-all duration-300 ${
                    star <= (hover || rating) ? "text-white scale-110" : "text-white/10"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="space-y-4">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono italic">Visual_Reference</p>
          <div className="flex items-center gap-4">
            {!preview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-24 h-32 border border-dashed border-white/10 flex flex-col items-center justify-center hover:bg-white/[0.02] transition-all group"
              >
                <RiImageAddLine size={20} className="text-white/20 group-hover:text-white transition-opacity" />
                <span className="text-[7px] uppercase mt-3 tracking-[0.3em] text-white/20">Add_File</span>
              </button>
            ) : (
              <div className="relative w-32 h-40 border border-white/10 bg-white/5">
                <img src={preview} className="w-full h-full object-cover grayscale" alt="Preview" />
                <button 
                  type="button"
                  onClick={() => {setPreview(null); setImageFile(null);}}
                  className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 shadow-xl hover:scale-110 transition-transform"
                >
                  <RiCloseLine size={12} />
                </button>
              </div>
            )}
            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleImageChange} 
            />
          </div>
        </div>

        {/* COMMENTARY SECTION */}
        <div className="space-y-3">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-mono italic">Subjective_Analysis</p>
          <textarea
            required
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Material performance, silhouette details, or architectural thoughts..."
            className="w-full bg-transparent border-b border-white/10 py-4 focus:border-white outline-none transition-all font-serif italic text-lg resize-none placeholder:text-white/10"
          />
        </div>

        {/* SUBMIT ACTION */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-6 text-[10px] uppercase tracking-[0.5em] font-bold text-white hover:gap-10 transition-all disabled:opacity-20 group"
        >
          {loading ? "Syncing_Data..." : "Archive_Impression"}
          <RiSendPlaneLine size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;