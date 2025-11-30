'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Material } from '@/types';
import { PlayCircle } from 'lucide-react'; 

interface MaterialCardProps {
  material: Material;
}

export default function MaterialCard({ material }: MaterialCardProps) {
  return (
    <Link 
      href={`/materials/${material.id}`}
      className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
    >
      {/* Thumbnail Image */}
      <div className="relative w-full h-48 bg-gray-100">
        {material.thumbnailUrl ? (
          <Image
            src={material.thumbnailUrl}
            alt={material.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <PlayCircle size={48} />
          </div>
        )}
        
        {/* Overlay Play Icon */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <PlayCircle className="text-white w-12 h-12 drop-shadow-lg" />
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 group-hover:text-green-700 transition-colors">
          {material.title}
        </h3>
        <p className="text-xs text-gray-500">
          Diposting pada {new Date(material.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
      </div>
    </Link>
  );
}