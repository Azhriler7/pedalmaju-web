'use client';

import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { updateUserStatus } from '@/features/users/services/UserService';

export function usePresence() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // 1. Set online saat pertama kali load
    updateUserStatus(user.uid, true);

    // 2. Heartbeat: Update 'lastSeen' setiap 2 menit
    // Agar jika browser crash, dia akan dianggap offline setelah beberapa menit
    const interval = setInterval(() => {
      updateUserStatus(user.uid, true);
    }, 10 * 1000);

    // 3. Set offline saat user menutup tab / pindah halaman (Cleanup)
    const handleOffline = () => updateUserStatus(user.uid, false);
    window.addEventListener('beforeunload', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleOffline);
      // Optional: Set offline saat unmount component
      // updateUserStatus(user.uid, false); 
    };
  }, [user]);
}