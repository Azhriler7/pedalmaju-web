"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Award, BookOpen, MessageCircle, Loader2 } from "lucide-react";
import ProfileView from "@/features/users/components/ProfileView";
import { getUserProfile } from "@/features/users/services/UserService";
import Button from "@/components/ui/Button";
import type { User } from "@/types";

const communityHighlights = [
  {
    title: "Forum Komunitas",
    description: "Diskusi dengan mentor dan petani lainnya untuk memecahkan tantangan lapangan.",
    href: "/forum",
  },
  {
    title: "Materi Terkurasi",
    description: "Ikuti modul-modul terbaru untuk mempertajam keterampilan pertanian cerdas.",
    href: "/materials",
  },
  {
    title: "Cerita Dampak",
    description: "Pelajari studi kasus keberhasilan penerapan IoT di berbagai daerah.",
    href: "/dashboard",
  },
];

export default function UserProfile() {
  const { id: profileId } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setError(null);

    (async () => {
      if (!profileId) {
        setError("Profil pengguna tidak ditemukan.");
        setLoading(false);
        return;
      }
      try {
        const data = await getUserProfile(profileId);
        if (!isActive) return;
        if (!data) {
          setError("Profil pengguna tidak ditemukan.");
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        if (isActive) {
          setError("Gagal memuat profil. Coba lagi nanti.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [profileId]);

  const quickStats = useMemo(() => {
    return [
      {
        label: profile?.role === "admin" ? "Peran" : "Anggota",
        value: profile?.role === "admin" ? "Admin Komunitas" : "Petani Cerdas",
        icon: Award,
      },
      {
        label: "Materi Diikuti",
        value: "Terus berkembang",
        icon: BookOpen,
      },
      {
        label: "Forum",
        value: "Aktif berdiskusi",
        icon: MessageCircle,
      },
    ];
  }, [profile?.role]);

  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-accent/12 via-accent/6 to-transparent p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground"
              >
                <ArrowLeft size={16} />
                Kembali ke dashboard
              </Link>
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                  Profil Komunitas
                </span>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Kenali lebih dekat perjalanan belajar Anda
                </h1>
                <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
                  Sinkronkan identitas Anda di komunitas PedalMaju, perbarui biodata, dan pantau kontribusi yang terus berkembang.
                </p>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border border-border bg-background/90 p-5 shadow-inner sm:grid-cols-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                    <stat.icon size={18} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/50">
                    {stat.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground/80">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {loading && (
          <section className="flex min-h-[40vh] items-center justify-center text-foreground/60">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat profil pengguna...
          </section>
        )}

        {!loading && error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
            {error}
          </section>
        )}

        {!loading && !error && profile && (
          <section className="grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
            <ProfileView initialUser={profile} />

            <aside className="space-y-5 rounded-3xl border border-border bg-background/95 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">Jelajahi Ekosistem</h2>
              <p className="text-sm text-foreground/70">
                Tingkatkan kontribusi Anda di komunitas melalui materi terbaru dan diskusi aktif.
              </p>
              <div className="space-y-4">
                {communityHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-4 shadow-sm transition hover:border-accent/60 hover:shadow-md"
                  >
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-xs text-foreground/60">{item.description}</p>
                    <Button intent="secondary" size="sm" href={item.href} className="mt-4">
                      Jelajahi
                    </Button>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
