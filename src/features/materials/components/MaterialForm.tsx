'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // 1. Import Image
import { ContentBlock, Material } from '@/types';
import { createMaterial, updateMaterial } from '../services/MaterialService';
import { uploadToCloudinary } from '@/lib/cloudinary'; 
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Trash2, Type, Video, Image as ImageIcon } from 'lucide-react';

type FormBlock = ContentBlock & {
  file?: File | null;      
  previewUrl?: string;     
};

type MaterialFormProps = {
  material?: Material;
  isEdit?: boolean;
};

export default function MaterialForm({ material, isEdit = false }: MaterialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState(material?.title || '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<FormBlock[]>(material ? material.contentBlocks.map(block => ({
    ...block,
    file: null,
    previewUrl: block.type === 'image' ? block.value : ''
  })) : []);

  // Add block
  const addBlock = (type: 'text' | 'video' | 'image') => {
    setBlocks([...blocks, {
      id: Date.now().toString(),
      type,
      value: '', 
      file: null,
      previewUrl: ''
    }]);
  };

  // Update value
  const updateBlockValue = (id: string, value: string) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, value } : b));
  };

  // Handle File Change
  const handleBlockFileChange = (id: string, file: File | null) => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBlocks(blocks.map(b => b.id === id ? { ...b, file, previewUrl } : b));
    }
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Judul materi wajib diisi!");
    if (isEdit && !material) return alert("Data materi tidak valid!");
    
    setLoading(true);
    try {
      const processedBlocks: ContentBlock[] = await Promise.all(
        blocks.map(async (block) => {
          if (block.type === 'image' && block.file) {
            const uploadedUrl = await uploadToCloudinary(block.file, 'materials');
            return { id: block.id, type: block.type, value: uploadedUrl };
          }
          return { id: block.id, type: block.type, value: block.value };
        })
      );

      if (isEdit && material) {
        await updateMaterial(material.id, title, thumbnail, processedBlocks, material.thumbnailUrl);
      } else {
        if (!thumbnail) return alert("Thumbnail wajib diupload!");
        await createMaterial(title, thumbnail, processedBlocks);
      }
      router.push('/admin/materials');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan materi. Cek koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border">
      
      {/* HEADER */}
      <div className="space-y-4 border-b pb-6">
        <h2 className="text-xl font-bold text-gray-800">Info Materi</h2>
        <Input 
          label="Judul Materi" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Cover Thumbnail</label>
          {isEdit && material?.thumbnailUrl && !thumbnail && (
            <div className="mb-2">
              <Image
                src={material.thumbnailUrl}
                alt="Current thumbnail"
                width={200}
                height={120}
                className="rounded-lg object-cover"
              />
              <p className="text-xs text-gray-500 mt-1">Thumbnail saat ini</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={e => e.target.files && setThumbnail(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {thumbnail && (
            <p className="text-xs text-green-600 mt-1">Thumbnail baru akan diupload</p>
          )}
        </div>
      </div>

      {/* BLOCKS */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Konten Pembelajaran</h2>
        
        {blocks.length === 0 && (
          <div className="text-gray-400 text-center py-10 border-2 border-dashed rounded-lg bg-gray-50">
            <p>Belum ada konten.</p>
            <p className="text-sm">Klik tombol di bawah untuk mulai menulis.</p>
          </div>
        )}

        {blocks.map((block) => (
          <div key={block.id} className="relative p-4 border rounded-lg bg-gray-50 group transition hover:shadow-sm">
            
            <div className="flex justify-between items-center mb-2">
              <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                block.type === 'video' ? 'bg-red-100 text-red-700 border-red-200' :
                block.type === 'image' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                'bg-gray-200 text-gray-700 border-gray-300'
              }`}>
                {block.type}
              </span>
              <button type="button" onClick={() => removeBlock(block.id)} className="text-gray-400 hover:text-red-500 transition">
                <Trash2 size={16} />
              </button>
            </div>

            {/* TYPE TEXT */}
            {block.type === 'text' && (
              <textarea
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500/20 outline-none h-32 text-sm bg-white"
                placeholder="Tulis materi paragraf di sini..."
                value={block.value}
                onChange={e => updateBlockValue(block.id, e.target.value)}
              />
            )}

            {/* TYPE VIDEO */}
            {block.type === 'video' && (
              <Input
                value={block.value}
                onChange={e => updateBlockValue(block.id, e.target.value)}
                placeholder="Paste Link YouTube di sini (cth: https://youtu.be/...)"
              />
            )}

            {/* TYPE IMAGE (Updated with next/image) */}
            {block.type === 'image' && (
              <div className="space-y-3">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleBlockFileChange(block.id, e.target.files ? e.target.files[0] : null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {/* Preview Image menggunakan Next.js Image */}
                {block.previewUrl && (
                  <div className="relative h-24 w-32 rounded-md overflow-hidden border shadow-sm mt-2">
                    <Image 
                      src={block.previewUrl} 
                      alt="Preview" 
                      fill 
                      className="object-cover"
                      unoptimized // Wajib ada untuk Blob URL lokal
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 justify-center pt-6 pb-2">
          <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg text-sm font-medium transition shadow-sm">
            <Type size={16} className="text-gray-600" /> + Paragraf
          </button>
          <button type="button" onClick={() => addBlock('video')} className="flex items-center gap-2 px-4 py-2 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-lg text-sm font-medium transition shadow-sm text-red-600">
            <Video size={16} /> + Video YT
          </button>
          <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 hover:bg-blue-50 hover:border-blue-200 rounded-lg text-sm font-medium transition shadow-sm text-blue-600">
            <ImageIcon size={16} /> + Gambar
          </button>
        </div>
      </div>

      <div className="pt-6 border-t sticky bottom-0 bg-white pb-4">
        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? 'Sedang Mengupload...' : 'Publikasikan Materi'}
        </Button>
      </div>
    </form>
  );
}