const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  testMatch: "**/*.browser.cjs",
  workers: 1,
  timeout: 30000,
  use: { baseURL: "http://localhost:3100", channel: "msedge", headless: true, viewport: { width: 360, height: 740 }, screenshot: "only-on-failure" },
  webServer: { command: "npm run start -- --port 3100", url: "http://localhost:3100/games", reuseExistingServer: false, timeout: 30000 },
});
