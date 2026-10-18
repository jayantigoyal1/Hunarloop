"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";

export function useConnection() {
  const simulated = useAppStore((state) => state.offlineMode);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  return { available: online && !simulated, online, simulated };
}
