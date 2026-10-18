const { test, expect } = require("@playwright/test");

test("filters update cards and pins together, with a clear empty state", async ({ page }, testInfo) => {
  await page.clock.install({ time: new Date("2026-10-18T12:00:00+05:30") });
  await page.goto("/opportunities");
  await expect(page.getByTestId("opportunity-card")).toHaveCount(13);
  await expect(page.getByTestId("village-map").getByRole("button")).toHaveCount(9);
  await page.getByTestId("village-map").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("village-map.png") });
  await page.getByRole("combobox", { name: "Opportunity type", exact: true }).selectOption("iti");
  await expect(page.getByTestId("opportunity-card")).toHaveCount(1);
  await expect(page.getByTestId("village-map").getByRole("button")).toHaveCount(1);
  await page.getByRole("checkbox", { name: "Women and girls only" }).check();
  await expect(page.getByText("No opportunities match these filters. Try a wider distance or reset the filters.")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("checkbox", { name: "Deadline within 7 days" }).check();
  await expect(page.getByTestId("opportunity-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Reset filters" }).click();
  const slider = page.getByRole("slider");
  await slider.focus();
  await page.keyboard.press("Home");
  await expect(page.getByTestId("opportunity-card")).toHaveCount(4);
  await expect(page.getByTestId("village-map").getByRole("button")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("combobox", { name: "Learning accommodations / rights information", exact: true }).selectOption("accommodations");
  await expect(page.getByTestId("opportunity-card")).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("map pin opens a focus-trapped drawer with checks, citations and a mock SMS toast", async ({ page }, testInfo) => {
  await page.goto("/opportunities");
  const pin = page.getByRole("button", { name: /^Map pin 3:/ });
  await pin.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Asha is 16 in the demo profile, above this illustrative minimum.")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "https://hte.rajasthan.gov.in/" })).toHaveAttribute("href", "https://hte.rajasthan.gov.in/");
  await dialog.getByRole("checkbox").first().check();
  await dialog.getByRole("button", { name: "Save & download", exact: true }).click();
  await dialog.getByRole("button", { name: "Remind me by SMS" }).click();
  await expect(dialog.getByRole("status")).toContainText("No SMS was sent or scheduled");
  await dialog.getByRole("button", { name: "Close application assistant" }).focus();
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement))).toBe(true);
  await dialog.getByRole("heading", { name: "Eligibility checklist", exact: true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("application-drawer.png") });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(pin).toBeFocused();
  await page.reload();
  await pin.click();
  await expect(page.getByRole("dialog").getByRole("checkbox").first()).toBeChecked();
  await expect(page.getByRole("dialog").getByText(/Downloaded, last updated/)).toBeVisible();
});

test("offline shows downloaded details and blocks unsaved listings and external links", async ({ page }) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: /^Map pin 3:/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Save & download", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.getByLabel("Settings", { exact: true }).click();
  await page.getByRole("checkbox", { name: "Simulate offline", exact: true }).check();
  await page.getByLabel("Settings", { exact: true }).click();
  await expect(page.getByRole("button", { name: /^Map pin 5:/ })).toBeDisabled();
  await page.getByRole("button", { name: /^Map pin 3:/ }).click();
  await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(0);
  await expect(page.getByRole("dialog").getByText(/Downloaded, last updated/)).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.getByRole("button", { name: /^Map pin 5:/ })).toBeDisabled();
  await page.getByRole("checkbox", { name: "Saved only", exact: true }).check();
  await expect(page.getByTestId("opportunity-card")).toHaveCount(1);
  await page.getByRole("button", { name: /^Map pin 3:/ }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Remove saved download" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByTestId("opportunity-card")).toHaveCount(0);
});

test("Hindi drawer fits narrow screens and does not infer the applicant's gender", async ({ page }, testInfo) => {
  await page.goto("/opportunities");
  await page.getByRole("button", { name: "हिन्दी में बदलें" }).click();
  await page.getByRole("checkbox", { name: "केवल महिलाएं और लड़कियां" }).check();
  await expect(page.getByTestId("opportunity-card")).toHaveCount(1);
  await page.getByRole("button", { name: /^नक्शे का निशान 9:/ }).click();
  await expect(page.getByRole("dialog").getByText("डेमो प्रोफ़ाइल में लिंग नहीं दिया गया है। नाम से अनुमान न लगाएं; आवेदक से पुष्टि करें।")).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("application-hindi.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector("dialog").scrollWidth <= document.querySelector("dialog").clientWidth)).toBe(true);
});
