export default function DashboardMediaPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Manajemen Media</h1>
        <p className="text-sm text-foreground/70">
          Sinkronkan foto dan video komunitas secara otomatis ke Cloudinary untuk dokumentasi berkualitas.
        </p>
      </header>
      <div className="rounded-2xl border border-border bg-background/90 p-6 text-sm text-foreground/70 dark:border-white/10">
        Modul media akan mendukung unggahan batch, penyematan highlight, dan integrasi galeri publik.
      </div>
    </section>
  );
}
