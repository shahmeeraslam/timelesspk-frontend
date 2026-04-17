// src/context/ShopContext.jsx
import React, { createContext, useState, useContext } from 'react';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  return (
    <ShopContext.Provider value={{ search, setSearch, showSearch, setShowSearch }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);