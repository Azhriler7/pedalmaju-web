import { getDatabase, onValue, ref } from "firebase/database";

import { getFirebaseApp } from "@/services/firebase/client";

type SensorSnapshot = Record<
  string,
  {
    name: string;
    status: "online" | "offline";
    value?: string;
    location?: string;
  }
>;

export function subscribeSensors(
  callback: (snapshot: SensorSnapshot | null) => void,
) {
  const app = getFirebaseApp();
  const db = getDatabase(app);
  const sensorsRef = ref(db, "sensors");

  return onValue(sensorsRef, (snapshot) => {
    callback(snapshot.val() as SensorSnapshot | null);
  });
}
