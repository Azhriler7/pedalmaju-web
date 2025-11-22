import Link from "next/link";

const featuredArticles = [
  {
    slug: "pengenalan-iot-untuk-pertanian",
    title: "Pengenalan IoT untuk Pertanian Modern",
    excerpt:
      "Pelajari bagaimana sensor dan sistem monitoring membantu petani memaksimalkan hasil panen dan efisiensi air.",
  },
  {
    slug: "otomatisasi-irigasi-berbasis-data",
    title: "Otomatisasi Irigasi Berbasis Data",
    excerpt:
      "Mulai dari perencanaan perangkat hingga integrasi Firebase untuk memantau kelembapan tanah secara real-time.",
  },
  {
    slug: "cloudinary-untuk-arsip-lahan",
    title: "Mengelola Dokumentasi Lahan dengan Cloudinary",
    excerpt:
      "Simpan foto drone, video pemantauan, dan laporan visual di Cloudinary dengan mudah.",
  },
];

export default function ArticlesPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/70">
          Artikel Edukasi
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Insight IoT untuk Pertanian Berkelanjutan
        </h1>
        <p className="max-w-3xl text-sm text-foreground/70">
          Kumpulan artikel mendalam mengenai penggunaan perangkat IoT, integrasi data, serta best practice berbasis pengalaman komunitas PedalMaju.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredArticles.map((article) => (
          <article
            key={article.slug}
            className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-background/90 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10"
          >
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-sm text-foreground/70">{article.excerpt}</p>
            </div>
            <Link
              className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
              href={`/articles/${article.slug}`}
            >
              Baca selengkapnya →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
