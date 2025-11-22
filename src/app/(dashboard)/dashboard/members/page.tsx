export default function DashboardMembersPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Anggota Komunitas</h1>
        <p className="text-sm text-foreground/70">
          Pantau performa, progres, dan keterlibatan anggota dalam setiap event.
        </p>
      </header>
      <div className="rounded-2xl border border-border bg-background/90 p-6 text-sm text-foreground/70 dark:border-white/10">
        Modul anggota akan terhubung dengan Firebase untuk menampilkan profil, statistik, dan leaderboard.
      </div>
    </section>
  );
}
