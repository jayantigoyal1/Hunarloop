"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { sampleStudent } from "@/data/student";
import { careers } from "@/data/careers";
import { validMilestone, type LessonFormat } from "@/data/roadmap";
import { demoMetrics, sessionId, skillSignals, type GameMetrics, type GameId } from "@/lib/game-engine";

let deviceStorageAvailable = true;
export const isDeviceStorageAvailable = () => deviceStorageAvailable;

export type Language = "en" | "hi";
export type PreferenceChoice = "accepted" | "rejected" | "pending";

export type ProfileConstraints = {
  location: string;
  budget: string;
  transport: string;
  device: string;
  connectivity: string;
};

export type StudentProfile = {
  name: string;
  village: string;
  district: string;
  preferredLanguage: string;
  interests: string[];
  skills: string[];
  enjoys: string[];
  goals: string[];
  constraints: ProfileConstraints;
};

export type OnboardingConsent = {
  profile: boolean;
  games: boolean;
  guardianNoticeRead: boolean;
};

export type ComfortSettings = {
  calmMode: PreferenceChoice;
  readingFont: PreferenceChoice;
  focusTimer: PreferenceChoice;
  alternativeResponses: PreferenceChoice;
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
  status?: "completed" | "skipped";
  metrics?: GameMetrics;
  simulated?: boolean;
};

export type GameResultInput = Omit<GameResult, "completedAt"> & { completedAt?: string };

export type PassportEvidence = {
  id: string;
  name: string;
  fileName: string;
  addedAt: string;
  status: "pending";
};

type AppData = {
  language: Language;
  calmMode: boolean;
  dyslexicFont: boolean;
  audioFirst: boolean;
  onboardingDone: boolean;
  onboardingConsent: OnboardingConsent;
  profile: StudentProfile;
  gameResults: GameResult[];
  gameSessionsCount: number;
  comfortSettings: ComfortSettings;
  chosenCareerId: string | null;
  completedMilestoneIds: string[];
  rewardedMilestoneIds: string[];
  roadmapFormat: LessonFormat | null;
  savedOpportunityIds: string[];
  points: number;
  earnedBadges: string[];
  joinedCircleIds: string[];
  offlineMode: boolean;
  passportEvidence: PassportEvidence[];
  teacherVerifiedSkills: string[];
  dismissedSkillSignals: string[];
  learningPreferences: string[];
  shareWithTeacher: boolean;
  focusTimerState: { remainingMs: number; endsAt: number | null };
};

type AppActions = {
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  setCalmMode: (enabled: boolean) => void;
  setDyslexicFont: (enabled: boolean) => void;
  setAudioFirst: (enabled: boolean) => void;
  setOnboardingDone: (done: boolean) => void;
  setOnboardingConsent: (consent: Partial<OnboardingConsent>) => void;
  loadDemoProfile: () => void;
  updateProfile: (profile: Partial<Omit<StudentProfile, "constraints">> & { constraints?: Partial<ProfileConstraints> }) => void;
  addGameResult: (result: GameResultInput) => void;
  clearGameResults: () => void;
  simulateThreeSessions: () => void;
  setComfortSetting: (setting: keyof ComfortSettings, choice: PreferenceChoice) => void;
  setChosenCareerId: (careerId: string | null) => void;
  setMilestoneComplete: (id: string, complete: boolean) => void;
  setRoadmapFormat: (format: LessonFormat) => void;
  toggleSavedOpportunity: (opportunityId: string) => void;
  addPoints: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  toggleJoinedCircle: (circleId: string) => void;
  setOfflineMode: (enabled: boolean) => void;
  toggleOfflineMode: () => void;
  resetDemo: () => void;
  setShareWithTeacher: (enabled: boolean) => void;
  setLearningPreferences: (items: string[]) => void;
  dismissSkillSignal: (signal: string) => void;
  addEvidence: (items: PassportEvidence[]) => void;
  renameEvidence: (id: string, name: string) => void;
  removeEvidence: (id: string) => void;
  startFocusTimer: () => void;
  pauseFocusTimer: () => void;
  resetFocusTimer: () => void;
  finishFocusTimer: () => void;
};

type AppState = AppData & AppActions;

