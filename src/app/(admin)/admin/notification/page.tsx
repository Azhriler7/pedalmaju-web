'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getUserNotifications, markAllAsRead } from '@/features/notifications/services/NotificationService';
import NotificationItem from '@/features/notifications/components/NotificationItem';
import { Notification } from '@/types';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';
import Spinner from '@/components/ui/Spinner';
import Link from 'next/link';

export default function AdminNotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const FIRESTORE_INDEX_URL =
    'https://console.firebase.google.com/v1/r/project/pedalmaju-6ee0e/firestore/indexes?create_composite=ClVwcm9qZWN0cy9wZWRhbG1hanUtNmVlMGUvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL25vdGlmaWNhdGlvbnMvaW5kZXhlcy9fEAEaDwoLcmVjaXBpZW50SWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC';

  const handleReload = () => window.location.reload();

  // Fetch notifications on load
  useEffect(() => {
    const fetchNotifs = async () => {
      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getUserNotifications(user.uid);
        setNotifications(data);
      } catch (error) {
        console.error('Failed to load notifications', error);
        const firebaseError = error as { code?: string; message?: string };
        if (firebaseError.code === 'failed-precondition' && firebaseError.message?.includes('index')) {
          setErrorMessage('Halaman notifikasi memerlukan Firestore composite index. Buat index terlebih dahulu lalu muat ulang halaman.');
        } else {
          setErrorMessage('Tidak dapat memuat notifikasi saat ini. Coba lagi beberapa saat.');
        }
      } finally {
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
      {/* Back Button */}
      <div className="px-4 pb-4">
        <Link
          href="/admin/forum"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Forum Admin
        </Link>
      </div>

      {errorMessage && (
        <div className="mx-4 mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-medium">{errorMessage}</p>
          {errorMessage.includes('index') && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link
                href={FIRESTORE_INDEX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-200"
              >
                Buka konfigurasi index
              </Link>
              <button
                onClick={handleReload}
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Muat ulang setelah membuat index
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <div className="sticky top-16 z-10 border-b border-gray-100 bg-white/90 px-4 pb-4 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-blue-100 p-2 text-blue-600">
              <Bell size={18} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Notifikasi Admin</h1>
              <p className="text-sm text-gray-500">Pantau interaksi terbaru dari komunitas dan materi dalam sistem.</p>
            </div>
          </div>

          {notifications.some(n => !n.isRead) && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs inline-flex items-center gap-1 self-start rounded-full border border-blue-200 px-3 py-1 font-semibold uppercase tracking-[0.24em] text-blue-600 transition hover:border-blue-300 hover:text-blue-700 sm:self-auto"
            >
              <CheckCheck size={14} />
              Tandai semua dibaca
            </button>
          )}
        </div>
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