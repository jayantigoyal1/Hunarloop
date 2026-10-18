const { test, expect } = require("@playwright/test");

test("choices adapt lessons, persist across pages, and fit a narrow screen", async ({ page }) => {
  await page.goto("/comfort");
  const choice = (name) => page.getByRole("region", { name, exact: true });
  for (const name of ["Calm Mode", "Reading-friendly font", "Chunked short lessons", "Alternative ways to respond"]) await choice(name).getByRole("button", { name: "Accept", exact: true }).click();
  await expect(page.locator("#platform-preferences")).toHaveClass(/calm.*font-dyslexic/);
  await expect(page.getByTestId("lesson-text")).toHaveText("Fill a clean pot with soil.");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByTestId("lesson-text")).toContainText("Place one seed");
  await page.getByRole("button", { name: "🪴 Add soil", exact: true }).click();
  await expect(page.getByRole("textbox")).toHaveValue("Add soil");
  await page.getByRole("button", { name: "Original lesson", exact: true }).click();
  await expect(page.getByTestId("lesson-text")).toContainText("Check the soil each morning.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/passport");
  await expect(page.locator("#platform-preferences")).toHaveClass(/calm.*font-dyslexic/);
  await page.goto("/comfort");
  await choice("Calm Mode").getByRole("button", { name: "Maybe later" }).click();
  await expect(page.locator("#platform-preferences")).not.toHaveClass(/calm/);
});

test("ten-minute timer pauses, resumes and finishes without rewards", async ({ page }) => {
  await page.goto("/comfort");
  await page.getByRole("region", { name: "Focus timer", exact: true }).filter({ has: page.getByRole("button", { name: "Accept", exact: true }) }).getByRole("button", { name: "Accept", exact: true }).click();
  await page.clock.install();
  await page.getByRole("button", { name: "Start 10 minutes" }).click();
  await page.clock.fastForward(60000);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("09:00");
  await page.clock.fastForward(10000);
  await expect(page.getByRole("timer")).toHaveText("09:00");
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.clock.fastForward(540000);
  await expect(page.getByRole("timer")).toHaveText("00:00");
  await expect(page.getByText("Time for a break. Continue when you are ready.")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("hunarloop-preferences")).state.points)).toBe(0);
});

test("read aloud uses chosen language and gracefully reports audio errors", async ({ page }) => {
  await page.addInitScript(() => {
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
    Object.defineProperty(window, "speechSynthesis", { value: { cancel() {}, speak(u) { window.spokenLanguage = u.lang; setTimeout(() => u.onerror?.({ error: "not-allowed" }), 10); } } });
  });
  await page.goto("/comfort");
  await page.getByRole("button", { name: "Read aloud", exact: true }).click();
  await expect(page.getByText("Audio is unavailable here. The lesson text and pictures are still available.")).toBeVisible();
  await page.getByRole("button", { name: "हिन्दी में बदलें" }).click();
  await page.getByRole("button", { name: "सुनें", exact: true }).click();
  expect(await page.evaluate(() => window.spokenLanguage)).toBe("hi-IN");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
