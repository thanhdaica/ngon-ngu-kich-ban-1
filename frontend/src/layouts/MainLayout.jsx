// src/layouts/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Cái "lỗ"
import HeaderBar from '../components/HeaderBar/HeaderBar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full relative bg-white">
  {/* Teal Glow Left */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: "#ffffff",
      backgroundImage: `
        radial-gradient(
          circle at top left,
          rgba(56, 193, 182, 0.5),
          transparent 70%
        )
      `,
      filter: "blur(80px)",
      backgroundRepeat: "no-repeat",
    }}
  />
     {/* Your Content/Components */}
     <div className="flex flex-col min-h-screen relative z-10">
      <HeaderBar />
      <main className="flex-grow">
        {/* React Router sẽ tự động "nhét" 
          HomePage hoặc BookDetailPage vào đây 
        */}
        <Outlet /> 
      </main>
      <Footer />
    </div>
</div>

    
  );
};
export default MainLayout;