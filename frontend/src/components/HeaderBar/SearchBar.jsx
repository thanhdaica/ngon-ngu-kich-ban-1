import React from 'react';
import { Input } from '@/components/ui/input';  // Đảm bảo đường dẫn đúng
import { Button } from '@/components/ui/button'; // Đảm bảo đường dẫn đúng
import { Search } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="flex w-full grow overflow-hidden rounded-lg bg-gray-50 shadow-inner">
      <Input
        type="search"
        placeholder="Tìm kiếm sách "
        // Tắt border và ring của input để nó liền mạch
        className="border-none grow focus-visible:ring-0 focus-visible:ring-offset-0 py-2 text-xl placeholder:text-lg"
      />
      <Button className="bg-primary hover:bg-primary-dark rounded-l-none">
        <Search className="w-5 h-5" /> 
       </Button>
    </div>
  );
};

export default SearchBar;