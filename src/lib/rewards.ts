export type ActivityEvent = {
  id: string;
  kind: "game" | "milestone" | "career" | "circleJoined" | "onboarding" | "legacy" | "adjustment";
  occurredAt: string | null;
  points: number;
  simulated?: boolean;
};

// Only non-sensitive participation facts are inputs to badge decisions.
export function activityBadgeIds(input: { onboardingDone: boolean; passportEdited: boolean; chosenCareerId: string | null; completedSessions: number; milestoneCount: number }): string[] {
  return [
    ...(input.onboardingDone ? ["first-step"] : []),
    ...(input.passportEdited ? ["passport-maker"] : []),
    ...(input.chosenCareerId ? ["path-finder"] : []),
    ...(input.completedSessions > 0 ? ["curious-explorer"] : []),
    ...(input.milestoneCount >= 4 ? ["steady-steps"] : []),
  ];
}
