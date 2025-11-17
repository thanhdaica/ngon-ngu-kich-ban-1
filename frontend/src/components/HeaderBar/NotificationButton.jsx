import React from 'react';
import { Button } from '@/components/ui/button'; // Lấy từ shadcn ui
import { Bell } from 'lucide-react';

const NotificationButton = () => {
  return (
    <Button variant="ghost" className=" flex flex-col h-auto px-2">
      <Bell className="w-6 h-6" />
      
    </Button>
  );
};
export default NotificationButton;