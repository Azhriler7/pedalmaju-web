export default function DashboardEventsPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Event Komunitas</h1>
        <p className="text-sm text-foreground/70">
          Kelola jadwal gowes, catat rute, dan sinkronkan progres peserta secara real-time.
        </p>
      </header>
      <div className="rounded-2xl border border-border bg-background/90 p-6 text-sm text-foreground/70 dark:border-white/10">
        Modul event akan menampilkan daftar event, statistik kehadiran, dan integrasi kalender.
      </div>
    </section>
  );
}
