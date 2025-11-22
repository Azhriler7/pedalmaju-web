"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ButtonLink from "@/components/ui/ButtonLink";

type NavItem = {
  href: string;
  label: string;
  intent?: "primary" | "ghost";
};

const navItems: NavItem[] = [
  { href: "/", label: "Landing" },
  { href: "/articles", label: "Artikel" },
  { href: "/forum", label: "Forum" },
  { href: "/dashboard", label: "Dashboard", intent: "primary" },
  { href: "/profile", label: "Profil" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          PedalMaju
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <ButtonLink
                key={item.href}
                href={item.href}
                intent={item.intent}
                isActive={isActive}
              >
                {item.label}
              </ButtonLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
