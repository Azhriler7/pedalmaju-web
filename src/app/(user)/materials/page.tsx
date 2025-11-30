"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import MaterialCard from "@/features/materials/components/MaterialCard";
import { getMaterials } from "@/features/materials/services/MaterialService";
import type { Material } from "@/types";

export default function UserMaterialsPage() {
	const [materials, setMaterials] = useState<Material[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		let isActive = true;

		const fetchMaterials = async () => {
			try {
				const data = await getMaterials();
				if (isActive) {
					setMaterials(data);
				}
			} catch (err) {
				console.error("Failed to load materials", err);
				if (isActive) {
					setError("Gagal memuat materi. Coba lagi nanti.");
				}
			} finally {
				if (isActive) {
					setLoading(false);
				}
			}
		};

		fetchMaterials();

		return () => {
			isActive = false;
		};
	}, []);

	const filteredMaterials = useMemo(() => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) {
			return materials;
		}
		return materials.filter((material) => material.title.toLowerCase().includes(term));
	}, [materials, searchTerm]);

	return (
		<main className="mx-auto flex w-full flex-col px-6 pb-12">
			<div className="mx-auto w-full max-w-6xl space-y-10">
				<section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-accent/12 via-accent/6 to-transparent p-8 shadow-sm">
					<div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
						<div className="space-y-4">
							<span className="inline-flex items-center rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/60">
								Materi Komunitas
							</span>
							<h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Jelajahi Kelas Pertanian Cerdas</h1>
							<p className="max-w-2xl text-base text-foreground/70">
								Temukan modul terbaru, video praktikum, dan panduan langkah demi langkah untuk meningkatkan produktivitas lahanmu.
							</p>
						</div>
						<div className="rounded-2xl border border-border bg-background/80 p-5 shadow-inner">
							<label className="block text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
								Cari materi
							</label>
							<div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10">
								<Search size={18} className="text-foreground/50" />
								<input
									type="text"
									placeholder="Ketik judul materi..."
									value={searchTerm}
									onChange={(event) => setSearchTerm(event.target.value)}
									className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-foreground/40"
								/>
							</div>
							<p className="mt-2 text-xs text-foreground/50">Contoh: IoT Sensor, Automasi Irigasi, Analitik Data</p>
						</div>
					</div>
				</section>

				{loading && (
					<section className="flex min-h-[40vh] items-center justify-center text-foreground/60">
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						Memuat materi pembelajaran...
					</section>
				)}

				{!loading && error && (
					<section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-600">
						{error}
					</section>
				)}

				{!loading && !error && filteredMaterials.length === 0 && (
					<section className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-foreground/70">
						Tidak ada materi yang cocok dengan pencarian.
					</section>
				)}

				{!loading && !error && filteredMaterials.length > 0 && (
					<section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filteredMaterials.map((material) => (
							<MaterialCard key={material.id} material={material} />
						))}
					</section>
				)}
			</div>
		</main>
	);
}
