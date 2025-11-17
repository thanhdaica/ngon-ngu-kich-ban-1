// File: src/pages/HomePage.jsx

// 1. Xóa import HeaderBar và Footer (vì MainLayout đã lo)
import ProductList from '../components/Product/ProductList';
import CategoryList from '../components/Category/CategoryList'; // (Đảm bảo đường dẫn này đúng)
import React from 'react';

// 2. Xóa import MainLayout (HomePage không cần nó)

const HomePage = () => {
  return (
    // 3. Xóa div, HeaderBar và Footer
    // Chỉ giữ lại nội dung chính (thẻ <main>)
    <main className="container mx-auto px-4 py-8 grow">
      <CategoryList />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Sản Phẩm Nổi Bật</h2>
        <ProductList /> 
      </div>
    </main>
  )
}

export default HomePage;