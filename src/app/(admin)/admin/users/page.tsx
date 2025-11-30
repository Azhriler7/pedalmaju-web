'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Loader2, Search, ShieldAlert } from 'lucide-react';
import BanButton from '@/components/ui/BanButton';
import { getAllUsers } from '@/features/users/services/UserService';
import type { User } from '@/types';

const fallbackAvatar = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=160&q=80';

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        if (!isActive) return;
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users', err);
        if (isActive) {
          setError('Gagal memuat daftar pengguna. Coba lagi nanti.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      const nameMatch = user.displayName?.toLowerCase().includes(term);
      const emailMatch = user.email?.toLowerCase().includes(term);
      return Boolean(nameMatch || emailMatch);
    });
  }, [users, searchTerm]);

  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-accent/15 via-accent/8 to-transparent p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                <ShieldAlert size={14} />
                Panel Pengguna
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Kelola akses komunitas dengan cepat</h1>
              <p className="max-w-2xl text-sm text-foreground/70">
                Pantau anggota aktif, identifikasi peran, dan ambil tindakan moderasi hanya dalam beberapa klik. Pencarian real-time membantu Anda menemukan pengguna tertentu dengan cepat.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-background/85 p-5 shadow-inner">
              <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
                Cari pengguna
              </label>
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
                <Search size={18} className="text-foreground/50" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Ketik nama atau email..."
                  className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
                />
              </div>
              <p className="mt-2 text-xs text-foreground/50">Contoh: admin@pedalmaju.id atau nama peserta.</p>
            </div>
          </div>
        </section>

        {loading && (
          <section className="flex min-h-[40vh] items-center justify-center text-foreground/60">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat daftar pengguna...
          </section>
        )}

        {!loading && error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
            {error}
          </section>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <section className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-foreground/70">
            Tidak ditemukan pengguna yang cocok dengan pencarian.
          </section>
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <section className="grid gap-4">
            {filteredUsers.map((user) => (
              <article
                key={user.uid}
                className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-background/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border">
                    <Image
                      src={user.photoURL || fallbackAvatar}
                      alt={user.displayName || user.email || 'Pengguna PedalMaju'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{user.displayName || 'Pengguna PedalMaju'}</p>
                    <p className="text-xs text-foreground/60">{user.email ?? 'Email tidak tercatat'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                      user.role === 'admin'
                        ? 'border border-blue-200 bg-blue-50 text-blue-700'
                        : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {user.role ?? 'member'}
                  </span>
                  {user.role !== 'admin' && (
                    <BanButton userId={user.uid} userName={user.displayName || user.email || 'Pengguna'} />
                  )}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}