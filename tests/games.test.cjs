const test = require("node:test");
const assert = require("node:assert/strict");
const { loader, memoryStorage } = require("./module-loader.cjs");

test("word metrics preserve each reaction time and count incorrect matches", () => {
  const { createMetrics, finalizeMetrics } = loader()("src/lib/game-engine.ts");
  const metrics = createMetrics("word-pop");
  metrics.trials = [{ target: "mango", selected: "mango", correct: true, reactionMs: 321, mode: "audio" }, { target: "apple", selected: "mango", correct: false, reactionMs: 800, mode: "visual" }];
  const result = finalizeMetrics(metrics, 120000);
  assert.equal(result.errors, 1);
  assert.deepEqual(result.reactionTimesMs, [321, 800]);
  assert.equal(metrics.errors, 0);
});

test("star accuracy, extra taps and change across time windows use raw events", () => {
  const { createMetrics, finalizeMetrics } = loader()("src/lib/game-engine.ts");
  const metrics = createMetrics("catch-star");
  assert.equal(finalizeMetrics(metrics, 0).accuracy, null);
  assert.equal(finalizeMetrics(metrics, 0).dropOff, null);
  metrics.taps = [{ atMs: 10, target: "star" }, { atMs: 20, target: "decoy" }, { atMs: 30, target: "empty" }];
  metrics.buckets[0] = { fromMs: 0, toMs: 30000, spawned: 10, hits: 8, misses: 2 };
  metrics.buckets[3] = { fromMs: 90000, toMs: 120000, spawned: 10, hits: 5, misses: 5 };
  const result = finalizeMetrics(metrics, 120000);
  assert.equal(result.accuracy, 1 / 3);
  assert.equal(result.impulsiveTaps, 2);
  assert.ok(Math.abs(result.dropOff - 0.3) < 0.00001);
});

test("skips and duplicate finish callbacks do not inflate sessions or rewards", () => {
  global.localStorage = memoryStorage();
  const store = loader()("src/lib/store.ts").useAppStore;
  const result = { id: "skip", gameId: "word-pop", status: "skipped", points: 10, skillSignals: [] };
  store.getState().addGameResult(result);
  store.getState().addGameResult(result);
  assert.equal(store.getState().gameSessionsCount, 0);
  assert.equal(store.getState().points, 0);
  assert.equal(store.getState().gameResults.length, 1);
  store.getState().addGameResult({ ...result, id: "done", status: "completed" });
  store.getState().addGameResult({ ...result, id: "done", status: "completed" });
  assert.equal(store.getState().gameSessionsCount, 1);
  assert.equal(store.getState().points, 10);
});

test("simulation needs consent, fills three sessions once and unlocks suggestions", () => {
  global.localStorage = memoryStorage();
  const load = loader();
  const store = load("src/lib/store.ts").useAppStore;
  const { comfortSuggestions } = load("src/lib/game-engine.ts");
  store.getState().simulateThreeSessions();
  assert.equal(store.getState().gameSessionsCount, 0);
  store.getState().setOnboardingConsent({ games: true });
  store.getState().simulateThreeSessions();
  store.getState().simulateThreeSessions();
  const results = store.getState().gameResults;
  assert.equal(results.length, 3);
  assert.equal(store.getState().gameSessionsCount, 3);
  assert.ok(results.every((result) => result.simulated && result.metrics.durationMs === 120000));
  assert.deepEqual(comfortSuggestions(results.slice(0, 2)), []);
  assert.equal(comfortSuggestions(results).length, 3);
  assert.deepEqual(comfortSuggestions(results.map((result) => ({ ...result, status: "skipped" }))), []);
  const restored = loader()("src/lib/store.ts").useAppStore.getState();
  assert.equal(restored.gameResults[1].metrics.maxSpan, 4);
});
