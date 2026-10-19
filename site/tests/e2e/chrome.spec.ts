import { expect, test } from "@playwright/test";
import { WORK_CATEGORIES } from "@/data/work-categories";

/* News and Events are two sections now, each with its own gate: News
   waits for three posts and has none, Events needs only to be non-empty
   and has six. So Events appears here and News does not. */
test("primary nav hides News until there are three entries, and shows Events", async ({
  page,
}) => {
  await page.goto("/");
  /* Scoped to the HEADER. The menu overlay carries its own nav, and an
     unscoped landmark query would match both the moment it is open. */
  /* TOP-LEVEL ONLY. Work carries a submenu of its four kinds inside
     this same nav, so an unqualified `a` now matches nine links and
     this assertion is about which SECTIONS appear. data-nav-top marks
     the row itself. */
  const links = page.locator('header nav[aria-label="Primary"] [data-nav-top]');
  await expect(links).toHaveText([
    "Services",
    "Work",
    "About",
    "Events",
    "Contact",
  ]);
});

/* The four kinds of work live in the NAVIGATION, not on /work — the
   client moved them. In the bar they are a submenu under Work, opened
   by hover for a pointer and by focus for a keyboard, with no state
   and no script behind them; in the full menu they are a column of
   their own, which is the only place they appear below sm where the
   bar's links are gone. */
test("Work carries its four kinds in the bar and in the menu", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const sub = page.locator("[data-work-menu] a");
  await expect(sub).toHaveText(WORK_CATEGORIES.map((c) => c.name));

  /* THE PANEL IS MEASURED, NOT ASKED. It hides with opacity rather
     than visibility — see the note in SiteNav — and Playwright counts
     an opacity-0 element as visible, so toBeVisible() passes in both
     states and proves nothing. An earlier version of this test used
     it and failed for that reason, which is the right failure. */
  const panel = page.locator("[data-work-menu]");
  const shown = () =>
    panel.evaluate((el) => {
      const cs = getComputedStyle(el.parentElement!);
      return { opacity: Number(cs.opacity), clicks: cs.pointerEvents };
    });

  expect(await shown(), "closed on load").toEqual({
    opacity: 0,
    clicks: "none",
  });

  /* A button now, not a link: Work has no page to go to. */
  await page.getByRole("button", { name: "Work", exact: true }).first().hover();
  await expect.poll(async () => (await shown()).opacity).toBe(1);
  expect((await shown()).clicks, "a hovered panel must take clicks").toBe(
    "auto",
  );
  await expect(sub.first()).toHaveAttribute(
    "href",
    `/work/${WORK_CATEGORIES[0].slug}`,
  );

  /* And reachable without a pointer. This is the half that WAS broken:
     visibility:hidden takes an element out of the tab order, so focus
     could never land here and the panel could never open for a
     keyboard at all. */
  await page.goto("/");
  expect(await shown(), "closed again").toEqual({ opacity: 0, clicks: "none" });
  await sub.first().focus();
  await expect.poll(async () => (await shown()).opacity).toBe(1);
  expect(
    await panel.evaluate((el) => el.contains(document.activeElement)),
    "focus must land inside the panel",
  ).toBe(true);

  /* NO DEAD GAP BETWEEN THE BAR AND THE CARD. The bar is 5.5rem and
     the link inside it 2.75rem, so the card first rendered 22px below
     the header with bare page in between: the pointer left the group
     on its way to the menu and the menu shut before it arrived. The
     wrapper's top padding bridges exactly that half-difference, and
     this measures the result rather than the padding — a different
     nav height has to keep the bridge, not the number. */
  const card = await page.locator("[data-work-menu]").boundingBox();
  const header = await page.locator("header").boundingBox();
  const gap = (card?.y ?? 0) - ((header?.y ?? 0) + (header?.height ?? 0));
  expect(gap, `the menu floats ${gap}px below the bar`).toBeLessThanOrEqual(1);
  expect(
    gap,
    "the menu should not overlap the bar either",
  ).toBeGreaterThanOrEqual(-1);

  /* And the pointer can actually travel the distance without losing
     it, which is the behaviour the gap broke. */
  const work = await page
    .getByRole("button", { name: "Work", exact: true })
    .first()
    .boundingBox();
  for (
    let y = (work?.y ?? 0) + (work?.height ?? 0) / 2;
    y < (card?.y ?? 0) + 30;
    y += 6
  ) {
    await page.mouse.move((work?.x ?? 0) + (work?.width ?? 0) / 2, y);
  }
  expect((await shown()).opacity, "the menu closed on the way to it").toBe(1);

  /* The full menu lists the same four, and that is what a narrow
     screen gets. */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("[data-menu-work] a")).toHaveText(
    WORK_CATEGORIES.map((c) => c.name),
  );
});

