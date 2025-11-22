export default function ForumNewThreadPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Mulai Diskusi Baru</h1>
        <p className="text-sm text-foreground/70">
          Bagikan pengalaman, pertanyaan teknis, atau insight seputar penerapan IoT pada pertanian.
        </p>
      </header>
      <form className="space-y-5 rounded-2xl border border-border bg-background/90 p-6 shadow-sm dark:border-white/10">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Judul Diskusi
          <input
            className="rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            type="text"
            name="title"
            placeholder="Misalnya: Sistem sensor kelembapan otomatis"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Ringkasan / Topik Utama
          <textarea
            className="min-h-[160px] rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            name="body"
            placeholder="Ceritakan masalah atau ide utama yang ingin dibahas..."
            required
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Terbitkan Diskusi
        </button>
      </form>
    </section>
  );
}
