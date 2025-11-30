import Link from "next/link";
import Button from "@/components/ui/Button";
import NavBar from "@/components/ui/NavBar";

const landingSections = [
  { id: "beranda", label: "Beranda" },
  { id: "solusi", label: "Solusi" },
  { id: "fitur", label: "Fitur" },
  { id: "komunitas", label: "Komunitas" },
  { id: "kontak", label: "Kontak" },
] as const;

const solutionHighlights = [
  {
    title: "Modul Belajar Terstruktur",
    description:
      "Ikuti kurikulum bertahap yang mengenalkan konsep dasar hingga penerapan teknologi IoT di pertanian.",
  },
  {
    title: "Pendampingan Mentor",
    description:
      "Akses sesi tanya jawab langsung dengan praktisi yang berpengalaman mengimplementasikan IoT di lahan.",
  },
  {
    title: "Simulasi Perangkat",
    description:
      "Pelajari cara membaca data sensor dan menyusun alur kerja otomatis melalui studi kasus dan walkthrough.",
  },
];

const featureCards = [
  {
    title: "Kelas Interaktif",
    points: [
      "Video, artikel, dan kuis untuk memahami IoT pertanian",
      "Rangkuman materi yang mudah diunduh",
      "Sertifikat kelulusan tiap modul",
    ],
  },
  {
    title: "Forum Komunitas",
    points: [
      "Diskusi topik IoT bersama mentor dan petani",
      "Berbagi pengalaman penggunaan teknologi",
      "Kumpulan rekomendasi alat dan pemasok",
    ],
  },
  {
    title: "Perpustakaan Materi",
    points: [
      "Studi kasus keberhasilan implementasi IoT",
      "Template rencana kerja digital",
      "Checklist persiapan instalasi perangkat",
    ],
  },
];

const communityHighlights = [
  {
    title: "Forum Diskusi",
    description:
      "Bertukar tips konfigurasi sensor, integrasi data, dan strategi adopsi teknologi bersama komunitas.",
  },
  {
    title: "Program Pendampingan",
    description:
      "Ikuti kelas live dan workshop rutin yang memandu langkah demi langkah penerapan IoT di lahan Anda.",
  },
  {
    title: "Cerita Sukses",
    description:
      "Dengar langsung pengalaman petani yang berhasil mengoptimalkan produksi dengan teknologi.",
  },
];

const currentYear = new Date().getFullYear();

export default function Home() {
  return (
    <>
      <NavBar variant="landing" />
      <main className="mx-auto flex w-full flex-col pt-20">
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
              E-Learning & Komunitas IoT Pertanian
            </h1>
            <p className="mx-auto max-w-2xl text-base text-foreground/80 sm:text-lg">
              Kuasai teknologi IoT sebelum diterapkan di lahan. Pelajari konsep, pahami perangkat, dan diskusikan strategi
              implementasi bersama mentor serta komunitas petani digital.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/login" intent="primary">
              Masuk Ke Kelas
            </Button>
            <Button href="/register" intent="secondary">
              Daftar Komunitas
            </Button>
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
              Bekal lengkap sebelum menerapkan perangkat di lapangan
            </h2>
            <p className="text-base text-foreground/70">
              PedalMaju memfasilitasi petani mempelajari dasar perangkat, cara membaca data, dan alur kerja digital melalui materi teoritis
              dan praktik ringan. Semua disusun agar proses adopsi teknologi berlangsung terarah dan efisien.
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
              Satu platform untuk belajar dan berkolaborasi
            </h2>
            <p className="mx-auto max-w-3xl text-base text-foreground/70">
              Materi multimedia, forum aktif, dan bank referensi dirancang untuk membantu petani memahami teknologi serta
              membangun jejaring sebelum menerapkan IoT secara penuh.
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
              Belajar bersama komunitas petani berbasis teknologi
            </h2>
            <p className="text-base text-foreground/70">
              PedalMaju mempertemukan mentor, petani modern, dan pegiat teknologi untuk saling berbagi pengetahuan.
              Ikuti diskusi rutin, dapatkan referensi perangkat, dan temukan dukungan ketika mulai mengadopsi IoT.
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

      <footer id="kontak" className="w-full bg-foreground text-background">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-background/60">
                Kontak
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Terhubung dengan tim PedalMaju
              </h2>
              <p className="text-base text-background/70">
                Ada ide kelas, ingin mengundang mentor, atau butuh dukungan implementasi IoT? Sampaikan kebutuhan Anda
                dan kami bantu merancang jalur pembelajaran yang tepat.
              </p>
              <div className="space-y-2 text-sm">
                <p>Email: <a className="font-medium underline" href="mailto:halo@pedalmaju.id">halo@pedalmaju.id</a></p>
                <p>WhatsApp: <a className="font-medium underline" href="https://wa.me/6281234567890" target="_blank" rel="noreferrer">+62 812-3456-7890</a></p>
                <p>Lokasi: Bandung, Jawa Barat</p>
              </div>
            </div>
            <div className="grid gap-8 text-sm sm:grid-cols-2">
              <div>
                <h3 className="text-base font-semibold">Navigasi</h3>
                <ul className="mt-3 space-y-2 text-background/70">
                  {landingSections.map((section) => (
                    <li key={section.id}>
                      <Link className="transition hover:text-background" href={`/#${section.id}`}>
                        {section.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-base font-semibold">Sosial</h3>
                <ul className="mt-3 space-y-2 text-background/70">
                  <li>
                    <a className="transition hover:text-background" href="https://instagram.com/pedalmaju" rel="noreferrer" target="_blank">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-background" href="https://youtube.com/@pedalmaju" rel="noreferrer" target="_blank">
                      YouTube
                    </a>
                  </li>
                  <li>
                    <a className="transition hover:text-background" href="https://linkedin.com/company/pedalmaju" rel="noreferrer" target="_blank">
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-white/10 pt-6 text-xs text-background/50">
            © {currentYear} PedalMaju. Semua hak cipta dilindungi.
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
