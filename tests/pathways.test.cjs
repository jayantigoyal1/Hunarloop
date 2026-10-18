const test = require("node:test");
const assert = require("node:assert/strict");
const { loader, memoryStorage } = require("./module-loader.cjs");

test("all routes return six unique, diverse careers and respond to profile inputs", () => {
  global.localStorage = memoryStorage();
  const load = loader();
  const store = load("src/lib/store.ts").useAppStore;
  const { recommendCareers } = load("src/lib/career-engine.ts");
  store.getState().loadDemoProfile();
  const profile = store.getState().profile;
  const routes = ["nearby", "earn", "long"].map((route) => recommendCareers(profile, route));
  for (const list of routes) {
    assert.equal(list.length, 6);
    assert.equal(new Set(list.map((r) => r.career.id)).size, 6);
    const categories = list.map((r) => r.career.category);
    assert.ok(new Set(categories).size >= 3);
    for (const category of categories) assert.ok(categories.filter((c) => c === category).length <= 2);
    assert.ok(list.every((r) => r.score >= 0 && r.score <= 100));
  }
  assert.notDeepEqual(routes[0].map((r) => r.career.id), routes[2].map((r) => r.career.id));
  const farmer = { ...profile, interests: ["खेती", "पशु"], skills: ["animal care"], enjoys: [] };
  assert.ok(recommendCareers(farmer, "nearby").slice(0, 2).some((r) => r.career.id === "dairy-assistant"));
  assert.equal(recommendCareers({ ...profile, interests: [], skills: [], enjoys: [], goals: [] }, "earn").length, 6);
});

test("every available career has eight complete bilingual weeks and its own project", () => {
  const load = loader();
  const { careers } = load("src/data/careers.ts");
  const { roadmapFor } = load("src/data/roadmap.ts");
  const projects = new Set();
  for (const career of careers) {
    const plan = roadmapFor(career);
    assert.deepEqual(plan.weeks.map((w) => w.week), [1, 2, 3, 4, 5, 6, 7, 8]);
    for (const week of plan.weeks) for (const language of ["en", "hi"]) {
      assert.ok(week.focus[language]);
      assert.equal(week.activities[language].length, 2);
      assert.ok(week.activities[language].every(Boolean));
    }
    projects.add(plan.weeks[4].activities.en[0]);
  }
  assert.equal(projects.size, careers.length);
});

test("milestone rewards cannot be farmed, survive reload and stay separate per career", () => {
  global.localStorage = memoryStorage();
  const load = loader();
  const store = load("src/lib/store.ts").useAppStore;
  const { practiceCoverage } = load("src/data/roadmap.ts");
  const id = "solar-technician:1:0";
  store.getState().setMilestoneComplete(id, true);
  store.getState().setMilestoneComplete(id, true);
  store.getState().setMilestoneComplete(id, false);
  store.getState().setMilestoneComplete(id, true);
  store.getState().setMilestoneComplete("invented:1:0", true);
  store.getState().setMilestoneComplete("solar-technician:9:0", true);
  assert.equal(store.getState().points, 5);
  assert.equal(practiceCoverage("solar-technician", store.getState().completedMilestoneIds)[0].done, 1);
  assert.equal(practiceCoverage("dairy-assistant", store.getState().completedMilestoneIds)[0].done, 0);
  store.getState().setRoadmapFormat("hands");
  const reloaded = loader()("src/lib/store.ts").useAppStore;
  assert.equal(reloaded.getState().roadmapFormat, "hands");
  reloaded.getState().setMilestoneComplete(id, false);
  reloaded.getState().setMilestoneComplete(id, true);
  assert.equal(reloaded.getState().points, 5);
  reloaded.getState().setMilestoneComplete("dairy-assistant:1:0", true);
  assert.equal(reloaded.getState().points, 10);
  reloaded.getState().resetDemo();
  assert.equal(reloaded.getState().completedMilestoneIds.length, 0);
  assert.equal(reloaded.getState().rewardedMilestoneIds.length, 0);
});
