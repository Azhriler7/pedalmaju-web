"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, PlusCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { getMaterials } from "@/features/materials/services/MaterialService";
import type { Material } from "@/types";

const fallbackThumbnail = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80";

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMaterials = async () => {
      try {
        const data = await getMaterials();
        if (isMounted) {
          setMaterials(data);
        }
      } catch (err) {
        console.error("Failed to load materials", err);
        if (isMounted) {
          setError("Gagal memuat daftar materi. Coba lagi nanti.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMaterials();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Daftar Materi</h1>
          <p className="text-sm text-foreground/60">Kelola konten pembelajaran untuk komunitas.</p>
        </div>
        <Button intent="primary" icon={<PlusCircle size={16} />} href="/admin/materials/create">
          Materi Baru
        </Button>
      </div>

      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center text-foreground/60">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat data materi...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && materials.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center text-sm text-foreground/70">
          Belum ada materi yang diterbitkan.
        </div>
      )}

      {!loading && !error && materials.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          {materials.map((material) => (
            <Link
              key={material.id}
              href={`/admin/materials/${material.id}`}
              className="group rounded-2xl border border-border/60 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:border-accent/60 hover:shadow-md"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                <Image
                  src={material.thumbnailUrl || fallbackThumbnail}
                  alt={material.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-col gap-3 px-5 py-4">
                <h2 className="text-lg font-semibold text-foreground">{material.title}</h2>
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <span>{material.contentBlocks.length} blok konten</span>
                  <span>{new Date(material.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
