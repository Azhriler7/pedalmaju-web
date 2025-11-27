'use client';

import NavBar from "@/components/ui/NavBar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NavBar
        variant="user"
        userName="Rizal Permana"
        userEmail="rizal@pedalmaju.id"
        profileHref="/user/profile/me"
      />
      <div className="flex-1 pt-20">{children}</div>
    </div>
  );
}