function createInitialData(): AppData {
  return {
    language: "en",
    calmMode: false,
    dyslexicFont: false,
    audioFirst: true,
    onboardingDone: false,
    onboardingConsent: { profile: false, games: false, guardianNoticeRead: false },
    profile: {
      name: "",
      village: "",
      district: "",
      preferredLanguage: "English",
      interests: [],
      skills: [],
      enjoys: [],
      goals: [],
      constraints: {
        location: "",
        budget: "low",
        transport: "bus",
        device: "low-end Android phone",
        connectivity: "patchy mobile data",
      },
    },
    gameResults: [],
    gameSessionsCount: 0,
    comfortSettings: {
      calmMode: "pending",
      readingFont: "pending",
      focusTimer: "pending",
      alternativeResponses: "pending",
      audioInstructions: "pending",
      stepByStepTasks: "pending",
      visualExamples: "pending",
      extraPracticeTime: "pending",
      offlineMaterials: "pending",
    },
    chosenCareerId: null,
    completedMilestoneIds: [],
    rewardedMilestoneIds: [],
    roadmapFormat: null,
    savedOpportunityIds: [],
    points: 0,
    earnedBadges: [],
    joinedCircleIds: [],
    offlineMode: false,
    passportEvidence: [],
    teacherVerifiedSkills: [],
    dismissedSkillSignals: [],
    learningPreferences: [],
    shareWithTeacher: false,
    focusTimerState: { remainingMs: 600000, endsAt: null },
  };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...createInitialData(),
      setLanguage: (language) => set({ language }),
      toggleLanguage: () => set((state) => ({ language: state.language === "en" ? "hi" : "en" })),
      setCalmMode: (calmMode) => set((state) => ({ calmMode, comfortSettings: { ...state.comfortSettings, calmMode: calmMode ? "accepted" : "rejected" } })),
      setDyslexicFont: (dyslexicFont) => set((state) => ({ dyslexicFont, comfortSettings: { ...state.comfortSettings, readingFont: dyslexicFont ? "accepted" : "rejected" } })),
      setAudioFirst: (audioFirst) => set((state) => ({ audioFirst, comfortSettings: { ...state.comfortSettings, audioInstructions: audioFirst ? "accepted" : "rejected" } })),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      setOnboardingConsent: (consent) =>
        set((state) => ({ onboardingConsent: { ...state.onboardingConsent, ...consent } })),
      loadDemoProfile: () =>
        set((state) => ({
          ...createInitialData(),
          language: state.language,
          calmMode: state.calmMode,
          dyslexicFont: state.dyslexicFont,
          audioFirst: state.audioFirst,
          comfortSettings: { ...createInitialData().comfortSettings, calmMode: state.comfortSettings.calmMode, readingFont: state.comfortSettings.readingFont, audioInstructions: state.comfortSettings.audioInstructions },
          profile: {
            name: sampleStudent.name,
            village: sampleStudent.village,
            district: sampleStudent.district,
            preferredLanguage: sampleStudent.preferredLanguage,
            interests: ["hands-on making", "helping people", "creative activities"],
            skills: ["drawing", "repairing things"],
            enjoys: ["repairing things", "drawing", "helping at home"],
            goals: ["finish Class 10", "explore vocational training", "earn safely when ready"],
            constraints: {
              location: `${sampleStudent.village}, ${sampleStudent.district}, ${sampleStudent.state}`,
              budget: sampleStudent.budget,
              transport: sampleStudent.transport,
              device: sampleStudent.device,
              connectivity: sampleStudent.connectivity,
            },
          },
          onboardingDone: true,
          teacherVerifiedSkills: ["drawing"],
          onboardingConsent: { profile: true, games: false, guardianNoticeRead: true },
        })),
      updateProfile: (profile) =>
        set((state) => ({
          teacherVerifiedSkills: state.teacherVerifiedSkills.filter((skill) => (profile.skills ?? state.profile.skills).includes(skill)),
          profile: {
            ...state.profile,
            ...profile,
            constraints: { ...state.profile.constraints, ...profile.constraints },
          },
        })),
      addGameResult: (result) =>
        set((state) => state.gameResults.some((existing) => existing.id === result.id) ? state : ({
          gameResults: [...state.gameResults, { ...result, completedAt: result.completedAt ?? new Date().toISOString() }],
          gameSessionsCount: state.gameSessionsCount + (result.status === "skipped" ? 0 : 1),
          points: state.points + (result.status === "skipped" ? 0 : Math.max(0, result.points)),
        })),
      simulateThreeSessions: () => {
        if (!get().onboardingConsent.games) return;
        const ids: GameId[] = ["word-pop", "sequence-memory", "catch-star"];
        const remaining = Math.max(0, 3 - get().gameResults.filter((result) => result.status !== "skipped" && result.metrics).length);
        for (let i = 0; i < remaining; i++) {
          const metrics = demoMetrics(ids[i]);
          get().addGameResult({ id: sessionId(), gameId: ids[i], points: 10, status: "completed", simulated: true, metrics, skillSignals: skillSignals(metrics) });
        }
      },
      clearGameResults: () => set({ gameResults: [], gameSessionsCount: 0 }),
      setComfortSetting: (setting, choice) =>
        set((state) => ({
          comfortSettings: { ...state.comfortSettings, [setting]: choice },
          ...(setting === "calmMode" ? { calmMode: choice === "accepted" } : {}),
          ...(setting === "readingFont" ? { dyslexicFont: choice === "accepted" } : {}),
          ...(setting === "audioInstructions" ? { audioFirst: choice === "accepted" } : {}),
          ...(setting === "focusTimer" && choice !== "accepted" ? { focusTimerState: { remainingMs: state.focusTimerState.endsAt === null ? state.focusTimerState.remainingMs : Math.max(0, state.focusTimerState.endsAt - Date.now()), endsAt: null } } : {}),
        })),
      setChosenCareerId: (chosenCareerId) => set({ chosenCareerId }),
      setRoadmapFormat: (roadmapFormat) => set({ roadmapFormat }),
      setMilestoneComplete: (id, complete) => set((state) => {
        if (!validMilestone(id, careers.map((career) => career.id))) return state;
        const completed = state.completedMilestoneIds.includes(id);
        if (completed === complete) return state;
        const reward = complete && !state.rewardedMilestoneIds.includes(id);
        return {
          completedMilestoneIds: complete ? [...state.completedMilestoneIds, id] : state.completedMilestoneIds.filter((item) => item !== id),
          rewardedMilestoneIds: reward ? [...state.rewardedMilestoneIds, id] : state.rewardedMilestoneIds,
          points: state.points + (reward ? 5 : 0),
        };
      }),
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
      setShareWithTeacher: (shareWithTeacher) => set({ shareWithTeacher }),
      setLearningPreferences: (learningPreferences) => set({ learningPreferences }),
      dismissSkillSignal: (signal) => set((state) => ({ dismissedSkillSignals: [...new Set([...state.dismissedSkillSignals, signal])] })),
      addEvidence: (items) => set((state) => ({ passportEvidence: [...state.passportEvidence, ...items] })),
      renameEvidence: (id, name) => set((state) => ({ passportEvidence: state.passportEvidence.map((item) => item.id === id ? { ...item, name } : item) })),
      removeEvidence: (id) => set((state) => ({ passportEvidence: state.passportEvidence.filter((item) => item.id !== id) })),
      startFocusTimer: () => set((state) => state.comfortSettings.focusTimer !== "accepted" || state.focusTimerState.endsAt !== null ? state : ({ focusTimerState: { remainingMs: state.focusTimerState.remainingMs || 600000, endsAt: Date.now() + (state.focusTimerState.remainingMs || 600000) } })),
      pauseFocusTimer: () => set((state) => ({ focusTimerState: { remainingMs: state.focusTimerState.endsAt === null ? state.focusTimerState.remainingMs : Math.max(0, state.focusTimerState.endsAt - Date.now()), endsAt: null } })),
      resetFocusTimer: () => set({ focusTimerState: { remainingMs: 600000, endsAt: null } }),
      finishFocusTimer: () => set((state) => state.focusTimerState.endsAt !== null && state.focusTimerState.endsAt <= Date.now() ? { focusTimerState: { remainingMs: 0, endsAt: null } } : state),
    }),
    {
      name: "hunarloop-preferences",
      merge: (persisted, current) => {
        const previous = (persisted ?? {}) as Partial<AppData>;
        const comfortSettings = { ...current.comfortSettings, ...previous.comfortSettings };
        if (!previous.comfortSettings?.calmMode && previous.calmMode) comfortSettings.calmMode = "accepted";
        if (!previous.comfortSettings?.readingFont && previous.dyslexicFont) comfortSettings.readingFont = "accepted";
        return {
          ...current, ...previous, comfortSettings,
          focusTimerState: { ...current.focusTimerState, ...previous.focusTimerState },
          calmMode: comfortSettings.calmMode === "accepted",
          dyslexicFont: comfortSettings.readingFont === "accepted",
          audioFirst: comfortSettings.audioInstructions === "pending" ? (previous.audioFirst ?? current.audioFirst) : comfortSettings.audioInstructions === "accepted",
        };
      },
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try { const value = localStorage.getItem(name); deviceStorageAvailable = true; return value; }
          catch { deviceStorageAvailable = false; return null; }
        },
        setItem: (name, value) => {
          try { localStorage.setItem(name, value); deviceStorageAvailable = true; }
          catch { deviceStorageAvailable = false; }
        },
        removeItem: (name) => {
          try { localStorage.removeItem(name); deviceStorageAvailable = true; }
          catch { deviceStorageAvailable = false; }
        },
      })),
      partialize: (state) => ({
        language: state.language,
        calmMode: state.calmMode,
        dyslexicFont: state.dyslexicFont,
        audioFirst: state.audioFirst,
        onboardingDone: state.onboardingDone,
        onboardingConsent: state.onboardingConsent,
        profile: state.profile,
        gameResults: state.gameResults,
        gameSessionsCount: state.gameSessionsCount,
        comfortSettings: state.comfortSettings,
        chosenCareerId: state.chosenCareerId,
        completedMilestoneIds: state.completedMilestoneIds,
        rewardedMilestoneIds: state.rewardedMilestoneIds,
        roadmapFormat: state.roadmapFormat,
        savedOpportunityIds: state.savedOpportunityIds,
        points: state.points,
        earnedBadges: state.earnedBadges,
        joinedCircleIds: state.joinedCircleIds,
        offlineMode: state.offlineMode,
        passportEvidence: state.passportEvidence,
        teacherVerifiedSkills: state.teacherVerifiedSkills,
        dismissedSkillSignals: state.dismissedSkillSignals,
        learningPreferences: state.learningPreferences,
        shareWithTeacher: state.shareWithTeacher,
        focusTimerState: state.focusTimerState,
      }),
    },
  ),
);
