import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
 <StrictMode>
    {/* 1. AuthProvider phải bao bọc ngoài cùng */}
    <AuthProvider> 
      {/* 2. CartProvider nằm bên trong (vì nó gọi useAuth) */}
      <CartProvider> 
        <App />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
