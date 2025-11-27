'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';

const learningStats = [
  {
    title: 'Materi Diselesaikan',
    value: '18',
    detail: '+3 minggu ini',
  },
  {
    title: 'Jam Belajar',
    value: '42',
    detail: 'Dalam 30 hari terakhir',
  },
  {
    title: 'Badge Keahlian',
    value: '4',
    detail: 'IoT, Hidroponik, Sensor',
  },
];

const activeTracks = [
  {
    title: 'IoT Sensor Dasar',
    description: 'Kuasai monitoring kelembapan dan suhu lahan.',
    progress: 68,
    nextSession: 'Modul berikutnya: Kalibrasi Sensor Tanah',
    ctaLabel: 'Lanjutkan Belajar',
    ctaHref: '/user/materials/sensor-dasar',
  },
  {
    title: 'Analitik Data Lapangan',
    description: 'Pelajari cara membaca pola data panen dan cuaca.',
    progress: 42,
    nextSession: 'Modul berikutnya: Dashboard Alert Otomatis',
    ctaLabel: 'Lanjutkan Modul',
    ctaHref: '/user/materials/analitik-data',
  },
];

const recommendedMaterials = [
  {
    title: 'Automasi Irigasi Cerdas',
    type: 'Artikel',
    duration: '12 menit baca',
    href: '/user/materials/otomasi-irigasi',
  },
  {
    title: 'Membangun Notifikasi WhatsApp',
    type: 'Video',
    duration: '18 menit',
    href: '/user/materials/notifikasi-whatsapp',
  },
  {
    title: 'Checklist Kalibrasi Mingguan',
    type: 'Template',
    duration: 'Unduh PDF',
    href: '/user/materials/checklist-kalibrasi',
  },
];

const communityUpdates = [
  { author: 'Mentor Andi', message: 'Menjawab pertanyaan Anda tentang sensor pH.', time: '30 menit lalu' },
  { author: 'Sari (Komunitas Bandung)', message: 'Mengunggah foto panen cabai terbaru.', time: '2 jam lalu' },
  { author: 'Moderator', message: 'Menandai diskusi “Otomasi Irigasi” sebagai unggulan.', time: 'Kemarin' },
];

const fieldStories = [
  {
    title: 'Demo Sistem IoT di Lahan Kopi',
    location: 'Garut, Jawa Barat',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    highlight: 'Tim sukses menurunkan penggunaan air 15% dengan sensor kelembapan.',
  },
  {
    title: 'Kunjungan Lapangan Petani Muda',
    location: 'Lembang, Bandung',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=900&q=80',
    highlight: 'Workshop instalasi sensor dan dashboard ringkas di greenhouse.',
  },
];

export default function UserDashboard() {
  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-8 shadow-sm">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                Selamat datang kembali
              </span>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Halo, Rizal! Lanjutkan perjalanan belajar pertanian cerdasmu.
              </h1>
              <p className="max-w-2xl text-base text-foreground/70">
                Pantau progress, lanjutkan materi yang tertunda, dan lihat aktivitas terbaru komunitas PedalMaju.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button intent="primary" href="/user/materials/sensor-dasar">
                  Lanjutkan Modul Terakhir
                </Button>
                <Button intent="secondary" href="/user/forum">
                  Buka Forum Komunitas
                </Button>
              </div>
            </div>
            <div className="relative h-48 rounded-2xl border border-border bg-gradient-to-br from-accent/20 via-accent/10 to-transparent p-6 shadow-inner md:h-full">
              <div
                className="absolute inset-0 rounded-2xl opacity-80"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, rgba(31,138,76,0.25), rgba(31,138,76,0.05)), url('https://images.unsplash.com/photo-1500904156668-758cff89dcff?auto=format&fit=crop&w=900&q=80')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative flex h-full flex-col justify-between text-white">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.3em] text-white/80">Target Minggu Ini</p>
                  <h2 className="text-2xl font-semibold leading-tight">
                    Selesaikan modul “Dashboard Alert Otomatis” untuk memantau lahan secara real-time.
                  </h2>
                </div>
                <div>
                  <Button intent="secondary" size="sm" href="/user/materials/analitik-data" className="border-white/60 text-white hover:bg-white/10">
                    Lihat Detail Modul
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {learningStats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-2xl border border-border bg-background/95 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-white/10"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">{stat.detail}</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{stat.title}</h3>
              <p className="mt-4 text-3xl font-bold text-accent">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Jalur Pembelajaran Aktif</h2>
            <Link href="/user/materials" className="text-sm font-semibold text-accent hover:underline">
              Lihat semua kelas
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {activeTracks.map((track) => (
              <article
                key={track.title}
                className="flex h-full flex-col justify-between gap-4 rounded-3xl border border-border bg-muted/10 p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-white/10"
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">{track.title}</h3>
                  <p className="text-sm text-foreground/70">{track.description}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    {track.nextSession}
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="h-2 rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${track.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-foreground/60">
                    <span>Progress</span>
                    <span>{track.progress}%</span>
                  </div>
                  <Button intent="primary" href={track.ctaHref} size="sm">
                    {track.ctaLabel}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <article className="space-y-5 rounded-3xl border border-border bg-background/95 p-6 shadow-sm dark:border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Materi Rekomendasi Untukmu</h2>
              <Button intent="secondary" size="sm" href="/user/materials">
                Jelajahi Materi
              </Button>
            </div>
            <ul className="space-y-4">
              {recommendedMaterials.map((material) => (
                <li
                  key={material.title}
                  className="flex items-start justify-between rounded-2xl border border-border/80 bg-muted/20 px-4 py-3 text-sm transition-colors hover:border-accent hover:bg-muted/40"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{material.title}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">{material.type}</p>
                    <p className="text-xs text-foreground/60">{material.duration}</p>
                  </div>
                  <Link href={material.href} className="text-xs font-semibold text-accent hover:underline">
                    Buka
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article className="space-y-4 rounded-3xl border border-border bg-background/95 p-6 shadow-sm dark:border-white/10">
            <h2 className="text-xl font-semibold">Aktivitas Komunitas Terbaru</h2>
            <ul className="space-y-3">
              {communityUpdates.map((update, index) => (
                <li key={index} className="rounded-xl border border-border/70 bg-muted/10 p-4">
                  <p className="text-sm font-semibold text-foreground">{update.author}</p>
                  <p className="text-sm text-foreground/70">{update.message}</p>
                  <p className="text-xs text-foreground/50">{update.time}</p>
                </li>
              ))}
            </ul>
            <Button intent="secondary" size="sm" href="/user/forum">
              Lihat Semua Update
            </Button>
          </article>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Galeri Lapangan & Cerita Dampak</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {fieldStories.map((story) => (
              <article
                key={story.title}
                className="relative overflow-hidden rounded-3xl border border-border bg-background/80 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg dark:border-white/10"
                style={{
                  backgroundImage: `linear-gradient(140deg, rgba(15,15,15,0.65), rgba(15,15,15,0.25)), url('${story.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="flex h-full flex-col justify-between p-6 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">{story.location}</p>
                    <h3 className="mt-2 text-lg font-semibold">{story.title}</h3>
                  </div>
                  <p className="text-sm text-white/80">{story.highlight}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
