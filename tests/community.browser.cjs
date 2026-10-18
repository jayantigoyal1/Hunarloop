const { test, expect } = require("@playwright/test");

test("rewards show badges, safe history and deep links to real opportunity demos", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("hunarloop-preferences", JSON.stringify({ state: {
      chosenCareerId: "solar-technician", points: 15, gameSessionsCount: 1,
      earnedBadges: ["curious-explorer"], rewardedMilestoneIds: ["solar-technician:1:0"],
      completedMilestoneIds: ["solar-technician:1:0"],
      activityHistory: [
        { id: "game:sample", kind: "game", points: 10, occurredAt: "2026-10-18T10:00:00+05:30" },
        { id: "milestone:solar-technician:1:0", kind: "milestone", points: 5, occurredAt: "2026-10-18T11:00:00+05:30" },
      ],
    }, version: 0 }));
  });
  await page.goto("/rewards");
  await expect(page.getByText("Points are not a measure of intelligence or employability. Points never come from sensitive observations.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Badge collection" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Activity history" })).toBeVisible();
  await expect(page.getByText("Completed a new plan step")).toBeVisible();
  await expect(page.getByText("Completed a game session")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Real rewards" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("rewards.png") });
  await page.getByRole("link", { name: "Explore opportunity" }).first().click();
  await expect(page).toHaveURL(/\/opportunities\?item=nsp-school-scholarship/);
  await expect(page.getByRole("dialog", { name: "Application assistant" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("interest circles can be joined and reported posts stay hidden until restored", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip to demo student" }).click();
  await page.goto("/circles");
  await expect(page.getByTestId("circle-card")).toHaveCount(4);
  const first = page.getByTestId("circle-card").first();
  await expect(first.getByText("Matches your interests", { exact: true })).toBeVisible();
  await first.getByRole("button", { name: "Join circle" }).click();
  await expect(first.getByRole("button", { name: "Leave circle" })).toHaveAttribute("aria-pressed", "true");
  await first.getByRole("button", { name: "Report" }).click();
  await expect(first.getByText("Demo report saved here. This post is hidden on this device; no facilitator has been notified.")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("circle-report.png") });
  await page.reload();
  await expect(page.getByTestId("circle-card").first().getByRole("button", { name: "Leave circle" })).toBeVisible();
  await page.getByTestId("circle-card").first().getByRole("button", { name: "Restore demo post" }).click();
  await expect(page.getByTestId("circle-card").first().getByRole("button", { name: "Report" })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("hunarloop-preferences")).state.points)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("parent audio plays, pauses, resumes and switches to Hindi without leaking observations", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem("hunarloop-preferences", JSON.stringify({ state: { chosenCareerId: "tailoring-maker", gameResults: [
      { id: "a", status: "completed", metrics: { kind: "word-pop" }, skillSignals: ["private signal"] },
      { id: "b", status: "completed", metrics: { kind: "sequence-memory" }, skillSignals: [] },
      { id: "c", status: "completed", metrics: { kind: "catch-star" }, skillSignals: [] },
    ] }, version: 0 }));
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, "speechSynthesis", { value: {
      cancel() { window.cancels = (window.cancels || 0) + 1; },
      pause() { window.pauses = (window.pauses || 0) + 1; },
      resume() { window.resumes = (window.resumes || 0) + 1; },
      speak(u) { window.lastSummary = { text: u.text, lang: u.lang }; u.onstart?.(); },
    } });
  });
  await page.goto("/parent");
  await expect(page.getByRole("heading", { name: "A plan to talk through together" })).toBeVisible();
  await expect(page.getByText(/Illustrative first-month budget/)).toBeVisible();
  await expect(page.getByText(/Many ways to build on strengths/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nearest free assessment centre · demo" })).toBeVisible();
  await page.getByRole("button", { name: "Listen to the summary", exact: true }).click();
  expect(await page.evaluate(() => window.lastSummary.lang)).toBe("en-IN");
  await page.getByRole("button", { name: "Pause audio" }).click();
  await expect(page.getByRole("button", { name: "Resume audio" })).toBeVisible();
  await page.getByRole("button", { name: "Resume audio" }).click();
  await page.getByRole("button", { name: "Stop audio" }).click();
  await page.getByRole("button", { name: "हिन्दी में बदलें" }).click();
  await page.getByRole("button", { name: "सारांश सुनें", exact: true }).click();
  expect(await page.evaluate(() => window.lastSummary.lang)).toBe("hi-IN");
  expect(await page.evaluate(() => window.pauses === 1 && window.resumes === 1)).toBe(true);
  expect(await page.getByRole("main").innerText()).not.toContain("private signal");
  await page.screenshot({ path: testInfo.outputPath("parent-hindi.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
