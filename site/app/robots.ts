import type { MetadataRoute } from "next";

/**
 * ONLY THE REAL DEPLOYMENT INVITES CRAWLERS.
 *
 * This allowed everything on every host, which is fine on
 * thewebxite.com and a problem anywhere else: a Vercel preview is a
 * public URL, and an indexed `*.vercel.app` copy of a client's site
 * competes with the client's own domain for its own name. The sitemap
 * below names the apex regardless of where it is served from, so a
 * crawled preview also advertises URLs it is not.
 *
 * VERCEL_ENV is "production" only for the production deployment, and
 * is undefined locally — which is why the check is written to allow
 * rather than to block: an unknown environment gets the safe answer.
 *
 * NOTE: a production deployment is still on *.vercel.app until the
 * custom domain is attached, and this will let that be indexed.
 * Attach the domain in the same sitting.
 */
export default function robots(): MetadataRoute.Robots {
  const live = process.env.VERCEL_ENV === "production";
  return {
    rules: live
      ? [{ userAgent: "*", allow: "/" }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: "https://thewebxite.com/sitemap.xml",
  };
}
