import { useEffect, useState } from "react";

import type { Article } from "@/types/content";

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function load() {
      // TODO: Ambil data artikel dari Firestore atau layanan konten.
      setArticles([]);
    }

    void load();
  }, []);

  return articles;
}
