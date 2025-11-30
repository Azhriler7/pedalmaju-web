import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
  try {
    // 1. Ambil Data dari Body Request
    const { userIdToBan } = await request.json();

    if (!userIdToBan) {
      return NextResponse.json({ error: 'User ID wajib diisi' }, { status: 400 });
    }

    // 2. Hapus User dari Authentication (Login)
    // Ini mencegah user login kembali selamanya
    await adminAuth.deleteUser(userIdToBan);

    // 3. Hapus Data User dari Firestore (Profile)
    await adminDb.collection('users').doc(userIdToBan).delete();

    // Opsional: Anda bisa juga menghapus semua postingan user tersebut disini jika mau

    return NextResponse.json({ message: `User ${userIdToBan} berhasil di-banned.` });

  } catch (error) {
    console.error('Gagal ban user:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}