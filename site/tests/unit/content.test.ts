import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { PROJECTS, projectBySlug } from "@/data/projects";
import { LAYERS, SERVICES, serviceBySlug } from "@/data/services";
import { SITE, NAV } from "@/data/site";

const DEMO = [
  "neuros",
  "agencium",
  "aiero",
  "constructum",
  "alan begham",
  "arthur dowson",
  "brandon adams",
  "dan smith",
  "tim bearton",
  "pacific hake",
  "1060 str. first avenue",
];

const text = JSON.stringify([
  PROJECTS,
  SERVICES,
  SITE,
  LAYERS,
  NAV,
]).toLowerCase();

// Scans the actual source text of every file in site/data/, not a
// hand-enumerated list of imports, so a module added later cannot escape
// the scan silently.
const dataDir = new URL("../../data/", import.meta.url);
const dataSourceText = readdirSync(dataDir)
  .map((name) => readFileSync(new URL(name, dataDir), "utf-8"))
  .join("\n")
  .toLowerCase();

describe("honesty rules", () => {
  it("carries no demo content from the old theme", () => {
    for (const s of DEMO) expect(dataSourceText).not.toContain(s);
  });

  it("never says agency, marketing firm, or Kuala Lumpur", () => {
    for (const s of ["marketing firm", "kuala lumpur"])
      expect(text).not.toContain(s);
    expect(text).not.toMatch(/\bagency\b/);
  });

  it("never uses the banned cliche", () => {
    expect(text).not.toMatch(/elevat(e|ing|ion)/);
  });

  it("positions as a Petaling Jaya digital architect", () => {
    expect(SITE.city).toBe("Petaling Jaya");
    expect(SITE.role).toBe("digital architect");
  });
});

