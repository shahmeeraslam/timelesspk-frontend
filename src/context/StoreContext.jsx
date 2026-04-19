import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../../api'; 

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [adminImg, setAdminImg] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIC: Fetch Orders (Private) ---
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await API.get('/api/orders/list'); 
      const orderData = response.data?.success ? response.data.orders : response.data;
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      if (error.response?.status === 401) console.warn("ORDER_SYNC_UNAUTHORIZED");
    }
  };

  // --- LOGIC: Fetch CMS (Public) ---
  const fetchCMS = async () => {
    try {
      /* FIX: We point to /api/public/home-config. 
         This bypasses 'protect' and 'admin' middleware entirely.
         No more 401 for guests or 403 for regular users!
      */
      const response = await API.get('/api/public/home-config');
      setCmsData(response.data);
    } catch (error) {
      console.error("CMS_FETCH_FAILURE:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Always fetch public CMS data for the UI (No guard needed)
    fetchCMS(); 

    // 2. Only fetch private user data if a token exists
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders();
    }
  }, []);

  return (
    <StoreContext.Provider value={{ 
      products, setProducts, 
      orders, setOrders, 
      fetchOrders,
      adminImg, setAdminImg, 
      isDarkMode, setIsDarkMode,
      cmsData, setCmsData,
      loading
    }}>
      <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
        {children}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);