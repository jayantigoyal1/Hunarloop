const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, "speechSynthesis", { value: { cancel() {}, speak(utterance) { window.lastSpokenWord = utterance.text; setTimeout(() => utterance.onend?.(), 10); } } });
  });
});

async function startGame(page, title) {
  await page.goto("/games");
  await page.getByRole("button", { name: new RegExp(title) }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.clock.install();
  await page.getByRole("button", { name: "Let's play", exact: true }).click();
}

async function saved(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("hunarloop-preferences")).state);
}

test("Word Pop records audio matches and errors, completes in two active minutes", async ({ page }) => {
  await startGame(page, "Word Pop");
  await page.clock.runFor(100);
  const target = await page.evaluate(() => window.lastSpokenWord);
  await page.getByRole("button", { name: target, exact: true }).click();
  await page.clock.runFor(600);
  const next = await page.evaluate(() => window.lastSpokenWord);
  const wrong = page.locator("button.game-bubble").filter({ hasNotText: next }).first();
  await wrong.click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await page.clock.fastForward(30000);
  await expect(page.getByText("Take your time", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Continue playing", exact: true }).last().click();
  await page.clock.fastForward(120000);
  await expect(page).toHaveURL(/\/games\/results$/);
  const state = await saved(page);
  expect(state.gameSessionsCount).toBe(1);
  expect(state.gameResults[0].metrics.durationMs).toBe(120000);
  expect(state.gameResults[0].metrics.errors).toBe(1);
  expect(state.gameResults[0].metrics.trials[0].correct).toBe(true);
  await page.getByRole("link", { name: "Open my Passport" }).click();
  await expect(page.getByText("Listening and matching", { exact: true })).toBeVisible();
});

test("Sequence Memory increases its sequence and records the completed span", async ({ page }) => {
  await startGame(page, "Sequence Memory");
  const first = await page.locator("button.bg-sun").innerText();
  await page.clock.runFor(1200);
  await page.getByRole("button", { name: new RegExp(first) }).click();
  await page.clock.runFor(600);
  const one = await page.locator("button.bg-sun").innerText();
  await page.clock.runFor(800);
  const two = await page.locator("button.bg-sun").innerText();
  await page.clock.runFor(1200);
  await page.getByRole("button", { name: new RegExp(one) }).click();
  await page.getByRole("button", { name: new RegExp(two) }).click();
  await page.clock.fastForward(120000);
  await expect(page).toHaveURL(/\/games\/results$/);
  const state = await saved(page);
  expect(state.gameResults[0].metrics.maxSpan).toBe(2);
  expect(state.gameResults[0].metrics.rounds).toHaveLength(2);
});

test("Catch the Star records stars, decoys and background taps", async ({ page }) => {
  await page.addInitScript(() => { let i = 0; Math.random = () => (i++ % 4 < 2 ? 0.1 : 0.9); });
  await startGame(page, "Catch the Star");
  await page.clock.runFor(1200);
  await page.getByRole("button", { name: "Gold star", exact: true }).first().click();
  await page.getByRole("button", { name: "Grey circle", exact: true }).first().click();
  await page.locator(".touch-manipulation").click({ position: { x: 5, y: 270 } });
  await page.clock.fastForward(120000);
  await expect(page).toHaveURL(/\/games\/results$/);
  const metrics = (await saved(page)).gameResults[0].metrics;
  expect(metrics.impulsiveTaps).toBe(2);
  expect(metrics.accuracy).toBeCloseTo(1 / 3);
});

test("Skip never completes a session and demo control unlocks comfort choices", async ({ page }) => {
  await startGame(page, "Word Pop");
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await expect(page).toHaveURL(/\/comfort$/);
  expect((await saved(page)).gameSessionsCount).toBe(0);
  await page.goto("/games");
  await page.getByText("Demo controls", { exact: true }).click();
  await page.getByRole("button", { name: "Simulate 3 sessions" }).click();
  await expect(page).toHaveURL(/\/games\/results$/);
  expect((await saved(page)).gameSessionsCount).toBe(3);
  await page.getByRole("link", { name: "See learning preferences" }).click();
  await expect(page.getByRole("button", { name: "Accept", exact: true })).toHaveCount(6);
  await page.getByRole("button", { name: "Accept", exact: true }).first().click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Accept", exact: true }).first()).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("Hindi labels and picture fallback allow play without speech", async ({ page }) => {
  await page.addInitScript(() => { speechSynthesis.speak = (utterance) => setTimeout(() => utterance.onerror?.({ error: "not-allowed" }), 10); });
  await page.goto("/games");
  await page.getByRole("button", { name: "हिन्दी में बदलें" }).click();
  await page.getByRole("button", { name: /शब्द बुलबुले/ }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "आगे बढ़ें", exact: true }).click();
  await page.clock.install();
  await page.getByRole("button", { name: "खेल शुरू करें", exact: true }).click();
  await page.clock.runFor(100);
  const label = await page.getByRole("img", { name: /^लक्ष्य:/ }).getAttribute("aria-label");
  await page.getByRole("button", { name: label.split(": ")[1], exact: true }).click();
  await page.getByRole("button", { name: "छोड़ें", exact: true }).click();
  await expect(page).toHaveURL(/\/comfort$/);
  expect((await saved(page)).gameResults[0].metrics.trials[0].mode).toBe("visual");
});
