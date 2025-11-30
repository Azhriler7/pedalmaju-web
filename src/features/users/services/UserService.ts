import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  limit, 
  query, 
  updateDoc, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { User } from '@/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

// 1. Get User Profile
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

// 2. Update Profile
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

// 3. Get All Users (Admin)
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

// 4. Update Status (Heartbeat)
export const updateUserStatus = async (uid: string, isOnline: boolean) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      isOnline,
      lastSeen: Date.now()
    });
  } catch (error) {
    // Silent fail
    console.error("Error update status", error);
  }
};

// 5. Get Online Users (Fetch Once - YANG HILANG TADI)
export const getOnlineUsers = async () => {
  const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);

  const q = query(
    collection(db, 'users'),
    where('isOnline', '==', true),
    where('lastSeen', '>', fiveMinutesAgo),
    orderBy('lastSeen', 'desc'),
    limit(10)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as User);
};

// 6. Listen User Online (Realtime)
export const listenToOnlineUsers = (callback: (users: User[]) => void) => {
  const timeThreshold = Date.now() - (30 * 1000);

  const q = query(
    collection(db, 'users'),
    where('isOnline', '==', true),
    where('lastSeen', '>', timeThreshold),
    orderBy('lastSeen', 'desc'),
    limit(20)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map(doc => doc.data() as User);
    callback(users);
  });

  return unsubscribe;
};