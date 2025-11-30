import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Material, Post } from '@/types';

export const getStudentDashboardData = async () => {
  try {
    // 1. Ambil 3 Materi Terbaru (Rekomendasi)
    const materialsQ = query(
      collection(db, 'materials'), 
      orderBy('createdAt', 'desc'), 
      limit(3)
    );
    
    // 2. Ambil 3 Postingan Forum Terbaru (Update Komunitas)
    const postsQ = query(
      collection(db, 'posts'), 
      orderBy('createdAt', 'desc'), 
      limit(3)
    );

    const [materialsSnap, postsSnap] = await Promise.all([
      getDocs(materialsQ),
      getDocs(postsQ)
    ]);

    return {
      materials: materialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material)),
      posts: postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)),
    };
  } catch (error) {
    console.error("Gagal ambil data dashboard siswa:", error);
    return { materials: [], posts: [] };
  }
};