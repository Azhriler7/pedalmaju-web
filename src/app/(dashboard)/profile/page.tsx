import Image from "next/image";

export default function ProfilePage() {
  return (
    <section className="space-y-8">
      <header className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-background/90 p-6 text-center shadow-sm dark:border-white/10 sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div className="flex items-center gap-4">
          <Image
            alt="Avatar komunitas"
            className="rounded-full border border-border object-cover dark:border-white/10"
            height={72}
            src="https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg"
            width={72}
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Nama Komunitas</h1>
            <p className="text-sm text-foreground/70">
              Edukasi IoT untuk pertanian berkelanjutan di seluruh Indonesia.
            </p>
          </div>
        </div>
        <button className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90">
          Edit Profil
        </button>
      </header>

      <section className="grid gap-6 rounded-2xl border border-border bg-background/90 p-6 shadow-sm dark:border-white/10 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Informasi Akun</h2>
          <dl className="grid gap-2 text-sm text-foreground/70">
            <div>
              <dt className="font-semibold text-foreground">Email</dt>
              <dd>nama@pedalmaju.id</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Peran</dt>
              <dd>Administrator Komunitas</dd>
            </div>
            <div>
              <dt className="font-semibold text-foreground">Terdaftar Sejak</dt>
              <dd>12 Januari 2025</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Aktivitas Terakhir</h2>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li>Memperbarui dokumentasi Cloudinary • 21 Nov 2025</li>
            <li>Membalas diskusi forum • 19 Nov 2025</li>
            <li>Menambahkan sensor kelembapan baru • 17 Nov 2025</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-background/90 p-6 shadow-sm dark:border-white/10">
        <h2 className="text-lg font-semibold">Integrasi Akun</h2>
        <div className="grid gap-4 text-sm text-foreground/70 sm:grid-cols-2">
          <div className="rounded-xl bg-accent/10 p-4 text-foreground">
            <p className="font-semibold text-foreground">Firebase</p>
            <p className="mt-2">
              Autentikasi, Firestore, dan Realtime Database untuk menyimpan data komunitas,
              sensor, serta artikel.
            </p>
            <button className="mt-3 rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:bg-accent/10">
              Kelola
            </button>
          </div>
          <div className="rounded-xl bg-accent/10 p-4 text-foreground">
            <p className="font-semibold text-foreground">Cloudinary</p>
            <p className="mt-2">
              Penyimpanan media untuk arsip lahan, dokumentasi video, dan konten forum.
            </p>
            <button className="mt-3 rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-accent hover:bg-accent/10">
              Kelola
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
