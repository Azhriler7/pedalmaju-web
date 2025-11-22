import Link from "next/link";

const sampleThreads = [
  {
    id: "kalibrasi-sensor-ph",
    title: "Cara Kalibrasi Sensor pH Tanah",
    replies: 12,
    excerpt:
      "Diskusi mengenai kalibrasi berkala untuk menjaga akurasi data pH di greenhouse hidroponik.",
  },
  {
    id: "optimasi-irigasi-tetes",
    title: "Optimasi Irigasi Tetes Berbasis Kelembapan",
    replies: 8,
    excerpt:
      "Bagikan konfigurasi solusi IoT kamu untuk menghemat air saat musim kemarau.",
  },
  {
    id: "integrasi-youtube-lapangan",
    title: "Berbagi Video Monitoring Lahan",
    replies: 5,
    excerpt:
      "Gunakan embed YouTube untuk menampilkan rekaman drone dan kamera lapangan.",
  },
];

export default function ForumPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3 text-center sm:text-left">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/70">
          Forum Komunitas
        </p>
        <h1 className="text-4xl font-bold tracking-tight">
          Diskusi IoT untuk Pertanian Cerdas
        </h1>
        <p className="max-w-3xl text-sm text-foreground/70">
          Terhubung dengan praktisi dan penggiat teknologi pertanian. Bagikan solusi,
          tanya jawab teknis, hingga keberhasilan penerapan IoT di lapangan.
        </p>
      </header>

      <div className="flex justify-end">
        <Link
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
          href="/forum/new"
        >
          Mulai Diskusi Baru
        </Link>
      </div>

      <div className="space-y-4">
        {sampleThreads.map((thread) => (
          <article
            key={thread.id}
            className="rounded-2xl border border-border bg-background/90 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-foreground">
                  <Link className="hover:underline" href={`/forum/${thread.id}`}>
                    {thread.title}
                  </Link>
                </h2>
                <p className="text-sm text-foreground/70">{thread.excerpt}</p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
                {thread.replies} balasan
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
