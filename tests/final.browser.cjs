const { test, expect } = require("@playwright/test");

test("post-onboarding home and six-step demo guide work at mobile width", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await page.getByRole("button", { name: "Skip to demo student" }).click();
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(page.getByRole("heading", { name: "My learning" })).toBeVisible();
  await expect(page.getByRole("img", { name: /Journey progress/ })).toBeVisible();
  await page.getByRole("link", { name: /Profile questions/ }).click();
  await page.getByRole("button", { name: "Open profile questions" }).click();
  await expect(page.getByPlaceholder("Type your answer here")).toHaveValue("Asha");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Today's small task" })).toBeVisible();
  await page.getByRole("button", { name: "Demo guide" }).click();
  const guide = page.getByRole("dialog", { name: "Explore HunarLoop" });
  await expect(guide).toBeVisible();
  for (let step = 1; step < 6; step++) await guide.getByRole("button", { name: "Next" }).click();
  await expect(guide.getByText("Step 6 of 6")).toBeVisible();
  await expect(guide.getByRole("link", { name: "Open this step: Family and teacher" })).toBeVisible();
  await guide.getByRole("button", { name: "Close demo guide" }).click();
  await page.screenshot({ path: testInfo.outputPath("home-dashboard.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("manual offline pauses fresh career analysis and live voice input", async ({ page }) => {
  await page.addInitScript(() => { window.SpeechRecognition = class { start() {} stop() {} }; });
  await page.goto("/");
  await page.getByRole("button", { name: "Skip to demo student" }).click();
  await page.getByLabel("Settings").click();
  await page.getByRole("checkbox", { name: "Simulate offline" }).check();
  await page.goto("/careers");
  await expect(page.getByRole("heading", { name: "Fresh career analysis is paused" })).toBeVisible();
  await expect(page.getByText("Demo offline", { exact: true })).toBeVisible();
  await page.goto("/onboarding");
  await page.getByRole("checkbox", { name: /I agree to save my answers/ }).check();
  await page.getByRole("checkbox", { name: "I have read this notice." }).check();
  await page.getByRole("button", { name: "Open profile questions" }).click();
  await expect(page.getByText("Live voice input pauses offline. Choose an option or type your answer.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Speak your answer" })).toBeDisabled();
  await expect(page.getByPlaceholder("Type your answer here")).toBeEnabled();
});

test("installed service worker opens cached pages without a network", async ({ page, context }) => {
  await page.goto("/");
  await page.waitForFunction(async () => {
    if (!("serviceWorker" in navigator)) return false;
    await navigator.serviceWorker.ready;
    return Boolean(navigator.serviceWorker.controller);
  }, null, { timeout: 30000 });
  const cached = await page.evaluate(async () => (await caches.open("hunarloop-shell-v2")).keys().then((keys) => keys.map((key) => new URL(key.url).pathname)));
  expect(cached).toContain("/passport");
  expect(cached).toContain("/icons/hunarloop-192.png");
  expect(cached.some((path) => path.startsWith("/_next/static/"))).toBe(true);
  await context.setOffline(true);
  await page.goto("/passport");
  await expect(page.getByRole("heading", { name: "Your Hunar Passport" }).first()).toBeVisible();
  await expect(page.getByText("Offline").first()).toBeVisible();
  await context.setOffline(false);
});
