import Link from "next/link";
import Button from "@/components/ui/Button";

const landingSections = [
  { id: "beranda", label: "Beranda" },
  { id: "solusi", label: "Solusi" },
  { id: "fitur", label: "Fitur" },
  { id: "komunitas", label: "Komunitas" },
  { id: "kontak", label: "Kontak" },
] as const;

const solutionHighlights = [
  {
    title: "Sensor Terhubung",
    description:
      "Integrasi perangkat IoT untuk memantau kelembapan, suhu, dan nutrisi dari satu dashboard.",
  },
  {
    title: "Data Real-time",
    description:
      "Streaming data dari Firebase Realtime Database untuk keputusan cepat di lapangan.",
  },
  {
    title: "Automasi Respons",
    description:
      "Tetapkan otomatisasi irigasi atau peringatan WhatsApp berdasarkan ambang batas tertentu.",
  },
];

const featureCards = [
  {
    title: "Dashboard Monitoring",
    points: [
      "Visualisasi sensor dan status perangkat terkini",
      "Analitik historis untuk evaluasi panen",
      "Pemberitahuan anomali langsung ke admin",
    ],
  },
  {
    title: "Manajemen Komunitas",
    points: [
      "Profiler anggota dan segmentasi role",
      "Agenda event dan presensi digital",
      "Integrasi dokumentasi media Cloudinary",
    ],
  },
  {
    title: "Konten Edukasi",
    points: [
      "Artikel praktik terbaik berbasis pengalaman lapangan",
      "Video tutorial YouTube terkurasi",
      "Forum tanya jawab antar petani cerdas",
    ],
  },
];

const communityHighlights = [
  {
    title: "Forum Diskusi",
    description:
      "Temukan jawaban teknis dari mentor dan sesama pengguna saat menghadapi tantangan di lahan.",
  },
  {
    title: "Program Pendampingan",
    description:
      "Ikuti sesi live untuk mempelajari kalibrasi sensor, analisis data, dan otomasi IoT.",
  },
  {
    title: "Cerita Sukses",
    description:
      "Pelajari studi kasus penerapan IoT yang meningkatkan efisiensi hingga 40%.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full flex-col">
      <section
        id="beranda"
        className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-background via-background to-background/80 px-6 py-24"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-12 text-center">
          <span className="rounded-full border border-accent/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/70">
            PedalMaju Platform
          </span>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Edukasi IoT Pertanian untuk Petani Cerdas
            </h1>
            <p className="mx-auto max-w-2xl text-base text-foreground/80 sm:text-lg">
              Bangun ekosistem pertanian presisi dengan perangkat IoT, data real-time dari Firebase,
              dan dokumentasi Cloudinary. PedalMaju membantu petani mengambil keputusan berbasis data.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/articles" intent="primary">
              Mulai Belajar
            </Button>
            <Button href="/login">Masuk / Daftar</Button>
          </div>
        </div>
      </section>

      <section
        id="solusi"
        className="flex min-h-screen w-full items-center bg-background px-6 py-24"
      >
        <div className="mx-auto grid w-full max-w-5xl gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60">
              Solusi IoT
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Monitoring terintegrasi dari sensor hingga tindakan lapangan
            </h2>
            <p className="text-base text-foreground/70">
              PedalMaju menghubungkan sensor dan perangkat lain melalui Firebase sehingga setiap data
              dapat dianalisis dan ditindaklanjuti secara langsung. Tim memperoleh visibilitas penuh
              terhadap kondisi tanam kapan saja.
            </p>
          </div>
          <div className="space-y-4">
            {solutionHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-2xl border border-border bg-background/90 p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md dark:border-white/10"
              >
                <h3 className="text-lg font-semibold text-foreground">{highlight.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="fitur"
        className="flex min-h-screen w-full items-center bg-muted/20 px-6 py-24"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60">
              Fitur Unggulan
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Satu platform untuk operasional dan edukasi pertanian
            </h2>
            <p className="mx-auto max-w-3xl text-base text-foreground/70">
              Dari dashboard monitoring, modul komunitas, hingga konten pembelajaran, semuanya dirancang
              untuk meningkatkan produktivitas dan kolaborasi petani.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-background/95 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10"
              >
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span aria-hidden className="mt-1 h-2 w-2 rounded-full bg-accent" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="komunitas"
        className="flex min-h-screen w-full items-center bg-background px-6 py-24"
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 md:flex-row">
          <div className="flex-1 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60">
              Komunitas
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Kolaborasi lintas komunitas untuk pertanian berkelanjutan
            </h2>
            <p className="text-base text-foreground/70">
              PedalMaju membangun jembatan antara mentor, petani muda, dan praktisi IoT. Bergabunglah
              untuk saling bertukar ide, berbagi dokumentasi lapangan, dan menginisiasi program dampak.
            </p>
          </div>
          <div className="flex-1 space-y-4">
            {communityHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-background/90 p-5 shadow-sm transition-colors hover:border-accent hover:shadow-md dark:border-white/10"
              >
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer
        id="kontak"
        className="flex min-h-screen w-full items-center bg-muted/20 px-6 py-24"
      >
        <div className="mx-auto grid w-full max-w-5xl gap-10 rounded-3xl border border-border bg-background/95 p-10 shadow-sm dark:border-white/10 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-foreground/60">
              Kontak
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Tetap terhubung dengan tim PedalMaju</h2>
            <p className="text-base text-foreground/70">
              Hubungi kami untuk demo produk, kolaborasi komunitas, atau pertanyaan seputar implementasi
              IoT di sektor pertanian.
            </p>
            <div className="space-y-2 text-sm text-foreground/80">
              <p>Email: <a className="font-medium text-foreground underline" href="mailto:halo@pedalmaju.id">halo@pedalmaju.id</a></p>
              <p>WhatsApp: <a className="font-medium text-foreground underline" href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">+62 812-3456-7890</a></p>
              <p>Lokasi: Bandung, Jawa Barat</p>
            </div>
          </div>
          <div className="grid gap-6 text-sm text-foreground/70 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold text-foreground">Navigasi</h3>
              <ul className="mt-3 space-y-2">
                {landingSections.map((section) => (
                  <li key={section.id}>
                    <Link className="hover:text-foreground" href={`/#${section.id}`}>
                      {section.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Sosial</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <a className="hover:text-foreground" href="https://instagram.com/pedalmaju" rel="noreferrer" target="_blank">
                    Instagram
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground" href="https://youtube.com/@pedalmaju" rel="noreferrer" target="_blank">
                    YouTube
                  </a>
                </li>
                <li>
                  <a className="hover:text-foreground" href="https://linkedin.com/company/pedalmaju" rel="noreferrer" target="_blank">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
