// File: src/components/HeaderBar/CartButton.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // <-- 1. Import
import { ShoppingCart } from 'lucide-react'; 
import { Button } from '@/components/ui/button';

const CartButton = () => {
  const { cart } = useCart(); // <-- 2. Lấy giỏ hàng

  // 3. Tính tổng số lượng
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Button asChild variant="ghost" className="flex flex-col h-auto px-2 relative">
      <Link to="/cart">
        <ShoppingCart className="w-6 h-6" />
        
        
        {/* 4. Hiển thị "bong bóng" số lượng */}
        {itemCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white 
                         text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
};
export default CartButton;