import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";

const PlaceOrder = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState("stripe");

  return (
    <PageTransition>
      <div
        style={{
          backgroundColor: "var(--brand-alt)",
          color: "var(--brand-main)",
        }}
        className="min-h-screen pt-28 pb-20 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20">
          {/* LEFT SIDE: Delivery & Payment Details */}
          <div className="w-full lg:w-3/5 space-y-12">
            {/* Section 1: Delivery Information */}
            <div>
              <h2
                style={{ color: "var(--brand-muted)" }}
                className="text-[10px] uppercase tracking-[0.5em] mb-8"
              >
                Pillar I — Delivery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { placeholder: "First Name" },
                  { placeholder: "Last Name" },
                  { placeholder: "Email Address", full: true },
                  { placeholder: "Street Address", full: true },
                  { placeholder: "City" },
                  { placeholder: "State / Province" },
                  { placeholder: "Zip Code" },
                  { placeholder: "Country" },
                ].map((input, idx) => (
                  <input
                    key={idx}
                    type="text"
                    placeholder={input.placeholder}
                    style={{
                      borderColor: "var(--brand-border)",
                      color: "var(--brand-main)",
                    }}
                    className={`bg-transparent border-b py-3 outline-none text-sm font-light focus:border-[var(--brand-main)] transition-colors ${input.full ? "md:col-span-2" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* Section 2: Payment Method Selection */}
            <div className="pt-8">
              <h2
                style={{ color: "var(--brand-muted)" }}
                className="text-[10px] uppercase tracking-[0.5em] mb-8"
              >
                Pillar II — Payment
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                {["stripe", "razorpay", "cod"].map((payment) => (
                  <div
                    key={payment}
                    onClick={() => setMethod(payment)}
                    style={{
                      borderColor:
                        method === payment
                          ? "var(--brand-main)"
                          : "var(--brand-border)",
                      backgroundColor:
                        method === payment
                          ? "var(--brand-soft-bg)"
                          : "transparent",
                      opacity: method === payment ? 1 : 0.5,
                    }}
                    className="flex-1 border p-4 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <span
                      style={{ color: "var(--brand-main)" }}
                      className="text-[10px] uppercase tracking-widest"
                    >
                      {payment === "cod" ? "Cash on Delivery" : payment}
                    </span>
                    <div
                      style={{
                        borderColor: "var(--brand-main)",
                        backgroundColor:
                          method === payment
                            ? "var(--brand-main)"
                            : "transparent",
                      }}
                      className="w-3 h-3 rounded-full border"
                    ></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10">
              <button
                onClick={() => navigate("/orders")}
                style={{
                  backgroundColor: "var(--brand-main)",
                  color: "var(--brand-alt)",
                }}
                className="px-16 py-5 text-[10px] uppercase tracking-[0.4em] hover:opacity-90 transition-all"
              >
                Authorize Payment
              </button>
              <button
                onClick={() => navigate("/")}
                style={{
                  borderColor: "var(--brand-main)",
                  color: "var(--brand-main)",
                }}
                className="px-16 py-5 border text-[10px] uppercase tracking-[0.4em] hover:bg-[var(--brand-soft-bg)] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Final Order Review (Sticky) */}
          <div className="w-full lg:w-2/5">
            <div
              style={{ backgroundColor: "var(--brand-soft-bg)" }}
              className="lg:sticky lg:top-32 p-8 md:p-12 space-y-8"
            >
              <h3
                style={{
                  color: "var(--brand-main)",
                  borderColor: "var(--brand-border)",
                }}
                className="text-xl font-serif italic border-b pb-4"
              >
                The Archive Summary
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-4 no-scrollbar">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-xs"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.img}
                        className="w-10 h-14 object-cover grayscale"
                      />
                      <div>
                        <p
                          style={{ color: "var(--brand-main)" }}
                          className="uppercase tracking-tighter"
                        >
                          {item.name}
                        </p>
                        <p style={{ color: "var(--brand-muted)" }}>
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p
                      style={{ color: "var(--brand-main)" }}
                      className="font-serif italic"
                    >
                      ${item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{ borderColor: "var(--brand-border)" }}
                className="space-y-3 pt-4 border-t"
              >
                <div className="flex justify-between text-xs tracking-widest">
                  <span style={{ color: "var(--brand-muted)" }}>Subtotal</span>
                  <span style={{ color: "var(--brand-main)" }}>
                    ${cartTotal}
                  </span>
                </div>
                <div className="flex justify-between text-xs tracking-widest">
                  <span style={{ color: "var(--brand-muted)" }}>Shipping</span>
                  <span
                    style={{ color: "var(--brand-main)" }}
                    className="uppercase"
                  >
                    Complimentary
                  </span>
                </div>
                <div
                  style={{ color: "var(--brand-main)" }}
                  className="flex justify-between text-lg font-bold pt-4"
                >
                  <span>Total</span>
                  <span className="font-serif italic">${cartTotal}</span>
                </div>
              </div>

              <p
                style={{ color: "var(--brand-muted)" }}
                className="text-[9px] uppercase tracking-[0.2em] text-center leading-relaxed"
              >
                * By authorizing payment, you agree to the <br /> Bold_Comfort
                terms of heritage and service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default PlaceOrder;
