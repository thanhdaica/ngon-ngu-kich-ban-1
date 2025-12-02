// frontend/src/App.jsx
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from './layouts/MainLayout'; 
import AdminLayout from './layouts/AdminLayout'; 

// Pages
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import CategoryDetailPage from './pages/CategoryDetailPage';
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage"; 
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentResultPage from './pages/PaymentResultPage'; // <-- Import trang mới

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminBookList from './pages/admin/AdminBookList';
import AdminBookForm from './pages/admin/AdminBookForm';
import AdminUserList from './pages/admin/AdminUserList';

function App() {
  return (
    <>
      <Toaster richColors />
      
      <BrowserRouter> 
        <Routes>
          
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:id" element={<CategoryDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/book/:id" element={<ProductDetailPage />} />
            
            {/* Thay thế route cũ của MoMo bằng Route kết quả VNPay */}
            <Route path="/payment-result" element={<PaymentResultPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
             <Route path="/admin/orders" element={<AdminOrderList />} /> 
             <Route path="/admin/order/:id" element={<AdminOrderDetail />} />
             <Route path="/admin/books" element={<AdminBookList />} />
             <Route path="/admin/books/add" element={<AdminBookForm />} />
             <Route path="/admin/books/edit/:id" element={<AdminBookForm />} />
             <Route path="/admin/users" element={<AdminUserList />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} /> 
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;