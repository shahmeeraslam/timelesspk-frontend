import React, { useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

// Context & Layouts
import { CartProvider } from "./context/CartContext";
import { ShopProvider } from "./context/ShopContext";
import { StoreProvider } from "./context/StoreContext";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import AdminLayout from "./components/AdminLayout";
import SystemTicker from "./components/SystemTicker.jsx";

// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Placeorder from "./pages/Placeorder";
import Orders from "./pages/Orders";
import About from "./pages/About";
import Dashboard from "./pages/adminpages/Dashboard";
import Inventory from "./pages/adminpages/Inventory";
import AdminOrders from "./pages/adminpages/AdminOrder";
import Customers from "./pages/adminpages/Customers";
import Settings from "./pages/adminpages/Settings";
import HomeManifestEditor from "./pages/adminpages/HomeManifestEditor.jsx";

const App = () => {
  const location = useLocation(); // Hook to listen for URL changes

  // useMemo prevents recalculating this on every minor state change
  const isAdminPath = useMemo(() => 
    location.pathname.startsWith("/admin"), 
    [location.pathname]
  );

  return (
    <StoreProvider>
      <ShopProvider>
        <CartProvider>
          <AnimatePresence mode="wait"> {/* "wait" is usually smoother than "sync" for page transitions */}
            <div className="bg-[var(--brand-alt)] min-h-screen selection:bg-white selection:text-black">
              
              {/* Only show Ticker and Toast if NOT in Admin territory */}
              {!isAdminPath && <SystemTicker />}
              
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: '#0a0a0a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0px',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  },
                }}
              />

              <Routes location={location} key={location.pathname}>
                {/* 1. CUSTOMER ROUTES */}
                <Route
                  path="/"
                  element={
                    <>
                      <Navbar />
                      <SearchBar />
                    </>
                  }
                >
                  <Route index element={<Home />} />
                  <Route path="collection" element={<Collection />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="product/:id" element={<Product />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="place-order" element={<Placeorder />} />
                  <Route path="orders" element={<Orders />} />
                </Route>

                {/* 2. ADMIN ROUTES */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} /> {/* Setting a default index for /admin */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory/>} /> 
                  <Route path="orders" element={<AdminOrders/>} />
                  <Route path="customers" element={<Customers/>} />
                  <Route path="settings" element={<Settings/>} />
                  <Route path="interface" element={<HomeManifestEditor/>} />
                </Route>
              </Routes>
            </div>
          </AnimatePresence>
        </CartProvider>
      </ShopProvider>
    </StoreProvider>
  );
};

export default App;