import Link from "next/link";
import { type ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  intent?: "primary" | "ghost";
  isActive?: boolean;
  className?: string;
};

const baseClasses = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/40";
const primaryClasses = "bg-accent text-accent-foreground hover:bg-accent/90";
const ghostClasses = "border border-foreground/40 bg-transparent text-foreground hover:border-foreground hover:bg-foreground/10";
const activeClasses = "ring-2 ring-accent ring-offset-2 ring-offset-background";

export default function ButtonLink({
  href,
  children,
  intent = "ghost",
  isActive = false,
  className = "",
}: ButtonLinkProps) {
  const variant = intent === "primary" ? primaryClasses : ghostClasses;
  const composed = [baseClasses, variant, isActive ? activeClasses : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={href} className={composed}>
      {children}
    </Link>
  );
}
