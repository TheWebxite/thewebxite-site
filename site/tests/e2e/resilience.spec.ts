import { expect, test } from "@playwright/test";

/** Review Focus 5 — full-bleed captures and grid children forcing page scroll. */
for (const width of [390, 768, 1024, 1280, 1440]) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${width}px overflows by ${overflow}px`).toBeLessThanOrEqual(0);
  });
}

/** Review Focus 3 — the pinned grid is tightest at its own breakpoint. */
test("pinned detail column is never crushed between 1024 and 1280", async ({ page }) => {
  for (const width of [1024, 1100, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    const box = await page.locator("[data-solution]").first().boundingBox();
    expect(box, `no solution rendered at ${width}`).not.toBeNull();
    expect(box!.width, `detail column crushed to ${box!.width}px at ${width}px`).toBeGreaterThan(320);
  }
});

/** Review Focus 2 — the pin must never be CREATED, not merely reverted. */
test("creates no pin under prefers-reduced-motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "networkidle" });

  const pinned = page.locator("[data-ecosystem-pin]");
  await expect(pinned).toHaveCount(1);
  await pinned.scrollIntoViewIfNeeded();
  const before = (await pinned.boundingBox())!.y;
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(600);
  const after = (await pinned.boundingBox())!.y;
  expect(
    Math.abs(after - before),
    "the column held its position — a pin was created under reduced motion",
  ).toBeGreaterThan(200);

  await expect(page.locator("#range article[data-capture]")).toHaveCount(5);
  await ctx.close();
});

/** The centrepiece: the pin must actually pin, and the active layer must
 *  change as solutions pass centre — instantly, never faded. */
test("the ecosystem pins and switches layer as the solutions scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const pinned = page.locator("[data-ecosystem-pin]");
  await expect(pinned).toHaveCount(1);

  const first = page.locator("[data-solution]").first();
  await first.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const before = await page.locator("[data-layer-active]").getAttribute("data-layer-active");

  await page.locator("[data-solution]").last().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const after = await page.locator("[data-layer-active]").getAttribute("data-layer-active");

  expect(after, "active layer never changed — the pinned diagram is inert").not.toBe(before);

  // Instant, not faded: no transition on the highlight.
  const transition = await page
    .locator("[data-layer-active] [data-layer]")
    .first()
    .evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(["0s", ""], "a transitioning highlight reads as lag").toContain(transition);
});

/** Review Focus 1 — the page must read as ordered text with no JS at all. */
test("renders readable, ordered content with JavaScript disabled", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto("/");

  /* The hero's h1 is the wordmark now, and its object is WebGL that cannot
     run here — so the supporting line is what has to survive with JS off. */
  await expect(page.locator("h1")).toContainText("TheWebxite");
  await expect(page.locator("section").first()).toContainText("not four purchases");
  await expect(page.locator("#the-gap")).toContainText("Digital Adoption Gap");
  await expect(page.locator("#range article[data-capture]")).toHaveCount(5);
  await expect(page.locator("#engagement")).toContainText("Free Demo");

  /* Reveal must not leave content invisible when its observer never runs.
     Point this at an element that actually uses Reveal: the proof section is
     a CSS sticky stack now and never wore the class, so asserting on it
     would pass whatever Reveal did. The gap's list items do use it. */
  const revealed = page.locator("#the-gap li.reveal").first();
  await expect(revealed).toHaveCount(1);
  const opacity = await revealed.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity), "Reveal left content invisible with JS off").toBeGreaterThan(0.99);

  await ctx.close();
});
