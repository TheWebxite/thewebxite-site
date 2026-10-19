import { expect, test } from "@playwright/test";
import { SERVICE_SLUGS } from "@/data/services";
import { PROJECT_SLUGS } from "@/data/projects";

const ALL_ROUTES = [
  "/", "/services", "/work/web-design", "/about", "/news", "/contact",
  ...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
  ...PROJECT_SLUGS.map((slug) => `/work/${slug}`),
];

test("sitemap lists every static route", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml, "sitemap missing homepage").toContain("<loc>https://thewebxite.com</loc>");
  for (const path of [
    "/services", "/work/web-design", "/about", "/contact",
    "/work/sandmerit", "/services/ai-automation-malaysia",
  ]) {
    expect(xml, `sitemap missing ${path}`).toContain(`thewebxite.com${path}`);
  }
});

/* ROBOTS NOW DEPENDS ON THE DEPLOYMENT. Only VERCEL_ENV=production
   invites crawlers; everything else — previews, and this suite —
   refuses them, because a public *.vercel.app copy of a client's site
   competes with the client's own domain for its own name. This build
   is not production, so the refusal is what must be served here. The
   allow branch is unit-tested, where the environment can be set. */
test("robots refuses crawlers off production, and still names the sitemap", async ({
  request,
}) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Sitemap:");
  expect(txt, "a non-production deployment must not be crawlable").toMatch(
    /Disallow:\s*\/\s*$/m,
  );
});

test("every page has a unique title", async ({ page }) => {
  const seen = new Set<string>();
  for (const path of ALL_ROUTES) {
    await page.goto(path);
    const t = await page.title();
    expect(t.length).toBeGreaterThan(10);
    expect(seen.has(t), `duplicate title on ${path}: ${t}`).toBe(false);
    seen.add(t);
  }
});
