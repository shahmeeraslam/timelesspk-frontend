const SilhouettePicker = ({ categories, currentCategory, setCategory, products, onAdd }) => (
  <section className="py-8 border-y border-[var(--brand-border)] space-y-6">
    <p className="text-[10px] uppercase tracking-[0.3em] font-mono opacity-60">Complete the Silhouette</p>
    <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] overflow-x-auto no-scrollbar">
      {categories.map((cat) => (
        <button 
          key={cat} 
          onClick={() => setCategory(cat)} 
          className={`pb-1 transition-all ${currentCategory === cat ? "text-[var(--brand-accent)] border-b border-[var(--brand-accent)]" : "opacity-30 hover:opacity-100"}`}
        >
          {cat}
        </button>
      ))}
    </div>
    <div className="grid grid-cols-4 gap-3">
      {products.map((item) => (
        <div 
          key={item._id} 
          onClick={() => onAdd(item)}
          className="group cursor-pointer aspect-[3/4] bg-[var(--brand-soft-bg)] overflow-hidden border border-[var(--brand-border)]"
        >
          <img src={item.image?.[0]} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="" />
        </div>
      ))}
    </div>
  </section>
);

export default SilhouettePicker;