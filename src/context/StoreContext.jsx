import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../../api'; 

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [adminImg, setAdminImg] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // --- NEW: CMS STATE FOR GLOBAL COMPONENTS ---
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch orders logic
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await API.get('/api/orders/list', {
        headers: { token }
      }); 
      const orderData = response.data?.success ? response.data.orders : response.data;
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Archive_Sync_Failure:", error);
      }
    }
  };

  // --- NEW: FETCH CMS CONFIG (Ticker, Hero, etc.) ---
  const fetchCMS = async () => {
    try {
      const response = await API.get('/api/admin/home-config');
      setCmsData(response.data);
    } catch (error) {
      console.error("CMS_FETCH_FAILURE:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchCMS(); // Always fetch public CMS data
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
      cmsData, setCmsData, // Exported for the Ticker and Home page
      loading
    }}>
      <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
        {children}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
