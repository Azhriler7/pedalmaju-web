'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/features/auth/services/AuthService';

const landingSections = [
  { id: "beranda", label: "Beranda" },
  { id: "solusi", label: "Solusi" },
  { id: "fitur", label: "Fitur" },
  { id: "komunitas", label: "Komunitas" },
  { id: "kontak", label: "Kontak" },
] as const;

interface NavBarProps {
  variant?: 'landing' | 'admin' | 'user';
  userEmail?: string;
  onLogout?: () => void;
  userName?: string;
  avatarUrl?: string;
  profileHref?: string;
}

// Komponen Navbar Standalone
const NavBar: React.FC<NavBarProps> = ({
  variant = 'landing',
  userEmail,
  onLogout,
  userName,
  avatarUrl,
  profileHref,
}) => {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const displayName = userName ?? userEmail;
  const userInitial = (userName ?? userEmail ?? 'U').charAt(0).toUpperCase();
  
  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/');
  };
  
  // Style dasar tombol (sesuai desain Button sebelumnya)
  const baseBtnClass = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 h-9 px-3 text-xs";
  
  // Style varian tombol
  const primaryBtnClass = `${baseBtnClass} bg-green-600 text-white hover:bg-green-700 border border-transparent shadow-sm`;
  const outlineBtnClass = `${baseBtnClass} bg-transparent text-green-700 border border-green-600 hover:bg-green-50`;

  // Fungsi scroll smooth
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderNavContent = () => {
    switch (variant) {
      case 'landing':
        return (
          <>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-green-600">
                PedalMaju
              </Link>
              <div className="hidden space-x-6 md:flex">
                {landingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScroll(section.id)}
                    className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Button Masuk (Outline) */}
              <Link href="/login" className={outlineBtnClass}>
                Masuk
              </Link>
              {/* Button Daftar (Primary) */}
              <Link href="/register" className={primaryBtnClass}>
                Daftar
              </Link>
            </div>
          </>
        );
      case 'admin':
        return (
          <>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-green-600">
                PedalMaju
              </Link>
              <div className="hidden space-x-6 md:flex">
                <Link href="/admin/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/materials" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Kelola Materi
                </Link>
                <Link href="/admin/forum" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Forum
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{userEmail}</span>
              <button onClick={onLogout || handleLogout} className={`${outlineBtnClass} hover:bg-red-50 hover:text-red-700 border-green-600`}>
                Logout
              </button>
            </div>
          </>
        );
      case 'user':
        return (
          <>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-green-600">
                PedalMaju
              </Link>
              <div className="hidden space-x-6 md:flex">
                <Link href="/user/dashboard" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/user/forum" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Forum
                </Link>
                <Link href="/user/materials" className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors">
                  Kelas
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {displayName && (
                <span className="hidden text-sm font-medium text-gray-600 md:block">
                  {displayName}
                </span>
              )}
              <div
                className="relative"
                onMouseEnter={() => setIsProfileOpen(true)}
                onMouseLeave={() => setIsProfileOpen(false)}
              >
                <button
                  type="button"
                  className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted/60 text-sm font-semibold text-foreground shadow-sm transition-transform hover:-translate-y-0.5"
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  {avatarUrl ? (
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${avatarUrl})` }}
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}
                </button>
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-2xl border border-border bg-background/95 p-4 shadow-lg transition-all duration-200 dark:border-white/10 ${
                    isProfileOpen ? 'pointer-events-auto opacity-100 translate-y-0' : 'pointer-events-none opacity-0 -translate-y-2'
                  }`}
                >
                  <div className="space-y-1 border-b border-border/80 pb-3">
                    <p className="text-sm font-semibold text-foreground">{displayName ?? 'Pengguna'}</p>
                    {userEmail && <p className="text-xs text-foreground/60">{userEmail}</p>}
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-foreground/80">
                    <Link
                      href={profileHref ?? '/user/profile'}
                      className="block rounded-lg px-3 py-2 transition-colors hover:bg-muted/60"
                    >
                      Lihat Profil
                    </Link>
                    <button
                      type="button"
                      onClick={onLogout || handleLogout}
                      className="w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {renderNavContent()}
      </div>
    </nav>
  );
};

export default NavBar;