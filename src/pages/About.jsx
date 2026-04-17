import React from "react";
import PageTransition from "../components/PageTransition";

const About = () => {
  return (
    <PageTransition>
      <div
        style={{
          backgroundColor: "var(--brand-alt)",
          color: "var(--brand-main)",
        }}
        className="font-sans antialiased"
      >
        {/* 1. VISIONARY HEADER */}
        <section className="pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
          <h2
            style={{ color: "var(--brand-muted)" }}
            className="text-[10px] uppercase tracking-[0.6em] mb-6"
          >
            Our Heritage
          </h2>
          <h1
            style={{ color: "var(--brand-main)" }}
            className="text-5xl md:text-7xl font-serif italic mb-10 leading-tight"
          >
            A Legacy of Quiet Confidence.
          </h1>
          <p
            style={{ color: "var(--brand-muted)" }}
            className="text-lg font-light leading-relaxed"
          >
            Bold_Comfort was founded on a singular defiance: that true luxury
            doesn't need to shout to be heard. We create for the individual who
            values the weight of a heavy linen, the click of a mechanical
            movement, and the silhouette of a perfectly lasted loafer.
          </p>
        </section>

        {/* 2. THE PHILOSOPHY - Split Layout */}
        <section
          style={{ borderColor: "var(--brand-border)" }}
          className="py-24 border-y"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-1/2">
              <div style={{ backgroundColor: "var(--brand-soft-bg)" }}>
                <img
                  src="https://imgs.search.brave.com/deey3HdUAOm8jnKZ1gzlL99kloTejhqgiwIqF9aQri8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9ibG9n/LmxhbmllcmkuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIw/LzAzL2ZvcmJpY2kt/ZS1tZXRyby1zYXJ0/b3JpYWxlLTExNzB4/NTUwLmpwZw"
                  alt="Workshop Detail"
                  className="w-full h-[500px] object-cover grayscale opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-8">
              <h3
                style={{ color: "var(--brand-main)" }}
                className="text-3xl font-serif"
              >
                The "Slow" Manifesto
              </h3>
              <p
                style={{ color: "var(--brand-muted)" }}
                className="font-light leading-relaxed"
              >
                In an era of disposable trends, we choose the difficult path.
                Our garments are sourced from century-old mills in Northern
                Italy and the Scottish Highlands. We do not release "seasons";
                we release **Archives**.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <h4
                    style={{ color: "var(--brand-main)" }}
                    className="text-[10px] uppercase tracking-widest font-bold mb-2"
                  >
                    Provenance
                  </h4>
                  <p
                    style={{ color: "var(--brand-muted)" }}
                    className="text-xs font-light"
                  >
                    Traceable materials from ethical, family-owned farms.
                  </p>
                </div>
                <div>
                  <h4
                    style={{ color: "var(--brand-main)" }}
                    className="text-[10px] uppercase tracking-widest font-bold mb-2"
                  >
                    Longevity
                  </h4>
                  <p
                    style={{ color: "var(--brand-muted)" }}
                    className="text-xs font-light"
                  >
                    Construction techniques meant to last generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE THREE PILLARS (Visual Grid) */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            {/* Pillar 1 */}
            <div className="text-center space-y-4 group">
              <div
                style={{ backgroundColor: "var(--brand-soft-bg)" }}
                className="aspect-square overflow-hidden mb-6"
              >
                <img
                  src="https://imgs.search.brave.com/hiOV4FROFXliXVhsE8F1w7MX314g374GFEPcGUKdrd0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9taW5p/bWFsdmludGFnZS5j/b20vY2RuL3Nob3Av/ZmlsZXMvMTNkMjVm/NjUtMWRjZC00ZGQx/LTg3MzAtYjA1Y2Nm/MjhiOTEyLmpwZz92/PTE3MjY2OTQyMTMm/d2lkdGg9NjAw"
                  className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  alt="Fabric"
                />
              </div>
              <h4
                style={{ color: "var(--brand-main)" }}
                className="text-sm uppercase tracking-[0.3em] font-bold"
              >
                Textiles
              </h4>
              <p
                style={{ color: "var(--brand-muted)" }}
                className="text-xs font-light px-4"
              >
                Raw silk, Egyptian Giza cotton, and Loro Piana cashmere.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="text-center space-y-4 group">
              <div
                style={{ backgroundColor: "var(--brand-soft-bg)" }}
                className="aspect-square overflow-hidden mb-6"
              >
                <img
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  alt="Watch"
                />
              </div>
              <h4
                style={{ color: "var(--brand-main)" }}
                className="text-sm uppercase tracking-[0.3em] font-bold"
              >
                Horology
              </h4>
              <p
                style={{ color: "var(--brand-muted)" }}
                className="text-xs font-light px-4"
              >
                Internal mechanical movements with zero electronic interference.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="text-center space-y-4 group">
              <div
                style={{ backgroundColor: "var(--brand-soft-bg)" }}
                className="aspect-square overflow-hidden mb-6"
              >
                <img
                  src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2071&auto=format&fit=crop"
                  className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                  alt="Studio"
                />
              </div>
              <h4
                style={{ color: "var(--brand-main)" }}
                className="text-sm uppercase tracking-[0.3em] font-bold"
              >
                Studio
              </h4>
              <p
                style={{ color: "var(--brand-muted)" }}
                className="text-xs font-light px-4"
              >
                Based in London, operating globally with a minimalist footprint.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CALL TO ACTION - Inverse Section */}
        <section
          style={{
            backgroundColor: "var(--brand-main)",
            color: "var(--brand-alt)",
          }}
          className="py-32 px-6 text-center"
        >
          <h3 className="text-4xl font-serif mb-8 italic">
            Join the Inner Circle
          </h3>
          <p
            style={{ color: "var(--brand-muted)" }}
            className="text-sm tracking-widest uppercase mb-12"
          >
            Stay informed on private archive releases.
          </p>
          <button
            style={{
              borderColor: "var(--brand-alt)",
              color: "var(--brand-alt)",
            }}
            className="border px-12 py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-500"
          >
            Register Interest
          </button>
        </section>
      </div>
    </PageTransition>
  );
};

export default About;
