"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MaterialForm from "@/features/materials/components/MaterialForm";

export default function AdminCreateMaterial() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-2">
        <Link href="/admin/materials" className="inline-flex items-center gap-2 text-sm text-foreground/60 transition hover:text-foreground">
          <ArrowLeft size={16} />
          Kembali ke daftar materi
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Buat Materi Baru</h1>
          <p className="text-sm text-foreground/60">Susun konten pembelajaran lengkap dengan teks, video, dan gambar.</p>
        </div>
      </div>

      <MaterialForm />
    </div>
  );
}
