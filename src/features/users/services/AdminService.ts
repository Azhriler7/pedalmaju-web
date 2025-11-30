import { db } from '@/lib/firebase';
import { collection, getCountFromServer, query, orderBy, limit, getDocs } from 'firebase/firestore';

export const getAdminStats = async () => {
  try {
    // 1. Hitung Total Data (Realtime Count)
    const usersSnap = await getCountFromServer(collection(db, 'users'));
    const materialsSnap = await getCountFromServer(collection(db, 'materials'));
    const postsSnap = await getCountFromServer(collection(db, 'posts'));

    // 2. Ambil Aktivitas Terbaru (User Baru & Materi Baru)
    const recentUsersQ = query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(2));
    const recentMaterialsQ = query(collection(db, 'materials'), orderBy('createdAt', 'desc'), limit(2));
    
    const [userDocs, materialDocs] = await Promise.all([
      getDocs(recentUsersQ),
      getDocs(recentMaterialsQ)
    ]);

    // Format Data Aktivitas
    const activities = [
      ...userDocs.docs.map(d => ({
        action: `User baru mendaftar: ${d.data().displayName}`,
        time: new Date(d.data().createdAt).toLocaleDateString('id-ID')
      })),
      ...materialDocs.docs.map(d => ({
        action: `Materi baru: ${d.data().title}`,
        time: new Date(d.data().createdAt).toLocaleDateString('id-ID')
      }))
    ];

    return {
      totalUsers: usersSnap.data().count,
      totalMaterials: materialsSnap.data().count,
      totalPosts: postsSnap.data().count,
      recentActivities: activities.slice(0, 4) // Ambil 4 teratas
    };
  } catch (error) {
    console.error("Gagal ambil stats admin:", error);
    return { totalUsers: 0, totalMaterials: 0, totalPosts: 0, recentActivities: [] };
  }
};