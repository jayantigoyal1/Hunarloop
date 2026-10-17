"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Language = "en" | "hi";
export type PreferenceChoice = "accepted" | "rejected" | "pending";

export type ProfileConstraints = {
  location: string;
  budget: "low" | "medium" | "high";
  transport: string;
  device: string;
  connectivity: string;
};

export type StudentProfile = {
  interests: string[];
  skills: string[];
  goals: string[];
  constraints: ProfileConstraints;
};

export type ComfortSettings = {
  audioInstructions: PreferenceChoice;
  stepByStepTasks: PreferenceChoice;
  visualExamples: PreferenceChoice;
  extraPracticeTime: PreferenceChoice;
  offlineMaterials: PreferenceChoice;
};

export type GameResult = {
  id: string;
  gameId: string;
  points: number;
  completedAt: string;
  skillSignals: string[];
};

export type GameResultInput = Omit<GameResult, "completedAt"> & { completedAt?: string };

type AppData = {
  language: Language;
  calmMode: boolean;
  dyslexicFont: boolean;
  audioFirst: boolean;
  onboardingDone: boolean;
  profile: StudentProfile;
  gameResults: GameResult[];
  gameSessionsCount: number;
  comfortSettings: ComfortSettings;
  chosenCareerId: string | null;
  savedOpportunityIds: string[];
  points: number;
  earnedBadges: string[];
  joinedCircleIds: string[];
  offlineMode: boolean;
};

type AppActions = {
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setCalmMode: (enabled: boolean) => void;
  setDyslexicFont: (enabled: boolean) => void;
  setAudioFirst: (enabled: boolean) => void;
  setOnboardingDone: (done: boolean) => void;
  updateProfile: (profile: Partial<Omit<StudentProfile, "constraints">> & { constraints?: Partial<ProfileConstraints> }) => void;
  addGameResult: (result: GameResultInput) => void;
  clearGameResults: () => void;
  setComfortSetting: (setting: keyof ComfortSettings, choice: PreferenceChoice) => void;
  setChosenCareerId: (careerId: string | null) => void;
  toggleSavedOpportunity: (opportunityId: string) => void;
  addPoints: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  toggleJoinedCircle: (circleId: string) => void;
  setOfflineMode: (enabled: boolean) => void;
  toggleOfflineMode: () => void;
  resetDemo: () => void;
};

type AppState = AppData & AppActions;

function createInitialData(): AppData {
  return {
    language: "en",
    calmMode: false,
    dyslexicFont: false,
    audioFirst: false,
    onboardingDone: false,
    profile: {
      interests: [],
      skills: [],
      goals: [],
      constraints: {
        location: "Khejroli, Jaipur, Rajasthan",
        budget: "low",
        transport: "bus",
        device: "low-end Android phone",
        connectivity: "patchy mobile data",
      },
    },
    gameResults: [],
    gameSessionsCount: 0,
    comfortSettings: {
      audioInstructions: "pending",
      stepByStepTasks: "pending",
      visualExamples: "pending",
      extraPracticeTime: "pending",
      offlineMaterials: "pending",
    },
    chosenCareerId: null,
    savedOpportunityIds: [],
    points: 0,
    earnedBadges: [],
    joinedCircleIds: [],
    offlineMode: false,
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...createInitialData(),
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({ language: state.language === "en" ? "hi" : "en" })),
      setCalmMode: (calmMode) => set({ calmMode }),
      setDyslexicFont: (dyslexicFont) => set({ dyslexicFont }),
      setAudioFirst: (audioFirst) => set({ audioFirst }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      updateProfile: (profile) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...profile,
            constraints: { ...state.profile.constraints, ...profile.constraints },
          },
        })),
      addGameResult: (result) =>
        set((state) => ({
          gameResults: [...state.gameResults, { ...result, completedAt: result.completedAt ?? new Date().toISOString() }],
          gameSessionsCount: state.gameSessionsCount + 1,
          points: state.points + Math.max(0, result.points),
        })),
      clearGameResults: () => set({ gameResults: [], gameSessionsCount: 0 }),
      setComfortSetting: (setting, choice) =>
        set((state) => ({ comfortSettings: { ...state.comfortSettings, [setting]: choice } })),
      setChosenCareerId: (chosenCareerId) => set({ chosenCareerId }),
      toggleSavedOpportunity: (opportunityId) =>
        set((state) => ({
          savedOpportunityIds: state.savedOpportunityIds.includes(opportunityId)
            ? state.savedOpportunityIds.filter((id) => id !== opportunityId)
            : [...state.savedOpportunityIds, opportunityId],
        })),
      addPoints: (amount) => set((state) => ({ points: Math.max(0, state.points + amount) })),
      awardBadge: (badgeId) =>
        set((state) => ({ earnedBadges: state.earnedBadges.includes(badgeId) ? state.earnedBadges : [...state.earnedBadges, badgeId] })),
      toggleJoinedCircle: (circleId) =>
        set((state) => ({
          joinedCircleIds: state.joinedCircleIds.includes(circleId)
            ? state.joinedCircleIds.filter((id) => id !== circleId)
            : [...state.joinedCircleIds, circleId],
        })),
      setOfflineMode: (offlineMode) => set({ offlineMode }),
      toggleOfflineMode: () => set((state) => ({ offlineMode: !state.offlineMode })),
      resetDemo: () => set(createInitialData()),
    }),
    {
      name: "hunarloop-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        calmMode: state.calmMode,
        dyslexicFont: state.dyslexicFont,
        audioFirst: state.audioFirst,
        onboardingDone: state.onboardingDone,
        profile: state.profile,
        gameResults: state.gameResults,
        gameSessionsCount: state.gameSessionsCount,
        comfortSettings: state.comfortSettings,
        chosenCareerId: state.chosenCareerId,
        savedOpportunityIds: state.savedOpportunityIds,
        points: state.points,
        earnedBadges: state.earnedBadges,
        joinedCircleIds: state.joinedCircleIds,
        offlineMode: state.offlineMode,
      }),
    },
  ),
);