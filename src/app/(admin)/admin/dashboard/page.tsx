'use client';

import React from 'react';
import Button from '@/components/ui/Button';

const stats = [
  {
    title: 'Total Pengguna',
    value: '1.234',
    description: 'Pengguna terdaftar',
    trend: '+3.2% bulan ini',
  },
  {
    title: 'Materi Terbit',
    value: '56',
    description: 'Artikel dan konten edukasi',
    trend: '+8 materi baru',
  },
  {
    title: 'Post Forum',
    value: '789',
    description: 'Diskusi aktif',
    trend: '+42 interaksi',
  },
  {
    title: 'Retensi Pengguna',
    value: '86%',
    description: 'Pengguna aktif 7 hari',
    trend: '+4.5% dibanding minggu lalu',
  },
];

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

const performanceHighlights = [
  { label: 'Tingkat Penyelesaian Materi', value: '72%', detail: 'Rata-rata peserta menyelesaikan modul' },
  { label: 'Pertumbuhan Komunitas', value: '+128', detail: 'Pengguna baru 30 hari terakhir' },
  { label: 'Rasio Respons Forum', value: '92%', detail: 'Pertanyaan terjawab dalam 24 jam' },
];

const recentActivities = [
  { action: 'Pengguna baru mendaftar', time: '2 jam lalu' },
  { action: 'Materi “IoT Sensor Tanah” dipublikasikan', time: '5 jam lalu' },
  { action: 'Diskusi “Kalibrasi Sensor” mencapai 50 balasan', time: '1 hari lalu' },
  { action: 'Admin menandai post sebagai unggulan', time: '2 hari lalu' },
];

export default function AdminDashboard() {
  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-foreground/50">
            Ringkasan Platform
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
          <p className="text-base text-foreground/70">
            Pantau performa komunitas, materi pembelajaran, dan aktivitas forum secara real-time.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-2xl border border-border bg-background/95 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-white/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
                {stat.description}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{stat.title}</h3>
              <p className="mt-4 text-3xl font-bold text-accent">{stat.value}</p>
              <p className="mt-2 text-sm text-foreground/70">{stat.trend}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <article className="space-y-6 rounded-3xl border border-border bg-muted/10 p-6 shadow-sm dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Aksi Cepat</h2>
                <p className="text-sm text-foreground/60">Optimalkan operasional admin dengan shortcut berikut.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-background/95 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-white/10"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground">{action.title}</h3>
                    <p className="text-sm text-foreground/70">{action.description}</p>
                  </div>
                  <Button href={action.ctaHref} intent={action.intent} size="sm">
                    {action.ctaLabel}
                  </Button>
                </div>
              ))}
            </div>
          </article>

          <article className="space-y-4 rounded-3xl border border-border bg-background/95 p-6 shadow-sm dark:border-white/10">
            <div>
              <h2 className="text-xl font-semibold">Performa Komunitas</h2>
              <p className="text-sm text-foreground/60">Indikator utama ekosistem belajar PedalMaju.</p>
            </div>
            <div className="space-y-4">
              {performanceHighlights.map((item) => (
                <div key={item.label} className="rounded-xl border border-border/70 bg-muted/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground/80">{item.label}</p>
                    <span className="text-lg font-semibold text-accent">{item.value}</span>
                  </div>
                  <p className="mt-2 text-xs text-foreground/60">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <article className="space-y-4 rounded-3xl border border-border bg-background/95 p-6 shadow-sm dark:border-white/10">
            <h2 className="text-xl font-semibold">Aktivitas Terbaru</h2>
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="border-l-2 border-accent/40 pl-4">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-foreground/60">{activity.time}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="space-y-5 rounded-3xl border border-border bg-background/95 p-6 shadow-sm dark:border-white/10">
            <h2 className="text-xl font-semibold">Catatan Admin</h2>
            <p className="text-sm text-foreground/70">
              Review singkat area yang membutuhkan perhatian admin minggu ini.
            </p>
            <ul className="space-y-3 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                12 laporan forum menunggu tindak lanjut moderasi.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                4 materi populer siap diperbarui dengan data sensor terbaru.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                Jadwalkan sesi tanya jawab komunitas untuk topik IoT minggu depan.
              </li>
            </ul>
            <Button intent="secondary" href="/admin/forum" size="sm">
              Lihat Detail Forum
            </Button>
          </article>
        </section>
      </div>
    </main>
  );
}