import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center gap-8 px-6 py-16">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Masuk ke PedalMaju</h1>
        <p className="text-sm text-foreground/70">
          Gunakan email dan kata sandi yang terdaftar untuk mengelola komunitasmu.
        </p>
      </header>
      <form className="space-y-4 rounded-2xl border border-border p-6 shadow-sm dark:border-white/10">
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
        <button
          type="submit"
          className="w-full rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Masuk
        </button>
      </form>
      <p className="text-center text-sm text-foreground/70">
        Belum punya akun? {" "}
        <Link className="font-semibold text-foreground" href="/register">
          Daftar sekarang
        </Link>
      </p>
    </section>
  );
}
