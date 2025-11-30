import React from 'react';
import Button from '@/components/ui/Button';
import { getAdminStats } from '@/features/users/services/AdminService'; 

// Data Navigasi (Aman karena hanya Link)
const quickActions = [
  {
    title: 'Publikasikan Materi Baru',
    description: 'Tambahkan modul atau artikel pembelajaran terbaru untuk komunitas.',
    ctaLabel: 'Tambah Materi',
    ctaHref: '/admin/materials/create',
    intent: 'primary' as const,
  },
  {
    title: 'Kelola Perpustakaan Materi',
    description: 'Perbarui, arsipkan, atau tinjau materi yang sudah ada.',
    ctaLabel: 'Kelola Materi',
    ctaHref: '/admin/materials',
    intent: 'secondary' as const,
  },
  {
    title: 'Moderasi Forum Komunitas',
    description: 'Pantau diskusi terbaru dan tangani laporan pengguna.',
    ctaLabel: 'Buka Forum',
    ctaHref: '/admin/forum',
    intent: 'secondary' as const,
  },
];

export default async function AdminDashboard() {
  // Ambil Data Real
  const stats = await getAdminStats();

  const summaryCards = [
    {
      title: 'Total Pengguna',
      description: 'Pengguna terdaftar',
      value: stats.totalUsers.toString(),
      highlight: true
    },
    {
      title: 'Materi Terbit',
      description: 'Konten edukasi aktif',
      value: stats.totalMaterials.toString(),
      highlight: false
    },
    {
      title: 'Post Forum',
      description: 'Diskusi komunitas',
      value: stats.totalPosts.toString(),
      highlight: false
    },
  ];

  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        
        {/* HEADER */}
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
            Ringkasan Platform
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard Admin</h1>
          <p className="text-base text-gray-600">
            Pantau performa komunitas dan materi pembelajaran secara real-time.
          </p>
        </header>

        {/* STATS GRID (DATA ASLI) */}
        <section className="grid gap-6 md:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                {card.description}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-gray-700">{card.title}</h3>
              <p className={`mt-4 text-3xl font-bold ${card.highlight ? 'text-green-600' : 'text-gray-900'}`}>
                {card.value}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          
          {/* QUICK ACTIONS */}
          <article className="space-y-6 rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Aksi Cepat</h2>
                <p className="text-sm text-gray-500">Optimalkan operasional admin dengan shortcut berikut.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                  <Button href={action.ctaHref} intent={action.intent} size="sm" fullWidth>
                    {action.ctaLabel}
                  </Button>
                </div>
              ))}
            </div>
          </article>

          {/* RECENT ACTIVITIES (DATA ASLI DARI LOG) */}
          <article className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Aktivitas Terbaru</h2>
            
            {stats.recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentActivities.map((activity, index) => (
                  <li key={index} className="border-l-2 border-green-300 pl-4">
                    <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-gray-400 text-sm italic border border-dashed rounded-xl">
                Belum ada aktivitas user atau materi baru.
              </div>
            )}
          </article>

        </section>
      </div>
    </main>
  );
}