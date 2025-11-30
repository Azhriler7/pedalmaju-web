"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Edit, Trash2 } from "lucide-react";
import { getMaterialById, deleteMaterial } from "@/features/materials/services/MaterialService";
import MaterialBlockRenderer from "@/features/materials/components/MaterialBlockRenderer";
import type { Material } from "@/types";

const fallbackThumbnail = "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80";

export default function AdminMaterialDetail() {
  const { id: materialId } = useParams<{ id: string }>();
  const router = useRouter();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!materialId || !confirm('Apakah Anda yakin ingin menghapus materi ini? Tindakan ini tidak dapat dibatalkan.')) return;

    setIsDeleting(true);
    try {
      await deleteMaterial(materialId);
      router.push('/admin/materials');
    } catch (error) {
      console.error('Failed to delete material', error);
      alert('Gagal menghapus materi. Coba lagi nanti.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <Link href="/admin/materials" className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground">
          <ArrowLeft size={16} />
          Kembali ke daftar materi
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Detail Materi</h1>
          {!loading && !error && material && (
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/materials/${materialId}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-accent px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
              >
                <Edit size={16} />
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          )}
        </div>
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
