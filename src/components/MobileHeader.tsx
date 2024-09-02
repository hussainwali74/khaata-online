import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function MobileHeader({ title, onMenuClick }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
      <h1 className="text-xl font-bold">{title}</h1>
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
}