/* THERE IS NO /work PAGE. Work names a group in the navigation and
   nothing else — its four kinds are the pages. The route must 404
   rather than quietly resolving to something, and nothing may link to
   it, which is the half that rots silently: a dead internal link
   still renders as a link. */
test("/work is not a page, and nothing links to it", async ({ page }) => {
  const res = await page.goto("/work");
  expect(res?.status(), "/work should not resolve").toBe(404);

  for (const route of [
    "/",
    "/about",
    "/services",
    "/news",
    "/contact",
    "/work/web-design",
  ]) {
    await page.goto(route);
    const dead = await page.locator('a[href="/work"]').count();
    expect(dead, `${route} still links to the removed /work`).toBe(0);
  }
});

test("every nav destination responds 200, including the gated one", async ({
  page,
}) => {
  for (const href of ["/services", "/about", "/news", "/events", "/contact"]) {
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
    if (!["127.0.0.1", "localhost"].includes(u.hostname))
      external.push(r.url());
  });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(external).toEqual([]);
});

/* ---- the bar's fill, including the paint before hydration ---- */

/** --color-canvas #0325A8, the filled bar's blue. */
const CANVAS: [number, number, number] = [3, 37, 168];

/** The bar's own pixel, read from a screenshot rather than from computed
 *  style: the whole point is what a person SEES, and before hydration the
 *  element's inline styles do not yet exist. */
async function barPixel(page: import("@playwright/test").Page) {
  /* Centre of the bar, derived from the viewport rather than hardcoded:
     x=700 was off the screen entirely in the mobile project. The centre
     is empty at every width — mark on the left, links and toggle on the
     right — and it is read without JS, so it works pre-hydration and in
     a scripting-disabled context too. */
  const vw = page.viewportSize()?.width ?? 1440;
  const png = await page.screenshot({
    clip: { x: Math.round(vw / 2) - 2, y: 20, width: 4, height: 4 },
  });
  const sharp = (await import("sharp")).default;
  const { data } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return [data[0], data[1], data[2]] as [number, number, number];
}

const isCanvas = (px: [number, number, number]) =>
  px.every((v, i) => Math.abs(v - CANVAS[i]) <= 6);

test("the bar does not flash brand blue over the hero before hydration", async ({
  page,
}) => {
  /* Hold the scripts back so the server's HTML is on screen alone. This
     is the real bug: the bar rendered filled and only corrected itself
     once the observer fired, so a slow connection got a bright blue lid
     across the hero — measured rgb(3,37,168) over a hero of
     rgb(17,44,139). */
  let hold = true;
  await page.route("**/*.js", async (route) => {
    if (hold) await new Promise((r) => setTimeout(r, 1200));
    await route.continue().catch(() => {});
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  const before = await barPixel(page);
  expect(
    isCanvas(before),
    `bar was filled brand blue pre-hydration: rgb(${before})`,
  ).toBe(false);

  hold = false;
  await page.waitForTimeout(2500);
  const after = await barPixel(page);
  expect(
    isCanvas(after),
    `bar was filled brand blue over the hero: rgb(${after})`,
  ).toBe(false);
});

test("the bar is filled on a page with no hero, and past the hero", async ({
  page,
}) => {
  await page.goto("/services", { waitUntil: "networkidle" });
  expect(isCanvas(await barPixel(page))).toBe(true);

  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollBy(0, -200)); // bring the bar back
  await page.waitForTimeout(600);
  expect(isCanvas(await barPixel(page))).toBe(true);
});

test("with scripting off the bar keeps its fill, hero or not", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  const page = await ctx.newPage();
  await page.goto("/", { waitUntil: "load" });
  /* Nothing will ever arm the bar here, and a permanently transparent one
     would put white links over the light sections below. */
  expect(isCanvas(await barPixel(page))).toBe(true);
  await ctx.close();
});

/** Navigate the way a person on this viewport would: the inline links
 *  exist from sm up, and below that they live behind the menu toggle. */
