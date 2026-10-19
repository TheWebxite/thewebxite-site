import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { CLIENTS } from "@/data/clients";
import { INDUSTRIES } from "@/data/industries";
import { PARTNERS } from "@/data/partners";

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
  /* SCOPED TO main. Unscoped, the first /work/ link on any page is now
     the bar's Work submenu — which is closed, and below sm is not
     rendered at all — so this asserted the chrome and failed on the
     narrow project. What it is about is the PAGE pointing at real
     work. */
  await expect(page.locator('main a[href^="/work/"]').first()).toBeVisible();
});

/* ---- the solutions rail ----
   Each of these pins a bug that actually shipped into a screenshot during
   the build, not a hypothetical. */

test("the rail carries every service plus its image panels, all one size", async ({ page }) => {
  await page.goto("/services");
  const panels = page.locator('[role="region"][aria-label^="Solutions,"] li');
  await expect(panels).toHaveCount(10); // 1 title + 6 services + 3 images

  const widths = await panels.evaluateAll((els) =>
    [...new Set(els.map((e) => Math.round(e.getBoundingClientRect().width)))]
  );
  expect(widths).toHaveLength(1);
});

test("the rail's first panel starts where the heading starts", async ({ page }) => {
  await page.goto("/services");
  const h2 = await page.locator("#solutions").boundingBox();
  const first = await page.locator('[role="region"][aria-label^="Solutions,"] li').first().boundingBox();
  expect(Math.abs((first?.x ?? 0) - (h2?.x ?? 0))).toBeLessThanOrEqual(1);
});

/** Where the rail is, in px, whichever mode it is in: the transform while
 *  pinned, the track's own scrollLeft in the fallback. */
const railOffset = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const track = document.querySelector('[role="region"][aria-label^="Solutions,"]') as HTMLElement;
    const row = track.querySelector("ul") as HTMLElement;
    const m = new DOMMatrix(getComputedStyle(row).transform);
    return Math.round(-m.m41) + track.scrollLeft;
  });

test("the rail steps ONE panel per click, not the whole rail", async ({ page }) => {
  await page.goto("/services");
  const panelW =
    (await page.locator('[role="region"][aria-label^="Solutions,"] li').first().boundingBox())?.width ?? 0;
  test.skip(panelW === 0, "no rail at this size");

  const before = await railOffset(page);
  await page.getByRole("button", { name: "Next solutions" }).click();
  await page.waitForTimeout(1200);
  const after = await railOffset(page);
  /* The first cut measured the <ul>, which is as wide as the whole rail,
     and one click jumped to the end. */
  expect(after - before).toBeGreaterThan(panelW * 0.5);
  expect(after - before).toBeLessThan(panelW * 1.6);
});

test("the rail's arrows disable at each end", async ({ page }) => {
  await page.goto("/services");
  const prev = page.getByRole("button", { name: "Previous solutions" });
  const next = page.getByRole("button", { name: "Next solutions" });
  await expect(prev).toBeDisabled();

  await page.evaluate(() => {
    const track = document.querySelector('[role="region"][aria-label^="Solutions,"]') as HTMLElement;
    const sec = document.querySelector('section[aria-labelledby="solutions"]') as HTMLElement;
    const outer = sec.firstElementChild as HTMLElement;
    const pinned = getComputedStyle(outer.firstElementChild as HTMLElement).position === "sticky";
    if (pinned) window.scrollTo(0, window.scrollY + outer.getBoundingClientRect().bottom);
    else track.scrollLeft = track.scrollWidth;
  });
  await page.waitForTimeout(700);
  await expect(next).toBeDisabled();
  await expect(prev).toBeEnabled();
});

