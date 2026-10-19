import { expect, test } from "@playwright/test";
import { EVENTS } from "@/data/events";

test("events index responds 200 with one h1 and a section per event", async ({ page }) => {
  const res = await page.goto("/events");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText("Events");
  await expect(page.locator("main section")).toHaveCount(EVENTS.length);
});

test("every photograph loads, at its own aspect ratio, with a real alt", async ({ page }) => {
  await page.goto("/events", { waitUntil: "networkidle" });
  /* They are lazy below the fold, so walk the page before judging. */
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(1200);

  const r = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("main img")] as HTMLImageElement[];
    return {
      count: imgs.length,
      broken: imgs.filter((i) => !i.complete || i.naturalWidth === 0).length,
      unlabelled: imgs.filter((i) => !i.alt.trim()).length,
      /* Rendered box vs the file's own ratio. A tile grid would crop
         these — the set mixes landscape, portrait and phone verticals. */
      squashed: imgs.filter((i) => {
        const file = i.naturalWidth / i.naturalHeight;
        const box = i.clientWidth / i.clientHeight;
        return Math.abs(file - box) > 0.02;
      }).length,
    };
  });

  const total = EVENTS.reduce((n, e) => n + e.photos.length, 0);
  expect(r.count).toBe(total);
  expect(r.broken).toBe(0);
  expect(r.unlabelled).toBe(0);
  expect(r.squashed).toBe(0);
});

test("each event states a date the photographs can support", async ({ page }) => {
  await page.goto("/events");
  for (const e of EVENTS) {
    const section = page.locator(`#${e.slug}`);
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(e.name);
    await expect(section.locator("time")).toHaveAttribute("datetime", e.date);
  }
});

test("the navigation offers Events and still hides News", async ({ page }) => {
  await page.goto("/");
  /* Whichever navigation this viewport actually has: the inline links
     appear from sm up, and below that everything lives in the menu. A
     first cut only knew about the inline nav and found nothing on a
     phone. */
  const inline = page.locator('nav[aria-label="Primary"]');
  const scope = (await inline.isVisible().catch(() => false))
    ? inline
    : (await page.getByRole("button", { name: "Open menu" }).click(), page.getByRole("dialog"));

  await expect(scope.getByRole("link", { name: "Events", exact: true })).toHaveCount(1);
  /* News stays hidden until there are three posts — one reads as
     abandoned. Events has its own, simpler gate: any at all. */
  await expect(scope.getByRole("link", { name: "News", exact: true })).toHaveCount(0);
});