async function clientNav(page: import("@playwright/test").Page, label: string) {
  const inline = page.getByRole("link", { name: label, exact: true }).first();
  if (await inline.isVisible().catch(() => false)) {
    await inline.click();
    return;
  }
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: label, exact: true })
    .first()
    .click();
}

test("the bar re-decides on client-side navigation, not just on reload", async ({
  page,
}) => {
  /* The bar lives in the root layout and does NOT remount between
     routes, so with no dependency on the path its effects ran once, on
     whichever page was loaded first. Coming back to the home page from
     one with no hero left it filled brand blue over the hero until
     something scrolled — and a reload "fixed" it only because a reload
     is a remount. That is the bug this pins. */
  await page.goto("/", { waitUntil: "networkidle" });
  expect(isCanvas(await barPixel(page)), "fresh load of the home page").toBe(
    false,
  );

  await clientNav(page, "Services");
  await page.waitForURL("**/services");
  await page.waitForTimeout(600);
  expect(isCanvas(await barPixel(page)), "a page with no hero").toBe(true);

  await page.getByRole("link", { name: "TheWebxite" }).first().click();
  await page.waitForURL((u) => u.pathname === "/");
  await page.waitForTimeout(700);
  expect(
    isCanvas(await barPixel(page)),
    "back on the home page by client-side nav",
  ).toBe(false);

  /* This step used to click Work, which is a button with no
     destination now. /about is NOT the substitute — it has a hero of
     its own, so the bar is meant to go transparent there and the
     assertion below would be asserting the opposite. The replacement
     is the page Work's link actually became, which is hero-less and
     is the exact path that now carries that navigation. */
  /* THROUGH THE FULL MENU, at both widths, and not via clientNav.
     Two traps here, both found the hard way. clientNav tries an inline
     link first, and a CLOSED submenu link reports as visible —
     opacity-0 counts as visible to Playwright — while being
     pointer-events:none, so the click lands on nothing. And the bar's
     Work button does not exist below sm, so hovering it times out on
     the narrow project. The overlay carries the same four kinds at
     every width, which is the whole reason it does. */
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Web design", exact: true })
    .first()
    .click();
  await page.waitForURL("**/work/web-design");
  await page.waitForTimeout(600);
  expect(
    isCanvas(await barPixel(page)),
    "away again, to another hero-less page",
  ).toBe(true);

  await page.goBack();
  await page.waitForTimeout(800);
  expect(isCanvas(await barPixel(page)), "home again via browser back").toBe(
    false,
  );
});

/* ---- one left edge, everywhere ---- */

/** Every route whose main column starts with a left-aligned h1. The home
 *  page is excluded on purpose: its h1 is the centred wordmark. */
const COLUMN_ROUTES = [
  "/about",
  "/contact",
  "/work/web-design",
  "/work/fuji-bakery",
  "/services",
  "/services/ai-automation-malaysia",
  "/events",
  "/news",
];

for (const route of COLUMN_ROUTES) {
  test(`${route} shares its left edge with the header and the footer`, async ({
    page,
  }) => {
    /* Two conventions had grown side by side. `max-w-[84rem] px-gutter`
       puts the padding INSIDE the 84rem box, so past that width the text
       starts one whole gutter further in than the chrome — measured 336
       against 288 at 1920 on /about, /contact, /services and the detail
       pages, while the header, footer, home page, /work and /events sat
       at 288. Invisible until a section shared a surface with the footer
       and the mismatch had something to line up against. */
    await page.setViewportSize({ width: 1920, height: 1000 });
    await page.goto(route, { waitUntil: "networkidle" });

    const m = await page.evaluate(() => {
      const left = (el: Element | null) =>
        el ? Math.round(el.getBoundingClientRect().left) : null;
      return {
        header: left(document.querySelector("header > div")),
        footer: left(document.querySelector("footer p")),
        h1: left(document.querySelector("main h1")),
      };
    });

    expect(m.h1, `${route}: h1 against the header`).toBe(m.header);
    expect(m.h1, `${route}: h1 against the footer`).toBe(m.footer);
  });
}

