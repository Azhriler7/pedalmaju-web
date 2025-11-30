'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '../services/UserService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Camera, Calendar, User as UserIcon, Edit2, X, Check, Shield, Mail } from 'lucide-react';

interface ProfileViewProps {
  initialUser: User;
}

export default function ProfileView({ initialUser }: ProfileViewProps) {
  const { user: currentUser } = useAuth(); // User yang sedang login di browser
  
  // State Data Profil
  const [profile, setProfile] = useState(initialUser);
  
  // State Mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // State Form Input (Hanya dipakai saat mode Edit)
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState(profile.photoURL);
  const objectUrlRef = useRef<string | null>(null);

  // Logic: Apakah user yang login === pemilik profil ini?
  const isOwnProfile = currentUser?.uid === profile.uid;

  // Handle saat user memilih file foto baru
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const nextPreview = URL.createObjectURL(file);
      objectUrlRef.current = nextPreview;
      setPreviewPhoto(nextPreview);
    }
  };

  // Handle Simpan ke Firebase
  const handleSave = async () => {
    setLoading(true);
    try {
      // Panggil service yang sudah Anda buat
      const result = await updateUserProfile(
        profile.uid, 
        { displayName, bio }, 
        photoFile || undefined
      );
      
      // Update tampilan UI dengan data baru tanpa refresh halaman
      setProfile({
        ...profile,
        displayName,
        bio,
        photoURL: result.photoURL || profile.photoURL
      });
      
      setIsEditing(false); // Keluar dari mode edit
    } catch (error) {
      alert('Gagal memperbarui profil. Silakan coba lagi.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Batal Edit
  const handleCancel = () => {
    setIsEditing(false);
    setDisplayName(profile.displayName);
    setBio(profile.bio || '');
    setPreviewPhoto(profile.photoURL);
    setPhotoFile(null);
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const joinedAtLabel = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(profile.createdAt));
    } catch {
      return '-';
    }
  }, [profile.createdAt]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* 1. Header Banner (Hiasan) */}
      <div className="h-32 bg-gradient-to-r from-green-600 to-green-700 relative">
        {/* Opsional: Bisa tambah tombol ganti cover di sini nanti */}
      </div>

      <div className="px-6 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6 gap-6">
          
          {/* 2. FOTO PROFIL */}
          <div className="relative group">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white bg-gray-100 overflow-hidden relative shadow-md">
              {previewPhoto ? (
                <Image 
                  src={previewPhoto} 
                  alt={profile.displayName} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <UserIcon size={48} />
                </div>
              )}
            </div>

            {/* Overlay Tombol Upload (Hanya muncul saat Editing) */}
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center text-xs font-medium">
                  <Camera size={24} className="mb-1" />
                  <span>Ubah</span>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoChange} 
                />
              </label>
            )}
          </div>

          {/* 3. INFORMASI UTAMA (Nama & Role) */}
          <div className="flex-1 w-full md:w-auto mt-2 md:mt-0">
            {isEditing ? (
              <div className="space-y-3 max-w-sm animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Nama Lengkap</label>
                  <Input 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Nama Lengkap" 
                    className="mt-1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {profile.displayName}
                  {profile.role === 'admin' && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full border border-blue-200 font-bold uppercase tracking-wide">
                      Admin
                    </span>
                  )}
                </h1>
                <p className="text-gray-500 text-sm font-medium">{profile.email}</p>
              </div>
            )}
          </div>

          {/* 4. TOMBOL AKSI (Edit / Save) */}
          {isOwnProfile && (
            <div className="mt-4 md:mt-0 flex gap-3">
              {isEditing ? (
                <>
                  <Button intent="secondary" size="sm" onClick={handleCancel} disabled={loading} icon={<X size={16}/>}>
                    Batal
                  </Button>
                  <Button intent="primary" size="sm" onClick={handleSave} loading={loading} icon={<Check size={16}/>}>
                    Simpan
                  </Button>
                </>
              ) : (
                <Button intent="secondary" size="sm" onClick={() => setIsEditing(true)} icon={<Edit2 size={16}/>}>
                  Edit Profil
                </Button>
              )}
            </div>
          )}
        </div>

        {/* 5. BIO & DETAIL */}
        <div className="space-y-6 border-t border-gray-100 pt-6">
          
          {/* Section Bio */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              Tentang Saya
            </h3>
            
            {isEditing ? (
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none text-sm transition-all"
                rows={4}
                placeholder="Ceritakan sedikit tentang diri Anda, lahan pertanian, atau keahlian Anda..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            ) : (
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {profile.bio || "Pengguna ini belum menulis biodata."}
              </p>
            )}
          </div>

          {/* Metadata Tambahan (Statis) */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-green-600" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-green-600" />
              <span>{profile.role === 'admin' ? 'Administrator komunitas' : 'Anggota komunitas'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-green-600" />
              <span>Bergabung sejak {joinedAtLabel}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}