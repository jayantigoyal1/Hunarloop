"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { sampleStudent } from "@/data/student";
import { careers } from "@/data/careers";
import { circles } from "@/data/circles";
import { circleDetails } from "@/data/circle-activities";
import { teacherStudents } from "@/data/teacherStudents";
import { teacherDesk } from "@/data/teacher-dashboard";
import { badges } from "@/data/badges";
import { activityBadgeIds, type ActivityEvent } from "@/lib/rewards";
import { opportunityCatalog, type OpportunityDownload } from "@/data/opportunity-catalog";
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

export type TeacherModule = { id: string; title: string; format: "audio" | "visual" | "hands-on"; price: number; createdAt: string };
export type TeacherRecommendation = { studentId: string; kind: "activity" | "opportunity"; itemId: string; createdAt: string };

type AppData = {
  language: Language;
  calmMode: boolean;
  dyslexicFont: boolean;
  audioFirst: boolean;
  onboardingDone: boolean;
  onboardingConsent: OnboardingConsent;
  profile: StudentProfile;
  passportEdited: boolean;
  gameResults: GameResult[];
  gameSessionsCount: number;
  comfortSettings: ComfortSettings;
  chosenCareerId: string | null;
  completedMilestoneIds: string[];
  rewardedMilestoneIds: string[];
  roadmapFormat: LessonFormat | null;
  savedOpportunityIds: string[];
  opportunityDownloads: Record<string, OpportunityDownload>;
  opportunityDocuments: Record<string, string[]>;
  points: number;
  earnedBadges: string[];
  activityHistory: ActivityEvent[];
  reportedShowcaseIds: string[];
  joinedCircleIds: string[];
  offlineMode: boolean;
  passportEvidence: PassportEvidence[];
  teacherVerifiedSkills: string[];
  dismissedSkillSignals: string[];
  learningPreferences: string[];
  shareWithTeacher: boolean;
  focusTimerState: { remainingMs: number; endsAt: number | null };
  teacherValidatedSkills: Record<string, string[]>;
  teacherModules: TeacherModule[];
  teacherRecommendations: TeacherRecommendation[];
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
  setOpportunityDocument: (opportunityId: string, documentId: string, checked: boolean) => void;
  addPoints: (amount: number) => void;
  awardBadge: (badgeId: string) => void;
  syncActivityBadges: () => void;
  reportShowcase: (id: string) => void;
  restoreShowcase: (id: string) => void;
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
  verifyTeacherSkill: (studentId: string, skill: string) => void;
  createTeacherModule: (module: Omit<TeacherModule, "id" | "createdAt">) => void;
  recommendTeacherItem: (studentId: string, kind: TeacherRecommendation["kind"], itemId: string) => void;
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
    passportEdited: false,
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
    opportunityDownloads: {},
    opportunityDocuments: {},
    points: 0,
    earnedBadges: [],
    activityHistory: [],
    reportedShowcaseIds: [],
    joinedCircleIds: [],
    offlineMode: false,
    passportEvidence: [],
    teacherVerifiedSkills: [],
    dismissedSkillSignals: [],
    learningPreferences: [],
    shareWithTeacher: false,
    focusTimerState: { remainingMs: 600000, endsAt: null },
    teacherValidatedSkills: {},
    teacherModules: [],
    teacherRecommendations: [],
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
      setOnboardingDone: (onboardingDone) => { set((state) => ({ onboardingDone, activityHistory: onboardingDone && !state.activityHistory.some((item) => item.id === "onboarding") ? [...state.activityHistory, { id: "onboarding", kind: "onboarding", points: 0, occurredAt: new Date().toISOString() }] : state.activityHistory })); get().syncActivityBadges(); },
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
      updateProfile: (profile) => {
        set((state) => ({
          passportEdited: state.passportEdited || Boolean(profile.interests?.length || profile.goals?.length || profile.enjoys?.length),
          teacherVerifiedSkills: state.teacherVerifiedSkills.filter((skill) => (profile.skills ?? state.profile.skills).includes(skill)),
          teacherValidatedSkills: { ...state.teacherValidatedSkills, "asha-demo": (state.teacherValidatedSkills["asha-demo"] ?? []).filter((skill) => (profile.skills ?? state.profile.skills).includes(skill)) },
          profile: {
            ...state.profile,
            ...profile,
            constraints: { ...state.profile.constraints, ...profile.constraints },
          },
        }));
        get().syncActivityBadges();
      },
      addGameResult: (result) => {
        set((state) => state.gameResults.some((existing) => existing.id === result.id) ? state : ({
          gameResults: [...state.gameResults, { ...result, points: result.status === "skipped" ? 0 : 10, completedAt: result.completedAt ?? new Date().toISOString() }],
          gameSessionsCount: state.gameSessionsCount + (result.status === "skipped" ? 0 : 1),
          points: state.points + (result.status === "skipped" ? 0 : 10),
          activityHistory: result.status === "skipped" ? state.activityHistory : [...state.activityHistory, { id: "game:" + result.id, kind: "game", points: 10, occurredAt: result.completedAt ?? new Date().toISOString(), simulated: result.simulated }],
        }));
        get().syncActivityBadges();
      },
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
      setChosenCareerId: (chosenCareerId) => {
        if (chosenCareerId !== null && !careers.some((item) => item.id === chosenCareerId)) return;
        set((state) => ({ chosenCareerId, activityHistory: chosenCareerId && !state.activityHistory.some((item) => item.id === "career:" + chosenCareerId) ? [...state.activityHistory, { id: "career:" + chosenCareerId, kind: "career", points: 0, occurredAt: new Date().toISOString() }] : state.activityHistory }));
        get().syncActivityBadges();
      },
      setRoadmapFormat: (roadmapFormat) => set({ roadmapFormat }),
      setMilestoneComplete: (id, complete) => {
        set((state) => {
        if (!validMilestone(id, careers.map((career) => career.id))) return state;
        const completed = state.completedMilestoneIds.includes(id);
        if (completed === complete) return state;
        const reward = complete && !state.rewardedMilestoneIds.includes(id);
        return {
          completedMilestoneIds: complete ? [...state.completedMilestoneIds, id] : state.completedMilestoneIds.filter((item) => item !== id),
          rewardedMilestoneIds: reward ? [...state.rewardedMilestoneIds, id] : state.rewardedMilestoneIds,
          points: state.points + (reward ? 5 : 0),
          activityHistory: reward ? [...state.activityHistory, { id: "milestone:" + id, kind: "milestone", points: 5, occurredAt: new Date().toISOString() }] : state.activityHistory,
        };
        });
        get().syncActivityBadges();
      },
      toggleSavedOpportunity: (opportunityId) => set((state) => {
        const listing = opportunityCatalog.find((item) => item.id === opportunityId);
        if (!listing) return state;
        if (state.opportunityDownloads[opportunityId]) {
          const opportunityDownloads = { ...state.opportunityDownloads };
          delete opportunityDownloads[opportunityId];
          return { opportunityDownloads, savedOpportunityIds: state.savedOpportunityIds.filter((id) => id !== opportunityId) };
        }
        if (state.offlineMode || (typeof navigator !== "undefined" && navigator.onLine === false)) return state;
        return {
          savedOpportunityIds: [...new Set([...state.savedOpportunityIds, opportunityId])],
          opportunityDownloads: { ...state.opportunityDownloads, [opportunityId]: { listing, updatedAt: new Date().toISOString() } },
        };
      }),
      setOpportunityDocument: (opportunityId, documentId, checked) => set((state) => {
        const listing = state.opportunityDownloads[opportunityId]?.listing ?? opportunityCatalog.find((item) => item.id === opportunityId);
        if (!listing || !listing.documents.some((_, index) => documentId === "doc-" + index)) return state;
        const existing = state.opportunityDocuments[opportunityId] ?? [];
        return { opportunityDocuments: { ...state.opportunityDocuments, [opportunityId]: checked ? [...new Set([...existing, documentId])] : existing.filter((id) => id !== documentId) } };
      }),
      addPoints: (amount) => set((state) => {
        if (!Number.isFinite(amount) || amount === 0) return state;
        const points = Math.max(0, state.points + amount);
        return { points, activityHistory: [...state.activityHistory, { id: "adjustment:" + Date.now() + ":" + state.activityHistory.length, kind: "adjustment", occurredAt: new Date().toISOString(), points: points - state.points }] };
      }),
      awardBadge: (badgeId) =>
        set((state) => ({ earnedBadges: !badges.some((badge) => badge.id === badgeId) || state.earnedBadges.includes(badgeId) ? state.earnedBadges : [...state.earnedBadges, badgeId] })),
      syncActivityBadges: () => set((state) => {
        const earnedBadges = [...new Set([...state.earnedBadges, ...activityBadgeIds({ onboardingDone: state.onboardingDone, passportEdited: state.passportEdited, chosenCareerId: state.chosenCareerId, completedSessions: state.gameSessionsCount, milestoneCount: state.rewardedMilestoneIds.length })])];
        return earnedBadges.length === state.earnedBadges.length ? state : { earnedBadges };
      }),
      reportShowcase: (id) => set((state) => !Object.values(circleDetails).some((item) => item.showcase.id === id) || state.reportedShowcaseIds.includes(id) ? state : { reportedShowcaseIds: [...state.reportedShowcaseIds, id] }),
      restoreShowcase: (id) => set((state) => ({ reportedShowcaseIds: state.reportedShowcaseIds.filter((item) => item !== id) })),
      toggleJoinedCircle: (circleId) => set((state) => {
        if (!circles.some((circle) => circle.id === circleId)) return state;
        const joined = state.joinedCircleIds.includes(circleId);
        return {
          joinedCircleIds: joined ? state.joinedCircleIds.filter((id) => id !== circleId) : [...state.joinedCircleIds, circleId],
          activityHistory: !joined && !state.activityHistory.some((item) => item.id === "circle:" + circleId)
            ? [...state.activityHistory, { id: "circle:" + circleId, kind: "circleJoined", points: 0, occurredAt: new Date().toISOString() }]
            : state.activityHistory,
        };
      }),
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
      verifyTeacherSkill: (studentId, skill) => set((state) => {
        if (!teacherStudents.some((student) => student.id === studentId) || !teacherDesk[studentId]?.pendingSkills.some((item) => item.en === skill)) return state;
        if (studentId === "asha-demo" && (!state.shareWithTeacher || !state.profile.skills.includes(skill))) return state;
        const existing = state.teacherValidatedSkills[studentId] ?? [];
        if (existing.includes(skill)) return state;
        return {
          teacherValidatedSkills: { ...state.teacherValidatedSkills, [studentId]: [...existing, skill] },
          ...(studentId === "asha-demo" ? { teacherVerifiedSkills: [...new Set([...state.teacherVerifiedSkills, skill])] } : {}),
        };
      }),
      createTeacherModule: (module) => set((state) => {
        const title = module.title.trim();
        if (!title || title.length > 80 || !["audio", "visual", "hands-on"].includes(module.format) || !Number.isInteger(module.price) || module.price < 0 || module.price > 10000) return state;
        return { teacherModules: [...state.teacherModules, { ...module, title, price: module.price, id: "module-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7), createdAt: new Date().toISOString() }] };
      }),
      recommendTeacherItem: (studentId, kind, itemId) => set((state) => {
        if (!teacherStudents.some((student) => student.id === studentId) || (studentId === "asha-demo" && !state.shareWithTeacher)) return state;
        if (kind === "activity" && itemId !== teacherDesk[studentId]?.activityId) return state;
        if (kind === "opportunity" && !opportunityCatalog.some((item) => item.id === itemId)) return state;
        return { teacherRecommendations: [...state.teacherRecommendations.filter((item) => item.studentId !== studentId || item.kind !== kind), { studentId, kind, itemId, createdAt: new Date().toISOString() }] };
      }),
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
          activityHistory: previous.activityHistory ?? (previous.points ? [{ id: "legacy-points", kind: "legacy", points: previous.points, occurredAt: null }] : []),
          focusTimerState: { ...current.focusTimerState, ...previous.focusTimerState },
          teacherValidatedSkills: previous.teacherValidatedSkills ?? {},
          teacherModules: previous.teacherModules ?? [],
          teacherRecommendations: previous.teacherRecommendations ?? [],
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
        passportEdited: state.passportEdited,
        gameResults: state.gameResults,
        gameSessionsCount: state.gameSessionsCount,
        comfortSettings: state.comfortSettings,
        chosenCareerId: state.chosenCareerId,
        completedMilestoneIds: state.completedMilestoneIds,
        rewardedMilestoneIds: state.rewardedMilestoneIds,
        roadmapFormat: state.roadmapFormat,
        savedOpportunityIds: state.savedOpportunityIds,
        opportunityDownloads: state.opportunityDownloads,
        opportunityDocuments: state.opportunityDocuments,
        points: state.points,
        earnedBadges: state.earnedBadges,
        activityHistory: state.activityHistory,
        reportedShowcaseIds: state.reportedShowcaseIds,
        joinedCircleIds: state.joinedCircleIds,
        offlineMode: state.offlineMode,
        passportEvidence: state.passportEvidence,
        teacherVerifiedSkills: state.teacherVerifiedSkills,
        dismissedSkillSignals: state.dismissedSkillSignals,
        learningPreferences: state.learningPreferences,
        shareWithTeacher: state.shareWithTeacher,
        focusTimerState: state.focusTimerState,
        teacherValidatedSkills: state.teacherValidatedSkills,
        teacherModules: state.teacherModules,
        teacherRecommendations: state.teacherRecommendations,
      }),
    },
  ),
);
