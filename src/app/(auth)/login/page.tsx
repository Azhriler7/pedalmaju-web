'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '@/features/auth/components/LoginForm';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full flex-col bg-gradient-to-b from-background via-background to-muted/60">
      <header className="flex items-center justify-between border-b border-border/60 bg-background/80 px-6 py-5 shadow-sm backdrop-blur-sm">
        <Button href="/" intent="secondary" size="md" className="flex items-center gap-2">
          <span aria-hidden>&larr;</span>
          <span>Kembali ke Beranda</span>
        </Button>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/50">PedalMaju</p>
          <p className="text-sm font-semibold text-foreground">Masuk</p>
        </div>
      </header>

      <section className="flex flex-1 items-center px-6 py-12">
        <div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="hidden gap-6 rounded-3xl border border-border bg-background/95 p-10 shadow-lg shadow-accent/10 md:flex md:flex-col">
            <span className="inline-flex w-fit items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/60">
              PedalMaju Community
            </span>
            <h1 className="text-3xl font-bold leading-tight text-foreground">
              Masuk dan lanjutkan perjalanan pertanian cerdas Anda.
            </h1>
            <p className="text-base text-foreground/70">
              Akses dashboard personal, materi pembelajaran, dan diskusi komunitas yang relevan dengan data lapangan Anda.
            </p>
            <ul className="space-y-3 text-sm text-foreground/75">
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                Statistik sensor real-time langsung di dashboard.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                Rekomendasi materi berdasarkan progres belajar Anda.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                Forum mentor dan petani modern siap membantu kapan saja.
              </li>
            </ul>
            <div className="rounded-2xl border border-accent/20 bg-accent/10 p-4 text-sm text-accent">
              &ldquo;PedalMaju membantu kami mengambil keputusan penyiraman lebih cepat dan tepat.&rdquo; — Komunitas Lembang
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background/98 p-8 shadow-xl shadow-accent/10">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Masuk ke Akun Anda</h2>
              <p className="text-sm text-foreground/70">
                Masukkan kredensial untuk mengakses data dan materi terbaru.
              </p>
            </div>
            <div className="mt-6 space-y-6">
              <LoginForm />
              <div className="text-center text-sm text-foreground/70">
                <p>
                  Belum punya akun?{' '}
                  <Link href="/register" className="text-accent hover:underline">
                    Daftar di sini
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
