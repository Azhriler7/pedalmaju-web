'use client';

import React, { useState } from 'react';
import { UserX } from 'lucide-react';

interface BanButtonProps {
  userId: string;
  userName: string;
}

export default function BanButton({ userId, userName }: BanButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBan = async () => {
    // 1. Konfirmasi agar tidak salah klik
    const confirm = window.confirm(`YAKIN ingin mem-banned user "${userName}" selamanya? Tindakan ini menghapus akun login & datanya.`);
    if (!confirm) return;

    setLoading(true);

    try {
      // 2. Panggil API Route yang sudah Anda buat
      const response = await fetch('/api/admin/ban-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdToBan: userId }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error);

      alert('User berhasil dimusnahkan.');
      window.location.reload(); 
    } catch (error: unknown) {
      let message = 'Unknown error';
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      } else {
        try {
          message = JSON.stringify(error);
        } catch {
          message = String(error);
        }
      }
      alert(`Gagal ban user: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBan}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-bold transition-colors"
    >
      <UserX size={14} />
      {loading ? 'Memproses...' : 'BAN USER'}
    </button>
  );
}