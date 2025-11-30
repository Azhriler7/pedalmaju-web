"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getMaterialById } from "@/features/materials/services/MaterialService";
import MaterialBlockRenderer from "@/features/materials/components/MaterialBlockRenderer";
import type { Material } from "@/types";

const fallbackThumbnail = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80";

export default function UserMaterialDetail() {
  const { id: materialId } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchMaterial = async () => {
      if (!materialId) {
        setError("Materi tidak ditemukan.");
        setLoading(false);
        return;
      }
      try {
        const data = await getMaterialById(materialId);
        if (!isActive) return;

        if (!data) {
          setError("Materi tidak ditemukan atau telah dihapus.");
          return;
        }

        setMaterial(data);
      } catch (err) {
        console.error("Failed to load material", err);
        if (isActive) {
          setError("Gagal memuat materi. Coba lagi nanti.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchMaterial();

    return () => {
      isActive = false;
    };
  }, [materialId]);

  return (
    <main className="mx-auto flex w-full flex-col px-6 pb-12">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="flex flex-col gap-2 pt-6">
          <Link
            href="/materials"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Kembali ke daftar materi
          </Link>
        </div>

        {loading && (
          <section className="flex min-h-[40vh] items-center justify-center text-foreground/60">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Memuat materi...
          </section>
        )}

        {!loading && error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
            {error}
          </section>
        )}

        {!loading && !error && material && (
          <article className="space-y-6 overflow-hidden rounded-3xl border border-border bg-background/95 shadow-sm">
            <div className="space-y-4 bg-gradient-to-br from-accent/12 via-accent/6 to-transparent px-6 py-8">
              <span className="inline-flex items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
                Modul Pembelajaran
              </span>
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{material.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-foreground/50">
                <span>
                  {new Date(material.createdAt).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span>{material.contentBlocks.length} blok konten</span>
              </div>
            </div>

            <div className="relative h-64 w-full border-y border-border">
              <Image
                src={material.thumbnailUrl || fallbackThumbnail}
                alt={material.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 60vw, 100vw"
              />
            </div>

            <div className="space-y-6 px-6 pb-8">
              {material.contentBlocks.map((block) => (
                <MaterialBlockRenderer key={block.id} block={block} />
              ))}
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
