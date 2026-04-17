import React from "react";
import { useCart } from "../context/CartContext";
import { collectionItems } from "../assets/homedata";
import PageTransition from "../components/PageTransition";

const Orders = () => {
  // In a real app, this data would come from a backend/database.
  // For now, we'll mock the 'My Orders' data using your collectionItems.
  const myOrders = [
    {
      ...collectionItems[0],
      date: "Oct 12, 2025",
      status: "In Transit",
      orderId: "BC-9921",
    },
    {
      ...collectionItems[2],
      date: "Sept 28, 2025",
      status: "Delivered",
      orderId: "BC-8842",
    },
  ];

  return (
    <PageTransition>
      <div
        style={{
          backgroundColor: "var(--brand-alt)",
          color: "var(--brand-main)",
        }}
        className="min-h-screen pt-28 pb-20 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div
            style={{ borderColor: "var(--brand-border)" }}
            className="border-b pb-10 mb-12"
          >
            <h1
              style={{ color: "var(--brand-main)" }}
              className="text-4xl font-serif italic mb-2"
            >
              The Archive
            </h1>
            <p
              style={{ color: "var(--brand-muted)" }}
              className="text-[10px] uppercase tracking-[0.4em]"
            >
              Your Purchase History & Acquisitions
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-12">
            {myOrders.map((order, index) => (
              <div
                key={index}
                style={{ borderColor: "var(--brand-soft-bg)" }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b"
              >
                {/* Product Info */}
                <div className="flex gap-6 w-full md:w-1/3">
                  <div
                    style={{ backgroundColor: "var(--brand-soft-bg)" }}
                    className="w-20 h-28 flex-shrink-0"
                  >
                    <img
                      src={order.img}
                      alt={order.name}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3
                      style={{ color: "var(--brand-main)" }}
                      className="text-xs font-bold uppercase tracking-widest"
                    >
                      {order.name}
                    </h3>
                    <p
                      style={{ color: "var(--brand-muted)" }}
                      className="text-[10px] mt-1 uppercase tracking-tighter"
                    >
                      {order.category}
                    </p>
                    <p
                      style={{ color: "var(--brand-main)" }}
                      className="text-sm font-serif italic mt-4"
                    >
                      ${order.price}
                    </p>
                  </div>
                </div>

                {/* Order Metadata */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-2/3 items-center">
                  <div>
                    <p
                      style={{ color: "var(--brand-muted)" }}
                      className="text-[9px] uppercase tracking-widest mb-1"
                    >
                      Date
                    </p>
                    <p
                      style={{ color: "var(--brand-main)" }}
                      className="text-xs font-light tracking-tight"
                    >
                      {order.date}
                    </p>
                  </div>

                  <div>
                    <p
                      style={{ color: "var(--brand-muted)" }}
                      className="text-[9px] uppercase tracking-widest mb-1"
                    >
                      Order ID
                    </p>
                    <p
                      style={{ color: "var(--brand-main)" }}
                      className="text-xs font-light tracking-tight"
                    >
                      {order.orderId}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor:
                          order.status === "Delivered"
                            ? "#166534"
                            : "var(--brand-main)",
                      }}
                      className="w-2 h-2 rounded-full"
                    ></div>
                    <p
                      style={{ color: "var(--brand-main)" }}
                      className="text-[10px] uppercase tracking-[0.2em] font-bold"
                    >
                      {order.status}
                    </p>
                  </div>

                  <button
                    style={{
                      borderColor: "var(--brand-border)",
                      color: "var(--brand-main)",
                    }}
                    className="md:col-start-3 text-[10px] uppercase tracking-widest border py-2 px-4 hover:border-[var(--brand-main)] transition-all"
                  >
                    Track Piece
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Suggestion */}
          {myOrders.length === 0 && (
            <div className="py-40 text-center">
              <p
                style={{ color: "var(--brand-muted)" }}
                className="font-serif italic"
              >
                Your archive is currently empty.
              </p>
              <button
                style={{
                  borderColor: "var(--brand-main)",
                  color: "var(--brand-main)",
                }}
                className="mt-6 text-[10px] uppercase tracking-[0.3em] border-b pb-1"
              >
                Begin Exploration
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Orders;
