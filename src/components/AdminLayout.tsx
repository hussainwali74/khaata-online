'use client';

import React, { useState } from 'react';
import { MobileHeader } from '@/components/MobileHeader';
import { AdminNavbar } from '@/components/AdminNavbar';
import { MobileNavbar } from '@/components/MobileNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden md:block">
        <AdminNavbar  />
      </div>
      <MobileNavbar />
      <div className="flex-grow flex flex-col md:flex-row">
        <div className={`md:w-64 bg-gray-100 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
          {/* Sidebar content */}
          {/* Add your sidebar navigation items here */}
        </div>
        <main className="flex-grow p-4">
          <MobileHeader title={title} onMenuClick={toggleMobileMenu} />
          {children}
        </main>
      </div>
    </div>
  );
}