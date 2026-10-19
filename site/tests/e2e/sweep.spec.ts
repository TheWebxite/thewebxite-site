import { expect, test } from "@playwright/test";
import { SERVICE_SLUGS } from "@/data/services";
import { PROJECT_SLUGS } from "@/data/projects";

const ROUTES = [
  "/", "/services", "/work/web-design", "/about", "/news", "/events", "/contact",
  ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  ...PROJECT_SLUGS.map((slug) => `/work/${slug}`),
];

const BANNED = [
  "neuros", "agencium", "aiero", "constructum", "alan begham", "arthur dowson",
  "brandon adams", "dan smith", "tim bearton", "pacific hake",
  "1060 str. first avenue", "marketing firm", "kuala lumpur",
  "lorem ipsum", "placeholder", "coming soon", "tbd",
];

for (const route of ROUTES) {
  test(`${route} is clean, accessible and does not overflow`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const body = (await page.locator("body").innerText()).toLowerCase();
    const metadata = (
      await page.evaluate(() => {
        const title = document.title ?? "";
        const metaContents = Array.from(
          document.querySelectorAll(
            'meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]',
          ),
        ).map((m) => m.getAttribute("content") ?? "");
        return [title, ...metaContents].join(" ");
      })
    ).toLowerCase();
    for (const b of BANNED) {
      expect(body, `${route} body contains "${b}"`).not.toContain(b);
      expect(metadata, `${route} metadata (title/meta tags) contains "${b}"`).not.toContain(b);
    }
    expect(body, `${route} body matches elevat(e|ing|ion)`).not.toMatch(/elevat(e|ing|ion)/);
    expect(metadata, `${route} metadata (title/meta tags) matches elevat(e|ing|ion)`).not.toMatch(/elevat(e|ing|ion)/);

    await expect(page.locator("h1")).toHaveCount(1);

    const unlabelled = await page.locator("img:not([alt])").count();
    expect(unlabelled, `${route} has an image with no alt`).toBe(0);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `${route} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
  });
}

test("no route loads an external request", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const h = new URL(r.url()).hostname;
    if (!["127.0.0.1", "localhost"].includes(h)) external.push(r.url());
  });
  for (const route of ROUTES) await page.goto(route, { waitUntil: "networkidle" });
  expect(external).toEqual([]);
});

test("no route leaks a PLACEHOLDER marker into rendered HTML", async ({ request }) => {
  for (const route of ROUTES) {
    const html = await (await request.get(route)).text();
    expect(html, `${route} leaked a PLACEHOLDER marker into the HTML`).not.toContain("PLACEHOLDER");
  }
});
