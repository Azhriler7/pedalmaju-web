"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getMaterialById } from "@/features/materials/services/MaterialService";
import MaterialBlockRenderer from "@/features/materials/components/MaterialBlockRenderer";
import type { Material } from "@/types";

const fallbackThumbnail = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80";

export default function AdminMaterialDetail() {
  const { id: materialId } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadMaterial = async () => {
      if (!materialId) {
        setError("Materi tidak ditemukan.");
        setLoading(false);
        return;
      }
      try {
        const data = await getMaterialById(materialId);
        if (!isActive) return;

        if (!data) {
          setError("Materi tidak ditemukan atau sudah dihapus.");
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

    loadMaterial();

    return () => {
      isActive = false;
    };
  }, [materialId]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <Link href="/admin/materials" className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground">
          <ArrowLeft size={16} />
          Kembali ke daftar materi
        </Link>
        <h1 className="text-2xl font-semibold text-foreground">Detail Materi</h1>
      </div>

      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center text-foreground/60">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat materi...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && material && (
        <article className="space-y-6 rounded-3xl border border-border bg-background/80 p-6 shadow-sm">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-foreground">{material.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-foreground/60">
              <span>{new Date(material.createdAt).toLocaleString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              <span>{material.contentBlocks.length} blok konten</span>
            </div>
          </div>

          <div className="relative h-72 w-full overflow-hidden rounded-2xl">
            <Image
              src={material.thumbnailUrl || fallbackThumbnail}
              alt={material.title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </div>

          <div className="space-y-6">
            {material.contentBlocks.map((block) => (
              <MaterialBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </article>
      )}
    </div>
  );
}
