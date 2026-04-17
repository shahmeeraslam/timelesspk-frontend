import React, { useState } from "react";
import PageTransition from "../components/PageTransition";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your message has been sent to the Bold_Comfort Concierge.");
    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
  };

  return (
    <PageTransition>
      <div
        style={{
          backgroundColor: "var(--brand-alt)",
          color: "var(--brand-main)",
        }}
        className="font-sans antialiased min-h-screen"
      >
        {/* 1. MINIMALIST HEADER */}
        <section
          style={{ borderColor: "var(--brand-border)" }}
          className="pt-32 pb-16 px-6 text-center border-b"
        >
          <h1
            style={{ color: "var(--brand-main)" }}
            className="text-5xl md:text-7xl font-serif italic mb-6"
          >
            Connect
          </h1>
          <p
            style={{ color: "var(--brand-muted)" }}
            className="text-[10px] uppercase tracking-[0.5em]"
          >
            London — Milan — New York — Karachi
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col lg:flex-row gap-20">
          {/* 2. LEFT SIDE: Global Ateliers & Info */}
          <div className="w-full lg:w-1/3 space-y-16">
            <div>
              <h3
                style={{ color: "var(--brand-muted)" }}
                className="text-xs uppercase tracking-[0.4em] font-bold mb-6"
              >
                The Ateliers
              </h3>
              <div className="space-y-8">
                <div>
                  <p
                    style={{ color: "var(--brand-main)" }}
                    className="text-sm font-bold uppercase tracking-widest"
                  >
                    Mayfair, London
                  </p>
                  <p
                    style={{ color: "var(--brand-muted)" }}
                    className="text-xs font-light mt-2 leading-relaxed"
                  >
                    24 Savile Row, London W1S 3PR
                    <br />
                    +44 20 7946 0123
                  </p>
                </div>
                <div>
                  <p
                    style={{ color: "var(--brand-main)" }}
                    className="text-sm font-bold uppercase tracking-widest"
                  >
                    Quadrilatero, Milan
                  </p>
                  <p
                    style={{ color: "var(--brand-muted)" }}
                    className="text-xs font-light mt-2 leading-relaxed"
                  >
                    Via Montenapoleone, 8, 20121 Milano
                    <br />
                    +39 02 1234 5678
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3
                style={{ color: "var(--brand-muted)" }}
                className="text-xs uppercase tracking-[0.4em] font-bold mb-6"
              >
                Digital Concierge
              </h3>
              <p
                style={{ color: "var(--brand-muted)" }}
                className="text-sm font-light leading-relaxed"
              >
                For sizing consultations, private archive access, or bespoke
                watch inquiries:
                <br />
                <span
                  style={{
                    borderColor: "var(--brand-main)",
                    color: "var(--brand-main)",
                  }}
                  className="font-bold border-b"
                >
                  concierge@boldcomfort.com
                </span>
              </p>
            </div>
          </div>

          {/* 3. RIGHT SIDE: The Inquiry Form */}
          <div
            style={{ backgroundColor: "var(--brand-soft-bg)" }}
            className="w-full lg:w-2/3 p-8 md:p-16"
          >
            <h3
              style={{ color: "var(--brand-main)" }}
              className="text-2xl font-serif mb-10 italic"
            >
              Send an Inquiry
            </h3>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  style={{ borderColor: "var(--brand-border)" }}
                  className="flex flex-col border-b focus-within:border-[var(--brand-main)] transition-colors py-2"
                >
                  <label
                    style={{ color: "var(--brand-muted)" }}
                    className="text-[9px] uppercase tracking-widest"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    style={{ color: "var(--brand-main)" }}
                    className="bg-transparent outline-none text-sm pt-2"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div
                  style={{ borderColor: "var(--brand-border)" }}
                  className="flex flex-col border-b focus-within:border-[var(--brand-main)] transition-colors py-2"
                >
                  <label
                    style={{ color: "var(--brand-muted)" }}
                    className="text-[9px] uppercase tracking-widest"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    style={{ color: "var(--brand-main)" }}
                    className="bg-transparent outline-none text-sm pt-2"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div
                style={{ borderColor: "var(--brand-border)" }}
                className="flex flex-col border-b focus-within:border-[var(--brand-main)] transition-colors py-2"
              >
                <label
                  style={{ color: "var(--brand-muted)" }}
                  className="text-[9px] uppercase tracking-widest"
                >
                  Subject
                </label>
                <select
                  style={{ color: "var(--brand-main)" }}
                  className="bg-transparent outline-none text-sm pt-2 cursor-pointer uppercase tracking-tighter"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                >
                  <option>General Inquiry</option>
                  <option>Bespoke Tailoring Appointment</option>
                  <option>Watch Service & Repair</option>
                  <option>Press & Media</option>
                </select>
              </div>

              <div
                style={{ borderColor: "var(--brand-border)" }}
                className="flex flex-col border-b focus-within:border-[var(--brand-main)] transition-colors py-2"
              >
                <label
                  style={{ color: "var(--brand-muted)" }}
                  className="text-[9px] uppercase tracking-widest"
                >
                  Your Message
                </label>
                <textarea
                  rows="4"
                  style={{ color: "var(--brand-main)" }}
                  className="bg-transparent outline-none text-sm pt-4 resize-none placeholder:text-[var(--brand-muted)]"
                  placeholder="How may we assist you?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "var(--brand-main)",
                  color: "var(--brand-alt)",
                }}
                className="w-full md:w-auto px-16 py-4 text-[10px] uppercase tracking-[0.4em] hover:opacity-80 transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>

        {/* 4. VISUAL ATMOSPHERE */}
        <section className="h-[400px] w-full overflow-hidden grayscale brightness-50">
          <img
            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2070&auto=format&fit=crop"
            alt="Location Atmosphere"
            className="w-full h-full object-cover"
          />
        </section>
      </div>
    </PageTransition>
  );
};

export default Contact;
