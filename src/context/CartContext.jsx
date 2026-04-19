import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from "../../api"
import toast from 'react-hot-toast';
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

  const fetchCart = useCallback(async () => {
    try {
      const res = await API.get("/api/cart");
      setCart(res.data || []);
    } catch (err) {
      console.error("Error fetching cart:", err.message);
    }
  }, []);

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
    toast.success("SESSION_TERMINATED: ARCHIVE_LOCKED");
    window.location.href = '/login'; 
  };

  const addToCart = (product) => {
    if (!user) {
      toast.error("Please Sign In to access the Archive.");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => {
        const pId = item.productId?._id || item.productId;
        return (
          pId === product._id && 
          item.size === product.size && 
          item.color === product.color
        );
      });

      const currentQty = existingItem ? existingItem.quantity : 0;
      const stockAvailable = product.stock ?? 0; 
      
      if (currentQty + 1 > stockAvailable) {
       toast.error(`INVENTORY_CONFLICT: LIMIT_${stockAvailable}_REACHED`, {
    icon: '⚠️',
    duration: 3000,
  });
  return prevCart;
}

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
        return !(pId === productId && item.size === size && item.color === color);
      });
      syncCartWithDB(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId, size, color, delta) => {
    setCart((prevCart) => {
      const itemToUpdate = prevCart.find((item) => {
        const pId = item.productId?._id || item.productId;
        return pId === productId && item.size === size && item.color === color;
      });

      if (itemToUpdate) {
        const newQty = itemToUpdate.quantity + delta;
        const stockLimit = itemToUpdate.productId?.countInStock || itemToUpdate.countInStock || 99;

        if (newQty > stockLimit) {
          toast.error(`Inventory_Limit: Cannot exceed ${stockLimit} units.`);
          return prevCart;
        }

        if (newQty < 1) return prevCart;

        const newCart = prevCart.map((item) => {
          const pId = item.productId?._id || item.productId;
          if (pId === productId && item.size === size && item.color === color) {
            return { ...item, quantity: newQty };
          }
          return item;
        });

        syncCartWithDB(newCart);
        return newCart;
      }
      return prevCart;
    });
  };

  const changeSize = (productId, color, oldSize, newSize) => {
    setCart((prevCart) => {
      const existingInNewSize = prevCart.find((item) => {
        const pId = item.productId?._id || item.productId;
        return pId === productId && item.color === color && item.size === newSize;
      });

      let newCart;
      if (existingInNewSize) {
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