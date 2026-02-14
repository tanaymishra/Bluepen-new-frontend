'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from './authStore';

export const useAuth = () => {
  const [isMounted, setIsMounted] = useState(false);
  const authStore = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Wrap storeUser in useCallback to maintain reference
  const storeUser = useCallback((userData: any) => {
    if (!isMounted) {
      // Queue the store operation for next tick if not mounted
      setTimeout(() => {
        authStore.storeUser(userData);
      }, 0);
      return;
    }
    authStore.storeUser(userData);
  }, [isMounted, authStore.storeUser]);

  // Return wrapped functions that check mounting state
  return {
    ...authStore,
    storeUser,
    isHydrated: isMounted && authStore.isHydrated,
    isMounted,
  };
};