import React from 'react';

// 1. IMPORT CÁC FILE CON (Dùng ./ vì chúng ở chung thư mục)
import SearchBar from './SearchBar';
import NotificationButton from './NotificationButton';
import CartButton from './CartButton';
import UserAccount from './UserAccount';
import { Link } from 'react-router-dom';

// (Bạn cũng nên tạo Logo.jsx và LanguageSwitcher.jsx rồi import vào đây)
// import Logo from './Logo'; 

const HeaderBar = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-100">
        
        {/* === NHÓM BÊN TRÁI === */}
        <div className="flex items-center gap-4">
          {/* <Logo /> */}
          {/* (Nút 9 ô vuông CategorySelector ở đây) */}
          <Link to="/" className="text-xl font-bold text-indigo-600">
           <img
            src="logo3anhem.png" // <-- Thay bằng tên file của bạn (ví dụ: /logo.svg)
            alt="Logo Trang chủ"
            className="h-16 w-auto" // <-- Thêm class để chỉnh kích thước logo
          /> 
           </Link>
        </div>

        {/* === NHÓM TRUNG TÂM === */}
        <div className="grow">
          {/* 2. SỬ DỤNG COMPONENT CON */}
          <SearchBar />
        </div>

        {/* === NHÓM BÊN PHẢI === */}
        <div className="flex items-center gap-3">
          {/* 2. SỬ DỤNG COMPONENT CON */}
          <NotificationButton />
          <CartButton />
          <UserAccount />
          {/* (LanguageSwitcher ở đây) */}
        </div>

      </div>
    </header>
  );
};

export default HeaderBar;