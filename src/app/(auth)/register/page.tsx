import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center gap-10 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Buat Akun Baru</h1>
        <p className="text-sm text-foreground/70">
          Mulai kelola komunitas gowesmu dengan integrasi Firebase dan Cloudinary yang siap pakai.
        </p>
      </header>
      <form className="grid gap-5 rounded-2xl border border-border p-6 shadow-sm dark:border-white/10">
        <div className="grid gap-2 text-left text-sm font-medium sm:grid-cols-2 sm:gap-4">
          <label className="flex flex-col gap-2">
            Nama Depan
            <input
              className="rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              type="text"
              name="firstName"
              placeholder="Joko"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            Nama Belakang
            <input
              className="rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              type="text"
              name="lastName"
              placeholder="Wijaya"
              required
            />
          </label>
        </div>
        <label className="flex flex-col gap-2 text-left text-sm font-medium">
          Email
          <input
            className="rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            type="email"
            name="email"
            placeholder="nama@domain.com"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-left text-sm font-medium">
          Kata Sandi
          <input
            className="rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-left text-sm font-medium">
          Konfirmasi Kata Sandi
          <input
            className="rounded-lg border border-border px-3 py-2 text-base text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Daftar
        </button>
      </form>
      <p className="text-center text-sm text-foreground/70">
        Sudah punya akun? {" "}
        <Link className="font-semibold text-foreground" href="/login">
          Masuk sekarang
        </Link>
      </p>
    </section>
  );
}
