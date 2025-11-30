'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types';
import { markAsRead } from '../services/NotificationService';
import { Heart, MessageCircle, Info, Reply } from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const router = useRouter();

  // Handle click: Mark read -> Navigate
  const handleClick = async () => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    router.push(notification.link);
  };

  // Helper: Get icon based on type
  const getIcon = () => {
    switch (notification.type) {
      case 'like': return <Heart className="w-4 h-4 text-white" fill="white" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-white" />;
      case 'reply': return <Reply className="w-4 h-4 text-white" />;
      default: return <Info className="w-4 h-4 text-white" />;
    }
  };

  // Helper: Get background color based on type
  const getIconBg = () => {
    switch (notification.type) {
      case 'like': return 'bg-red-500';
      case 'comment': return 'bg-blue-500';
      case 'reply': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        flex items-center gap-3 p-4 border-b cursor-pointer transition-colors
        ${notification.isRead ? 'bg-white hover:bg-gray-50' : 'bg-green-50 hover:bg-green-100'}
      `}
    >
      {/* Icon Indicator */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconBg()}`}>
        {getIcon()}
      </div>

      {/* Avatar Sender */}
      <div className="flex-shrink-0 relative w-10 h-10">
         <Image 
           src={notification.senderPhoto || '/default-avatar.png'} // Pastikan ada default image
           alt={notification.senderName}
           fill
           className="rounded-full object-cover border-2 border-white"
         />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-gray-800">
          <span className="font-bold">{notification.senderName}</span> {notification.message}
        </p>
        <p className={`text-xs mt-1 ${notification.isRead ? 'text-gray-400' : 'text-green-600 font-semibold'}`}>
          {new Date(notification.createdAt).toLocaleDateString('id-ID', {
            hour: '2-digit', minute: '2-digit'
          })}
        </p>
      </div>

      {/* Read Indicator Dot */}
      {!notification.isRead && (
        <div className="w-2 h-2 rounded-full bg-red-500"></div>
      )}
    </div>
  );
}