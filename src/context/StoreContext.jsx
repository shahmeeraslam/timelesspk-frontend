import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../../api'; 

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [adminImg, setAdminImg] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
  try {
    // Ensure '/api' is included if it's not in your axios baseURL
    const response = await API.get('/api/orders/list'); 
    
    const orderData = response.data?.success ? response.data.orders : response.data;
    setOrders(Array.isArray(orderData) ? orderData : []);
  } catch (error) {
     console.error("Archive_Sync_Failure:", error);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

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