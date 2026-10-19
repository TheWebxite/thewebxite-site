# TheWebxite Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild thewebxite.com as a five-section site whose home page argues one claim — "the tools exist, they're just not connected into one system" — and whose proof is eight real client sites that look nothing like each other.

**Architecture:** Extend the existing Next.js 16 App Router project at `site/`. A typed content layer in `site/data/` is the single source of truth for projects, services and news; every page reads from it, and a Vitest suite enforces the spec's honesty rules against that data so a fabricated client or a missing capture fails the build rather than shipping. Presentation is Tailwind 4 utilities bound to frozen tokens via `@theme inline`. Scroll behaviour is GSAP ScrollTrigger with exactly one pin, guarded by `matchMedia` before creation.

**Tech Stack:** Next.js 16, React 19, TypeScript (strict), Tailwind 4, GSAP 3 + ScrollTrigger + SplitText, Lenis, `@fontsource/open-sauce-one`, Vitest, Playwright, sharp (build-time image conversion).

**Spec:** `docs/superpowers/specs/2026-10-02-thewebxite-revamp-design.md`

## Global Constraints

Copied verbatim from the spec. Every task's requirements implicitly include this section.

- **No component or block library.** Not shadcn/ui, Tailark, Efferd, KokonutUI, React Bits or spartan. Techniques may be reimplemented against these tokens; components may not be installed.
- **No stock photograph may illustrate a client project.** If there is no capture, there is no image.
- **No invented metric, testimonial, team member, award or client.**
- **Nothing from the old theme's demo content survives.** Banned strings include `neuros`, `Agencium`, `Aiero`, `Constructum`, `Alan Begham`, `Arthur Dowson`, `Brandon Adams`, `Dan Smith`, `Tim Bearton`, `Pacific hake`, `1060 Str. First Avenue`.
- **Copy written rather than quoted from a client source is marked** `{/* PLACEHOLDER */}` in the markup until approved.
- **No team page, testimonials, pricing page or careers page**, in any form.
- **Positioning:** Petaling Jaya, "digital architect" — never "agency", never "marketing firm", never "Kuala Lumpur".
- **Banned word:** "Elevate" and its inflections, anywhere in copy.
- **Colour is frozen.** Canvas `#0325A8`, Surface `#F3F2F0`, Text `#FFFFFF`, Text-muted `#BCC7F5`, Ink `#071238`, Ink-muted `#4A5578`, Accent `#8CDBFF`. `#0074DD` is illustration-only and may never carry text or a border on the canvas.
- **Typography:** Open Sauce One only, self-hosted, three weights — 400, 500, 700. No Google Fonts, no CDN font request.
- **Motion:** exactly one pin per page. Active-layer changes instant, never faded. All scroll behaviour disabled below 1024px and under `prefers-reduced-motion`, checked *before* the trigger is created.
- **With JavaScript off, every section must still read as plain, ordered text.**

## Review Focus

Five failure modes the spec implies that no task's happy-path tests would otherwise exercise. Each line's test is assigned to the task that owns the code.

1. **JavaScript disabled** — the pinned ecosystem and every reveal must still render readable, correctly ordered content, not blank or `opacity:0` boxes. *(test in Task 8)*
2. **`prefers-reduced-motion: reduce`** — no ScrollTrigger pin may be created at all; the spec requires the check before creation, so a torn-down pin is still a failure. *(test in Task 8)*
3. **Viewport 1024–1280px** — the pinned two-column grid is widest-constrained exactly at its breakpoint; a fixed-width child in an `fr` track crushes the detail column. *(test in Task 8)*
4. **A project with a missing capture or no live URL** — the data layer must render no `<img>` and no `<a>` rather than a broken image or an `href="undefined"`. *(test in Task 9)*
5. **390px viewport with full-bleed captures** — grid and flex children default to `min-width:auto`, so a wide capture or a `tabular-nums` row silently forces horizontal page scroll. *(test in Task 8, repeated per-route in Task 14)*

---

### Task 1: Test harness

Nothing in `site/` is currently tested and `package.json` has no test script. Everything downstream depends on this.

**Files:**
- Modify: `site/package.json`
- Create: `site/vitest.config.ts`
- Create: `site/playwright.config.ts`
- Create: `site/tests/unit/harness.test.ts`
- Create: `site/tests/e2e/harness.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run test:unit` (Vitest), `npm run test:e2e` (Playwright against a built app on port 3100), `npm test` (both). Unit tests live in `site/tests/unit/*.test.ts`; e2e in `site/tests/e2e/*.spec.ts`.

- [ ] **Step 1: Install dev dependencies**

```bash
cd site
npm i -D vitest @vitest/coverage-v8 @playwright/test sharp
npx playwright install chromium
```

- [ ] **Step 2: Write `site/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Write `site/playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3100", trace: "retain-on-failure" },
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
```

- [ ] **Step 4: Add scripts to `site/package.json`**

Add to the `"scripts"` object:

```json
"test:unit": "vitest run",
"test:e2e": "playwright test",
"test": "npm run test:unit && npm run test:e2e"
```

- [ ] **Step 5: Write the failing harness tests**

`site/tests/unit/harness.test.ts`:

```ts
import { describe, expect, it } from "vitest";

