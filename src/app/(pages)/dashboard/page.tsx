'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { getShopIdForCurrentUser } from '@/app/actions/shopActions';
import DashboardComponent from './dashboard_component';
export default function DashboardPage() {
  const [hasShop, setHasShop] = useState<boolean | null>(null);
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [shopId, setShopId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoaded && userId) {
      checkUserShop();
    }
  }, [isLoaded, userId]);

  useEffect(() => {
    async function fetchShopId() {
      try {
        const id = await getShopIdForCurrentUser();
        setShopId(id);
      } catch (error) {
        console.error("Failed to fetch shop ID:", error);
        // Handle error (e.g., show error message to user)
      }
    }

    fetchShopId();
  }, []);

  const checkUserShop = async () => {
    try {
      const storedHasShop = localStorage.getItem('hasShop');
      if (storedHasShop !== null) {
        setHasShop(storedHasShop === 'true');
        if (storedHasShop === 'false') {
          router.push('/onboarding');
        }
        return;
      }

      const response = await fetch('/api/user-shop');
      if (response.ok) {
        setHasShop(true);
        localStorage.setItem('hasShop', 'true');
      } else {
        setHasShop(false);
        localStorage.setItem('hasShop', 'false');
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error checking user shop:', error);
      setHasShop(false);
      localStorage.setItem('hasShop', 'false');
      router.push('/onboarding');
    }
  };

  if (hasShop === null) {
    return <div>Loading...</div>;
  }

  if (!hasShop) {
    return null; // Will redirect to onboarding
  }

  // Your existing dashboard content
  return (
    <DashboardComponent/>
);
}