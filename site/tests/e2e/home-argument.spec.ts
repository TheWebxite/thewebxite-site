import { expect, test } from "@playwright/test";

/* This required the deck's strongest line — "The tools exist…" — as the h1.
   The client chose the NAME as the hero's subject instead, with the object
   directly behind it, so the h1 is now the wordmark. The assertion follows
   that decision, but still pins what it was really protecting: exactly one
   h1, and the positioning still stated in the hero rather than quietly lost
   when the sentence left. */
test("hero carries the name as its h1, with the positioning line beneath", async ({ page }) => {
  await page.goto("/");
  const h1 = page.locator("h1");
  await expect(h1).toHaveCount(1);
  await expect(h1).toHaveText("TheWebxite");

  const hero = page.locator("section").first();
  await expect(hero).toContainText("the brand, the systems, the automation");
  await expect(hero).toContainText("not four purchases");
});

test("the gap names the deck's three failures", async ({ page }) => {
  await page.goto("/");
  const gap = page.locator("#the-gap");
  for (const t of ["Digital Adoption Gap", "Manual Workflow", "Missed Growth Opportunities"]) {
    await expect(gap).toContainText(t);
  }
});

test("range stacks five captures on the home page, each with a real alt", async ({ page }) => {
  await page.goto("/");
  /* Five of the eight are featured here as a sticky stack; the full set is
     on /work/web-design, and the link beneath states the real total so the section can
     never imply the studio has only five clients. */
  const figures = page.locator("#range article[data-capture]");
  await expect(figures).toHaveCount(5);
  /* "All projects", not "All 8 projects": the studio will keep adding work
     and a hardcoded count in the link would go stale. */
  await expect(page.locator('#range a[href="/work/web-design"]')).toContainText("All projects");

  for (const slug of ["the-knights-atelier", "torii-teppanyaki", "propel-global", "sandmerit"]) {
    const img = page.locator(`#range article[data-capture="${slug}"] img`);
    await expect(img).toHaveCount(1);
    const alt = await img.getAttribute("alt");
    expect(alt && alt.length).toBeGreaterThan(20);
  }
});

test("range links each capture to its own case study", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('#range article[data-capture="sandmerit"] a').first().getAttribute("href");
  expect(href).toBe("/work/sandmerit");
});

test("engagement shows the deck's three steps", async ({ page }) => {
  await page.goto("/");
  const c = page.locator("#engagement");
  for (const t of ["Tech Consultation", "Free Demo", "Follow-up Timeline"]) {
    await expect(c).toContainText(t);
  }
});