describe("projects", () => {
  /* Seven priority projects added 2026-10-19, on Xin's list for /work. */
  it("has the approved clients and no others", () => {
    expect(PROJECTS.map((p) => p.client).sort()).toEqual([
      "65th MD 308 Lions Convention 2027",
      "Conceptine",
      "Dr Dylan Dental Clinic",
      "Fuji Bakery",
      "HLM Research Centre, Universiti Malaya",
      "JUE Cantonese Cuisine",
      "KIM Health & Beauty",
      "MIA — Malaysian Institute of Art",
      "MIECO",
      "Propel Global Berhad",
      "Sandmerit",
      "The Knights Atelier",
      "The Knights Award",
      "The Skin Suite",
      "Torii Teppanyaki",
    ]);
  });

  it("excludes every client the brief removed", () => {
    const names = PROJECTS.map((p) => p.client)
      .join(" ")
      .toLowerCase();
    for (const gone of ["vteg", "vitalz", "germ killer", "studio anise"]) {
      expect(names).not.toContain(gone);
    }
  });

  it("gives every project a unique slug that round-trips", () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of PROJECTS) expect(projectBySlug(p.slug)).toBe(p);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("points every declared capture at a file that exists", () => {
    for (const p of PROJECTS) {
      expect(p.image, `${p.client} has no capture`).not.toBeNull();
      expect(p.image).toBe(`/work/${p.slug}.webp`);
      const onDisk = new URL(`../../public${p.image}`, import.meta.url);
      expect(
        existsSync(onDisk),
        `${p.client} capture missing: ${p.image}`,
      ).toBe(true);
    }
  });

  /* The single `story` became the two statements the client's
     reference uses — what the business needed, and what was built
     about it — so the page can carry a Challenge/Solution block. */
  it("keeps both statements a pair: a solution without a challenge is a feature list", () => {
    for (const p of PROJECTS) {
      expect(
        p.challenge === null,
        `${p.client}: one statement without the other`,
      ).toBe(p.solution === null);
    }
  });

  /* THE STATEMENTS ARE OURS, written because the client declined to
     supply them, and that is exactly why they are governed rather
     than trusted. The old assertion here was that both were null —
     a tripwire for invented copy. Copy now exists by instruction, so
     the tripwire is replaced by the two rules it was protecting.

     RULE ONE: NOTHING ABOUT WHAT THE CLIENT HAD BEFORE. A capture of
     a site as it stands today cannot tell you there was no site
     before it, that the old one was slow, or that they could not sell
     online. Each of those is a false claim about a named, real
     company whenever it is wrong, published on their supplier's site.

     RULE TWO: NO METRICS. We hold no uplift figures for any of the
     eight, so a percentage or a conversion claim here could only have
     been made up. */
  const PRIOR_STATE =
    /\b(?:used to|previously|before (?:we|the|their)|had no|didn'?t have|did not have|no website|outdated|legacy site|old site)\b/i;
  const METRIC =
    /\d+\s*%|\b(?:roi|conversion rate|uplift|increased|boosted|doubled|tripled|grew by)\b/i;

  it("claims nothing about what a client had before we arrived", () => {
    for (const p of PROJECTS) {
      for (const [field, text] of [
        ["challenge", p.challenge],
        ["solution", p.solution],
      ] as const) {
        if (!text) continue;
        const hit = text.match(PRIOR_STATE);
        expect(
          hit?.[0],
          `${p.client} ${field} claims a prior state`,
        ).toBeUndefined();
      }
    }
  });

  it("quotes no figure we do not have", () => {
    for (const p of PROJECTS) {
      for (const [field, text] of [
        ["challenge", p.challenge],
        ["solution", p.solution],
      ] as const) {
        if (!text) continue;
        const hit = text.match(METRIC);
        expect(
          hit?.[0],
          `${p.client} ${field} quotes a metric`,
        ).toBeUndefined();
      }
    }
  });

  /* And they are real sentences, not stubs: the challenge is the line
     set large at the head of the page, so an empty-ish one is visible
     from across the room. */
  /* A FLOOR AND A CEILING, and the ceiling is the one that matters.
     The challenge is set as display type at the head of the page, and
     the first draft ran to three sentences there — five heavy lines
     shouting at a quiet paragraph beside them, which is what made the
     pair look mismatched. Display type carries ONE thought; anything
     longer belongs in the solution, where body copy can hold it. */
  it("writes both statements, at a length each can carry", () => {
    for (const p of PROJECTS) {
      expect(p.challenge, `${p.client} challenge`).not.toBeNull();
      expect(p.solution, `${p.client} solution`).not.toBeNull();
      expect(
        p.challenge!.length,
        `${p.client} challenge too short`,
      ).toBeGreaterThan(55);
      expect(
        p.challenge!.length,
        `${p.client} challenge is ${p.challenge!.length} chars — too long for display type`,
      ).toBeLessThan(135);
      expect(
        p.solution!.length,
        `${p.client} solution too short`,
      ).toBeGreaterThan(110);
    }
  });

  it("gives every capture a non-generic alt text naming the client", () => {
    for (const p of PROJECTS) {
      if (p.image === null) continue;
      expect(p.alt.length).toBeGreaterThan(20);
      expect(p.alt).toContain(p.client.split(" —")[0]);
    }
  });

  it("states at least two observed facts per project, so no page is empty", () => {
    for (const p of PROJECTS) {
      expect(p.observed.length).toBeGreaterThanOrEqual(2);
      for (const fact of p.observed) {
        expect(fact.trim()).toBe(fact);
        expect(fact.trim().length).toBeGreaterThanOrEqual(20);
      }
    }
  });

  it("uses https for every live URL, or null", () => {
    for (const p of PROJECTS) {
      if (p.url === null) continue;
      expect(p.url).toMatch(/^https:\/\//);
    }
  });
});

describe("services", () => {
  it("has the deck's six solutions", () => {
    expect(SERVICES).toHaveLength(6);
    expect(SERVICES.map((s) => s.deckName).sort()).toEqual([
      "AI & Automation",
      "Business Intelligence",
      "Business Systems",
      "Customer Growth",
      "Digital Presence",
      "Digital Transformation",
    ]);
  });

  it("puts the searched term in every slug, for SEO", () => {
    for (const s of SERVICES) {
      expect(s.slug).toMatch(/-malaysia$/);
      expect(serviceBySlug(s.slug)).toBe(s);
    }
  });

  it("maps every service onto a real ecosystem layer", () => {
    const keys = LAYERS.map((l) => l.key);
    for (const s of SERVICES) expect(keys).toContain(s.layer);
  });

  it("covers all four layers — an unused layer means the diagram lies", () => {
    expect(new Set(SERVICES.map((s) => s.layer)).size).toBe(4);
  });
});

describe("clientele", () => {
  it("carries the client's own list, each with a logo on disk", async () => {
    const { CLIENTS } = await import("@/data/clients");
    const { existsSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    /* The deck's nine were replaced by the list the client gave
       directly. The count is theirs to set, so this asserts the shape
       rather than a number — but a list this long is the whole reason
       the row moves, so it should never quietly shrink to a handful. */
    expect(CLIENTS.length).toBeGreaterThan(15);
    for (const c of CLIENTS) {
      const file = join(process.cwd(), "public", c.src);
      expect(existsSync(file), c.src).toBe(true);
      expect(statSync(file).size, c.src).toBeGreaterThan(512);
      expect(c.name.trim().length, c.src).toBeGreaterThan(1);
      /* Provenance: every mark came off that company's own site. */
      expect(c.site, c.src).toMatch(/^https:\/\//);
    }
  });

  it("does not repeat a logo between clientele and tech partners", async () => {
    const { CLIENTS } = await import("@/data/clients");
    const { PARTNERS } = await import("@/data/partners");
    const both = CLIENTS.map((c) => c.src).filter((s) =>
      PARTNERS.some((p) => p.src === s),
    );
    expect(both).toEqual([]);
  });
});
