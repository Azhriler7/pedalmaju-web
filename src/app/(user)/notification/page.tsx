'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserNotifications, markAllAsRead } from '@/features/notifications/services/NotificationService';
import NotificationItem from '@/features/notifications/components/NotificationItem';
import { Notification } from '@/types';
import { Bell, CheckCheck } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on load
  useEffect(() => {
    const fetchNotifs = async () => {
      if (user) {
        const data = await getUserNotifications(user.uid);
        setNotifications(data);
        setLoading(false);
      }
    };
    fetchNotifs();
  }, [user]);

  // Handle Mark All Read
  const handleMarkAllRead = async () => {
    if (!user) return;
    
    // Optimistic Update (Update UI dulu biar cepat)
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    await markAllAsRead(user.uid);
  };

  if (loading) return <div className="p-10 flex justify-center"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto py-6 bg-white min-h-screen shadow-sm border-x border-gray-100">
      
      {/* Header */}
      <div className="px-4 pb-4 border-b flex items-center justify-between sticky top-16 bg-white/90 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Bell className="text-green-600" />
          <h1 className="text-xl font-bold text-gray-900">Notifikasi</h1>
        </div>
        
        {notifications.some(n => !n.isRead) && (
          <button 
            onClick={handleMarkAllRead}
            className="text-xs flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
          >
            <CheckCheck size={14} />
            Tandai semua dibaca
          </button>
        )}
      </div>

      {/* List */}
      <div>
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <NotificationItem key={notif.id} notification={notif} />
          ))
        ) : (
          <div className="text-center py-20 text-gray-400">
            <Bell size={48} className="mx-auto mb-4 opacity-20" />
            <p>Belum ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
}