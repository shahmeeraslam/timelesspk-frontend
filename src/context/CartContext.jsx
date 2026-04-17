import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      return null;
    }
  });

  // --- 1. FETCH CART FROM NEW COLLECTION ---
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token && token !== "null") {
      try {
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Backend returns cart.items
        setCart(res.data || []);
      } catch (err) {
        console.error("Error fetching cart:", err.message);
      }
    }
  }, []);

  // --- 2. DATABASE SYNC FUNCTION (Updated Endpoint) ---
  const syncCartWithDB = async (updatedCart) => {
    const token = localStorage.getItem('token');
    if (token && token !== "null") {
      try {
        // We now send { items: updatedCart } to match the new Cart model
        await axios.put("http://localhost:5000/api/cart/sync", 
          { items: updatedCart }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Cloud Sync Error:", err.response?.data?.message || err.message);
      }
    }
  };

  // Load cart when user logs in or app starts
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]); 
    }
  }, [user, fetchCart]);

  // Sync auth state across tabs
  useEffect(() => {
    const syncAuthState = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (JSON.stringify(parsed) !== JSON.stringify(user)) {
          setUser(parsed);
        }
      } else if (user) {
        setUser(null);
      }
    };
    window.addEventListener('storage', syncAuthState);
    syncAuthState();
    return () => window.removeEventListener('storage', syncAuthState);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setUser(null);
    setCart([]); 
    window.location.href = '/login'; 
  };

  // --- 3. ACTIONS ---

  const addToCart = (product) => {
    if (!user) {
      alert("Please Sign In to access the Archive.");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => {
          const pId = item.productId?._id || item.productId;
          return pId === product._id && item.size === product.size;
        }
      );

      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) => {
          const pId = item.productId?._id || item.productId;
          return (pId === product._id && item.size === product.size)
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      } else {
        // Keep the full product object locally for immediate UI update
        newCart = [...prevCart, { ...product, productId: product._id, quantity: 1 }];
      }
      
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => {
        const pId = item.productId?._id || item.productId;
        return !(pId === productId && item.size === size);
      });
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, size, delta) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        const pId = item.productId?._id || item.productId;
        if (pId === productId && item.size === size) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      });
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const changeSize = (productId, oldSize, newSize) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        const pId = item.productId?._id || item.productId;
        return (pId === productId && item.size === oldSize)
          ? { ...item, size: newSize }
          : item;
      });
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  // Helper to get price safely whether populated or not
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.productId?.price || item.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, changeSize,
      updateQuantity, cartTotal, setUser, user, handleLogout 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);