/* THE PAGE HAS EXACTLY ONE SCROLLER, and that is a measured property,
   not a convention.

   `overflow-x: hidden` on body — which is what it carried — makes the
   OTHER axis compute to `auto` (CSS Overflow 3: a `visible` axis beside
   one that is neither `visible` nor `clip` becomes `auto`). That is a
   scroll container nested inside the document's own, sitting across
   every route because it lives in the root layout. It is inert only
   while body's height equals its content height; an absolutely
   positioned layer hanging below body's in-flow bottom gives it a real
   scroll range, and this layout has several at negative z-index. A
   wheel event over a nested scroller is that scroller's to consume.

   This went unseen for two reasons worth recording. The scan that
   "ruled out nested scroll containers" walked elements inside the page
   and skipped html and body — where the only real one was. And every
   spec ran with prefers-reduced-motion: reduce (headless Chromium's
   default), which makes SmoothScroll return before constructing Lenis,
   so no test had ever exercised the scrolling that visitors get. The
   config now sets no-preference explicitly; see the note there.

   Asserting overflowY is the point rather than asserting a scroll
   range: the range depends on today's layout, the computed overflow is
   the defect itself. */
for (const route of [
  "/",
  "/about",
  "/services",
  "/news",
  "/contact",
  "/events",
]) {
  test(`${route} has one scroll container, not two`, async ({ page }) => {
    await page.goto(route, { waitUntil: "load" });

    const m = await page.evaluate(() => {
      const bd = document.body;
      const s = getComputedStyle(bd);
      return {
        overflowY: s.overflowY,
        bodyScrollable: bd.scrollHeight - bd.clientHeight,
        /* Short pages must still cover the window, or the ground stops
           partway down the screen. This is what guards the min-h-screen
           that replaced min-h-full when html lost its height. */
        bodyHeight: Math.round(bd.getBoundingClientRect().height),
        viewport: window.innerHeight,
        nested: [...document.querySelectorAll("body *")].filter((el) => {
          const cs = getComputedStyle(el);
          return (
            /(auto|scroll)/.test(cs.overflowY) &&
            el.scrollHeight - el.clientHeight > 4
          );
        }).length,
      };
    });

    expect(m.overflowY, `${route}: body must not be a scroll container`).toBe(
      "visible",
    );
    expect(
      m.bodyScrollable,
      `${route}: body must have no scroll range of its own`,
    ).toBe(0);
    expect(
      m.nested,
      `${route}: no element may scroll vertically inside the page`,
    ).toBe(0);
    expect(
      m.bodyHeight,
      `${route}: body must cover the window even when the page is short`,
    ).toBeGreaterThanOrEqual(m.viewport - 1);
  });
}

/* THE PAGE BEHIND THE OPEN MENU CANNOT MOVE, under both scroll regimes.

   `body { overflow: hidden }` was the entire lock, and it does nothing
   while Lenis is running: Lenis takes the wheel, prevents the default
   and writes the scroll position from its own rAF loop, so clipping a
   box it is not scrolling changes nothing. Measured before the fix —
   the page ran on 1988px behind the open menu. It passed review and
   four manual close-path checks purely because headless Chromium
   reports prefers-reduced-motion, which stops Lenis being constructed
   at all; under `reduce` the body lock really is the whole mechanism
   and really does work. Hence both regimes here: each one covers a
   different half of the lock, and the bug lived in the half nothing
   ran. */
for (const motion of ["no-preference", "reduce"] as const) {
  test(`the page cannot scroll behind the open menu (${motion})`, async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: motion,
    });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "load" });

    /* Proves the regime is the one we think we are testing, so neither
       case can silently become a copy of the other. */
    const lenisOn = await page.evaluate(() =>
      document.documentElement.classList.contains("lenis"),
    );
    expect(
      lenisOn,
      `Lenis should be ${motion === "reduce" ? "off" : "on"}`,
    ).toBe(motion !== "reduce");

    await page.getByRole("button", { name: "Open menu" }).click();
    const before = await page.evaluate(() => window.scrollY);

    await page.mouse.move(195, 400);
    for (let i = 0; i < 10; i++) await page.mouse.wheel(0, 200);
    await page.waitForTimeout(500);

    expect(
      await page.evaluate(() => Math.round(window.scrollY)),
      "the page moved behind the open menu",
    ).toBe(Math.round(before));

    /* And the lock lets go — a lock that sticks is the worse bug. */
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(600);
    expect(
      await page.evaluate(() => window.scrollY),
      "the page did not scroll again after the menu closed",
    ).toBeGreaterThan(before + 50);

    await ctx.close();
  });
}
