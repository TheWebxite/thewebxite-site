import { expect, test } from "@playwright/test";

test("news index responds 200 with exactly one h1", async ({ page }) => {
  const res = await page.goto("/news");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  /* News and Events were one page while both were empty. The events
     have arrived; the writing has not. */
  await expect(page.locator("h1")).toHaveText("News");
});

test("news index renders its honest empty state", async ({ page }) => {
  await page.goto("/news");
  await expect(page.locator("main")).toContainText("Nothing published here yet");
});

test("an unknown news slug 404s rather than rendering empty", async ({ page }) => {
  const res = await page.goto("/news/anything-at-all");
  expect(res?.status()).toBe(404);
});
