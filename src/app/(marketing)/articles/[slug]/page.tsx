import type { Metadata } from "next";

const glossary = {
	"pengenalan-iot-untuk-pertanian": {
		title: "Pengenalan IoT untuk Pertanian Modern",
		description:
			"Dasar-dasar memanfaatkan sensor dan dashboard untuk mengoptimalkan lahan pertanian.",
	},
	"otomatisasi-irigasi-berbasis-data": {
		title: "Otomatisasi Irigasi Berbasis Data",
		description:
			"Bangun sistem irigasi otomatis menggunakan data kelembapan dan jadwal pintar.",
	},
	"cloudinary-untuk-arsip-lahan": {
		title: "Mengelola Dokumentasi Lahan dengan Cloudinary",
		description:
			"Langkah-langkah mengarsipkan foto dan video monitoring lahan di Cloudinary.",
	},
} satisfies Record<string, { title: string; description: string }>;

type ArticleSlug = keyof typeof glossary;

function isArticleSlug(value: string): value is ArticleSlug {
	return value in glossary;
}

export function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Metadata {
	if (!isArticleSlug(params.slug)) {
		return {
			title: "Artikel PedalMaju",
		};
	}

	const article = glossary[params.slug];

	return {
		title: `${article.title} | PedalMaju`,
		description: article.description,
	};
}

export default function ArticleDetailPage({
	params,
}: {
	params: { slug: string };
}) {
	if (!isArticleSlug(params.slug)) {
		return (
			<section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 text-center">
				<h1 className="text-3xl font-semibold">Artikel tidak ditemukan</h1>
				<p className="text-sm text-foreground/70">
					Coba kembali ke daftar artikel untuk eksplorasi topik lainnya.
				</p>
			</section>
		);
	}

	const article = glossary[params.slug];

	return (
		<article className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
			<header className="space-y-3">
				<p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/70">
					Artikel
				</p>
				<h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
				<p className="text-sm text-foreground/70">{article.description}</p>
			</header>
			<section className="space-y-4 text-base leading-relaxed text-foreground/80">
				<p>
					Konten artikel lengkap akan diisi dari basis data atau CMS yang dihubungkan
					dengan Firebase. Gunakan komponen MDX atau rich text untuk menyajikan
					panduan langkah demi langkah, diagram integrasi sensor, dan tips terbaik
					dari komunitas.
				</p>
				<p>
					Sematkan dokumentasi visual dari Cloudinary untuk memberikan ilustrasi
					mengenai implementasi IoT di lahan pertanian. Sertakan juga grafik data
					dari Firebase untuk menunjukkan bagaimana sensor memengaruhi keputusan
					operasional.
				</p>
			</section>
		</article>
	);
}
