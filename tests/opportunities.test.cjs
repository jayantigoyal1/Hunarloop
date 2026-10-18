const test = require("node:test");
const assert = require("node:assert/strict");
const { loader, memoryStorage } = require("./module-loader.cjs");
const now = Date.parse("2026-10-18T12:00:00+05:30");

test("combined filters include online items, respect support flags and exclude expired deadlines", () => {
  const load = loader();
  const { opportunityCatalog } = load("src/data/opportunity-catalog.ts");
  const { filterOpportunities, defaultOpportunityFilters } = load("src/lib/opportunity-engine.ts");
  const filter = (values) => filterOpportunities(opportunityCatalog, { ...defaultOpportunityFilters, ...values }, ["women-skill-support"], now);
  assert.ok(filter({ distance: 0 }).every((item) => item.distanceKm === 0));
  assert.equal(filter({ womenOnly: true }).length, 1);
  assert.equal(filter({ womenOnly: true, distance: 10 }).length, 0);
  assert.ok(filter({ soon: true }).every((item) => Date.parse(item.deadlineAt) >= now));
  assert.equal(filter({ savedOnly: true, support: "rights" })[0].id, "women-skill-support");
  assert.equal(filter({ type: "iti", support: "accommodations", distance: 10 }).length, 1);
  assert.ok(filter({ support: "rights" }).every((item) => item.rights));
});

test("deadline labels use India calendar days and expire at the actual closing time", () => {
  const { deadlineStatus } = loader()("src/lib/opportunity-engine.ts");
  assert.deepEqual(deadlineStatus("2026-10-18T23:59:59+05:30", now), { kind: "today", days: 0 });
  assert.equal(deadlineStatus("2026-10-18T11:59:59+05:30", now).kind, "closed");
  assert.deepEqual(deadlineStatus("2026-10-25T23:59:59+05:30", now), { kind: "days", days: 7 });
  assert.equal(deadlineStatus(null, now).kind, "unknown");
  assert.equal(deadlineStatus("not-a-date", now).kind, "unknown");
});

test("eligibility distinguishes a demo match, failed age condition and unknown facts", () => {
  const { eligibilityResult } = loader()("src/lib/opportunity-engine.ts");
  assert.equal(eligibilityResult("age14").status, "match");
  assert.equal(eligibilityResult("age18").status, "no-match");
  assert.equal(eligibilityResult("class").status, "match");
  assert.equal(eligibilityResult("state").status, "match");
  assert.equal(eligibilityResult("women").status, "unknown");
  assert.equal(eligibilityResult("provider").status, "unknown");
});

test("saved snapshots and documents persist; offline cannot download new items; reset clears both", () => {
  global.localStorage = memoryStorage();
  const load = loader();
  const store = load("src/lib/store.ts").useAppStore;
  const id = "jaipur-iti-courses";
  store.getState().toggleSavedOpportunity(id);
  store.getState().setOpportunityDocument(id, "doc-0", true);
  store.getState().setOpportunityDocument(id, "doc-0", true);
  store.getState().setOpportunityDocument(id, "doc-99", true);
  assert.deepEqual(store.getState().opportunityDocuments[id], ["doc-0"]);
  const snapshot = store.getState().opportunityDownloads[id];
  assert.ok(snapshot.listing.officialUrl);
  assert.equal(snapshot.listing.documentsHi.length, snapshot.listing.documents.length);
  assert.ok(Number.isFinite(Date.parse(snapshot.updatedAt)));
  const reloaded = loader()("src/lib/store.ts").useAppStore;
  assert.deepEqual(reloaded.getState().opportunityDownloads[id], snapshot);
  assert.deepEqual(reloaded.getState().opportunityDocuments[id], ["doc-0"]);
  reloaded.getState().setOfflineMode(true);
  reloaded.getState().toggleSavedOpportunity("naps-apprenticeship");
  assert.equal(reloaded.getState().savedOpportunityIds.length, 1);
  reloaded.getState().toggleSavedOpportunity(id);
  assert.equal(reloaded.getState().savedOpportunityIds.length, 0);
  assert.equal(reloaded.getState().opportunityDownloads[id], undefined);
  assert.equal(reloaded.getState().points, 0);
  reloaded.getState().resetDemo();
  assert.deepEqual(reloaded.getState().opportunityDocuments, {});
});

test("all map pin hit targets fit the schematic without overlapping at mobile width", () => {
  const load = loader();
  const { opportunityCatalog } = load("src/data/opportunity-catalog.ts");
  const { mapPositions } = load("src/lib/opportunity-engine.ts");
  const pins = mapPositions(opportunityCatalog);
  assert.equal(pins.length, opportunityCatalog.filter((item) => item.distanceKm > 0).length);
  for (let i = 0; i < pins.length; i++) for (let j = i + 1; j < pins.length; j++) {
    const x = Math.abs(pins[i].x - pins[j].x) * 0.95;
    const y = Math.abs(pins[i].y - pins[j].y) * 0.95;
    assert.ok(x >= 48 || y >= 48, "48px pin targets must not overlap");
  }
  for (const item of opportunityCatalog) assert.equal(item.documents.length, item.documentsHi.length);
});
