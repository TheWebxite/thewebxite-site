import { describe, expect, it } from "vitest";
import { NEWS, NEWS_SLUGS, newsBySlug } from "@/data/news";

/**
 * NEWS is empty today, but these invariants must hold once entries are
 * added by hand — this is the contract the rest of the module relies on.
 */
describe("news data invariants", () => {
  it("keeps NEWS_SLUGS in sync with NEWS", () => {
    expect(NEWS_SLUGS).toEqual(NEWS.map((n) => n.slug));
  });

  it("gives every entry a unique slug", () => {
    expect(new Set(NEWS_SLUGS).size).toBe(NEWS_SLUGS.length);
  });

  it("returns undefined from newsBySlug for an unknown slug", () => {
    expect(newsBySlug("not-a-real-entry")).toBeUndefined();
  });
});
