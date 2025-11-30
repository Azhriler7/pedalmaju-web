'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';
import { listenToOnlineUsers } from '@/features/users/services/UserService';
import { useAuth } from '@/hooks/useAuth';

export default function OnlineStories() {
  const { user: currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  useEffect(() => {
    // Subscribe ke listener realtime
    const unsubscribe = listenToOnlineUsers((users) => {
      // Filter agar diri sendiri tidak muncul (opsional, tergantung selera)
      // setOnlineUsers(users.filter(u => u.uid !== currentUser?.uid));
      setOnlineUsers(users);
    });

    // Unsubscribe saat komponen hilang (cleanup)
    return () => unsubscribe();
  }, [currentUser]);

  // Jika tidak ada user online, sembunyikan section ini
  if (onlineUsers.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 py-4 mb-4">
      <div className="px-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Sedang Online
        </h3>
        
        {/* Container Scroll Horizontal */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {onlineUsers.map((u) => (
            <div key={u.uid} className="flex flex-col items-center min-w-[64px]">
              
              {/* Lingkaran Foto */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-green-400 to-green-600">
                  <div className="w-full h-full rounded-full border-2 border-white bg-gray-100 overflow-hidden relative">
                    <Image 
                      src={u.photoURL || '/default-avatar.png'} 
                      alt={u.displayName} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Dot Hijau (Indicator Online) */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Nama User */}
              <span className="text-[10px] text-gray-600 mt-1 text-center truncate w-16 leading-tight">
                {u.displayName?.split(' ')[0]} {/* Ambil nama depan saja */}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}