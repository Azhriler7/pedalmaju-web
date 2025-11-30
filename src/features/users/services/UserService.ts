import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, limit, query, updateDoc } from 'firebase/firestore';
import { User } from '@/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Ambil data user berdasarkan UID
export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error get user:", error);
    return null;
  }
};

// Update data user (Bio, Nama, Foto)
export const updateUserProfile = async (uid: string, data: Partial<User>, photoFile?: File) => {
  try {
    const updatePayload: Partial<User> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        (updatePayload as Record<string, unknown>)[key] = value;
      }
    });

    if (photoFile) {
      const uploadedUrl = await uploadToCloudinary(photoFile, 'profiles');
      updatePayload.photoURL = uploadedUrl;
    }

    const userRef = doc(db, 'users', uid);
    if (Object.keys(updatePayload).length > 0) {
      await updateDoc(userRef, updatePayload);
    }

    return { success: true, photoURL: updatePayload.photoURL };
  } catch (error) {
    console.error('Error update user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const q = query(collection(db, 'users'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ ...(docSnap.data() as User), uid: docSnap.id }));
  } catch (error) {
    console.error('Error get all users:', error);
    return [] as User[];
  }
};