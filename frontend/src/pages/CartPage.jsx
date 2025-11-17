// Tạo file: src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext'; // <-- 1. Lấy "bộ não"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CartPage() {
  const { cart, removeFromCart, loading, handleCheckout } = useCart(); // 2. Lấy state từ Context
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Đang tải giỏ hàng...</div>;
  }

  // 3. Tính tổng số sản phẩm và tổng tiền
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart?.items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  // 4. Nếu giỏ hàng rỗng
  if (itemCount === 0) {
    // Sửa: Bọc nội dung trong khung trắng, thêm icon và định dạng Link thành nút
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Giỏ hàng của bạn</h1>

        {/* Khung Card trắng  */}
        <div className="bg-white shadow-lg rounded-xl p-16 text-center"> 
          
            {/* Icon Túi hàng (Sử dụng tạm một div/span nếu không có component Icon) */}
            <span className="inline-block p-4 rounded-full bg-orange-100 text-orange-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </span>
            
          <p className="text-xl text-gray-700 mb-6">Giỏ hàng của bạn đang trống</p>
          
          <Link 
            to="/" 
            className="bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-700 transition-colors inline-block"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  // 5. Nếu giỏ hàng có đồ
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng ({itemCount} sản phẩm)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cột trái: Danh sách sản phẩm */}
        <div className="md:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product._id} className="flex items-center bg-white shadow rounded-lg p-4">
              <img src={item.product.coverUrl} alt={item.product.name} className="w-20 h-28 object-cover rounded" />
              <div className="flex-1 ml-4">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">Số lượng: {item.quantity}</p>
                <p className="text-lg font-bold text-red-600">
                  {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                </p>
              </div>
              <button 
                onClick={() => removeFromCart(item.product._id)} // <-- 6. Nút xóa
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* Cột phải: Tóm tắt đơn hàng */}
        <div className="md:col-span-1">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Tóm tắt</h2>
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span>{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <button 
              onClick={() => {
                  if (!user) {
                      toast.error("Vui lòng đăng nhập để thanh toán!");
                  } else {
                      navigate('/checkout'); // <-- CHUYỂN HƯỚNG ĐẾN TRANG THANH TOÁN
                  }
              }}
              className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg mt-6 hover:bg-red-700"
            >
              Tiến hành Thanh toán
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}