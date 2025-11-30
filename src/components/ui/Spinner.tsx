import React from 'react';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
  size?: number;
}

// Komponen Loading Spinner
export default function Spinner({ className = "", size = 32 }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 
        className={`animate-spin text-green-600 ${className}`} 
        size={size} 
      />
    </div>
  );
}