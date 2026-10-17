export const GAME_DURATION_MS = 120_000;
export type GameId = "word-pop" | "sequence-memory" | "catch-star";
export type WordMetrics = {
  kind: "word-pop"; durationMs: number;
  trials: { target: string; selected: string; correct: boolean; reactionMs: number; mode: "audio" | "visual" }[];
  errors: number; reactionTimesMs: number[];
};
export type SequenceMetrics = {
  kind: "sequence-memory"; durationMs: number; maxSpan: number;
  rounds: { sequence: number[]; response: number[]; correct: boolean }[];
};
export type StarBucket = { fromMs: number; toMs: number; spawned: number; hits: number; misses: number };
export type StarMetrics = {
  kind: "catch-star"; durationMs: number;
  taps: { atMs: number; target: "star" | "decoy" | "empty" }[];
  buckets: StarBucket[]; accuracy: number | null; impulsiveTaps: number; dropOff: number | null;
};
export type GameMetrics = WordMetrics | SequenceMetrics | StarMetrics;

export function createMetrics(id: GameId): GameMetrics {
  if (id === "word-pop") return { kind: id, durationMs: 0, trials: [], errors: 0, reactionTimesMs: [] };
  if (id === "sequence-memory") return { kind: id, durationMs: 0, maxSpan: 0, rounds: [] };
  return { kind: id, durationMs: 0, taps: [], accuracy: null, impulsiveTaps: 0, dropOff: null, buckets: Array.from({ length: 4 }, (_, i) => ({ fromMs: i * 30000, toMs: (i + 1) * 30000, spawned: 0, hits: 0, misses: 0 })) };
}

export function finalizeMetrics(metrics: GameMetrics, durationMs: number): GameMetrics {
  const result: GameMetrics = JSON.parse(JSON.stringify(metrics));
  result.durationMs = Math.min(GAME_DURATION_MS, Math.max(0, durationMs));
  if (result.kind === "word-pop") {
    result.errors = result.trials.filter((trial) => !trial.correct).length;
    result.reactionTimesMs = result.trials.map((trial) => trial.reactionMs);
  }
  if (result.kind === "catch-star") {
    const hits = result.taps.filter((tap) => tap.target === "star").length;
    result.accuracy = result.taps.length ? hits / result.taps.length : null;
    // A count of decoy/background taps, never a label applied to a student.
    result.impulsiveTaps = result.taps.length - hits;
    const first = result.buckets[0];
    const last = result.buckets[3];
    result.dropOff = first.spawned && last.spawned ? first.hits / first.spawned - last.hits / last.spawned : null;
  }
  return result;
}

export function skillSignals(metrics: GameMetrics): string[] {
  if (metrics.kind === "word-pop" && metrics.trials.some((trial) => trial.correct)) return [metrics.trials.some((trial) => trial.mode === "audio" && trial.correct) ? "listening and matching" : "visual matching"];
  if (metrics.kind === "sequence-memory" && metrics.maxSpan > 0) return ["pattern memory"];
  if (metrics.kind === "catch-star" && metrics.taps.some((tap) => tap.target === "star")) return ["hand-eye coordination"];
  return ["trying new activities"];
}

export function demoMetrics(id: GameId): GameMetrics {
  const metrics = createMetrics(id);
  if (metrics.kind === "word-pop") metrics.trials = Array.from({ length: 12 }, (_, i) => ({ target: "mango", selected: i === 3 ? "apple" : "mango", correct: i !== 3, reactionMs: 900 + i * 40, mode: "audio" }));
  if (metrics.kind === "sequence-memory") {
    metrics.maxSpan = 4;
    metrics.rounds = [{ sequence: [0, 1, 2, 3], response: [0, 1, 2, 3], correct: true }, { sequence: [0, 1, 2, 3, 0], response: [0, 2], correct: false }];
  }
  if (metrics.kind === "catch-star") {
    metrics.buckets.forEach((bucket, i) => { bucket.spawned = 10; bucket.hits = 9 - i; bucket.misses = 1 + i; });
    metrics.taps = metrics.buckets.flatMap((bucket) => Array.from({ length: bucket.hits }, (_, i) => ({ atMs: bucket.fromMs + i * 2000, target: "star" as const })));
    metrics.taps.push({ atMs: 95000, target: "decoy" });
  }
  return finalizeMetrics(metrics, GAME_DURATION_MS);
}

export function comfortSuggestions(results: { status?: string; metrics?: GameMetrics }[]): ("audioInstructions" | "visualExamples" | "stepByStepTasks" | "extraPracticeTime")[] {
  const completed = results.filter((result) => result.status !== "skipped" && result.metrics);
  if (completed.length < 3) return [];
  const suggestions = new Set<"audioInstructions" | "visualExamples" | "stepByStepTasks" | "extraPracticeTime">();
  completed.forEach(({ metrics }) => {
    if (metrics?.kind === "word-pop") suggestions.add(metrics.trials.some((trial) => trial.mode === "audio") ? "audioInstructions" : "visualExamples");
    if (metrics?.kind === "sequence-memory") suggestions.add("stepByStepTasks");
    if (metrics?.kind === "catch-star") suggestions.add("extraPracticeTime");
  });
  return [...suggestions];
}

export function sessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
