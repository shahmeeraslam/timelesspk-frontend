import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../../api'; 

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [adminImg, setAdminImg] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    // Get the token from storage (standard practice for local development)
    const token = localStorage.getItem('token');
    
    // If no token exists, don't even try the request
    if (!token) return;

    try {
      const response = await API.get('/api/orders/list', {
        headers: { token } // Ensure your backend middleware expects the 'token' key
      }); 
      
      const orderData = response.data?.success ? response.data.orders : response.data;
      setOrders(Array.isArray(orderData) ? orderData : []);
    } catch (error) {
      // Only log if it's NOT a 401, or handle it gracefully
      if (error.response?.status !== 401) {
        console.error("Archive_Sync_Failure:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchOrders();
    }
  }, []); // Only runs on mount

  return (
    <StoreContext.Provider value={{ 
      products, setProducts, 
      orders, setOrders, 
      fetchOrders,
      adminImg, setAdminImg, 
      isDarkMode, setIsDarkMode 
    }}>
      <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
        {children}
      </div>
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);