test("4D runs on the deck's gradient ground with the client's own numerals", async ({ page }) => {
  await page.goto("/");
  const steps = page.locator("#process li[data-step-4d]");
  await expect(steps).toHaveCount(4);
  await expect(steps).toHaveText([/01\s*Discover/, /02\s*Design/, /03\s*Deliver/, /04\s*Drive/]);

  /* 4D now runs on .ground-deck — Company Profile p-04's own ground
     reproduced, roughly twice as bright as .ground-deep, which it used
     before. Assert the ground deliberately, and the condition that
     brightness depends on: EVERY line on it must be white. The muted token
     needs its background under 0.0903 luminance and this one reaches
     0.118, so a single muted line here would measure about 4.0:1. That is
     the assertion worth keeping — not merely that the root colour is
     light, which was true before and would stay true while a nested
     paragraph quietly failed. */
  /* The ground paints on ::before: a single fixed object travels this
     page between every background and its text, which is only possible
     if the background is not on the section itself. The colour it has
     to be is unchanged — see the z-index ladder in globals.css. */
  const ground = await page.locator("#process").evaluate((el) => ({
    cls: el.className,
    bg: getComputedStyle(el, "::before").backgroundColor,
    hasGradient: getComputedStyle(el, "::before").backgroundImage.includes("gradient"),
    color: getComputedStyle(el).color,
  }));
  expect(ground.cls).toContain("ground-deck");
  expect(ground.bg).toBe("rgb(1, 0, 76)");
  expect(ground.hasGradient, "the deck ground is a gradient, not a flat fill").toBe(true);
  expect(ground.color, "text on the deck ground must be the light family").toBe("rgb(255, 255, 255)");

  const muted = await page.evaluate(() => {
    const token = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-text-muted").trim();
    const n = parseInt(token.slice(1), 16);
    const want = `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
    return [...document.querySelectorAll("#process *")]
      .filter((e) => getComputedStyle(e).color === want && e.textContent?.trim()).length;
  });
  expect(muted, "the muted token cannot survive on the deck ground").toBe(0);
});

/* ---- the mark that travels the page ---- */

test("the mark is fixed, stays centred, and turns as the page scrolls", async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  const mark = page.locator("[data-pagemark]");
  test.skip((await mark.count()) === 0, `no mark in ${info.project.name}`);

  const at = () =>
    page.evaluate(() => {
      const el = document.querySelector("[data-pagemark]") as HTMLElement;
      const r = el.getBoundingClientRect();
      const c = el.querySelector("canvas") as HTMLCanvasElement;
      const s = document.createElement("canvas");
      s.width = 24;
      s.height = 24;
      s.getContext("2d")!.drawImage(c, 0, 0, 24, 24);
      return {
        centreX: Math.round(r.x + r.width / 2),
        centreY: Math.round(r.y + r.height / 2),
        fixed: getComputedStyle(el).position,
        z: getComputedStyle(el).zIndex,
      };
    });

  const top = await at();
  expect(top.fixed, "it has to be fixed or it cannot follow").toBe("fixed");
  /* Behind every word and in front of every ground: the whole mechanism
     is this number against the -3 the grounds paint at. */
  expect(top.z).toBe("-1");
  expect(Math.abs(top.centreX - 720)).toBeLessThan(4);
  expect(Math.abs(top.centreY - 450)).toBeLessThan(4);

  const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * 0.4));
  await page.waitForTimeout(900);
  const mid = await at();
  /* Still dead centre of the viewport a third of the way down a
     12,000px page — that is what "follows you" means. */
  expect(Math.abs(mid.centreX - 720)).toBeLessThan(4);
  expect(Math.abs(mid.centreY - 450)).toBeLessThan(4);
});

test("the mark holds one opacity and changes colour with the ground", async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  const mark = page.locator("[data-pagemark]");
  test.skip((await mark.count()) === 0, `no mark in ${info.project.name}`);

  const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const sample = async (fraction: number) => {
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(total * fraction));
    await page.waitForTimeout(1200);
    return page.evaluate(() => {
      const ground = document
        .elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        .find((e) => typeof e.className === "string" && /ground-\w+/.test(e.className));
      return {
        ground: ground ? (ground.className.match(/ground-\w+/) ?? ["none"])[0] : "none",
        opacity: +getComputedStyle(document.querySelector("[data-pagemark] > div")!).opacity,
      };
    });
  };

  const seen = [];
  for (const f of [0, 0.18, 0.52, 0.88]) seen.push(await sample(f));

  /* ONE opacity the whole way down. The earlier version faded the object
     out wherever text crossed it, which made it blink down the page; it
     holds its presence and changes colour instead. */
  const opacities = [...new Set(seen.map((s) => s.opacity))];
  expect(opacities, `opacity varied: ${JSON.stringify(seen)}`).toHaveLength(1);

  /* And it passes over both kinds of ground, which is the whole reason
     two tones exist — a single colour cannot read on both. */
  const grounds = seen.map((s) => s.ground);
  expect(grounds.some((g) => g === "ground-flat"), `never crossed paper: ${grounds}`).toBe(true);
  expect(
    grounds.some((g) => g === "ground-deep" || g === "ground-deck" || g === "ground-grain"),
    `never crossed a dark ground: ${grounds}`,
  ).toBe(true);
});

test("the mark is lighter than a dark ground and darker than paper", async ({ page }, info) => {
  /* This one needs the time, and the arithmetic says so: find() walks up
     to 41 scroll positions at 220ms each and runs twice, measure() settles
     1400ms and runs twice, and the page gets 2200ms to load — about 25s of
     deliberate waiting before a single pixel is read. It fitted inside the
     30s default only while scrolling was instant, which it was because
     every spec silently ran under prefers-reduced-motion and Lenis was
     never constructed. With smooth scrolling actually on, each position
     takes longer to settle, find() needs more iterations, and the same
     test tips over the default. The waits are what make the measurement
     trustworthy, so the budget moves rather than the waits.

     It forces 1440 below, so the mobile project runs an identical desktop
     measurement under a mobile label — duplicated work, logged rather
     than changed here. */
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2200);
  test.skip((await page.locator("[data-pagemark]").count()) === 0, `no mark in ${info.project.name}`);

  const sharp = (await import("sharp")).default;
  const total = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

  /* THE REFERENCE COMES FROM THE DOM, NOT FROM A SECOND PIXEL. Sampling
     "the ground beside the mark" put the probe on a dark project card
     inside the light section and reported the mark as 140 lighter than
     paper. The ground's own declared colour cannot be fooled that way. */
  const groundUnderMark = () =>
    page.evaluate(() => {
      const el = document
        .elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        .find((e) => typeof e.className === "string" && /ground-(flat|deep|deck|grain)/.test(e.className));
      if (!el) return null;
      const rgb = getComputedStyle(el, "::before").backgroundColor.match(/\d+/g);
      return { name: (el.className.match(/ground-\w+/) ?? ["?"])[0], rgb: rgb ? rgb.slice(0, 3).map(Number) : null };
    });

  /* And the scroll positions are FOUND, not guessed: this page is twelve
     thousand pixels of mixed grounds and a fraction that lands on paper
     today lands on a card tomorrow. */
  const find = async (want: (n: string) => boolean) => {
    for (let i = 0; i <= 40; i++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round((total * i) / 40));
      await page.waitForTimeout(220);
      const g = await groundUnderMark();
      if (g?.rgb && want(g.name)) return g;
    }
    return null;
  };

  const measure = async (g: { rgb: number[] | null }) => {
    await page.waitForTimeout(1400);
    const { data } = await sharp(await page.screenshot({ clip: { x: 705, y: 332, width: 30, height: 16 } }))
      .raw()
      .toBuffer({ resolveWithObject: true });
    let r = 0, gg = 0, b = 0;
    for (let i = 0; i < data.length; i += 3) { r += data[i]; gg += data[i + 1]; b += data[i + 2]; }
    const n = data.length / 3;
    return lum([r / n, gg / n, b / n]) - lum(g.rgb!);
  };

  const paper = await find((n) => n === "ground-flat");
  const dark = await find((n) => n === "ground-deep" || n === "ground-deck");
  expect(paper, "never found a paper ground under the mark").not.toBeNull();
  expect(dark, "never found a dark ground under the mark").not.toBeNull();

  expect(await measure(paper!), "on paper the mark must be DARKER than its ground").toBeLessThan(-8);
  expect(await measure(dark!), "on a dark ground it must be LIGHTER than its ground").toBeGreaterThan(8);
});
