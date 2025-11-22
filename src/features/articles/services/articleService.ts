import { collection, getDocs } from "firebase/firestore";

import type { Article } from "@/types/content";
import { getFirestoreDb } from "@/services/firebase/client";

const COLLECTION = "articles";

export async function fetchArticles(): Promise<Article[]> {
  const db = getFirestoreDb();
  const snapshot = await getDocs(collection(db, COLLECTION));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Article) }));
}
