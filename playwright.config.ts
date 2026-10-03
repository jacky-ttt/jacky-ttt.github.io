import { defineConfig } from "@playwright/test"

const PORT = 4322

export default defineConfig({
  testDir: "tests",
  // Baselines are committed. Font rendering differs per OS, so the platform is in the path;
  // regenerate with `npm run test:visual:update` on a new machine.
  snapshotPathTemplate:
    "tests/__screenshots__/{platform}/{projectName}/{testFileName}/{arg}{ext}",
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  expect: {
    // Strict: zero differing pixels. Rendering is deterministic with the pinned Chromium, and
    // a loose ratio let a real bug (dimmed card text vanishing) slip through.
    toHaveScreenshot: { caret: "hide" },
  },
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: "desktop",
      use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `npm run build && npx astro preview --port ${PORT} --ignore-lock`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
