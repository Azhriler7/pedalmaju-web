'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';
import { getOnlineUsers } from '../services/UserService';

export default function OnlineUserList() {
  const [users, setUsers] = useState<User[]>([]);

  // Refresh data setiap 1 menit
  useEffect(() => {
    const fetchUsers = async () => {
      const onlineUsers = await getOnlineUsers();
      setUsers(onlineUsers);
    };

    fetchUsers(); // Fetch awal
    const interval = setInterval(fetchUsers, 60000); // Fetch ulang tiap menit

    return () => clearInterval(interval);
  }, []);

  if (users.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        User Online ({users.length})
      </h3>
      
      <div className="flex flex-col gap-3">
        {users.map((u) => (
          <div key={u.uid} className="flex items-center gap-2">
            <div className="relative w-8 h-8">
              <Image 
                src={u.photoURL || '/default-avatar.png'} 
                alt={u.displayName} 
                fill
                className="rounded-full object-cover border border-gray-100"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {u.displayName}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                {u.role === 'admin' ? 'Admin' : 'Petani'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}