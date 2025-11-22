import ButtonLink from "@/components/ui/ButtonLink";
import { SensorCard } from "@/features/devices/components/SensorCard";

const quickActions = [
  {
    title: "Buat Event Baru",
    description: "Atur detail rute, jadwal, dan durasi dalam hitungan menit.",
    href: "/dashboard/events",
  },
  {
    title: "Undang Anggota",
    description: "Bagikan kode atau tautan undangan untuk komunitasmu.",
    href: "/dashboard/members",
  },
  {
    title: "Unggah Dokumentasi",
    description: "Sinkronkan media ke Cloudinary untuk arsip berkualitas.",
    href: "/dashboard/media",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground/70">
          Ringkasan
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Selamat datang kembali!</h1>
        <p className="max-w-2xl text-sm text-foreground/70">
          Pantau statistik terkini komunitas gowesmu. Data real-time dari Firebase memudahkan kamu melihat progres event, performa anggota, dan dokumentasi media yang terhubung ke Cloudinary.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <div
            key={action.title}
            className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-background/90 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/10"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{action.title}</h2>
              <p className="text-sm text-foreground/70">{action.description}</p>
            </div>
            <ButtonLink href={action.href} intent="ghost">
              Lanjutkan
            </ButtonLink>
          </div>
        ))}
      </div>
      <section className="grid gap-6 rounded-2xl border border-border bg-background/90 p-6 dark:border-white/10">
        <h2 className="text-xl font-semibold">Statistik Cepat</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-accent/10 p-4 text-sm font-medium text-foreground">
            <p className="text-foreground/70">Event Aktif</p>
            <p className="mt-2 text-2xl font-semibold">4</p>
          </div>
          <div className="rounded-xl bg-accent/10 p-4 text-sm font-medium text-foreground">
            <p className="text-foreground/70">Total Peserta</p>
            <p className="mt-2 text-2xl font-semibold">128</p>
          </div>
          <div className="rounded-xl bg-accent/10 p-4 text-sm font-medium text-foreground">
            <p className="text-foreground/70">Media Baru</p>
            <p className="mt-2 text-2xl font-semibold">36</p>
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background/90 p-6 dark:border-white/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">Status Sensor IoT</h2>
          <p className="text-sm text-foreground/70">
            Monitor perangkat langsung dari Firebase Realtime Database.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SensorCard
            location="Lahan Sayur A"
            name="Sensor Kelembapan"
            status="online"
            value="42% RH"
          />
          <SensorCard
            location="Lahan Padi B"
            name="Sensor Suhu"
            status="online"
            value="29°C"
          />
          <SensorCard
            location="Gudang Benih"
            name="Sensor pH"
            status="offline"
          />
        </div>
      </section>
    </section>
  );
}
