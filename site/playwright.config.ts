import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  /* reducedMotion IS DELIBERATE AND LOAD-BEARING. Headless Chromium
     reports prefers-reduced-motion: reduce unless told otherwise, and
     SmoothScroll checks that media query BEFORE constructing Lenis. So
     the default left every spec running against a page with no smooth
     scrolling at all — the scroll path that virtually every real
     visitor gets was untested, and a scroll bug reported from the
     browser could not reproduce here however hard it was driven.
     The specs that genuinely test the reduced-motion branch set it
     themselves, per test; they are unaffected. */
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    reducedMotion: "no-preference",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