test("on desktop the page's own scroll drives the rail, 1:1, with no dead scroll", async ({ page }, info) => {
  await page.goto("/services");
  const pinned = await page.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="solutions"]') as HTMLElement;
    return getComputedStyle(sec.firstElementChild!.firstElementChild as HTMLElement).position === "sticky";
  });
  test.skip(!pinned, `not pinned in ${info.project.name}`);

  const geom = await page.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="solutions"]') as HTMLElement;
    const outer = sec.firstElementChild as HTMLElement;
    const vp = outer.firstElementChild as HTMLElement;
    const track = document.querySelector('[role="region"][aria-label^="Solutions,"]') as HTMLElement;
    return {
      span: outer.offsetHeight - vp.offsetHeight,
      travel: track.scrollWidth - track.clientWidth,
      top: window.scrollY + outer.getBoundingClientRect().top,
    };
  });
  /* The spacer claims exactly the rail's travel and not a pixel more, so
     the section ends when the last panel lands rather than holding the
     reader through empty scroll. */
  expect(Math.abs(geom.span - geom.travel)).toBeLessThanOrEqual(2);

  const half = await page.evaluate(async (g) => {
    window.scrollTo(0, g.top + g.span / 2);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const row = document.querySelector('[role="region"][aria-label^="Solutions,"] ul') as HTMLElement;
    return Math.round(-new DOMMatrix(getComputedStyle(row).transform).m41);
  }, geom);
  expect(Math.abs(half - geom.travel / 2)).toBeLessThan(8);

  const end = await page.evaluate(async (g) => {
    window.scrollTo(0, g.top + g.span);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const track = document.querySelector('[role="region"][aria-label^="Solutions,"]') as HTMLElement;
    const last = track.querySelector("ul")!.lastElementChild as HTMLElement;
    return last.getBoundingClientRect().right - track.getBoundingClientRect().right;
  }, geom);
  /* At the bottom of the pin the last panel is fully in, inside the
     trailing gutter — not still off the edge, not scrolled past. */
  expect(end).toBeLessThanOrEqual(0);
  expect(end).toBeGreaterThan(-120);
});

/**
 * The cards float on a shadow and the track that holds them CLIPS, so the
 * shadow only looks right if the track reserves room for it. It did not,
 * twice: first at all, then at 40px, which is enough for the resting
 * shadow and not for the much larger hover one — the shadow reached the
 * clip still clearly darker than the page and ended in a hard horizontal
 * line under the card.
 *
 * Measures the real thing: hover a card, screenshot the strip of track
 * between the card's bottom and the clip, and require the last few rows
 * to have faded to the page's own colour. If the clip cuts the shadow,
 * those rows are visibly darker and this fails.
 */
test("a hovered card's shadow finishes before the track clips it", async ({ page }, info) => {
  await page.goto("/services");
  const pinned = await page.evaluate(() => {
    const sec = document.querySelector('section[aria-labelledby="solutions"]') as HTMLElement;
    return getComputedStyle(sec.firstElementChild!.firstElementChild as HTMLElement).position === "sticky";
  });
  test.skip(!pinned, `rail is a swipe list in ${info.project.name}`);

  await page.evaluate(() => {
    const o = document.querySelector('section[aria-labelledby="solutions"] > div') as HTMLElement;
    window.scrollTo(0, window.scrollY + o.getBoundingClientRect().top + 40);
  });
  /* The white card: the largest step from the page's own colour, so a
     clipped shadow shows up most clearly under it. */
  await page.locator('[role="region"][aria-label^="Solutions,"] li').nth(1).hover();
  await page.waitForTimeout(500);

  const strip = await page.evaluate(() => {
    const track = document.querySelector('[role="region"][aria-label^="Solutions,"]') as HTMLElement;
    const li = track.querySelectorAll("li")[1];
    const t = track.getBoundingClientRect();
    const l = li.getBoundingClientRect();
    return { x: Math.round(l.x + l.width / 2) - 4, y: Math.round(t.bottom) - 6, width: 8, height: 5 };
  });
  const png = await page.screenshot({ clip: strip });
  const { data } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  /* --color-surface #F3F2F0, which .ground-flat paints the page with. */
  const GROUND = [243, 242, 240];
  let worst = 0;
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) worst = Math.max(worst, Math.abs(data[i + c] - GROUND[c]));
  }
  expect(worst).toBeLessThanOrEqual(3);
});

/* ---- the ecosystem diagram assembles in order ---- */

