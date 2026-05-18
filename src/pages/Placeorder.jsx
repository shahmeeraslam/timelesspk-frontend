import React, { useState, useMemo, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import CheckoutLogistics from "../components/placeorder/CheckoutLogistics";
import CheckoutManifest from "../components/placeorder/CheckoutManifest";
import API from "../../api";
import toast from "react-hot-toast";

const PlaceOrder = () => {
  const { cart, setCart, user, setUser } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [useProfileAddress, setUseProfileAddress] = useState(true);
  
  const method = "cod";

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", country: "Pakistan", phone: ""
  });

  const hasValidProfileAddress = useMemo(() => {
    if (!user || !user.shippingAddress) return false;
    const addr = user.shippingAddress;
    return !!(
      user.name &&
      user.email &&
      addr.street?.trim() &&
      addr.city?.trim() &&
      addr.state?.trim() &&
      addr.phone?.trim()
    );
  }, [user]);

  useEffect(() => {
    if (user) {
      if (useProfileAddress) {
        if (hasValidProfileAddress) {
          const nameParts = user.name ? user.name.split(" ") : ["", ""];
          setFormData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email || "",
            street: user.shippingAddress?.street || "",
            city: user.shippingAddress?.city || "",
            state: user.shippingAddress?.state || "",
            zipcode: user.shippingAddress?.zipCode || user.shippingAddress?.zipcode || "",
            country: user.shippingAddress?.country || "Pakistan",
            phone: user.shippingAddress?.phone || ""
          });
        } else {
          setUseProfileAddress(false);
          toast.error("PROFILE_LOGISTICS_INCOMPLETE: ENTER MANUAL MANIFEST");
        }
      }
    } else {
      setUseProfileAddress(false);
    }
  }, [useProfileAddress, user, hasValidProfileAddress]);

  const totals = useMemo(() => {
    return cart.reduce((acc, item) => {
      const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
      const basePrice = pData.price || 0;
      const discountPercent = pData.discount || 0;
      const originalItemTotal = basePrice * item.quantity;
      const discountedItemPrice = basePrice * (1 - discountPercent / 100);
      const discountedItemTotal = discountedItemPrice * item.quantity;
      
      acc.subtotal += originalItemTotal;
      acc.total += discountedItemTotal;
      return acc;
    }, { subtotal: 0, total: 0 });
  }, [cart]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      firstName: "", lastName: "", email: "", street: "",
      city: "", state: "", zipcode: "", country: "Pakistan", phone: ""
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error("MANIFEST_EMPTY");

    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].trim());

    if (missingFields.length > 0) {
      return toast.error(`CRITICAL_METADATA_MISSING: ${missingFields.join(', ').toUpperCase()}`);
    }

    const cleanPhone = formData.phone.trim();
    if (!/^\d{11}$/.test(cleanPhone)) {
      return toast.error("VALIDATION_ERROR: PHONE_MUST_BE_11_DIGITS");
    }

    setIsProcessing(true);
    try {
      if (!useProfileAddress && user) {
        try {
          const addressPayload = {
            street: formData.street.trim(),
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipcode.trim(),
            country: formData.country,
            phone: cleanPhone
          };

          const profileResponse = await API.put("/api/auth/update-address", { address: addressPayload });
          
          if (profileResponse.data?.shippingAddress) {
            const updatedUser = { ...user, shippingAddress: profileResponse.data.shippingAddress };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            if (setUser) setUser(updatedUser);
          }
        } catch (addrErr) {
          console.error("BACKGROUND_PROFILE_SYNC_FAILED", addrErr);
        }
      }

      const orderData = {
        address: { ...formData, phone: cleanPhone },
        items: cart.map(item => {
          const pData = item.productId && typeof item.productId === 'object' ? item.productId : item;
          return {
            productId: pData._id || item.productId,
            name: pData.name || item.name || "Archive_Item",
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: pData.price || item.price || 0,
            image: pData.image || [], 
            category: pData.category || "General", 
            img: pData.img || (pData.image?.[0]?.url) || "" 
          };
        }),
        amount: Math.round(totals.total), 
        paymentMethod: method
      };

      const response = await API.post("/api/orders/place", orderData);
      if (response.data.success) {
        toast.success("MANIFEST_LOGGED: ARCHIVE_UPDATED");
        if (setCart) setCart([]); 
        navigate("/orders");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "TERMINAL_FAILURE");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-black text-white">
        <form onSubmit={handlePlaceOrder} className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-24">
          
          <CheckoutLogistics 
            formData={formData}
            onInputChange={onInputChange}
            useProfileAddress={useProfileAddress}
            setUseProfileAddress={setUseProfileAddress}
            hasValidProfileAddress={hasValidProfileAddress}
            clearForm={clearForm}
            isProcessing={isProcessing}
          />

          <CheckoutManifest 
            cart={cart}
            totals={totals}
          />

        </form>
      </div>
    </PageTransition>
  );
};

export default PlaceOrder;