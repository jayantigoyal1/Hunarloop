const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Compile only the modules under test in memory using the existing TS dependency.
function loader() {
  const cache = new Map();
  return function load(file) {
    const fullPath = path.resolve(__dirname, "..", file);
    if (cache.has(fullPath)) return cache.get(fullPath).exports;
    const module = { exports: {} };
    cache.set(fullPath, module);
    const code = ts.transpileModule(fs.readFileSync(fullPath, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const localRequire = (name) => name.startsWith("@/") ? load(`src/${name.slice(2)}.ts`) : require(name);
    new Function("require", "module", "exports", code)(localRequire, module, module.exports);
    return module.exports;
  };
}

function memoryStorage() {
  const items = new Map();
  return { getItem: (key) => items.get(key) ?? null, setItem: (key, value) => items.set(key, value), removeItem: (key) => items.delete(key) };
}

test("employer preview exposes only the four approved fields", () => {
  const { employerPreview } = loader()("src/lib/passport.ts");
  const profile = { name: "Asha", interests: ["art"], skills: ["drawing"], goals: ["learn"], village: "private", constraints: { budget: "private" }, observations: "private", learningPreferences: ["private"], evidence: ["private"] };
  const preview = employerPreview(profile);
  assert.deepEqual(Object.keys(preview).sort(), ["goals", "interests", "name", "skills"]);
  assert.equal(JSON.stringify(preview).includes("private"), false);
  preview.skills.push("new");
  assert.deepEqual(profile.skills, ["drawing"]);
});

test("Phase 2 saved profiles open with defaults for the new passport fields", () => {
  global.localStorage = memoryStorage();
  const first = loader()("src/lib/store.ts").useAppStore;
  first.getState().loadDemoProfile();
  const old = JSON.parse(localStorage.getItem("hunarloop-preferences"));
  for (const key of ["passportEvidence", "teacherVerifiedSkills", "dismissedSkillSignals", "learningPreferences", "shareWithTeacher"]) delete old.state[key];
  localStorage.setItem("hunarloop-preferences", JSON.stringify(old));
  const restored = loader()("src/lib/store.ts").useAppStore.getState();
  assert.equal(restored.profile.name, "Asha");
  assert.deepEqual(restored.passportEvidence, []);
  assert.deepEqual(restored.teacherVerifiedSkills, []);
  assert.equal(restored.shareWithTeacher, false);
});

test("editing or removing verified skills cannot carry verification to a new claim", () => {
  global.localStorage = memoryStorage();
  const store = loader()("src/lib/store.ts").useAppStore;
  store.getState().loadDemoProfile();
  assert.deepEqual(store.getState().teacherVerifiedSkills, ["drawing"]);
  store.getState().updateProfile({ skills: ["painting"] });
  store.getState().updateProfile({ skills: ["painting", "drawing"] });
  assert.deepEqual(store.getState().teacherVerifiedSkills, []);
});

test("evidence, preferences and sharing survive reload and reset with the demo", () => {
  global.localStorage = memoryStorage();
  const store = loader()("src/lib/store.ts").useAppStore;
  store.getState().addEvidence([{ id: "one", name: "Work", fileName: "work.pdf", addedAt: "2026-10-18", status: "pending" }]);
  store.getState().renameEvidence("one", "My drawing");
  store.getState().setShareWithTeacher(true);
  store.getState().setLearningPreferences(["Quiet room"]);
  store.getState().setComfortSetting("audioInstructions", "accepted");
  store.getState().dismissSkillSignal("planning");
  const restored = loader()("src/lib/store.ts").useAppStore;
  assert.equal(restored.getState().passportEvidence[0].name, "My drawing");
  assert.equal(restored.getState().passportEvidence[0].status, "pending");
  assert.equal(restored.getState().shareWithTeacher, true);
  assert.deepEqual(restored.getState().learningPreferences, ["Quiet room"]);
  assert.equal(restored.getState().comfortSettings.audioInstructions, "accepted");
  assert.deepEqual(restored.getState().dismissedSkillSignals, ["planning"]);
  restored.getState().removeEvidence("one");
  assert.deepEqual(restored.getState().passportEvidence, []);
  restored.getState().resetDemo();
  assert.equal(restored.getState().shareWithTeacher, false);
  assert.deepEqual(restored.getState().learningPreferences, []);
});

test("storage failures keep the editor usable and report unsaved changes", () => {
  global.localStorage = { getItem: () => null, setItem: () => { throw new Error("quota"); }, removeItem: () => {} };
  const { useAppStore, isDeviceStorageAvailable } = loader()("src/lib/store.ts");
  assert.doesNotThrow(() => useAppStore.getState().updateProfile({ name: "Asha" }));
  assert.equal(useAppStore.getState().profile.name, "Asha");
  assert.equal(isDeviceStorageAvailable(), false);
});

test("editable chip lists remove empty and repeated entries", () => {
  const { uniqueItems } = loader()("src/lib/passport.ts");
  assert.deepEqual(uniqueItems([" drawing ", "", "Drawing", "planning"]), ["drawing", "planning"]);
});