/** Each animated part's "fully on" value, keyed by WHAT IT IS rather than
 *  by its beat: 1 for an opacity, and for an arrow the fraction of its
 *  path drawn (dashoffset runs 1 -> 0).
 *
 *  Keying by identity is the point. The first version of this test read
 *  data-beat and asserted that beat N finished before beat N+1, which is
 *  true by construction — the delay IS beat x step — so it passed happily
 *  when the beats were shuffled onto the wrong elements. Verified: swap
 *  the right arrow's beat with the left arrow's and that version still
 *  went green. This one names the parts the way the deck's argument does
 *  and fails on that swap. */
const ecoState = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const loop = document.querySelector('[data-eco="loop"]')!;
    const out: Record<string, number> = {};
    for (const e of loop.querySelectorAll('[data-eco="box"]'))
      out["box:" + (e as HTMLElement).dataset.layer] = +getComputedStyle(e).opacity;
    for (const e of loop.querySelectorAll('[data-eco="arrow"]'))
      out["arrow:" + (e as HTMLElement).dataset.dir] =
        1 - parseFloat(getComputedStyle(e.querySelector("path")!).strokeDashoffset);
    out.caption = +getComputedStyle(document.querySelector('[data-eco="caption"]')!).opacity;
    return out;
  });

test("the ecosystem diagram waits, then assembles in the order the loop runs", async ({ page }, info) => {
  await page.goto("/services");
  const wide = await page.locator('[data-eco="loop"]').isVisible();
  test.skip(!wide, `the loop is a single column in ${info.project.name}`);

  /* Nothing has started: the diagram is below the fold on arrival, and
     an earlier cut watched the whole SECTION, so its heading crossing
     the fold played the entire sequence before it could be seen. */
  const atLoad = await ecoState(page);
  for (const [k, v] of Object.entries(atLoad)) expect(v, `${k} should start hidden`).toBeLessThan(0.05);

  await page.evaluate(() => document.querySelector('[data-eco="loop"]')!.scrollIntoView({ block: "center" }));

  const firstOn: Record<string, number> = {};
  const started = Date.now();
  for (let i = 0; i < 40; i++) {
    const s = await ecoState(page);
    const t = Date.now() - started;
    for (const [k, v] of Object.entries(s)) if (v >= 0.99 && firstOn[k] === undefined) firstOn[k] = t;
    if (firstOn.caption !== undefined) break;
    await page.waitForTimeout(120);
  }

  /* The deck's loop: front end, to the back end, to intelligence, to
     growth, and back round — each arrow between the two it joins. */
  const order = [
    "box:brand", "arrow:right",
    "box:ops", "arrow:down",
    "box:ai", "arrow:left",
    "box:grow", "arrow:up",
    "caption",
  ];
  for (const k of order) expect(firstOn[k], `${k} never finished`).toBeDefined();
  for (let i = 1; i < order.length; i++) {
    expect(
      firstOn[order[i]],
      `${order[i]} (${firstOn[order[i]]}ms) should not land before ${order[i - 1]} (${firstOn[order[i - 1]]}ms)`,
    ).toBeGreaterThanOrEqual(firstOn[order[i - 1]]);
  }
});

test("the ecosystem diagram is simply visible under reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/services", { waitUntil: "networkidle" });
  expect(await page.locator("[data-eco-stage]").count()).toBe(0);
  const s = await ecoState(page);
  for (const [k, v] of Object.entries(s)) expect(v, `${k} should be visible`).toBeGreaterThan(0.99);
  await ctx.close();
});

test("the services page carries the clientele as well as the partners", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  /* Shown all at once: a carousel made a reader wait for a logo, held
     two rows at different speeds, and collided with a dead `.marquee`
     rule left in the stylesheet. */
  const named = page.locator("[data-logo-grid] li img");
  const partners = page.locator('[aria-labelledby="tech-partners"] li');
  await expect(named).toHaveCount(CLIENTS.length);
  await expect(partners).toHaveCount(PARTNERS.length);

  /* The stack stays on ONE line. */
  const rows = await partners.evaluateAll((els) =>
    new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size,
  );
  expect(rows, "tech partners must be a single row").toBe(1);

  /* Logos are the information here, so every one that is announced is
     named rather than marked decorative. */
  for (const row of [named, partners.locator("img")]) {
    const alts = await row.evaluateAll((els) => (els as HTMLImageElement[]).map((i) => i.alt.trim()));
    expect(alts.filter((a) => a === "")).toEqual([]);
  }
});

