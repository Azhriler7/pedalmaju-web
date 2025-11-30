import { db } from '@/lib/firebase';
import { 
  collection, addDoc, getDocs, getDoc, deleteDoc, doc, 
  query, orderBy, updateDoc 
} from 'firebase/firestore';
import { Material, ContentBlock } from '@/types';
import { uploadToCloudinary } from '@/lib/cloudinary';

const COLLECTION = 'materials';

// Create Material
export const createMaterial = async (
  title: string, 
  thumbnailFile: File | null, 
  blocks: ContentBlock[]
) => {
  let thumbnailUrl = '';
  
  // 1. Upload Thumbnail (Cover)
  if (thumbnailFile) {
    // FIX: Sebelumnya salah nama variabel (imageUrl -> thumbnailUrl)
    thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'materials');
  }

  // 2. Simpan ke Firestore
  const newMaterial: Omit<Material, 'id'> = {
    title,
    thumbnailUrl,
    contentBlocks: blocks, // Blocks sudah berisi URL gambar (diurus di Form)
    createdAt: Date.now(),
  };

  await addDoc(collection(db, COLLECTION), newMaterial);
};

// ... (Sisa fungsi getMaterials, deleteMaterial tetap sama)
export const getMaterials = async () => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Material));
};

export const getMaterialById = async (id: string) => {
  const docRef = doc(db, COLLECTION, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Material;
};

export const deleteMaterial = async (id: string) => {
  await deleteDoc(doc(db, COLLECTION, id));
};

// Update Material
export const updateMaterial = async (
  id: string,
  title: string,
  thumbnailFile: File | null,
  blocks: ContentBlock[],
  currentThumbnailUrl?: string
) => {
  let thumbnailUrl = currentThumbnailUrl || '';

  // Upload new thumbnail if provided
  if (thumbnailFile) {
    thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'materials');
  }

  // Update in Firestore
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    title,
    thumbnailUrl,
    contentBlocks: blocks,
  });
};