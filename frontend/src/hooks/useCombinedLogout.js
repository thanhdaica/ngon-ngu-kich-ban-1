// src/hooks/useCombinedLogout.js
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook tùy chỉnh gộp logic Đăng xuất (Auth) và Xóa Giỏ hàng (Cart).
 * Hook này phải được sử dụng trong các component có nút Đăng xuất.
 */
export const useCombinedLogout = () => {
    // 1. Lấy các hàm từ Context
    const { logout } = useAuth(); // Hàm logout chỉ xóa token/user (AuthContext)
    const { setCart } = useCart(); // Hàm xóa giỏ hàng (CartContext)
    const navigate = useNavigate();

    // 2. Hàm xử lý logic tổng hợp
    const combinedLogout = () => {
        // Thực hiện logic xóa Auth
        logout(); 
        
        // Thực hiện logic xóa Cart
        if (setCart) {
            setCart(null); 
        }
        
        toast.info("Bạn đã đăng xuất thành công."); 
        
        // Chuyển hướng về trang chủ hoặc trang đăng nhập
        navigate('/'); 
    };

    return combinedLogout;
};