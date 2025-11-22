import Link from "next/link";
import { type ReactNode } from "react";

const sidebarLinks = [
  { href: "/dashboard", label: "Ringkasan" },
  { href: "/dashboard/events", label: "Event" },
  { href: "/dashboard/members", label: "Anggota" },
  { href: "/dashboard/media", label: "Media" },
];

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row">
      <aside className="w-full rounded-2xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur dark:border-white/10 lg:w-64">
        <h2 className="text-lg font-semibold">Dashboard</h2>
        <p className="mt-1 text-sm text-foreground/70">
          Navigasi fitur utama komunitasmu.
        </p>
        <nav className="mt-6 flex flex-col gap-2">
          {sidebarLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
