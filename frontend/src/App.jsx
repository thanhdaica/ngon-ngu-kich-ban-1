import {Toaster} from 'sonner';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Import Layout (vỏ bọc)
import MainLayout from './layouts/MainLayout'; 

// 2. Import các trang (ruột)
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import CategoryDetailPage from './pages/CategoryDetailPage';
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage"; 
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
// (Bạn cũng cần import BookDetailPage khi tạo nó)


function App() {

  return (
    <>
      <Toaster richColors />
      
      <BrowserRouter> 
        <Routes>
          
          {/* === 3. LOGIC SỬA ĐỔI NẰM Ở ĐÂY === */}

          {/* A. Các trang CÔNG KHAI (có Header/Footer) */}
          {/* Bọc các trang này trong MainLayout */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/category/:id"
              element={<CategoryDetailPage />}
            />
            <Route 
              path="/cart" 
              element={<CartPage />} 
            />
            <Route 
              path="/checkout" 
              element={<CheckoutPage />} 
            />
            <Route path="/book/:id" 
            element={<ProductDetailPage />} 
            />

            {/* (Thêm <Route path="/book/:id" ... /> vào đây khi bạn tạo) */}
          </Route>

          {/* B. Các trang RIÊNG (không có Header/Footer) */}
          {/* Để các trang này bên ngoài MainLayout */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} /> 
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;