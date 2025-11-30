'use client';

import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic'; 
import { ContentBlock } from '@/types';

// 1. Buat tipe data manual untuk props ReactPlayer yang kita pakai
// Ini menggantikan 'any' dengan definisi yang jelas dan aman
interface ReactPlayerProps {
  url: string;
  width: string | number;
  height: string | number;
  controls?: boolean;
  className?: string;
}

// 2. Load ReactPlayer secara Dynamic
// Gunakan 'as React.ComponentType<ReactPlayerProps>' agar TypeScript senang
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false }) as React.ComponentType<ReactPlayerProps>;

export default function MaterialBlockRenderer({ block }: { block: ContentBlock }) {
  
  // Render Teks
  if (block.type === 'text') {
    return (
      <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-6">
        {block.value}
      </div>
    );
  }

  // Render Gambar
  if (block.type === 'image') {
    return (
      <div className="relative w-full h-64 md:h-96 mb-6 rounded-xl overflow-hidden shadow-sm">
        <Image 
          src={block.value} 
          alt="Materi Image" 
          fill 
          className="object-cover"
        />
      </div>
    );
  }

  // Render Video
  if (block.type === 'video') {
    return (
      <div className="relative w-full pt-[56.25%] mb-6 rounded-xl overflow-hidden bg-black shadow-sm">
        <ReactPlayer
          url={block.value}
          width="100%"
          height="100%"
          controls={true}
          className="absolute top-0 left-0"
        />
      </div>
    );
  }

  return null;
}