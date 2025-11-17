import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  
  // --- Dữ liệu và tính toán (an toàn) ---
  const price = product.price || 0;
  const originalPrice = product.originalPrice || 0;
  const soldQuantity = product.soldQuantity || 0;
  const stockStatus = product.stockStatus || 'inStock';

  const discountPercent = (originalPrice > price)
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link 
      to={`/book/${product._id}`} 
      className="card bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden block border border-gray-200"
    >
      
      {/* Phần hình ảnh (với các tag) */}
      <div className="relative w-full aspect-[3/4]"> 
        <img 
          src={product.coverUrl || 'https://via.placeholder.com/300x400?text=No+Image'} 
          alt={product.name} 
          className="object-cover w-full h-full"
        />
        
        {stockStatus === 'inStock' && (
          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-semibold">
            Sắp Có Hàng
          </span>
        )}
        
        
      </div>
      
      {/* Phần thông tin */}
      <div className="p-3">
        {/* Tên sản phẩm */}
        <h3 className="text-sm font-medium text-gray-800 h-10 overflow-hidden text-ellipsis">
          {product.name}
        </h3>

      {/* Giá */}
        <div className="mt-2 flex items-baseline flex-wrap">
          <span className="text-lg font-bold text-red-600">
            {price.toLocaleString('vi-VN')}đ
          </span>
          {discountPercent > 0 && (
            <span className="ml-2 text-xs text-gray-500 line-through">
              {originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>

        {discountPercent > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-md font-bold">
              -{discountPercent}%
            </span>
          )}

        {/* Thanh "Đã bán" */}
        {soldQuantity > 0 && (
          <div className="mt-2">
            <div className="relative w-full bg-red-100 rounded-full h-4">
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-red-700">
                Đã bán {soldQuantity}
              </span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}