import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from "../../api"
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

  // --- 1. FETCH CART ---
  const fetchCart = useCallback(async () => {
    try {
      const res = await API.get("/api/cart");
      setCart(res.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err.message);
    }
  }, []);

  // --- 2. DATABASE SYNC ---
  const syncCartWithDB = async (updatedCart) => {
    try {
      await API.put("/api/cart/sync", { items: updatedCart });
    } catch (err) {
      console.error("Cloud Sync Error:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]); 
    }
  }, [user, fetchCart]);

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

  // --- 3. UPDATED ACTIONS (COLOR & SIZE SENSITIVE) ---

  const addToCart = (product) => {
    if (!user) {
      alert("Please Sign In to access the Archive.");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => {
        const pId = item.productId?._id || item.productId;
        // Unique combination: ID + SIZE + COLOR
        return (
          pId === product._id && 
          item.size === product.size && 
          item.color === product.color
        );
      });

      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) => {
          const pId = item.productId?._id || item.productId;
          return (pId === product._id && item.size === product.size && item.color === product.color)
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      } else {
        newCart = [...prevCart, { ...product, productId: product._id, quantity: 1 }];
      }
      
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => {
        const pId = item.productId?._id || item.productId;
        // Keep everything EXCEPT the specific ID + Size + Color combo
        return !(pId === productId && item.size === size && item.color === color);
      });
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, size, color, delta) => {
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        const pId = item.productId?._id || item.productId;
        if (pId === productId && item.size === size && item.color === color) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      });
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const changeSize = (productId, color, oldSize, newSize) => {
    setCart((prevCart) => {
      // Check if the NEW size in the SAME color already exists in cart
      const existingInNewSize = prevCart.find((item) => {
        const pId = item.productId?._id || item.productId;
        return pId === productId && item.color === color && item.size === newSize;
      });

      let newCart;
      if (existingInNewSize) {
        // If it exists, merge them: increase quantity of new size, remove old size
        newCart = prevCart
          .map((item) => {
            const pId = item.productId?._id || item.productId;
            if (pId === productId && item.color === color && item.size === newSize) {
              const oldItem = prevCart.find(i => (i.productId?._id || i.productId) === productId && i.color === color && i.size === oldSize);
              return { ...item, quantity: item.quantity + (oldItem?.quantity || 1) };
            }
            return item;
          })
          .filter((item) => {
            const pId = item.productId?._id || item.productId;
            return !(pId === productId && item.color === color && item.size === oldSize);
          });
      } else {
        // Standard size change
        newCart = prevCart.map((item) => {
          const pId = item.productId?._id || item.productId;
          return (pId === productId && item.color === color && item.size === oldSize)
            ? { ...item, size: newSize }
            : item;
        });
      }
      
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  // Correct total logic considering discounts (salePrice)
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.productId?.salePrice || item.salePrice || item.productId?.price || item.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ 
      cart, setCart, addToCart, removeFromCart, changeSize,
      updateQuantity, cartTotal, setUser, user, handleLogout 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);