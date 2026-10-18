const { test, expect } = require("@playwright/test");

test("teacher view respects sharing, verifies a skill, and saves local actions", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Skip to demo student" }).click();
  await page.getByRole("link", { name: "Teacher", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Class support desk" })).toBeVisible();
  await expect(page.getByText("Support cards are private and never shared with employers.")).toBeVisible();
  await expect(page.getByText("8 students")).toBeVisible();
  await page.getByRole("button", { name: "View details" }).first().click();
  const drawer = page.getByRole("dialog", { name: "Student support details: Asha" });
  await expect(drawer.getByText(/has not enabled teacher sharing/)).toBeVisible();
  await expect(drawer.getByRole("button", { name: "Verify" })).toHaveCount(0);
  await drawer.getByRole("button", { name: "Close student details" }).click();
  await page.getByRole("link", { name: "Student", exact: true }).click();
  await page.getByRole("switch", { name: "Share with teacher" }).check();
  await page.getByRole("link", { name: "Teacher", exact: true }).click();
  await page.getByRole("button", { name: "View details" }).first().click();
  await expect(drawer.getByRole("heading", { name: "Private learning-support cards" })).toBeVisible();
  await drawer.getByRole("button", { name: "Verify" }).click();
  await expect(drawer.getByText("Teacher-verified")).toBeVisible();
  await drawer.getByRole("button", { name: "Recommend activity" }).click();
  await drawer.getByRole("button", { name: "Refer to opportunity" }).click();
  await expect(drawer.getByText("Saved on this device only; nothing was sent.").first()).toBeVisible();
  await drawer.getByRole("button", { name: "Close student details" }).click();
  await page.getByRole("textbox", { name: "Module title" }).fill("Repair safely");
  await page.getByRole("button", { name: "Paid" }).click();
  await page.getByRole("spinbutton", { name: "Price in rupees" }).fill("120");
  await page.getByRole("button", { name: "Create module" }).click();
  await expect(page.getByText("Repair safely")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Repair safely")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("teacher-mobile.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("desktop class filters distinguish task load from low starts", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/teacher");
  await expect(page.getByText("8 students")).toBeVisible();
  await page.getByRole("combobox", { name: "Activity pattern" }).selectOption("overwhelm");
  await expect(page.getByText("2 students")).toBeVisible();
  await expect(page.getByText(/Starts stayed fairly high while finished tasks fell/)).toBeVisible();
  await page.getByRole("combobox", { name: "Activity pattern" }).selectOption("disengagement");
  await expect(page.getByText("2 students")).toBeVisible();
  await expect(page.getByText(/Few activities were started/)).toBeVisible();
  await page.getByRole("searchbox", { name: "Search students" }).fill("Bagru");
  await expect(page.getByText("1 students")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("teacher-desktop.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("teacher controls and role switch work in Hindi at mobile width", async ({ page }) => {
  await page.goto("/teacher");
  await page.getByRole("button", { name: "हिन्दी में बदलें" }).click();
  await expect(page.getByRole("heading", { name: "कक्षा सहायता डेस्क" })).toBeVisible();
  await expect(page.getByRole("link", { name: "शिक्षक", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("कक्षा 10").first()).toBeVisible();
  await page.getByRole("combobox", { name: "गतिविधि का तरीका" }).selectOption("overwhelm");
  await expect(page.getByText("काम के बोझ की संभावना", { exact: true }).last()).toBeVisible();
  await page.getByRole("link", { name: "अभिभावक", exact: true }).click();
  await expect(page).toHaveURL(/\/parent$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
