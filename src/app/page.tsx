import ButtonLink from "@/components/ui/ButtonLink";

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:py-24">
      <span className="rounded-full border border-accent/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/80">
        PedalMaju Platform
      </span>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Edukasi IoT Pertanian untuk Petani Cerdas.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-foreground/80 sm:text-lg">
          Bangun ekosistem pertanian presisi dengan perangkat IoT, data real-time
          dari Firebase, dan dokumentasi Cloudinary. Pelajari praktik terbaik
          melalui artikel edukasi, forum komunitas, dan dashboard monitoring.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/articles" intent="primary">
          Mulai Belajar
        </ButtonLink>
        <ButtonLink href="/dashboard">Masuk Dashboard</ButtonLink>
      </div>
    </section>
  );
}
