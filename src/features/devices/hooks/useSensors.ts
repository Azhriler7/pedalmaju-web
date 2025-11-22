import { useEffect, useState } from "react";

type Sensor = {
  id: string;
  name: string;
  status: "online" | "offline";
  value?: string;
  location?: string;
};

export function useSensors() {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    async function load() {
      // TODO: Hubungkan dengan Firebase Realtime Database untuk memantau sensor IoT.
      setSensors([]);
    }

    void load();
  }, []);

  return sensors;
}
