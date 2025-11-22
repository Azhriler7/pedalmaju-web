import { useEffect, useState } from "react";

import type { Thread } from "@/types/content";

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    async function load() {
      // TODO: Ambil data forum dari Firestore secara real-time.
      setThreads([]);
    }

    void load();
  }, []);

  return threads;
}
