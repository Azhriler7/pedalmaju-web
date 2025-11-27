'use client';

import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: 'primary' | 'secondary' | 'logout';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
}

// Komponen Button Reusable
const Button: React.FC<ButtonProps> = ({
  intent = 'primary',
  size = 'md',
  loading = false,
  icon,
  href,
  children,
  className = '',
  fullWidth = false,
  disabled,
  ...props
}) => {
  
  // Base styles (Layout & Transition)
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Warna & Style (Hijau Theme)
  const intentClasses = {
    primary: 'bg-green-600 text-white hover:bg-green-700 border border-transparent shadow-sm',
    secondary: 'bg-transparent text-green-700 border-2 border-green-600 hover:bg-green-50',
    logout: 'bg-transparent text-green-700 border-2 border-green-600 hover:bg-red-50 hover:text-red-700',
  };

  // Ukuran padding & text
  const sizeClasses = {
    sm: 'h-9 px-3 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  
  // Gabungkan semua class
  const combinedClassName = `${baseClasses} ${intentClasses[intent]} ${sizeClasses[size]} ${widthClass} ${className}`;

  // Render sebagai Link (jika ada href)
  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClassName}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }

  // Render sebagai Button biasa
  return (
    <button className={combinedClassName} disabled={loading || disabled} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;