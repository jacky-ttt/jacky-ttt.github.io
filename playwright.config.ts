import { defineConfig } from "@playwright/test"

const PORT = 4322

const desktop = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
const mobile = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
}

export default defineConfig<{ textScale: number }>({
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
    { name: "desktop", use: desktop },
    { name: "mobile", use: mobile },
    // The same tests at the browser's 200% font-size setting (WCAG 1.4.4); see textScale in
    // tests/site.spec.ts.
    { name: "desktop-200", use: { ...desktop, textScale: 2 } },
    { name: "mobile-200", use: { ...mobile, textScale: 2 } },
  ],
  webServer: {
    command: `npm run build && npx astro preview --port ${PORT} --ignore-lock`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
