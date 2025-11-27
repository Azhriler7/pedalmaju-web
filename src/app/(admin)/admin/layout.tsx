'use client';

import NavBar from "@/components/ui/NavBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NavBar variant="admin" userEmail="admin@example.com" />
      <div className="flex-1 pt-20">{children}</div>
    </div>
  );
}