describe("unit harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

`site/tests/e2e/harness.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("home page responds", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
});
```

- [ ] **Step 6: Run both to verify they pass**

Run: `cd site && npm test`
Expected: Vitest 1 passed; Playwright 2 passed (desktop + mobile).

- [ ] **Step 7: Commit**

```bash
git add site/package.json site/package-lock.json site/vitest.config.ts site/playwright.config.ts site/tests
git commit -m "test: add vitest and playwright harness"
```

---

### Task 2: Token amendments and the grain surface

The spec's §6.4 permits exactly two token additions and no others.

**Files:**
- Modify: `site/app/tokens.css`
- Modify: `site/app/globals.css`
- Create: `site/tests/unit/tokens.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS classes `.ground-grain` (grained canvas) and `.ground-flat` (flat surface), plus tokens `--grain-opacity` and `--grain-tile`. The noise is a self-contained data URI in `globals.css` — no component, no SVG in the document.

- [ ] **Step 1: Write the failing token test**

`site/tests/unit/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../../app/tokens.css", import.meta.url), "utf8");

/** sRGB relative luminance per WCAG 2.1 */
function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe("frozen tokens", () => {
  it("keeps every frozen colour at its spec value", () => {
    for (const [name, value] of [
      ["--color-canvas", "#0325A8"],
      ["--color-surface", "#F3F2F0"],
      ["--color-text", "#FFFFFF"],
      ["--color-text-muted", "#BCC7F5"],
      ["--color-ink", "#071238"],
      ["--color-ink-muted", "#4A5578"],
      ["--color-accent", "#8CDBFF"],
    ] as const) {
      expect(css).toMatch(new RegExp(`${name}:\\s*${value}`, "i"));
    }
  });

  it("holds every text pair above 4.5:1", () => {
    expect(ratio("#FFFFFF", "#0325A8")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#BCC7F5", "#0325A8")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#071238", "#F3F2F0")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#4A5578", "#F3F2F0")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#8CDBFF", "#0325A8")).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps #0074DD illustration-only — it fails against the canvas", () => {
    expect(ratio("#0074DD", "#0325A8")).toBeLessThan(4.5);
  });

  it("adds exactly the two permitted tokens", () => {
    expect(css).toMatch(/--grain-opacity:/);
    expect(css).toMatch(/--grain-tile:/);
    expect(css).toMatch(/--step-4:\s*clamp\(/);
  });

  it("adds no new typeface, radius or shadow", () => {
    expect(css.match(/--font-[a-z]+:/g) ?? []).toHaveLength(2);
    expect(css.match(/--radius-[a-z]+:/g) ?? []).toHaveLength(2);
    expect(css).not.toMatch(/--shadow/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd site && npx vitest run tests/unit/tokens.test.ts`
Expected: FAIL — "adds exactly the two permitted tokens" (no `--grain-opacity`, `--step-4` is a fixed `7rem`).

- [ ] **Step 3: Amend `site/app/tokens.css`**

Replace the `--step-4` line and append the grain tokens inside `:root`:

```css
  /* Display climbs on wide viewports: the hero carries the whole argument on
     one line and 112px does not hold a 1920px screen. Floor is the frozen
     7rem, so nothing below 1280px changes. */
  --step-4: clamp(7rem, 5.2vw + 2.8rem, 8.75rem);

  /* --- Grain -------------------------------------------------------------
     Deck p4 reads as a printed matte surface because of NOISE, not the
     gradient. Flat canvas + a tiled turbulence overlay gets the same quality
     without the gradient ground the direction bans.                        */
  --grain-opacity: 0.22;
  --grain-tile: 180px;
```

- [ ] **Step 4: Add the ground classes to `site/app/globals.css`**

Append:

```css
/* ---------------------------------------------------------------------------
   Grounds. Grain carries the argument sections; flat carries the work, where
   a textured ground would fight a screenshot.
--------------------------------------------------------------------------- */
.ground-grain {
  position: relative;
  background: var(--color-canvas);
  color: var(--color-text);
  isolation: isolate;
}

/* The tile is an inline data URI, not a fragment URL: `background-image:
   url("#id")` is not paintable in any engine. `stitchTiles="stitch"` is what
   keeps the 180px tile seamless when it repeats. */
.ground-grain::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: var(--grain-opacity);
  background-size: var(--grain-tile) var(--grain-tile);
  background-image: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
}

.ground-flat {
  background: var(--color-surface);
  color: var(--color-ink);
}

@media (prefers-contrast: more) {
  .ground-grain::after { opacity: 0; }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd site && npx vitest run tests/unit/tokens.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add site/app/tokens.css site/app/globals.css site/tests/unit/tokens.test.ts
git commit -m "feat: grain surface and display-step amendment"
```

---

### Task 3: Content layer and the honesty rules

This is where the spec's §3.3 becomes executable. A fabricated client or a missing capture must fail `npm test`.

**Files:**
- Create: `site/data/projects.ts`
- Create: `site/data/services.ts`
- Create: `site/data/site.ts`
- Create: `site/tests/unit/content.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Project = { slug: string; client: string; sector: string; country: "MY" | "NZ"; url: string | null; image: string | null; alt: string; observed: string[]; story: string | null; launched: string }`
  - `PROJECTS: Project[]` (8 entries), `projectBySlug(slug: string): Project | undefined`, `PROJECT_SLUGS: string[]`
  - `type Service = { slug: string; deckName: string; title: string; summary: string; layer: LayerKey; detail: string[] }`
  - `SERVICES: Service[]` (6 entries), `serviceBySlug(slug: string): Service | undefined`
  - `type LayerKey = "brand" | "ops" | "ai" | "grow"`, `LAYERS: { key: LayerKey; name: string; gloss: string }[]`
  - `SITE: { name; role; city; email; phones: string[]; instagram; address }`, `NAV: { href: string; label: string }[]`

- [ ] **Step 1: Write the failing content test**

`site/tests/unit/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { PROJECTS, projectBySlug } from "@/data/projects";
import { LAYERS, SERVICES, serviceBySlug } from "@/data/services";
import { SITE, NAV } from "@/data/site";

const DEMO = [
  "neuros", "agencium", "aiero", "constructum", "alan begham", "arthur dowson",
  "brandon adams", "dan smith", "tim bearton", "pacific hake", "1060 str. first avenue",
];

const text = JSON.stringify([PROJECTS, SERVICES, SITE, LAYERS, NAV]).toLowerCase();

describe("honesty rules", () => {
  it("carries no demo content from the old theme", () => {
    for (const s of DEMO) expect(text).not.toContain(s);
  });

  it("never says agency, marketing firm, or Kuala Lumpur", () => {
    for (const s of ["marketing firm", "kuala lumpur"]) expect(text).not.toContain(s);
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
  it("has the eight approved clients and no others", () => {
    expect(PROJECTS.map((p) => p.client).sort()).toEqual([
      "Fuji Bakery", "MIA — Malaysian Institute of Art", "Propel Global Berhad",
      "Sandmerit", "The Knights Atelier", "The Knights Award",
      "The Skin Suite", "Torii Teppanyaki",
    ]);
  });

  it("excludes every client the brief removed", () => {
    const names = PROJECTS.map((p) => p.client).join(" ").toLowerCase();
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
      if (p.image === null) continue;
      expect(p.image).toMatch(/^\/work\/[a-z0-9-]+\.webp$/);
      const onDisk = new URL(`../../public${p.image}`, import.meta.url);
      expect(existsSync(onDisk), `${p.client} capture missing: ${p.image}`).toBe(true);
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
    for (const p of PROJECTS) expect(p.observed.length).toBeGreaterThanOrEqual(2);
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
      "AI & Automation", "Business Intelligence", "Business Systems",
      "Customer Growth", "Digital Presence", "Digital Transformation",
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
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd site && npx vitest run tests/unit/content.test.ts`
Expected: FAIL — cannot resolve `@/data/projects`.

- [ ] **Step 3: Write `site/data/site.ts`**

```ts
/** Contact details and positioning. Every value is the client's own, from
 *  Company Profile.pdf p2 and p9. */
export const SITE = {
  name: "TheWebxite",
  role: "digital architect",
  city: "Petaling Jaya",
  address: "Pusat Dagangan NZX, 47301 Petaling Jaya, Selangor",
  email: "sales@thewebxite.com",
  phones: ["+6017 777 5971", "+60 11-2522 9855", "+60 12-578 3143"],
  instagram: "@thewebxite",
} as const;

export const NAV: { href: string; label: string }[] = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News & Events" },
  { href: "/contact", label: "Contact" },
];
```

- [ ] **Step 4: Write `site/data/services.ts`**

```ts
export type LayerKey = "brand" | "ops" | "ai" | "grow";

/** The four layers, Company Profile.pdf p6. Names are the deck's; the
 *  one-line glosses are written in the brand voice. */
export const LAYERS: { key: LayerKey; name: string; gloss: string }[] = [
  { key: "brand", name: "Build Brand", gloss: "Front end — how you are judged in the first seconds" },
  { key: "ops", name: "Improve Operations", gloss: "Back end — the systems the front end runs on" },
  { key: "ai", name: "Work Smarter", gloss: "Intelligence — the repetitive work stops being manual" },
  { key: "grow", name: "Grow Faster", gloss: "Growth — and what it tells you to build next" },
];

export type Service = {
  slug: string;
  deckName: string;
  title: string;
  summary: string;
  layer: LayerKey;
  detail: string[];
};

/**
 * Six solutions from p5. `deckName` and `summary` are the deck's words
 * verbatim; `title` and `slug` add the term Malaysian SMEs actually search,
 * so the brand language leads and the searched language still reaches the
 * H1, the slug and the meta description.
 *
 * The layer mapping is ours, not the deck's — flagged for confirmation.
 */
export const SERVICES: Service[] = [
  {
    slug: "web-design-development-malaysia",
    deckName: "Digital Presence",
    title: "Digital Presence — Web Design & Development in Malaysia",
    summary: "Websites, e-commerce, and branding.",
    layer: "brand",
    detail: [
      "A website is the first thing a customer judges you on, and most of the time it is the only thing they see before deciding whether to call.",
      "We design and build the site, the brand it carries, and the e-commerce behind it when you sell online.",
    ],
  },
  {
    slug: "seo-digital-marketing-malaysia",
    deckName: "Customer Growth",
    title: "Customer Growth — SEO & Digital Marketing in Malaysia",
    summary: "Digital marketing, SEO, and lead generation.",
    layer: "grow",
    detail: [
      "A site nobody finds is a brochure in a drawer.",
      "Search, paid campaigns and the lead capture that turns attention into an enquiry you can answer.",
    ],
  },
  {
    slug: "ai-automation-malaysia",
    deckName: "AI & Automation",
    title: "AI & Automation — Workflow Automation for Malaysian SMEs",
    summary: "AI assistants, automation, and workflow optimisation.",
    layer: "ai",
    detail: [
      "Spreadsheets, follow-ups and admin quietly eat hours every week and do not scale.",
      "We automate the repetitive work so the team runs lean and nothing slips.",
    ],
  },
  {
    slug: "custom-systems-malaysia",
    deckName: "Business Systems",
    title: "Business Systems — Custom Applications & Portals in Malaysia",
    summary: "Custom applications, portals, and integrations.",
    layer: "ops",
    detail: [
      "When off-the-shelf software nearly fits, the gap is where the manual work lives.",
      "Custom applications, customer and staff portals, and the integrations that connect what you already run.",
    ],
  },
  {
    slug: "business-intelligence-malaysia",
    deckName: "Business Intelligence",
    title: "Business Intelligence — Dashboards & Reporting in Malaysia",
    summary: "Dashboards, analytics, and reporting.",
    layer: "grow",
    detail: [
      "Most businesses have the data and no way to look at it.",
      "Dashboards and reporting that answer the question you actually asked, built on the systems you already have.",
    ],
  },
  {
    slug: "digital-transformation-malaysia",
    deckName: "Digital Transformation",
    title: "Digital Transformation — Technology Strategy in Malaysia",
    summary: "Technology strategies for long-term growth.",
    layer: "ops",
    detail: [
      "Transformation is a sequence, not a purchase.",
      "We map what to change, in what order, and what each step has to be worth before it is worth doing.",
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
```

- [ ] **Step 5: Write `site/data/projects.ts`**

```ts
export type Project = {
  slug: string;
  client: string;
  sector: string;
  country: "MY" | "NZ";
  /** Live site, or null where no URL has been supplied. */
  url: string | null;
  /** Capture in /public/work, or null. NEVER a stock photograph. */
  image: string | null;
  alt: string;
  /** Facts legible in the capture or on the live site. Verifiable, not narrative. */
  observed: string[];
  /** The written story. null until the client supplies one — never invented. */
  story: string | null;
  /** ISO date of the capture, not of the build — we do not know build dates. */
  launched: string;
};

/**
 * Eight clients, publication permission granted 2026-10-02.
 *
 * `observed` is written from the CAPTURE and the live site, which is the one
 * kind of claim a reader can check against the image beside it. `story` stays
 * null for every project until the client supplies a written record: the
 * Company Profile deck contains no per-project content (page 8 is a logo wall),
 * so there is nothing to draw on and nothing will be invented.
 *
 * Ordered to maximise contrast between neighbours — the range argument depends
 * on the jolt between consecutive captures, not on alphabetical order.
 */
export const PROJECTS: Project[] = [
  {
    slug: "the-knights-atelier",
    client: "The Knights Atelier",
    sector: "Luxury fragrance e-commerce",
    country: "MY",
    url: "https://theknightsatelier.com",
    image: "/work/the-knights-atelier.webp",
    alt: "The Knights Atelier home page: a warm gold photograph of perfume flacons under the words Sense to Scent",
    observed: [
      "A catalogue organised around five fragrance worlds — Soft, Clean, Energy, Nature, Timeless.",
      "A product page for every fragrance, each with its top, heart and base notes.",
      "A working cart with a slide-out bag, and a quick-view drawer on the shop grid.",
      "Bespoke SVG flacons rendered per fragrance rather than stock product photography.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "torii-teppanyaki",
    client: "Torii Teppanyaki",
    sector: "Restaurant chain",
    country: "MY",
    url: "https://torii.com.my",
    image: "/work/torii-teppanyaki.webp",
    alt: "Torii Teppanyaki home page: a red tiled background with the brand's flame mascot and the wordmark set large in yellow",
    observed: [
      "A flame mascot carried as the primary brand device rather than food photography.",
      "A menu browser and an outlet finder reachable from the first screen.",
      "A running announcement ribbon along the foot of the hero.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "propel-global",
    client: "Propel Global Berhad",
    sector: "Engineering group",
    country: "MY",
    url: "https://propelglobal.com.my",
    image: "/work/propel-global.webp",
    alt: "Propel Global Berhad home page: a navy header over a photograph of two engineers at a welding robot, headlined Propel Engineering",
    observed: [
      "Three divisions carried in one site — Engineering, Construction and Maxflo — each with its own hero.",
      "An investor relations section alongside the commercial pages.",
      "A rotating hero with division-level navigation.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "the-skin-suite",
    client: "The Skin Suite",
    sector: "Cosmetic clinic",
    country: "NZ",
    url: "https://www.theskinsuite.co.nz",
    image: "/work/the-skin-suite.webp",
    alt: "The Skin Suite home page: a soft editorial layout in pink and cream headlined Fresh faced and fine-line free",
    observed: [
      "Online booking and an online shop, both reachable from the header.",
      "A treatment menu split from the retail range.",
      "Hawke's Bay, New Zealand — the one client in this set outside Malaysia.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "sandmerit",
    client: "Sandmerit",
    sector: "B2B performance-management software",
    country: "MY",
    url: "https://sandmerit.com",
    image: "/work/sandmerit.webp",
    alt: "Sandmerit home page: a yellow field headlined Malaysia's Leading Performance Management System and Corporate KPI Software",
    observed: [
      "Seven country flags in the footer of the hero — Malaysia, Singapore, the Philippines, Thailand, Vietnam, Cambodia, Indonesia.",
      "A language switcher in the primary navigation.",
      "Separate paths for the software, the workshops and the consultants.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "mia",
    client: "MIA — Malaysian Institute of Art",
    sector: "Higher education",
    country: "MY",
    url: "https://mia.edu.my",
    image: "/work/mia.webp",
    alt: "Malaysian Institute of Art home page: a mosaic of student work under the words Design the Future",
    observed: [
      "Separate entry points for staff, students and webmail alongside the public site.",
      "Programmes, admissions and student affairs as first-class navigation.",
      "A student-work gallery used as the hero rather than campus photography.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "the-knights-award",
    client: "The Knights Award",
    sector: "Awards programme",
    country: "MY",
    url: "https://theknightsaward.com",
    image: "/work/the-knights-award.webp",
    alt: "The Knights Award home page: two gold particle horses facing each other on a black field",
    observed: [
      "A black ground carried across the whole site rather than a single dark hero.",
      "The twin-horse emblem rendered as particles rather than a flat logo.",
    ],
    story: null,
    launched: "2026-10-02",
  },
  {
    slug: "fuji-bakery",
    client: "Fuji Bakery",
    sector: "Food manufacturing",
    country: "MY",
    url: "https://fujibakery.com.my",
    image: "/work/fuji-bakery.webp",
    alt: "Fuji Bakery home page: a production line of pastries headlined Your One-Stop Pastry and Bakery Manufacturer",
    observed: [
      "A manufacturer's site rather than a shopfront — the hero is the production line.",
      "A product catalogue separated from a where-to-buy section.",
    ],
    story: null,
    launched: "2026-10-02",
  },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);
```

- [ ] **Step 6: Run the test**

Run: `cd site && npx vitest run tests/unit/content.test.ts`
Expected: FAIL on "points every declared capture at a file that exists" only — the `.webp` files do not exist yet. Every other test passes. Task 4 closes this.

- [ ] **Step 7: Commit**

```bash
git add site/data site/tests/unit/content.test.ts
git commit -m "feat: typed content layer with honesty-rule tests"
```

---

### Task 4: Capture pipeline

Converts the salvaged PNGs (3–6 MB each) into web-sized WebP and closes the failing test from Task 3.

**Files:**
- Create: `site/scripts/build-captures.mjs`
- Create: `site/public/work/*.webp` (generated)
- Modify: `site/package.json`

**Interfaces:**
- Consumes: `PROJECT_SLUGS` from `@/data/projects`; source PNGs in `../salvage/client-sites/`.
- Produces: `site/public/work/<slug>.webp` for all eight slugs, max width 2048, quality 82.

- [ ] **Step 1: Write `site/scripts/build-captures.mjs`**

```js
import { mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = join(here, "..", "..", "salvage", "client-sites");
const OUT = join(here, "..", "public", "work");

/** slug -> source filename in salvage/client-sites. Live 2026 captures win
 *  over the client's 2025 media-library versions wherever both exist. */
const SOURCES = {
  "the-knights-atelier": "the-knights-atelier.png",
  "torii-teppanyaki": "torii-teppanyaki.png",
  "propel-global": "propel-global-2026.png",
  "the-skin-suite": "the-skin-suite-2026.png",
  sandmerit: "sandmerit-2026.png",
  mia: "mia-2026.png",
  "the-knights-award": "the-knights-award.png",
  "fuji-bakery": "fuji-bakery-2026.png",
};

mkdirSync(OUT, { recursive: true });

let failed = 0;
for (const [slug, file] of Object.entries(SOURCES)) {
  const from = join(SRC, file);
  if (!existsSync(from)) {
    console.error(`MISSING source for ${slug}: ${from}`);
    failed += 1;
    continue;
  }
  const to = join(OUT, `${slug}.webp`);
  const info = await sharp(from).resize({ width: 2048, withoutEnlargement: true })
    .webp({ quality: 82 }).toFile(to);
  console.log(`${slug.padEnd(22)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

if (failed) { console.error(`\n${failed} source image(s) missing.`); process.exit(1); }
```

- [ ] **Step 2: Add the script to `site/package.json`**

```json
"captures": "node scripts/build-captures.mjs"
```

- [ ] **Step 3: Run it**

Run: `cd site && npm run captures`
Expected: eight lines printed, each well under 500 KB. Exit 0.

- [ ] **Step 4: Run the content test to verify it now passes**

Run: `cd site && npx vitest run tests/unit/content.test.ts`
Expected: PASS, all tests including "points every declared capture at a file that exists".

- [ ] **Step 5: Commit**

```bash
git add site/scripts/build-captures.mjs site/public/work site/package.json
git commit -m "feat: capture pipeline, eight client webp captures"
```

---

### Task 5: Chrome — nav, footer, smooth scroll, layout

**Files:**
- Modify: `site/app/layout.tsx`
- Modify: `site/app/components/SiteNav.tsx`
- Modify: `site/app/components/SiteFooter.tsx`
- Create: `site/app/components/SmoothScroll.tsx`
- Create: `site/tests/e2e/chrome.spec.ts`

**Interfaces:**
- Consumes: `NAV`, `SITE` from `@/data/site`; the `.ground-grain` class from Task 2.
- Produces: `RootLayout` renders `<SmoothScroll />`, `<SiteNav />`, `{children}`, `<SiteFooter />`. Nav is a `<nav aria-label="Primary">` containing one `<a>` per visible `NAV` entry.

- [ ] **Step 1: Write the failing e2e test**

`site/tests/e2e/chrome.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

/* News & Events is gated on NEWS.length >= 3 and NEWS is empty until Task 12,
   so four links are correct here. Task 12 replaces this with the open case. */
test("primary nav hides News until there are three entries", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('nav[aria-label="Primary"] a');
  await expect(links).toHaveText(["Services", "Work", "About", "Contact"]);
});

test("every nav destination responds 200, including the gated one", async ({ page }) => {
  for (const href of ["/services", "/work", "/about", "/news", "/contact"]) {
    const res = await page.goto(href);
    expect(res?.status(), `${href} should resolve`).toBe(200);
  }
});

test("footer states Petaling Jaya and never says agency", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("Petaling Jaya");
  await expect(footer).not.toContainText(/agency|marketing firm|Kuala Lumpur/i);
});

test("loads no third-party font or CDN script", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (!["127.0.0.1", "localhost"].includes(u.hostname)) external.push(r.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(external).toEqual([]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd site && npx playwright test tests/e2e/chrome.spec.ts --project=desktop`
Expected: FAIL — nav has the old Stage A links; `/services` etc. 404.

- [ ] **Step 3: Write `site/app/components/SmoothScroll.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis, mounted once. Disabled entirely under prefers-reduced-motion —
 * checked BEFORE construction, per the motion rule, not torn down after.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
```

Install it: `cd site && npm i lenis`

- [ ] **Step 4: Rewrite `site/app/components/SiteNav.tsx`**

```tsx
import Link from "next/link";
import { NAV, SITE } from "@/data/site";
import { NEWS } from "@/data/news";

/**
 * News & Events is hidden until there are three or more entries: a news
 * section showing one item reads as abandoned and costs more credibility
 * than having none. The route always exists; only the link is gated.
 */
export default function SiteNav() {
  const items = NAV.filter((n) => n.href !== "/news" || NEWS.length >= 3);

  return (
    <header className="w-full px-[var(--space-gutter)] py-6">
      <div className="mx-auto flex max-w-[84rem] items-baseline justify-between gap-8">
        <Link href="/" className="font-display text-base font-bold tracking-[-0.02em]">
          {SITE.name}
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-7 gap-y-2 text-xs">
          {items.map((n) => (
            <Link key={n.href} href={n.href} className="min-h-[44px] inline-flex items-center hover:text-accent">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

Create the minimal `site/data/news.ts` this imports — Task 12 fills it:

```ts
export type NewsItem = { slug: string; title: string; date: string; body: string[] };

/** Seeded from project launches in Task 12. The nav link is gated on length >= 3. */
export const NEWS: NewsItem[] = [];

export const newsBySlug = (slug: string) => NEWS.find((n) => n.slug === slug);
export const NEWS_SLUGS = NEWS.map((n) => n.slug);
```

- [ ] **Step 5: Rewrite `site/app/components/SiteFooter.tsx`**

```tsx
import { SITE } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="ground-grain px-[var(--space-gutter)] py-[var(--space-block)]">
      <div className="mx-auto flex max-w-[84rem] flex-wrap justify-between gap-x-12 gap-y-6 text-xs">
        <p className="max-w-[28ch]">
          {SITE.name} — a {SITE.city}-based {SITE.role}.
        </p>
        <address className="not-italic">
          <a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a>
          <br />
          {SITE.phones[0]}
          <br />
          {SITE.address}
        </address>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Rewrite `site/app/layout.tsx`**

```tsx
import type { Metadata } from "next";

import "@fontsource/open-sauce-one/400.css";
import "@fontsource/open-sauce-one/500.css";
import "@fontsource/open-sauce-one/700.css";
import "./globals.css";

import SmoothScroll from "./components/SmoothScroll";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://thewebxite.com"),
  title: {
    default: "TheWebxite — Petaling Jaya digital architect",
    template: "%s · TheWebxite",
  },
  description:
    "We build the brand, the systems, the automation and the growth as one connected stack. Petaling Jaya, Malaysia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="ground-grain min-h-full overflow-x-hidden">
        <SmoothScroll />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create placeholder routes so the nav resolves**

Create each of `site/app/services/page.tsx`, `site/app/work/page.tsx`, `site/app/about/page.tsx`, `site/app/news/page.tsx`, `site/app/contact/page.tsx` with this shape, substituting the name:

```tsx
export default function Page() {
  return <main className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
    <h1 className="text-section font-display">Services</h1>
  </main>;
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `cd site && npx playwright test tests/e2e/chrome.spec.ts`
Expected: PASS, 8 tests (4 × 2 projects).

- [ ] **Step 9: Commit**

```bash
git add site/app site/data/news.ts site/tests/e2e/chrome.spec.ts site/package.json site/package-lock.json
git commit -m "feat: site chrome, routes and smooth scroll"
```

---

### Task 6: Home — hero and the gap

**Files:**
- Modify: `site/app/components/Hero.tsx`
- Create: `site/app/components/Gap.tsx`
- Create: `site/tests/e2e/home-argument.spec.ts`

**Interfaces:**
- Consumes: `Reveal` (existing).
- Produces: `<Hero />`, `<Gap />`. Hero renders the claim inside a single `<h1>`.

- [ ] **Step 1: Write the failing test**

`site/tests/e2e/home-argument.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("hero carries the deck's strongest line as the h1", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  await expect(h1).toContainText("The tools exist");
  await expect(h1).toContainText("not connected into one system");
});

test("the gap names the deck's three failures", async ({ page }) => {
  await page.goto("/");
  const gap = page.locator("#the-gap");
  for (const t of ["Digital Adoption Gap", "Manual Workflow", "Missed Growth Opportunities"]) {
    await expect(gap).toContainText(t);
  }
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd site && npx playwright test tests/e2e/home-argument.spec.ts --project=desktop`
Expected: FAIL — `#the-gap` not found.

- [ ] **Step 3: Rewrite `site/app/components/Hero.tsx`**

```tsx
import Link from "next/link";

/**
 * stacked-statement-hero. Three lines at three genuinely different sizes,
 * left aligned, no image, one text link. The claim is Company Profile p4
 * verbatim and is the strongest sentence the company owns.
 */
export default function Hero() {
  return (
    <section className="ground-grain px-[var(--space-gutter)] pb-[var(--space-section)] pt-[clamp(3rem,8vw,7rem)]">
      <div className="mx-auto max-w-[84rem]">
        <h1 className="max-w-[18ch] font-display text-display font-bold leading-[0.94] tracking-[-0.03em]">
          The tools exist. They&rsquo;re just not connected into one system.
        </h1>

        {/* PLACEHOLDER: recombines the "Petaling Jaya digital architect" line
            (p2) with the connected-stack idea (p6). Both halves are the
            client's; the join is ours. */}
        <p className="mt-[var(--space-block)] max-w-[46ch] text-lead text-text-muted">
          We are a Petaling Jaya digital architect. We build the brand, the systems,
          the automation and the growth as one stack — not four purchases.
        </p>

        <Link
          href="/work"
          className="mt-10 inline-flex min-h-[44px] items-center border-b border-accent text-base text-accent"
        >
          See the work
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `site/app/components/Gap.tsx`**

```tsx
import Reveal from "./Reveal";

/** Company Profile p4, verbatim. The vertical rule starts here and runs the
 *  length of the page, so the argument reads as one object. */
const FAILURES = [
  {
    title: "Digital Adoption Gap",
    body: "Customers judge you in seconds — a weak or missing website loses them before you say a word.",
  },
  {
    title: "Manual Workflow",
    body: "Spreadsheets, follow-ups and admin quietly eat hours every week and don't scale.",
  },
  {
    title: "Missed Growth Opportunities",
    body: "Big brands run on AI for support, content and decisions. Most SMEs still do it all by hand.",
  },
];

export default function Gap() {
  return (
    <section id="the-gap" className="ground-grain px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <p className="max-w-[40ch] text-lead">
          1.2 million SMEs run Malaysia, yet most have no real brand, no automation
          and no AI working for them.
        </p>

        <ul className="mt-[var(--space-block)] border-t border-hairline">
          {FAILURES.map((f, i) => (
            <Reveal as="li" key={f.title} delayIndex={i} className="grid gap-3 border-b border-hairline py-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-10">
              <h2 className="font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">{f.title}</h2>
              <p className="max-w-[52ch] text-text-muted">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd site && npx playwright test tests/e2e/home-argument.spec.ts`
Expected: PASS, 4 tests.

- [ ] **Step 6: Commit**

```bash
git add site/app/components/Hero.tsx site/app/components/Gap.tsx site/tests/e2e/home-argument.spec.ts
git commit -m "feat: home hero and the gap"
```

---

### Task 7: Home — range and the engagement circles

The range section is the strongest asset on the site.

**Files:**
- Create: `site/app/components/Range.tsx`
- Create: `site/app/components/Circles.tsx`
- Modify: `site/app/components/Process.tsx`
- Modify: `site/tests/e2e/home-argument.spec.ts`

**Interfaces:**
- Consumes: `PROJECTS` from `@/data/projects`.
- Produces: `<Range />` renders one `<figure data-capture="<slug>">` per project with a `next/image`; `<Circles />` renders `<li data-step="1|2|3">`; `<Process />` renders `<li data-step-4d="01".."04">` on the flat ground.

- [ ] **Step 1: Add the failing tests to `site/tests/e2e/home-argument.spec.ts`**

```ts
test("range shows all eight captures, each with a real alt", async ({ page }) => {
  await page.goto("/");
  const figures = page.locator("#range figure[data-capture]");
  await expect(figures).toHaveCount(8);

  for (const slug of ["the-knights-atelier", "torii-teppanyaki", "propel-global", "fuji-bakery"]) {
    const img = page.locator(`#range figure[data-capture="${slug}"] img`);
    await expect(img).toHaveCount(1);
    const alt = await img.getAttribute("alt");
    expect(alt && alt.length).toBeGreaterThan(20);
  }
});

test("range links each capture to its own case study", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('#range figure[data-capture="sandmerit"] a').first().getAttribute("href");
  expect(href).toBe("/work/sandmerit");
});

test("engagement shows the deck's three steps", async ({ page }) => {
  await page.goto("/");
  const c = page.locator("#engagement");
  for (const t of ["Tech Consultation", "Free Demo", "Follow-up Timeline"]) {
    await expect(c).toContainText(t);
  }
});

test("4D runs on the flat ground with the client's own numerals", async ({ page }) => {
  await page.goto("/");
  const steps = page.locator("#process li[data-step-4d]");
  await expect(steps).toHaveCount(4);
  await expect(steps).toHaveText([/01\s*Discover/, /02\s*Design/, /03\s*Deliver/, /04\s*Drive/]);

  const bg = await page.locator("#process").evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg, "4D must sit on the flat surface, not the grain canvas").toBe("rgb(243, 242, 240)");
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd site && npx playwright test tests/e2e/home-argument.spec.ts --project=desktop`
Expected: FAIL — `#range` not found.

- [ ] **Step 3: Write `site/app/components/Range.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import Reveal from "./Reveal";

/**
 * The proof section, and the site's central argument about the work.
 *
 * NOT a logo marquee. A greyscale logo says someone paid us; a screenshot
 * says we built that. The eight captures are deliberately unalike — a gold
 * perfume maison, a black particle-horse awards site, a red teppanyaki
 * mascot, a corporate engineering group — and the jolt between consecutive
 * captures IS the argument. Ordering comes from PROJECTS, which is sequenced
 * for contrast rather than alphabetically.
 *
 * Flat surface, not grain: a textured ground fights a screenshot.
 */
export default function Range() {
  return (
    <section id="range" className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        {/* PLACEHOLDER: headline is ours, pending the client's own wording. */}
        <h2 className="max-w-[16ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          Eight clients. No house style.
        </h2>
        <p className="mt-6 max-w-[52ch] text-ink-muted">
          Most studios ship one template in several colourways. These came from
          the same four people.
        </p>

        <div className="mt-[var(--space-section)] grid gap-[var(--space-section)]">
          {PROJECTS.map((p, i) => (
            <Reveal as="figure" key={p.slug} data-capture={p.slug} delayIndex={i} className="min-w-0">
              <Link href={`/work/${p.slug}`} className="block">
                {p.image ? (
                  <Image
                    src={p.image}
                    alt={p.alt}
                    width={2048}
                    height={1280}
                    sizes="(max-width: 1024px) 100vw, 84rem"
                    priority={i === 0}
                    className="h-auto w-full max-w-full"
                  />
                ) : null}
                <figcaption className="mt-5 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                  <span className="font-display text-section font-bold tracking-[-0.02em]">{p.client}</span>
                  <span className="text-xs text-ink-muted">
                    {p.sector}
                    {p.country === "NZ" ? " · New Zealand" : ""}
                  </span>
                </figcaption>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `site/app/components/Circles.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Company Profile p9 as a web object: three concentric fields, each carrying
 * one engagement step. Scroll-LINKED, never pinned — the page's single pin
 * belongs to the ecosystem (Stack.tsx), and the one-pin cap is absolute.
 *
 * #0074DD appears here and only here: it is illustration on a light surface,
 * which is precisely what the token permits and the one place the deck uses it.
 */
const STEPS = [
  { n: 1, title: "Tech Consultation", body: "We get to know your business, map where the gaps are, and pinpoint where web, automation or AI will actually move the needle." },
  { n: 2, title: "Free Demo", body: "See it working before you commit — a real demo built around your use case, not just slides and promises." },
  { n: 3, title: "Follow-up Timeline", body: "Once we're rolling, you get clear milestones and regular check-ins, so you always know what's shipping and when." },
];

export default function Circles() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (!root.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-ring]", {
        scale: 0.86,
        transformOrigin: "100% 50%",
        stagger: 0.06,
        ease: "none",
        scrollTrigger: { trigger: root.current!, start: "top 85%", end: "bottom 60%", scrub: 0.4 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="engagement" ref={root} className="ground-flat overflow-hidden px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto grid max-w-[84rem] gap-[var(--space-block)] lg:grid-cols-[minmax(0,34ch)_minmax(0,1fr)]">
        <h2 className="min-w-0 font-display text-major font-bold leading-[1] tracking-[-0.03em]">
          We are always ready to help you and answer your questions
        </h2>

        <ol className="relative grid min-w-0 gap-10 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.n} data-ring data-step={s.n} className="relative min-w-0 rounded-full/none">
              <span
                aria-hidden="true"
                className="absolute -z-10 hidden rounded-full lg:block"
                style={{
                  inset: `-${6 + i * 2}rem -${4 + i * 3}rem`,
                  background: i === 2 ? "var(--color-blue-mid)" : `rgba(7,18,56,${0.05 + i * 0.05})`,
                }}
              />
              <h3 className={`font-display text-lead font-bold ${i === 2 ? "lg:text-surface" : ""}`}>{s.title}</h3>
              <p className={`mt-3 text-base ${i === 2 ? "lg:text-surface" : "text-ink-muted"}`}>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Rewrite `site/app/components/Process.tsx`**

The existing component was written for the blue ground. It moves to the flat
surface and gains the `data-step-4d` hooks.

```tsx
import Reveal from "./Reveal";

/**
 * numbered-steps-horizontal. Company Profile p7 verbatim — the numerals are
 * the client's own, which is why they are allowed: the ruleset bans invented
 * meta-labels like "SECTION 01", not a sequence the client already numbers.
 *
 * One hairline runs edge to edge behind the row so it reads as a single
 * process rather than four separate items.
 */
const STEPS = [
  { n: "01", name: "Discover", lead: "Understand Your Business", body: "Identify business challenges, opportunities, and objectives." },
  { n: "02", name: "Design", lead: "Plan The Right Solution", body: "Define the strategy, solution architecture, and implementation roadmap." },
  { n: "03", name: "Deliver", lead: "Build The Solution", body: "Develop, test, and integrate the solution." },
  { n: "04", name: "Drive", lead: "Accelerate Growth", body: "Measure performance, optimise results, and support long-term growth." },
];

export default function Process() {
  return (
    <section id="process" className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <h2 className="max-w-[20ch] font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">
          Our 4D approach and delivery framework
        </h2>

        <ol className="mt-[var(--space-block)] grid border-t border-hairline-ink md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              data-step-4d={s.n}
              delayIndex={i}
              className="min-w-0 border-b border-hairline-ink py-8 md:border-b-0 md:pr-8"
            >
              <p className="font-display text-lead font-bold tabular-nums">
                <span className="text-ink-muted">{s.n}</span> {s.name}
              </p>
              <p className="mt-3 text-base font-medium">{s.lead}</p>
              <p className="mt-2 max-w-[34ch] text-base text-ink-muted">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `cd site && npx playwright test tests/e2e/home-argument.spec.ts`
Expected: PASS, 16 tests.

- [ ] **Step 7: Commit**

```bash
git add site/app/components/Range.tsx site/app/components/Circles.tsx site/app/components/Process.tsx site/tests/e2e/home-argument.spec.ts
git commit -m "feat: range, engagement circles, 4D on the flat ground"
```

---

### Task 8: Home assembly, and the Review Focus tests

Assembles the page and pins down four of the five Review Focus failure modes.

**Files:**
- Modify: `site/app/page.tsx`
- Modify: `site/app/components/Stack.tsx`
- Create: `site/tests/e2e/resilience.spec.ts`

**Interfaces:**
- Consumes: every home component.
- Produces: the composed `/` route, and `<ContactBlock />` at `site/app/components/ContactBlock.tsx` — reused by `/contact` in Task 11.

- [ ] **Step 1: Write the failing resilience tests**

`site/tests/e2e/resilience.spec.ts`:

```ts
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
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  // and the content is still readable
  await expect(page.locator("#range figure[data-capture]")).toHaveCount(8);
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

  await expect(page.locator("h1")).toContainText("The tools exist");
  await expect(page.locator("#the-gap")).toContainText("Digital Adoption Gap");
  await expect(page.locator("#range figure[data-capture]")).toHaveCount(8);
  await expect(page.locator("#engagement")).toContainText("Free Demo");

  // Reveal must not leave content invisible when its observer never runs.
  const hidden = await page.locator("#range figure").first().evaluate(
    (el) => getComputedStyle(el).opacity,
  );
  expect(Number(hidden)).toBeGreaterThan(0.99);

  await ctx.close();
});
```

- [ ] **Step 2: Run to verify failures**

Run: `cd site && npx playwright test tests/e2e/resilience.spec.ts --project=desktop`
Expected: FAIL — the home page has no `#range` yet, and the no-JS opacity check fails because `.reveal` starts at `opacity:0`.

- [ ] **Step 3: Rewrite `site/app/page.tsx`**

```tsx
import Hero from "./components/Hero";
import Gap from "./components/Gap";
import Stack from "./components/Stack";
import Range from "./components/Range";
import Process from "./components/Process";
import Circles from "./components/Circles";
import ContactBlock from "./components/ContactBlock";

/**
 * One sustained argument, in seven moves:
 *   1 the claim        2 the gap it names     3 the system that closes it
 *   4 proof it works   5 how we work          6 how to start   7 contact
 *
 * Grain carries 1-3 and 6; flat carries 4, 5 and 7, where a textured ground
 * would fight a screenshot.
 */
export default function Home() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <Hero />
      <Gap />
      <Stack />
      <Range />
      <Process />
      <Circles />
      <ContactBlock />
    </main>
  );
}
```

Create `site/app/components/ContactBlock.tsx`:

```tsx
import { SITE } from "@/data/site";

/** editorial-contact-block. Email largest, because it is what most visitors
 *  actually want. No form card, no map, no icons. */
export default function ContactBlock() {
  return (
    <section id="contact" className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <a
          href={`mailto:${SITE.email}`}
          className="inline-block max-w-full break-words font-display text-major font-bold leading-[1] tracking-[-0.03em] hover:text-blue-mid"
        >
          {SITE.email}
        </a>
        <ul className="mt-[var(--space-block)] grid gap-x-12 gap-y-3 text-base sm:grid-cols-3">
          {SITE.phones.map((p) => (
            <li key={p} className="tabular-nums">
              <a href={`tel:${p.replace(/\s/g, "")}`}>{p}</a>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[34ch] text-ink-muted">{SITE.address}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Fix the no-JS reveal in `site/app/globals.css`**

The `.reveal` rule must only hide content when JavaScript is present. Add a root class set by the client, and default to visible:

```css
/* Reveal defaults to VISIBLE. Only once the client has marked the document
   does it start hidden — so with JS off, nothing is ever stuck at opacity 0. */
.reveal { opacity: 1; transform: none; }

.js .reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity var(--duration-base) var(--ease-standard),
              transform var(--duration-base) var(--ease-standard);
}

.js .reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .js .reveal { opacity: 1; transform: none; transition: none; }
}
```

Add the marker in `site/app/components/SmoothScroll.tsx`'s effect, before the reduced-motion return:

```tsx
    document.documentElement.classList.add("js");
```

- [ ] **Step 5: Guard and instrument the pin in `site/app/components/Stack.tsx`**

Four changes to the existing component:

1. Add the width guard **before** `gsap.registerPlugin`, so no pin is ever created on a narrow or reduced-motion visit:

```tsx
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
```

2. Put `min-w-0` on the grid wrapper **and both columns**. A grid child defaults to `min-width:auto`, which is what crushes the detail column at 1024–1280px.

3. Add the test hooks: `data-ecosystem-pin` on the element passed to `pin:`, and `data-layer-active={active}` on the layer list, with `data-layer={l.key}` on each item.

4. Set the section's ground to `ground-grain`, and make the highlight instant:

```tsx
className={`... ${active === l.key ? "text-accent" : "text-text-muted"}`}
style={{ transition: "none" }}
```

- [ ] **Step 6: Run the tests**

Run: `cd site && npx playwright test tests/e2e/resilience.spec.ts`
Expected: PASS, 18 tests.

- [ ] **Step 7: Run the whole suite**

Run: `cd site && npm test`
Expected: all green.

- [ ] **Step 8: Commit**

```bash
git add site/app site/tests/e2e/resilience.spec.ts
git commit -m "feat: assemble home page; no-JS, reduced-motion and overflow guards"
```

---

### Task 9: /work and /work/[slug]

**Files:**
- Modify: `site/app/work/page.tsx`
- Create: `site/app/work/[slug]/page.tsx`
- Create: `site/tests/e2e/work.spec.ts`

**Interfaces:**
- Consumes: `PROJECTS`, `projectBySlug`, `PROJECT_SLUGS`.
- Produces: eight statically generated routes at `/work/<slug>`.

- [ ] **Step 1: Write the failing tests**

`site/tests/e2e/work.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const SLUGS = [
  "the-knights-atelier", "torii-teppanyaki", "propel-global", "the-skin-suite",
  "sandmerit", "mia", "the-knights-award", "fuji-bakery",
];

test("work index lists all eight", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("article[data-project]")).toHaveCount(8);
});

for (const slug of SLUGS) {
  test(`/work/${slug} renders with its observed facts`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const facts = page.locator("[data-observed] li");
    expect(await facts.count()).toBeGreaterThanOrEqual(2);
  });
}

test("an unknown project 404s rather than rendering empty", async ({ page }) => {
  const res = await page.goto("/work/not-a-client");
  expect(res?.status()).toBe(404);
});

/** Review Focus 4 — missing url or image must render nothing, not a broken node. */
test("renders no empty image or undefined href anywhere in work", async ({ page }) => {
  for (const slug of SLUGS) {
    await page.goto(`/work/${slug}`);
    const badImg = await page.locator('img[src=""], img:not([alt])').count();
    expect(badImg, `${slug} has a broken image`).toBe(0);
    const badHref = await page.locator('a[href="undefined"], a[href=""], a[href="null"]').count();
    expect(badHref, `${slug} has a broken link`).toBe(0);
  }
});

test("no case study invents a story", async ({ page }) => {
  await page.goto("/work/fuji-bakery");
  await expect(page.locator("[data-story-gap]")).toHaveCount(1);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd site && npx playwright test tests/e2e/work.spec.ts --project=desktop`
Expected: FAIL — `/work/<slug>` 404s.

- [ ] **Step 3: Write `site/app/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, projectBySlug, PROJECT_SLUGS } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: p.client,
    description: `${p.client} — ${p.sector}. Built by TheWebxite, a Petaling Jaya digital architect.`,
  };
}

/**
 * One template, eight pages. Carries ONLY what can be verified: the capture,
 * the live URL, and facts legible on the site itself.
 *
 * `story` is null for every project because no written record exists — the
 * Company Profile deck's page 8 is a logo wall with no per-project content.
 * Rather than invent one, the page renders an explicit gap. When the client
 * supplies three or four lines, it drops in here with no layout change.
 */
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();

  const i = PROJECTS.indexOf(p);
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  return (
    <main className="ground-flat">
      <div className="mx-auto max-w-[84rem] px-[var(--space-gutter)] pt-10">
        <Link href="/work" className="inline-flex min-h-[44px] items-center text-xs text-ink-muted hover:text-blue-mid">
          ← All work
        </Link>
      </div>

      <header className="mx-auto max-w-[84rem] px-[var(--space-gutter)] pb-[var(--space-block)] pt-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
          {p.sector}
          {p.country === "NZ" ? " · Hawke's Bay, New Zealand" : " · Malaysia"}
        </p>
        <h1 className="mt-5 max-w-[16ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          {p.client}
        </h1>
        {p.url ? (
          <a href={p.url} target="_blank" rel="noopener noreferrer"
             className="mt-7 inline-flex min-h-[44px] items-center border-b border-ink text-base hover:text-blue-mid">
            Visit {new URL(p.url).hostname.replace(/^www\./, "")} ↗
          </a>
        ) : null}
      </header>

      {p.image ? (
        <figure className="mx-auto max-w-[84rem] px-[var(--space-gutter)]">
          <Image src={p.image} alt={p.alt} width={2048} height={1280} priority
                 sizes="(max-width: 1024px) 100vw, 84rem" className="h-auto w-full max-w-full" />
        </figure>
      ) : null}

      <section className="mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[var(--space-section)]">
        <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">On the site</h2>
        <ul data-observed className="mt-6 max-w-[62ch] border-t border-hairline-ink">
          {p.observed.map((o) => (
            <li key={o} className="border-b border-hairline-ink py-4 text-lead leading-[1.5]">{o}</li>
          ))}
        </ul>

        {p.story ? (
          <div className="mt-[var(--space-block)] max-w-[62ch] space-y-5">
            <p>{p.story}</p>
          </div>
        ) : (
          /* Not a placeholder to be filled with invention — a declared absence.
             Rendered as an HTML comment so nothing incomplete reaches a reader. */
          <div data-story-gap hidden aria-hidden="true" />
        )}
      </section>

      <nav aria-label="More work" className="mx-auto max-w-[84rem] border-t border-hairline-ink px-[var(--space-gutter)] py-[var(--space-block)]">
        <Link href={`/work/${next.slug}`} className="group inline-flex min-h-[44px] flex-col justify-center">
          <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">Next</span>
          <span className="mt-2 font-display text-section font-bold tracking-[-0.02em] group-hover:text-blue-mid">
            {next.client}
          </span>
        </Link>
      </nav>
    </main>
  );
}
```

- [ ] **Step 4: Write `site/app/work/page.tsx`**

```tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import Reveal from "../components/Reveal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Eight client sites built by TheWebxite — luxury e-commerce, restaurant, engineering, education, B2B software and a clinic in New Zealand.",
};

export default function WorkIndex() {
  return (
    <main className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <h1 className="max-w-[16ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          Eight clients. No house style.
        </h1>

        <div className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal as="article" key={p.slug} data-project={p.slug} delayIndex={i} className="min-w-0">
              <Link href={`/work/${p.slug}`} className="block">
                {p.image ? (
                  <Image src={p.image} alt={p.alt} width={2048} height={1280} loading={i < 2 ? "eager" : "lazy"}
                         sizes="(max-width: 768px) 100vw, 42rem" className="h-auto w-full max-w-full" />
                ) : null}
                <h2 className="mt-5 font-display text-section font-bold tracking-[-0.02em]">{p.client}</h2>
                <p className="mt-2 text-xs text-ink-muted">
                  {p.sector}{p.country === "NZ" ? " · New Zealand" : ""}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `cd site && npx playwright test tests/e2e/work.spec.ts`
Expected: PASS, 24 tests.

- [ ] **Step 6: Commit**

```bash
git add site/app/work site/tests/e2e/work.spec.ts
git commit -m "feat: work index and eight case-study pages"
```

---

### Task 10: /services and /services/[slug]

**Files:**
- Modify: `site/app/services/page.tsx`
- Create: `site/app/services/[slug]/page.tsx`
- Create: `site/tests/e2e/services.spec.ts`

**Interfaces:**
- Consumes: `SERVICES`, `serviceBySlug`, `SERVICE_SLUGS`, `LAYERS`.
- Produces: six statically generated routes at `/services/<slug>`.

- [ ] **Step 1: Write the failing tests**

`site/tests/e2e/services.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const SLUGS = [
  "web-design-development-malaysia", "seo-digital-marketing-malaysia",
  "ai-automation-malaysia", "custom-systems-malaysia",
  "business-intelligence-malaysia", "digital-transformation-malaysia",
];

test("services index lists all six and links each", async ({ page }) => {
  await page.goto("/services");
  for (const s of SLUGS) {
    await expect(page.locator(`a[href="/services/${s}"]`).first()).toBeVisible();
  }
});

for (const slug of SLUGS) {
  test(`/services/${slug} has one h1 and a unique meta description`, async ({ page }) => {
    const res = await page.goto(`/services/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc && desc.length).toBeGreaterThan(50);
    expect(desc).toContain("Malaysia");
  });
}

test("each service page names the ecosystem layer it belongs to", async ({ page }) => {
  await page.goto("/services/ai-automation-malaysia");
  await expect(page.locator("[data-layer]")).toContainText("Work Smarter");
});

test("service pages cross-link to real work", async ({ page }) => {
  await page.goto("/services/web-design-development-malaysia");
  await expect(page.locator('a[href^="/work/"]').first()).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd site && npx playwright test tests/e2e/services.spec.ts --project=desktop`
Expected: FAIL — service detail routes 404.

- [ ] **Step 3: Write `site/app/services/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LAYERS, SERVICES, serviceBySlug, SERVICE_SLUGS } from "@/data/services";
import { PROJECTS } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: `${s.summary} ${s.detail[0]} TheWebxite, a Petaling Jaya digital architect serving SMEs across Malaysia.`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const layer = LAYERS.find((l) => l.key === s.layer)!;
  const others = SERVICES.filter((o) => o.slug !== s.slug);
  /* Three projects as evidence. Not filtered by service — we hold no record of
     which service produced which project, and inventing that mapping would be
     a fabricated claim. Shown as "recent work" rather than "built with this". */
  const evidence = PROJECTS.slice(0, 3);

  return (
    <main className="ground-flat">
      <header className="mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[var(--space-section)]">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">{s.deckName}</p>
        <h1 className="mt-5 max-w-[20ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          {s.title}
        </h1>
        <p className="mt-7 max-w-[52ch] text-lead text-ink-muted">{s.summary}</p>
      </header>

      <section className="mx-auto max-w-[84rem] px-[var(--space-gutter)] pb-[var(--space-section)]">
        <div className="max-w-[62ch] space-y-5 text-lead leading-[1.55]">
          {s.detail.map((d) => <p key={d}>{d}</p>)}
        </div>

        <p data-layer className="mt-[var(--space-block)] max-w-[52ch] border-t border-hairline-ink pt-6 text-base text-ink-muted">
          Sits in the <strong className="font-medium text-ink">{layer.name}</strong> layer
          of the stack — {layer.gloss.toLowerCase()}.{" "}
          <Link href="/services" className="border-b border-ink-muted hover:text-blue-mid">See the whole stack</Link>
        </p>
      </section>

      <section className="mx-auto max-w-[84rem] border-t border-hairline-ink px-[var(--space-gutter)] py-[var(--space-block)]">
        <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">Recent work</h2>
        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {evidence.map((p) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="inline-flex min-h-[44px] items-center border-b border-ink text-base hover:text-blue-mid">
                {p.client}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <nav aria-label="Other services" className="mx-auto max-w-[84rem] border-t border-hairline-ink px-[var(--space-gutter)] py-[var(--space-block)]">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`/services/${o.slug}`} className="inline-flex min-h-[44px] items-center text-base text-ink-muted hover:text-blue-mid">
                {o.deckName}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
```

- [ ] **Step 4: Write `site/app/services/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { LAYERS, SERVICES } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web design, SEO, AI automation, custom business systems, business intelligence and digital transformation — one connected stack, from a Petaling Jaya digital architect.",
};

export default function ServicesIndex() {
  return (
    <main className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <h1 className="max-w-[18ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          One partner. Every digital need.
        </h1>
        <p className="mt-7 max-w-[52ch] text-lead text-ink-muted">
          Supporting your digital journey from brand building to business growth —
          one connected system, not scattered tools.
        </p>

        <ol className="mt-[var(--space-section)] border-t border-hairline-ink">
          {SERVICES.map((s) => {
            const layer = LAYERS.find((l) => l.key === s.layer)!;
            return (
              <li key={s.slug} className="border-b border-hairline-ink">
                <Link href={`/services/${s.slug}`} className="grid min-h-[44px] gap-2 py-8 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)_auto] md:items-baseline md:gap-10">
                  <span className="font-display text-section font-bold tracking-[-0.02em]">{s.deckName}</span>
                  <span className="min-w-0 text-ink-muted">{s.summary}</span>
                  <span className="text-xs uppercase tracking-[0.14em] text-ink-muted">{layer.name}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `cd site && npx playwright test tests/e2e/services.spec.ts`
Expected: PASS, 18 tests.

- [ ] **Step 6: Commit**

```bash
git add site/app/services site/tests/e2e/services.spec.ts
git commit -m "feat: services index and six SEO-targeted service pages"
```

---

### Task 11: /about and /contact

**Files:**
- Modify: `site/app/about/page.tsx`
- Modify: `site/app/contact/page.tsx`
- Create: `site/tests/e2e/about-contact.spec.ts`

**Interfaces:**
- Consumes: `SITE`, `LAYERS`, `ContactBlock`.
- Produces: `/about` and `/contact`.

- [ ] **Step 1: Write the failing tests**

`site/tests/e2e/about-contact.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("about carries mission and vision and no people", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("main")).toContainText("Mission");
  await expect(page.locator("main")).toContainText("Vision");
  await expect(page.locator("main")).toContainText("Petaling Jaya");
  await expect(page.locator("main")).not.toContainText(/our team|meet the team|founder/i);
});

test("contact gives a mailto and three tel links", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  expect(await page.locator('a[href^="tel:"]').count()).toBeGreaterThanOrEqual(3);
});

test("contact has no form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("form")).toHaveCount(0);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd site && npx playwright test tests/e2e/about-contact.spec.ts --project=desktop`
Expected: FAIL — the placeholder pages carry only an `<h1>`.

- [ ] **Step 3: Write `site/app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { LAYERS } from "@/data/services";

export const metadata: Metadata = {
  title: "About",
  description:
    "TheWebxite is a Petaling Jaya digital architect, bridging the gap between traditional operations and the digital future for Malaysian SMEs.",
};

/** Mission and vision are Company Profile p3 verbatim; the positioning
 *  sentence is p2 verbatim. No team section, by client decision. */
export default function About() {
  return (
    <main className="ground-flat">
      <header className="mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[var(--space-section)]">
        <h1 className="max-w-[14ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          Your partner in digital evolution
        </h1>
        <p className="mt-8 max-w-[54ch] text-lead leading-[1.5]">
          We are a Petaling Jaya-based digital architect dedicated to bridging the gap
          between traditional operations and the digital future. We don&rsquo;t just build
          websites; we engineer custom systems and AI-driven solutions that automate your
          growth and simplify your management.
        </p>
      </header>

      <section className="mx-auto grid max-w-[84rem] gap-[var(--space-block)] border-t border-hairline-ink px-[var(--space-gutter)] py-[var(--space-section)] md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">Mission</h2>
          <p className="mt-4 font-display text-section font-bold leading-[1.08] tracking-[-0.02em]">
            Empowering Digital Growth
          </p>
          <p className="mt-4 max-w-[46ch] text-ink-muted">
            We empower SMEs with affordable, accessible, and future-ready digital solutions
            that help them attract customers, improve efficiency, and achieve sustainable growth.
          </p>
        </div>
        <div className="min-w-0">
          <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">Vision</h2>
          <p className="mt-4 font-display text-section font-bold leading-[1.08] tracking-[-0.02em]">
            Leading Digital Transformation
          </p>
          <p className="mt-4 max-w-[46ch] text-ink-muted">
            To be Malaysia&rsquo;s trusted digital transformation partner, helping businesses
            embrace technology, automation, and AI to unlock their full potential.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[84rem] border-t border-hairline-ink px-[var(--space-gutter)] py-[var(--space-section)]">
        <h2 className="max-w-[20ch] font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">
          Front to back, one connected system
        </h2>
        <ol className="mt-[var(--space-block)] border-t border-hairline-ink">
          {LAYERS.map((l, i) => (
            <li key={l.key} className="grid gap-2 border-b border-hairline-ink py-6 md:grid-cols-[4rem_minmax(0,18rem)_minmax(0,1fr)] md:gap-8">
              <span className="text-xs tabular-nums text-ink-muted">0{i + 1}</span>
              <span className="font-display text-lead font-bold">{l.name}</span>
              <span className="min-w-0 text-ink-muted">{l.gloss}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Write `site/app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { SITE } from "@/data/site";
import ContactBlock from "../components/ContactBlock";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to TheWebxite — ${SITE.email}, or call. Pusat Dagangan NZX, Petaling Jaya, Selangor.`,
};

export default function Contact() {
  return (
    <main className="ground-flat">
      <header className="mx-auto max-w-[84rem] px-[var(--space-gutter)] pt-[var(--space-section)]">
        <h1 className="max-w-[18ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          We are always ready to help you and answer your questions
        </h1>
        <p className="mt-7 max-w-[46ch] text-lead text-ink-muted">
          One thing about us: we treat and serve every client with heart. Send us a
          message and our team will reach out to you soon.
        </p>
      </header>
      <ContactBlock />
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `cd site && npx playwright test tests/e2e/about-contact.spec.ts`
Expected: PASS, 6 tests.

- [ ] **Step 6: Commit**

```bash
git add site/app/about site/app/contact site/tests/e2e/about-contact.spec.ts
git commit -m "feat: about and contact pages"
```

---

### Task 12: /news seeded with project launches

**Files:**
- Modify: `site/data/news.ts`
- Modify: `site/app/news/page.tsx`
- Create: `site/app/news/[slug]/page.tsx`
- Create: `site/tests/e2e/news.spec.ts`
- Modify: `site/tests/e2e/chrome.spec.ts`

**Interfaces:**
- Consumes: `PROJECTS`.
- Produces: `NEWS: NewsItem[]` derived from projects; routes `/news` and `/news/<slug>`; the nav gate from Task 5 now opens.

- [ ] **Step 1: Write the failing tests**

`site/tests/e2e/news.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("news index lists at least three entries", async ({ page }) => {
  await page.goto("/news");
  expect(await page.locator("article[data-news]").count()).toBeGreaterThanOrEqual(3);
});

test("each entry has a real date, not a placeholder", async ({ page }) => {
  await page.goto("/news");
  const times = page.locator("article[data-news] time");
  expect(await times.count()).toBeGreaterThanOrEqual(3);
  for (const t of await times.all()) {
    expect(await t.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});

test("a news entry links through to its project", async ({ page }) => {
  await page.goto("/news/the-knights-atelier-is-live");
  await expect(page.locator('a[href="/work/the-knights-atelier"]')).toBeVisible();
});
```

Replace the nav-gating test in `site/tests/e2e/chrome.spec.ts` with the now-open case:

```ts
test("primary nav carries the five sections in order", async ({ page }) => {
  await page.goto("/");
  const links = page.locator('nav[aria-label="Primary"] a');
  await expect(links).toHaveText(["Services", "Work", "About", "News & Events", "Contact"]);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd site && npx playwright test tests/e2e/news.spec.ts --project=desktop`
Expected: FAIL — `/news` lists nothing, `NEWS` is empty.

- [ ] **Step 3: Rewrite `site/data/news.ts`**

```ts
import { PROJECTS } from "./projects";

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  /** The project this announces, when it announces one. */
  project: string | null;
  body: string[];
};

/**
 * Seeded from project launches, which are real, dated and self-refreshing —
 * every shipped site adds one. There is no archive of written articles to
 * import: the old WordPress install held fourteen theme-demo posts about
 * machine learning and nothing else, and none of it survives.
 *
 * The nav link is gated on NEWS.length >= 3 in SiteNav, so a thin section is
 * never shown.
 */
export const NEWS: NewsItem[] = PROJECTS.map((p) => ({
  slug: `${p.slug}-is-live`,
  title: `${p.client} is live`,
  date: p.launched,
  project: p.slug,
  body: [
    `${p.client} — ${p.sector.toLowerCase()}${p.country === "NZ" ? ", in Hawke's Bay, New Zealand" : ""} — is live.`,
    ...p.observed,
  ],
}));

export const newsBySlug = (slug: string) => NEWS.find((n) => n.slug === slug);
export const NEWS_SLUGS = NEWS.map((n) => n.slug);
```

- [ ] **Step 4: Write `site/app/news/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { NEWS } from "@/data/news";

export const metadata: Metadata = {
  title: "News & Events",
  description: "What TheWebxite has shipped recently.",
};

export default function NewsIndex() {
  return (
    <main className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <h1 className="font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">News &amp; Events</h1>

        <ol className="mt-[var(--space-section)] border-t border-hairline-ink">
          {NEWS.map((n) => (
            <li key={n.slug}>
              <article data-news={n.slug} className="border-b border-hairline-ink">
                <Link href={`/news/${n.slug}`} className="grid min-h-[44px] gap-2 py-7 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-10">
                  <time dateTime={n.date} className="text-xs tabular-nums text-ink-muted">{n.date}</time>
                  <h2 className="min-w-0 font-display text-lead font-bold tracking-[-0.01em]">{n.title}</h2>
                </Link>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Write `site/app/news/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWS_SLUGS, newsBySlug } from "@/data/news";
import { projectBySlug } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return NEWS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = newsBySlug(slug);
  return n ? { title: n.title, description: n.body[0] } : {};
}

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = newsBySlug(slug);
  if (!n) notFound();
  const project = n.project ? projectBySlug(n.project) : undefined;

  return (
    <main className="ground-flat mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[var(--space-section)]">
      <Link href="/news" className="inline-flex min-h-[44px] items-center text-xs text-ink-muted hover:text-blue-mid">
        ← News &amp; Events
      </Link>
      <time dateTime={n.date} className="mt-8 block text-xs tabular-nums text-ink-muted">{n.date}</time>
      <h1 className="mt-4 max-w-[20ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">{n.title}</h1>
      <div className="mt-8 max-w-[62ch] space-y-4 text-lead leading-[1.55]">
        {n.body.map((p) => <p key={p}>{p}</p>)}
      </div>
      {project ? (
        <Link href={`/work/${project.slug}`} className="mt-10 inline-flex min-h-[44px] items-center border-b border-ink text-base hover:text-blue-mid">
          See the {project.client} page
        </Link>
      ) : null}
    </main>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `cd site && npx playwright test tests/e2e/news.spec.ts tests/e2e/chrome.spec.ts`
Expected: PASS — news 6 tests, chrome 8 tests.

- [ ] **Step 7: Commit**

```bash
git add site/data/news.ts site/app/news site/tests/e2e/news.spec.ts site/tests/e2e/chrome.spec.ts
git commit -m "feat: news section seeded from project launches"
```

---

### Task 13: Sitemap, robots and social cards

**Files:**
- Create: `site/app/sitemap.ts`
- Create: `site/app/robots.ts`
- Create: `site/app/opengraph-image.tsx`
- Create: `site/tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `PROJECT_SLUGS`, `SERVICE_SLUGS`, `NEWS_SLUGS`.
- Produces: `/sitemap.xml`, `/robots.txt`, `/opengraph-image`.

- [ ] **Step 1: Write the failing tests**

`site/tests/e2e/seo.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("sitemap lists every static route", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of [
    "/", "/services", "/work", "/about", "/news", "/contact",
    "/work/sandmerit", "/services/ai-automation-malaysia", "/news/sandmerit-is-live",
  ]) {
    expect(xml, `sitemap missing ${path}`).toContain(`thewebxite.com${path === "/" ? "" : path}`);
  }
});

test("robots allows crawling and points at the sitemap", async ({ request }) => {
  const txt = await (await request.get("/robots.txt")).text();
  expect(txt).toContain("Sitemap:");
  expect(txt).not.toMatch(/Disallow:\s*\/\s*$/m);
});

test("every page has a unique title", async ({ page }) => {
  const seen = new Set<string>();
  for (const path of ["/", "/services", "/work", "/about", "/news", "/contact", "/work/mia"]) {
    await page.goto(path);
    const t = await page.title();
    expect(t.length).toBeGreaterThan(10);
    expect(seen.has(t), `duplicate title on ${path}: ${t}`).toBe(false);
    seen.add(t);
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run: `cd site && npx playwright test tests/e2e/seo.spec.ts --project=desktop`
Expected: FAIL — `/sitemap.xml` 404s.

- [ ] **Step 3: Write `site/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { PROJECT_SLUGS } from "@/data/projects";
import { SERVICE_SLUGS } from "@/data/services";
import { NEWS_SLUGS } from "@/data/news";

const BASE = "https://thewebxite.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "", "/services", "/work", "/about", "/news", "/contact",
    ...SERVICE_SLUGS.map((s) => `/services/${s}`),
    ...PROJECT_SLUGS.map((s) => `/work/${s}`),
    ...NEWS_SLUGS.map((s) => `/news/${s}`),
  ];
  return paths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    priority: p === "" ? 1 : p.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
```

- [ ] **Step 4: Write `site/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://thewebxite.com/sitemap.xml",
  };
}
```

- [ ] **Step 5: Write `site/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TheWebxite — the tools exist, they're just not connected into one system";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: 72, background: "#0325A8", color: "#FFFFFF",
      }}>
        <div style={{ fontSize: 68, lineHeight: 1.04, letterSpacing: -2, maxWidth: 980, display: "flex" }}>
          The tools exist. They&rsquo;re just not connected into one system.
        </div>
        <div style={{ fontSize: 26, color: "#BCC7F5", display: "flex" }}>
          TheWebxite — Petaling Jaya digital architect
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `cd site && npx playwright test tests/e2e/seo.spec.ts`
Expected: PASS, 6 tests.

- [ ] **Step 7: Commit**

```bash
git add site/app/sitemap.ts site/app/robots.ts site/app/opengraph-image.tsx site/tests/e2e/seo.spec.ts
git commit -m "feat: sitemap, robots and social card"
```

---

### Task 14: Whole-site sweep

Repeats the Review Focus checks across every route, and runs the demo-content scan against rendered HTML rather than source data.

**Files:**
- Create: `site/tests/e2e/sweep.spec.ts`

**Interfaces:**
- Consumes: every route.
- Produces: no app code — a gate.

- [ ] **Step 1: Write the sweep**

`site/tests/e2e/sweep.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/", "/services", "/work", "/about", "/news", "/contact",
  "/work/the-knights-atelier", "/work/fuji-bakery",
  "/services/web-design-development-malaysia", "/news/sandmerit-is-live",
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
    for (const b of BANNED) expect(body, `${route} contains "${b}"`).not.toContain(b);
    expect(body).not.toMatch(/elevat(e|ing|ion)/);

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
```

- [ ] **Step 2: Run it**

Run: `cd site && npx playwright test tests/e2e/sweep.spec.ts`
Expected: PASS, 22 tests (11 × 2 viewports). Fix any route that fails rather than relaxing the assertion.

- [ ] **Step 3: Run the whole suite**

Run: `cd site && npm test`
Expected: all green — unit and e2e.

- [ ] **Step 4: Build clean**

Run: `cd site && npm run build && npx tsc --noEmit && npx eslint .`
Expected: build succeeds, no type errors, no lint errors.

- [ ] **Step 5: Commit**

```bash
git add site/tests/e2e/sweep.spec.ts
git commit -m "test: whole-site sweep for demo content, a11y and overflow"
```

---

## Deferred — not in this plan

These are spec open questions with no answer yet. Each has a slot; none blocks the build.

- **Written project stories.** `Project.story` is `null` for all eight. When the client supplies copy, set the field; `/work/[slug]` renders it with no layout change.
- **The seven logo-only clients** (MITC, DS, TAR UMT, CYL, Kingsman Realty, Nextloop, Lions International) — no captures exist. Decide whether they get a secondary logo row.
- **Solution-to-layer mapping** — ours, not the deck's. Flagged in `data/services.ts`.
- **Vector logo originals** — the recovered suite is 1080px raster.
- **Hero detail line** and the **"Eight clients. No house style."** headline are marked `PLACEHOLDER` pending the client's own wording.
