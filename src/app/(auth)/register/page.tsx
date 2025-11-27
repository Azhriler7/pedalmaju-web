'use client';

import React from 'react';
import Link from 'next/link';
import RegisterForm from '@/features/auth/components/RegisterForm';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col bg-gradient-to-b from-background via-background to-muted/60">
      <header className="flex items-center justify-between border-b border-border/60 bg-background/80 px-6 py-5 shadow-sm backdrop-blur-sm">
        <Button href="/" intent="secondary" size="md" className="flex items-center gap-2">
          <span aria-hidden>&larr;</span>
          <span>Kembali ke Beranda</span>
        </Button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">PedalMaju</p>
          <p className="text-sm font-semibold text-foreground">Registrasi</p>
        </div>
      </header>

      <section className="flex flex-1 items-center px-6 py-12">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="hidden gap-6 rounded-3xl border border-border bg-background/95 p-10 shadow-lg shadow-accent/10 md:flex md:flex-col">
            <span className="inline-flex w-fit items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/60">
              Bergabung dengan PedalMaju
            </span>
            <h1 className="text-3xl font-bold leading-tight text-foreground">
              Buat akun dan bangun strategi pertanian berbasis data.
            </h1>
            <p className="text-base text-foreground/70">
              Personalisasi materi belajar, simpan insight lapangan, dan kolaborasi dengan mentor yang ahli di bidang IoT pertanian.
            </p>
            <div className="grid gap-3 text-sm text-foreground/75">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">Kelas Terstruktur</p>
                <p className="text-foreground/60">Kurasi modul mulai dari instalasi sensor hingga analitik panen.</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">Komunitas Aktif</p>
                <p className="text-foreground/60">Diskusi harian dan sesi mentoring rutin setiap minggu.</p>
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/50">
              Lebih dari 1.200 petani telah bergabung
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-background/98 p-8 shadow-xl shadow-accent/10">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Buat Akun Baru</h2>
              <p className="text-sm text-foreground/70">
                Isi data berikut untuk mulai belajar dan bergabung di komunitas.
              </p>
            </div>
            <div className="mt-6 space-y-6">
              <RegisterForm />
              <div className="text-center text-sm text-foreground/70">
                <p>
                  Sudah punya akun?{' '}
                  <Link href="/login" className="text-accent hover:underline">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
