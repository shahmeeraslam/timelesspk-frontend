import React, { createContext, useState, useContext, useEffect } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // --- New Global UI States ---
  const [adminImg, setAdminImg] = useState(null); // Stores the final saved image URL
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- Inventory & Orders ---
  const [products, setProducts] = useState([
    { id: 1, name: "Heritage Wool Coat", category: "Clothing", price: 450, stock: 12 },
    { id: 2, name: "Mid-Century Oak Chair", category: "Furniture", price: 1200, stock: 4 },
    { id: 3, name: "Silk Archive Scarf", category: "Accessories", price: 180, stock: 0 },
  ]);

  const [orders, setOrders] = useState([
    { id: "ORD-9922", date: "Apr 04", customer: "Shahmeer ALi", total: 1450, status: "Processing" },
    { id: "ORD-9921", date: "Apr 04", customer: "Zainab Ahmed", total: 1450, status: "Processing" },
  ]);

  return (
    <StoreContext.Provider value={{ 
      products, setProducts, 
      orders, setOrders, 
      adminImg, setAdminImg, 
      isDarkMode, setIsDarkMode 
    }}>
      {/* This div ensures the theme variables apply to everything inside the provider */}
      <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
        {children}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);