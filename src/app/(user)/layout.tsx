'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import NavBar from "@/components/ui/NavBar";
import { useAuth } from "@/hooks/useAuth";
import { usePresence } from "@/hooks/usePresence"; 

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  usePresence(); 

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <span className="text-sm">Memuat akun Anda...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NavBar
        variant="user"
        userName={user.displayName}
        userEmail={user.email}
        avatarUrl={user.photoURL}
        profileHref={`/profile/${user.uid}`}
      />
      <div className="flex-1 pt-20">{children}</div>
    </div>
  );
}