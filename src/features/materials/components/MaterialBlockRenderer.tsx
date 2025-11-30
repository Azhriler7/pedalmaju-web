'use client';

import React from 'react';
import Image from 'next/image';
import { ContentBlock } from '@/types';

// Helper: Ambil ID YouTube dari berbagai format link (Short URL, Full URL, Embed)
const getYouTubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default function MaterialBlockRenderer({ block }: { block: ContentBlock }) {
  
  // 1. Render Teks
  if (block.type === 'text') {
    return (
      <div className="prose max-w-none text-gray-800 leading-relaxed whitespace-pre-wrap mb-8 text-base md:text-lg">
        {block.value}
      </div>
    );
  }

  // 2. Render Gambar
  if (block.type === 'image') {
    return (
      <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Image 
          src={block.value} 
          alt="Visualisasi Materi" 
          fill 
          className="object-cover hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>
    );
  }

  // 3. Render Video (Native Iframe - Solusi Paling Stabil)
  if (block.type === 'video') {
    const videoId = getYouTubeId(block.value);

    // Jika ID berhasil diambil dari link admin
    if (videoId) {
      return (
        <div className="relative w-full pt-[56.25%] mb-8 rounded-2xl overflow-hidden bg-gray-100 shadow-md border border-gray-200">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    } 
    
    // Tampilan jika Link Admin salah/rusak
    return (
      <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm text-center font-medium">
        Video tidak dapat dimuat. Link rusak atau tidak valid.
        <br/>
        <span className="text-xs text-gray-500 mt-1 block">{block.value}</span>
      </div>
    );
  }

  return null;
}