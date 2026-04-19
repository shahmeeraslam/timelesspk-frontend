import React, { useState } from "react";

import { Outlet, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";

import Collection from "./pages/Collection";

import Contact from "./pages/Contact";

import Product from "./pages/Product";

import Cart from "./pages/Cart";

import Login from "./pages/Login";

import Placeorder from "./pages/Placeorder";

import Orders from "./pages/Orders";

import About from "./pages/About";

import Navbar from "./components/Navbar";

import { CartProvider } from "./context/CartContext";

import { ShopProvider } from "./context/ShopContext";

import SearchBar from "./components/SearchBar";

import Register from "./pages/Register";

import Profile from "./pages/Profile";

import AdminLayout from "./components/AdminLayout";

import Dashboard from "./pages/adminpages/Dashboard";

import Inventory from "./pages/adminpages/Inventory";

import AdminOrders from "./pages/adminpages/AdminOrder";

import Customers from "./pages/adminpages/Customers";

import Settings from "./pages/adminpages/Settings";

import SystemTicker from "./components/SystemTicker.jsx"
import { StoreProvider } from "./context/StoreContext";

import { AnimatePresence } from "framer-motion";
import HomeManifestEditor from "./pages/adminpages/HomeManifestEditor.jsx";
import { Toaster } from "react-hot-toast";
const App = () => {
  const isAdminPath = location.pathname.startsWith("/admin");
  return (
    <AnimatePresence mode="sync">
      <StoreProvider>
        <ShopProvider>
          <CartProvider>
            <div className="bg-[var(--brand-alt)] min-h-screen"
            
            >
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
  
              <Routes>
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
                  {/* Changed "Inventory" to "inventory" for URL consistency */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="inventory" element={<Inventory/>} /> 
                  <Route path="orders" element={<AdminOrders/>} />
                  <Route path="customers" element={<Customers/>} />
                  <Route path="settings" element={<Settings/>} />
                  <Route path="interface" element={<HomeManifestEditor/>} />
                </Route>
              </Routes>
            </div>
          </CartProvider>
        </ShopProvider>
      </StoreProvider>
    </AnimatePresence>
  );
};

export default App;