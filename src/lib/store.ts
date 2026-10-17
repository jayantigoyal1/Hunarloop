"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Language = "en" | "hi";

type AppState = {
  language: Language;
  calmMode: boolean;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setCalmMode: (enabled: boolean) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: "en",
      calmMode: false,
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({ language: state.language === "en" ? "hi" : "en" })),
      setCalmMode: (calmMode) => set({ calmMode }),
    }),
    {
      name: "hunarloop-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language, calmMode: state.calmMode }),
    },
  ),
);