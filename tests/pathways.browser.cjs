const { test, expect } = require("@playwright/test");

test("six recommendations per tab, two-card comparison and career selection", async ({ page }, testInfo) => {
  await page.goto("/careers");
  await expect(page.getByRole("heading", { name: "AI analysing your profile…" })).toBeVisible();
  await expect(page.getByTestId("career-card")).toHaveCount(6);
  for (const name of ["Learn-and-earn", "Long-term", "Nearby"]) {
    await page.getByRole("tab", { name, exact: true }).click();
    await expect(page.getByTestId("career-card")).toHaveCount(6);
  }
  const cards = page.getByTestId("career-card");
  await cards.nth(0).getByRole("button", { name: "Compare", exact: true }).click();
  await cards.nth(1).getByRole("button", { name: "Compare", exact: true }).click();
  await expect(page.getByTestId("career-comparison").locator("section")).toHaveCount(2);
  await expect(cards.nth(2).getByRole("button", { name: "Compare", exact: true })).toBeDisabled();
  await page.getByTestId("career-comparison").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("career-comparison.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const title = await cards.first().getByRole("heading", { level: 2 }).innerText();
  await cards.first().getByRole("button", { name: "Choose this career", exact: true }).click();
  await expect(page).toHaveURL(/\/roadmap$/);
  await expect(page.getByTestId("roadmap-week")).toHaveCount(8);
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText(title, { exact: true })).toBeVisible();
});

test("formats, completion, points and Hindi work after reload", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("hunarloop-preferences")) localStorage.setItem("hunarloop-preferences", JSON.stringify({ state: { chosenCareerId: "solar-technician" }, version: 0 }));
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, "speechSynthesis", { value: { cancel() {}, speak(u) { window.lastLesson = u.text; setTimeout(() => u.onend?.(), 10); } } });
  });
  await page.goto("/roadmap");
  await expect(page.getByTestId("roadmap-week")).toHaveCount(8);
  await page.getByTestId("roadmap-week").first().getByRole("button", { name: "Read aloud", exact: true }).click();
  expect(await page.evaluate(() => window.lastLesson)).toContain("electricity");
  await page.getByRole("button", { name: "Visual", exact: true }).click();
  await expect(page.getByTestId("format-guidance")).toContainText("storyboard");
  await page.getByRole("button", { name: "Hands-on", exact: true }).click();
  const checkbox = page.getByTestId("roadmap-week").first().getByRole("checkbox").first();
  await checkbox.check();
  await checkbox.uncheck();
  await checkbox.check();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("hunarloop-preferences")).state.points)).toBe(5);
  await page.reload();
  await expect(checkbox).toBeChecked();
  await expect(page.getByRole("button", { name: "Hands-on", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "हिन्दी में बदलें" }).click();
  await expect(page.getByRole("heading", { name: "आपकी आठ सप्ताह की शुरुआती योजना" })).toBeVisible();
  await expect(page.getByRole("link", { name: "आधिकारिक स्रोत" })).toHaveCount(3);
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("roadmap-hindi.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("accepted comfort input opens one week at a time and direct entry has an empty state", async ({ page }) => {
  await page.goto("/roadmap");
  await expect(page.getByText("Choose a career to build your weekly plan.")).toBeVisible();
  await page.evaluate(() => localStorage.setItem("hunarloop-preferences", JSON.stringify({ state: { chosenCareerId: "dairy-assistant", comfortSettings: { visualExamples: "accepted", stepByStepTasks: "accepted" }, dyslexicFont: true, calmMode: true }, version: 0 })));
  await page.reload();
  await expect(page.getByText(/Adjusted for your visual strength/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Visual", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("roadmap-week")).toHaveCount(8);
  await expect(page.getByTestId("roadmap-week").getByRole("checkbox")).toHaveCount(2);
  await page.getByRole("button", { name: /^Week 8/ }).click();
  await expect(page.getByTestId("roadmap-week").last().getByRole("checkbox")).toHaveCount(2);
  await expect(page.getByTestId("roadmap-week").first().getByRole("checkbox")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
