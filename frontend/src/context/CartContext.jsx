// frontend/src/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return {
    headers: { 'Authorization': `Bearer ${token}` }
  };
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); 
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // 1. Tự động lấy giỏ hàng
  useEffect(() => {
    const fetchCart = async () => {
      const config = getAuthConfig();
      if (!config) { 
        setLoading(false);
        return; 
      }
      try {
        // SỬA: Thêm http://localhost:3000
        const response = await axios.get('http://localhost:3000/api/cart', config);
        setCart(response.data);
      } catch (error) {
        console.error("Lỗi tải giỏ hàng:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]); // Thêm user vào dependency để khi đăng nhập xong nó tự load lại

  // 2. Thêm vào giỏ hàng
  const addToCart = async (productId, quantity) => {
    const config = getAuthConfig();
    if (!config) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      return; 
    }
    try {
      // SỬA: Thêm http://localhost:3000
      const response = await axios.post('http://localhost:3000/api/cart', { productId, quantity }, config);
      setCart(response.data); 
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ");
    }
  };

  // 3. Cập nhật số lượng
  const updateQuantity = async (productId, newQuantity) => {
      const config = getAuthConfig();
      if (!config) return;
      if (newQuantity < 1) return;
      try {
          // SỬA: Thêm http://localhost:3000
          const response = await axios.put('http://localhost:3000/api/cart', { productId, quantity: newQuantity }, config);
          setCart(response.data);
      } catch (error) {
          toast.error("Không thể cập nhật số lượng.");
      }
  };

  // 4. Xóa khỏi giỏ
  const removeFromCart = async (productId) => {
    const config = getAuthConfig();
    if (!config) return; 
    try {
      // SỬA: Thêm http://localhost:3000
      const response = await axios.delete(`http://localhost:3000/api/cart/${productId}`, config);
      setCart(response.data); 
      toast.success("Đã xóa khỏi giỏ hàng.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
    }
  };

  // 5. Xử lý thanh toán (Có hỗ trợ chọn sản phẩm selectedItemIds)
  const handleCheckoutAPI = async (shippingAddress, paymentMethod, selectedItemIds) => {
    const config = getAuthConfig();

    if (!config || !user) {
        toast.error("Vui lòng đăng nhập để tiến hành thanh toán!");
        return false;
    }
    
    // Gửi danh sách sản phẩm được chọn lên server
    const checkoutData = { shippingAddress, paymentMethod, selectedItemIds };

    try {
        // SỬA: Thêm http://localhost:3000
        const response = await axios.post('http://localhost:3000/api/order', checkoutData, config);
        
        // Sau khi tạo đơn, giỏ hàng ở server đã thay đổi (xóa món đã mua).
        // Ta gọi lại API lấy giỏ hàng mới nhất để cập nhật UI ngay lập tức.
        const newCartResponse = await axios.get('http://localhost:3000/api/cart', config);
        setCart(newCartResponse.data);
        
        if (paymentMethod === 'COD') {
            toast.success(`Đơn hàng #${response.data.data._id.substring(0, 8)} đã được tạo!`);
        }
        
        return response.data; 
    } catch (error) {
        console.error("Lỗi Thanh toán:", error);
        toast.error(error.response?.data?.message || "Lỗi khi tạo đơn hàng.");
        return false; 
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, loading, addToCart, updateQuantity, removeFromCart, handleCheckoutAPI }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  return useContext(CartContext);
};