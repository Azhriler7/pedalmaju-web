'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthService } from '@/features/auth/services/AuthService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await AuthService.register(email, password, displayName);
      
      // Simpan session (opsional jika nanti butuh middleware)
      if (auth.currentUser) {
        const token = await getIdToken(auth.currentUser);
        Cookies.set('session', token, { expires: 7 });
      }
      
      // Redirect manual tanpa middleware
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal mendaftar');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Nama Lengkap"
        id="displayName"
        type="text"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        placeholder="Masukkan nama lengkap"
        required
      />

      <Input
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Masukkan email"
        required
      />

      <Input
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Masukkan password"
        required
      />

      {error && (
        <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      <Button 
        type="submit" 
        intent="primary" 
        loading={loading} 
        fullWidth
      >
        Daftar Sekarang
      </Button>
    </form>
  );
};

export default RegisterForm;