'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 1. Import Image
import { Loader2, BookOpen, MessageSquare, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { getStudentDashboardData } from '@/features/users/services/StudentService';
import { Material, Post } from '@/types';

export default function UserDashboard() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      try {
        const data = await getStudentDashboardData();
        if (!isActive) return;
        setMaterials(data.materials);
        setPosts(data.posts);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
        // Error state diset disini
        if (isActive) setError('Gagal memuat data dashboard. Silakan refresh halaman.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadData();

    return () => { isActive = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 text-gray-500">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p>Menyiapkan ladang ilmu...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        
        {/* 2. Tampilkan Error jika ada (Fix variable unused) */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm text-center">
            {error}
          </div>
        )}

        {/* HERO SECTION */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-r from-green-50 via-white to-white p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-green-200 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-700 bg-green-50">
                Dashboard Petani
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-gray-900">
                Halo, {user?.displayName || 'Sahabat Tani'}!
              </h1>
              <p className="max-w-2xl text-base text-gray-600">
                Lanjutkan pembelajaran teknologi pertanian Anda. Akses materi terbaru dan diskusi komunitas hari ini.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row pt-2">
                <Button intent="primary" href="/materials">
                  Lihat Semua Materi
                </Button>
                <Button intent="secondary" href="/forum">
                  Buka Forum
                </Button>
              </div>
            </div>
            
            {/* Banner Image - Menggunakan Next Image */}
            <div className="relative h-48 rounded-2xl overflow-hidden shadow-md md:h-64 bg-gray-200">
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
               <Image 
                 src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80" 
                 alt="Agriculture IoT" 
                 fill
                 className="object-cover"
                 priority // Load prioritas karena di atas fold
               />
               <div className="absolute bottom-4 left-4 z-20 text-white">
                 <p className="text-xs uppercase tracking-widest opacity-90">Quote</p>
                 <p className="font-medium text-sm">&quot;Teknologi untuk pangan masa depan.&quot;</p>
               </div>
            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="grid gap-6 md:grid-cols-3">
           <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600"><BookOpen size={20} /></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Materi Tersedia</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{materials.length}</p>
              <p className="text-xs text-gray-500 mt-1">Modul siap dipelajari</p>
           </article>
           
           <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><MessageSquare size={20} /></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Diskusi Forum</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
              <p className="text-xs text-gray-500 mt-1">Interaksi komunitas terkini</p>
           </article>

           <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><TrendingUp size={20} /></div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status Akun</p>
              </div>
              <p className="text-xl font-bold text-gray-900 line-clamp-1">{user?.email || 'Guest'}</p>
              <p className="text-xs text-green-600 font-medium mt-1">Member Aktif</p>
           </article>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          
          {/* MATERI TERBARU */}
          <article className="space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Materi Terbaru</h2>
              <Link href="/materials" className="text-sm font-semibold text-green-600 hover:underline">
                Lihat Semua
              </Link>
            </div>
            
            {materials.length > 0 ? (
              <ul className="space-y-4">
                {materials.map((material) => (
                  <li key={material.id} className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-green-200 hover:bg-green-50/30">
                    <div className="flex items-center gap-4">
                      {/* Thumbnail Kecil dengan Next Image */}
                      <div className="h-12 w-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 relative">
                        {material.thumbnailUrl && (
                          <Image 
                            src={material.thumbnailUrl} 
                            alt={material.title} 
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-green-700">{material.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(material.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link href={`/materials/${material.id}`} className="text-xs font-bold text-green-600 px-3 py-1.5 bg-white rounded-lg border border-green-100 shadow-sm hover:bg-green-600 hover:text-white transition-all">
                      Buka
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 text-sm">Belum ada materi yang tersedia.</p>
              </div>
            )}
          </article>

          {/* UPDATE KOMUNITAS */}
          <article className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Diskusi Terbaru</h2>
            
            {posts.length > 0 ? (
              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-blue-100 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Avatar dengan Next Image */}
                      <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0">
                        {post.authorPhoto && (
                          <Image 
                            src={post.authorPhoto} 
                            alt={post.authorName} 
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <p className="text-xs font-bold text-gray-900">{post.authorName}</p>
                      <span className="text-[10px] text-gray-400">• {new Date(post.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    {/* 3. Fix Unescaped Quote */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">&quot;{post.content}&quot;</p>
                    <Link href={`/forum/${post.id}`} className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">
                      Lihat Diskusi <span className="text-xs">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400 text-sm">Belum ada diskusi di forum.</p>
              </div>
            )}
            
            <Button intent="secondary" size="sm" href="/forum" fullWidth>
              Gabung Forum
            </Button>
          </article>

        </section>
      </div>
    </main>
  );
}