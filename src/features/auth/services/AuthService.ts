import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '@/types';

interface FirebaseError extends Error {
  code: string;
}

export class AuthService {
  
  // Register: Create Auth & Save to Firestore
  static async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName });

      const user: User = {
        uid: firebaseUser.uid,
        email: email,
        displayName,
        photoURL: '', 
        role: 'user', 
        bio: '',
        createdAt: Date.now(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), user);

      return user;
    } catch (error: unknown) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  // Login: Auth & Fetch from Firestore
  static async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Data user tidak ditemukan di database');
      }

      return userDoc.data() as User;
    } catch (error: unknown) {
      throw new Error(this.getErrorMessage(error));
    }
  }

  // Logout
  static async logout(): Promise<void> {
    await signOut(auth);
  }

  // Get Current User
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Error Handler Helper
  private static getErrorMessage(error: unknown): string {
    let errorCode = '';

    if (error && typeof error === 'object' && 'code' in error) {
      errorCode = (error as FirebaseError).code;
    }

    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Email sudah terdaftar.';
      case 'auth/invalid-email':
        return 'Format email salah.';
      case 'auth/user-not-found':
        return 'Akun tidak ditemukan.';
      case 'auth/wrong-password':
        return 'Password salah.';
      case 'auth/weak-password':
        return 'Password terlalu lemah (min 6 karakter).';
      default:
        if (error instanceof Error) return error.message;
        return 'Terjadi kesalahan sistem.';
    }
  }
}