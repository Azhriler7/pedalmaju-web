'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Komponen Input dengan Toggle Password
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', label, error, ...props }, ref) => {
    
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';

    // Logic toggle tipe input (text <-> password)
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full space-y-1.5">
        {/* Render Label jika ada */}
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`
              flex h-11 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 
              placeholder:text-gray-400 
              focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600
              disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300'}
              ${className}
            `}
            {...props}
          />

          {/* Tombol Toggle Password (Mata) */}
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              tabIndex={-1} // Agar tidak bisa difokus dengan tab (UX)
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Render Pesan Error jika ada */}
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;