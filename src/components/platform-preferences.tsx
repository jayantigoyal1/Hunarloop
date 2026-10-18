"use client";

import type { ReactNode } from "react";
import { useAppStore } from "@/lib/store";

export function PlatformPreferences({ children }: { children: ReactNode }) {
  const calm = useAppStore((state) => state.calmMode);
  const font = useAppStore((state) => state.dyslexicFont);
  const audio = useAppStore((state) => state.audioFirst);
  const chunked = useAppStore((state) => state.comfortSettings.stepByStepTasks === "accepted");
  const alternative = useAppStore((state) => state.comfortSettings.alternativeResponses === "accepted");
  return <div id="platform-preferences" className={`${calm ? "calm" : ""} ${font ? "font-dyslexic" : ""}`} data-audio-first={audio} data-chunked-lessons={chunked} data-alternative-responses={alternative}>{children}</div>;
}