test("the page says each thing once, here and against /about", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  const services = (await page.locator("main").innerText()).toLowerCase();

  /* The lead under the h1 used to repeat the ecosystem's lead verbatim,
     350px apart on the same page. */
  const lead = "supporting your digital journey";
  expect(services.split(lead).length - 1, "the p6 lead should appear once").toBe(1);

  /* p6's three statements were added here, found to repeat /about, and
     removed from this page rather than that one. /about has since
     dropped the sentence too — its "Front to back" section became
     "What sets us apart" and the copy went from describing the
     offering to describing the studio — so the sentence is now on
     NEITHER page, and the assertion is that it stays that way rather
     than drifting back onto both.

     Checking both sides matters more than it looks: asserting only
     that /services lacks it would pass trivially for a sentence
     nobody uses, and would not notice it being pasted back onto this
     page the next time someone wants a lead paragraph. */
  await page.goto("/about", { waitUntil: "networkidle" });
  const about = (await page.locator("main").innerText()).toLowerCase();
  const retired = "we cover the whole stack";
  expect(services.includes(retired), "/services should not carry it").toBe(false);
  expect(about.includes(retired), "/about dropped it with the rebuild").toBe(false);

  /* What /about says in its place is its own, and only its own. */
  const apart = "we are all four";
  expect(about.includes(apart), "/about owns its differentiator line").toBe(true);
  expect(services.includes(apart), "/services should not repeat it").toBe(false);
});

/* ---- the FAQ ---- */

test("the FAQ opens, closes and is operable from the keyboard alone", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  const items = page.locator("#faq ~ div details, section[aria-labelledby='faq'] details");
  await expect(items).toHaveCount(6);

  /* One answer is open on arrival: a column of closed rows reads as
     empty, which is the problem this section exists to solve. */
  await expect(page.locator("section[aria-labelledby='faq'] details[open]")).toHaveCount(1);

  const third = items.nth(2);
  await third.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(third).toHaveAttribute("open", "");
  /* Exclusive: opening one closes the other, via the native name= group. */
  await expect(page.locator("section[aria-labelledby='faq'] details[open]")).toHaveCount(1);

  await page.keyboard.press("Enter");
  await expect(third).not.toHaveAttribute("open", "");
});

test("the FAQ works with scripting off", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/services", { waitUntil: "load" });
  /* <details> is the one disclosure the platform ships working. */
  await expect(page.locator("section[aria-labelledby='faq'] details")).toHaveCount(6);
  await expect(page.locator("section[aria-labelledby='faq'] details[open]")).toHaveCount(1);
  await ctx.close();
});

test("the FAQ is valid markup and promises nothing we cannot support", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  /* A <dl> may only hold dt/dd; the first cut put <details> inside one. */
  expect(await page.locator("section[aria-labelledby='faq'] dl").count()).toBe(0);
  expect(await page.locator("section[aria-labelledby='faq'] summary h3").count()).toBe(6);

  /* No invented figure. Prices, durations and client counts are facts we
     do not hold, and an FAQ is exactly where a plausible-sounding one
     would slip in unnoticed. */
  const text = await page.locator("section[aria-labelledby='faq']").innerText();
  expect(text).not.toMatch(/RM\s?\d/i);
  expect(text).not.toMatch(/\$\s?\d/);
  expect(text).not.toMatch(/\b\d+\s*(?:-|–|to)?\s*\d*\s*(?:days?|weeks?|months?)\b/i);
  expect(text).not.toMatch(/\b\d{2,}\s*(?:clients?|businesses|projects?)\b/i);
});

