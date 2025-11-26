'use client';

import React from 'react';
import Link from 'next/link';
import Button from './Button';

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
}

const NavBar: React.FC<NavBarProps> = ({ variant = 'landing', userEmail, onLogout }) => {
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
              <Link href="/" className="text-xl font-bold text-accent">
                PedalMaju
              </Link>
              <div className="hidden space-x-6 md:flex">
                {landingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleScroll(section.id)}
                    className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors"
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button href="/login" intent="outline" size="sm">
                Masuk
              </Button>
              <Button href="/register" intent="primary" size="sm">
                Daftar
              </Button>
            </div>
          </>
        );
      case 'admin':
      case 'user':
        return (
          <>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-accent">
                PedalMaju
              </Link>
              <div className="hidden space-x-6 md:flex">
                <Link href="/dashboard" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">
                  Dashboard
                </Link>
                <Link href="/articles" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">
                  Artikel
                </Link>
                <Link href="/community" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">
                  Komunitas
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/70">{userEmail}</span>
              <Button onClick={onLogout} intent="outline" size="sm">
                Logout
              </Button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {renderNavContent()}
      </div>
    </nav>
  );
};

export default NavBar;
