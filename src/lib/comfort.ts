import type { GameResult } from "@/lib/store";

export const accommodationIds = ["calmMode", "readingFont", "audioInstructions", "stepByStepTasks", "focusTimer", "alternativeResponses"] as const;
export type AccommodationId = typeof accommodationIds[number];
export type SupportCluster = { id: "reading" | "memory" | "focus" | "sensory"; sessions: number; confidence: "low" | "medium"; ready: boolean };

export function supportClusters(results: GameResult[]): SupportCluster[] {
  const completed = [...new Map(results.filter((result) => result.status !== "skipped" && result.metrics).map((result) => [result.id, result])).values()];
  return ([{ id: "reading", kind: "word-pop" }, { id: "memory", kind: "sequence-memory" }, { id: "focus", kind: "catch-star" }, { id: "sensory", kind: null }] as const).map(({ id, kind }) => {
    const relevant = completed.filter((result) => result.metrics?.kind === kind);
    return {
      id,
      sessions: relevant.length,
      // Demo confidence rule, not a validated score. Simulations never raise confidence.
      confidence: relevant.filter((result) => !result.simulated).length >= 3 ? "medium" : "low",
      ready: completed.length >= 3 && relevant.length > 0,
    };
  });
}
