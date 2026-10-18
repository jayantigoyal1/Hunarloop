const test = require("node:test");
const assert = require("node:assert/strict");
const { loader, memoryStorage } = require("./module-loader.cjs");

test("rewards depend on participation, not performance or support settings", () => {
  global.localStorage = memoryStorage();
  const store = loader()("src/lib/store.ts").useAppStore;
  store.getState().loadDemoProfile();
  store.getState().addGameResult({ id: "a", gameId: "word-pop", status: "completed", points: 999, skillSignals: ["private metric"], metrics: { kind: "word-pop", trials: [] } });
  store.getState().addGameResult({ id: "b", gameId: "word-pop", status: "completed", points: 0, skillSignals: [], metrics: { kind: "word-pop", trials: [{ correct: false }] } });
  store.getState().addGameResult({ id: "skip", gameId: "word-pop", status: "skipped", points: 20, skillSignals: [] });
  assert.equal(store.getState().points, 20);
  store.getState().setComfortSetting("calmMode", "accepted");
  store.getState().setComfortSetting("readingFont", "rejected");
  store.getState().toggleJoinedCircle("creative-corners");
  store.getState().reportShowcase("creative-corners-showcase");
  assert.equal(store.getState().points, 20);
  assert.equal(store.getState().activityHistory.filter((event) => event.kind === "game").length, 2);
  assert.equal(store.getState().activityHistory.filter((event) => event.kind === "circleJoined").length, 1);
  assert.ok(store.getState().activityHistory.every((event) => (event.kind !== "game" || event.points === 10) && !JSON.stringify(event).includes("private metric")));
  store.getState().setMilestoneComplete("solar-technician:1:0", true);
  store.getState().setMilestoneComplete("solar-technician:1:0", false);
  store.getState().setMilestoneComplete("solar-technician:1:0", true);
  assert.equal(store.getState().points, 25);
  assert.equal(store.getState().activityHistory.filter((event) => event.kind === "milestone").length, 1);
  store.getState().syncActivityBadges();
  assert.ok(store.getState().earnedBadges.includes("curious-explorer"));
  assert.ok(!store.getState().earnedBadges.includes("passport-maker"));
  store.getState().updateProfile({ goals: ["Try a local course"] });
  store.getState().syncActivityBadges();
  assert.ok(store.getState().earnedBadges.includes("passport-maker"));
  assert.equal(store.getState().points, 25);
});

test("legacy points remain visible in history and reset clears new state", () => {
  const storage = memoryStorage();
  storage.setItem("hunarloop-preferences", JSON.stringify({ state: { points: 30, earnedBadges: ["first-step"], joinedCircleIds: ["solar-makers"] }, version: 0 }));
  global.localStorage = storage;
  const store = loader()("src/lib/store.ts").useAppStore;
  assert.deepEqual(store.getState().activityHistory.map((event) => [event.kind, event.points, event.occurredAt]), [["legacy", 30, null]]);
  store.getState().reportShowcase("solar-makers-showcase");
  store.getState().reportShowcase("unknown");
  assert.deepEqual(store.getState().reportedShowcaseIds, ["solar-makers-showcase"]);
  store.getState().toggleJoinedCircle("unknown");
  assert.deepEqual(store.getState().joinedCircleIds, ["solar-makers"]);
  const reloaded = loader()("src/lib/store.ts").useAppStore;
  assert.deepEqual(reloaded.getState().reportedShowcaseIds, ["solar-makers-showcase"]);
  reloaded.getState().restoreShowcase("solar-makers-showcase");
  reloaded.getState().resetDemo();
  assert.equal(reloaded.getState().points, 0);
  assert.deepEqual(reloaded.getState().reportedShowcaseIds, []);
  assert.deepEqual(reloaded.getState().activityHistory, []);
});

test("circle matching uses stated interests and parent transcript stays within safe inputs", () => {
  const load = loader();
  const { matchedCircles } = load("src/data/circle-activities.ts");
  assert.equal(matchedCircles(["drawing", "storytelling"])[0].circle.id, "creative-corners");
  assert.equal(matchedCircles(["खेती", "पानी"])[0].circle.id, "kheti-club");
  const { buildParentSummary } = load("src/lib/parent-summary.ts");
  const en = buildParentSummary("solar-technician", "en");
  const hi = buildParentSummary("solar-technician", "hi");
  assert.equal(en.length, 5);
  assert.ok(en.some((part) => part.key === "cost" && part.text.includes("Source:")));
  assert.ok(en.some((part) => part.key === "income" && part.text.includes("₹")));
  assert.ok(hi.some((part) => part.text.includes("सोलर")));
  assert.ok(!JSON.stringify(en).includes("gameResults"));
  assert.ok(buildParentSummary(null, "en")[0].text.includes("No career"));
});
