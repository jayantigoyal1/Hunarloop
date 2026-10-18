const test = require("node:test");
const assert = require("node:assert/strict");
const { loader, memoryStorage } = require("./module-loader.cjs");

test("confidence excludes skips, duplicates and simulated evidence", () => {
  const { supportClusters } = loader()("src/lib/comfort.ts");
  const results = [0, 1, 2].map((id) => ({ id: String(id), status: "completed", metrics: { kind: "word-pop" } }));
  assert.equal(supportClusters(results)[0].confidence, "medium");
  assert.equal(supportClusters(results.map((r) => ({ ...r, simulated: true })))[0].confidence, "low");
  assert.equal(supportClusters([results[0], results[0], { ...results[1], status: "skipped" }])[0].ready, false);
  assert.equal(supportClusters(results)[3].sessions, 0);
});

test("settings sync, persist, pause timers and never change rewards", () => {
  global.localStorage = memoryStorage();
  const store = loader()("src/lib/store.ts").useAppStore;
  const originalNow = Date.now;
  let now = 1000;
  Date.now = () => now;
  try {
    const before = store.getState().points;
    for (const key of ["calmMode", "readingFont", "audioInstructions", "focusTimer"]) store.getState().setComfortSetting(key, "accepted");
    assert.equal(store.getState().calmMode, true);
    assert.equal(store.getState().dyslexicFont, true);
    store.getState().startFocusTimer();
    now += 100000;
    store.getState().pauseFocusTimer();
    assert.equal(store.getState().focusTimerState.remainingMs, 500000);
    store.getState().startFocusTimer();
    now += 10000;
    store.getState().setComfortSetting("focusTimer", "pending");
    assert.deepEqual(store.getState().focusTimerState, { remainingMs: 490000, endsAt: null });
    store.getState().setComfortSetting("calmMode", "pending");
    assert.equal(store.getState().calmMode, false);
    store.getState().setDyslexicFont(false);
    assert.equal(store.getState().comfortSettings.readingFont, "rejected");
    assert.equal(store.getState().points, before);
    const reloaded = loader()("src/lib/store.ts").useAppStore;
    assert.equal(reloaded.getState().focusTimerState.remainingMs, 490000);
    assert.equal(reloaded.getState().audioFirst, true);
  } finally { Date.now = originalNow; }
});
