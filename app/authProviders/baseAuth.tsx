"use client"
import React, { useEffect } from 'react'
import { useAuth } from '@/authentication/authentication';
const BaseAuth = () => {
  const { isHydrated,isAuthenticated } = useAuth();
  useEffect(() => {
    if(isHydrated && !isAuthenticated()) {
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
  })
  return null;
}

export default BaseAuth