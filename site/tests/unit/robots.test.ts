import { describe, expect, it, vi, afterEach } from "vitest";

/* The e2e suite can only ever see a non-production build, so it can
   assert the refusal and not the permission. This covers the other
   branch — and it is the branch that matters, because a robots file
   that blocks the real site is a far worse failure than one that lets
   a preview be crawled. */
describe("robots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const load = async () => {
    vi.resetModules();
    return (await import("@/app/robots")).default();
  };

  it("invites crawlers only on the production deployment", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const r = await load();
    expect(r.rules).toEqual([{ userAgent: "*", allow: "/" }]);
  });

  for (const env of ["preview", "development", ""]) {
    it(`refuses crawlers when VERCEL_ENV is ${env || "unset"}`, async () => {
      vi.stubEnv("VERCEL_ENV", env);
      const r = await load();
      expect(r.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    });
  }

  it("always names the sitemap, crawlable or not", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect((await load()).sitemap).toBe("https://thewebxite.com/sitemap.xml");
  });
});