test("industries are a general list, named from clients that exist", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  const rows = page.locator('section[aria-labelledby="industries"] li');
  await expect(rows).toHaveCount(INDUSTRIES.length);
  for (let i = 0; i < INDUSTRIES.length; i++) {
    await expect(rows.nth(i)).toContainText(INDUSTRIES[i].name);
  }

  /* NOTHING IS CLICKABLE, by instruction: the rows are plain list
     items. A row that looks like a link and is not is worse than one
     that never offered — an earlier version pointed each at a case
     study. */
  expect(await page.locator('section[aria-labelledby="industries"] a').count()).toBe(0);
  expect(await page.locator('section[aria-labelledby="industries"] button').count()).toBe(0);

  /* The photographs are stock and illustrate the industry; the row's
     own heading is the information, so they are decorative. */
  const alts = await page
    .locator('section[aria-labelledby="industries"] img')
    .evaluateAll((els) => (els as HTMLImageElement[]).map((i) => i.alt));
  expect(alts.every((a) => a === "")).toBe(true);
});

test("hovering an industry row fills it with brand blue and opens the photograph", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  const row = page.locator('section[aria-labelledby="industries"] li').nth(2);
  await row.scrollIntoViewIfNeeded();

  const read = () =>
    row.evaluate((e) => ({
      bg: getComputedStyle(e).backgroundColor,
      heading: getComputedStyle(e.querySelector("h3")!).color,
      frame: Math.round(e.querySelector("span:last-child")!.getBoundingClientRect().width),
    }));

  const before = await read();
  expect(before.bg, "transparent before hover").toBe("rgba(0, 0, 0, 0)");

  await row.hover();
  await page.waitForTimeout(600);
  const after = await read();

  /* --color-canvas #0325A8, white type. */
  expect(after.bg).toBe("rgb(3, 37, 168)");
  expect(after.heading).toBe("rgb(255, 255, 255)");
  /* The frame widens so the image opens rather than the row merely
     changing colour — from sm up only, because at phone width there is
     no room to give it and the colour carries the whole effect. */
  const wide = (page.viewportSize()?.width ?? 0) >= 640;
  if (wide) expect(after.frame).toBeGreaterThan(before.frame);
  else expect(after.frame).toBe(before.frame);
});

test("every client logo loads, and the partners fit on one line", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.locator("#clientele").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => {
    const imgs = [...document.querySelectorAll("[data-logo-grid] img")] as HTMLImageElement[];
    const partners = document.querySelector('[aria-labelledby="tech-partners"] ul')!;
    const cells = [...partners.querySelectorAll("li")];
    return {
      total: imgs.length,
      loaded: imgs.filter((i) => i.complete && i.naturalWidth > 0).length,
      partnerOverflow: partners.scrollWidth - partners.clientWidth,
      partnerRows: new Set(cells.map((e) => Math.round(e.getBoundingClientRect().top))).size,
    };
  });

  /* Every logo, loaded. The carousel this replaced was wider than the
     window by design, so lazy loading never fired for most of it —
     measured at 8 of 22, the rest sliding past as empty space. */
  expect(state.loaded, `only ${state.loaded} of ${state.total} logos loaded`).toBe(state.total);

  /* "One row" with a scrollbar is two rows with extra steps. */
  expect(state.partnerOverflow, "the partners row must not scroll").toBe(0);
  expect(state.partnerRows, "the partners must stay on one line").toBe(1);
});

test("the clientele holds still and reads as a few rows, not a wall", async ({ page }) => {
  /* Column count is responsive, so the row count only means something
     at a stated width. */
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/services", { waitUntil: "networkidle" });
  await page.locator("#clientele").scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  /* Nothing animates. The carousel this replaced inherited an animation
     from a dead `.marquee` rule left unlayered in the stylesheet — and
     unlayered CSS beats @layer whatever the specificity — so the whole
     block slid leftward forever with no reset. */
  const moving = await page.evaluate(() => {
    const scope = document.querySelector('[aria-labelledby="clientele"]')!;
    return [...scope.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.animationName !== "none" || cs.transitionProperty.includes("transform");
    }).length;
  });
  expect(moving, "nothing in the clientele grid should animate").toBe(0);

  /* Four rows at desktop, so the whole list is readable at a glance. */
  const rows = await page.evaluate(
    () =>
      new Set(
        [...document.querySelectorAll("[data-logo-grid] li")].map((e) =>
          Math.round(e.getBoundingClientRect().top),
        ),
      ).size,
  );
  expect(rows).toBeGreaterThan(2);
  expect(rows).toBeLessThan(7);
});
