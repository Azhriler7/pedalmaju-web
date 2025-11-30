"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import MaterialForm from "@/features/materials/components/MaterialForm";
import { getMaterialById } from "@/features/materials/services/MaterialService";
import type { Material } from "@/types";

export default function AdminEditMaterial() {
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

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex min-h-[40vh] items-center justify-center text-foreground/60">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Memuat materi...
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex flex-col gap-2">
          <Link href="/admin/materials" className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground">
            <ArrowLeft size={16} />
            Kembali ke daftar materi
          </Link>
          <h1 className="text-2xl font-semibold text-foreground">Edit Materi</h1>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || "Materi tidak ditemukan."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <Link href={`/admin/materials/${materialId}`} className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground">
          <ArrowLeft size={16} />
          Kembali ke detail materi
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Edit Materi</h1>
          <p className="text-sm text-foreground/60">Perbarui konten pembelajaran materi ini.</p>
        </div>
      </div>

      <MaterialForm material={material} isEdit />
    </div>
  );
}