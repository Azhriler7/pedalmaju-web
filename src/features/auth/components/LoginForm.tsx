'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthService } from '@/features/auth/services/AuthService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handle Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await AuthService.login(email, password);
      
      // Set session cookie
      if (auth.currentUser) {
        const token = await getIdToken(auth.currentUser);
        Cookies.set('session', token, { expires: 7 }); 
      }
      
      // Redirect logic
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard'); // Perbaikan: sesuai folder (student)/dashboard
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Gagal login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        Masuk
      </Button>
    </form>
  );
};

export default LoginForm;