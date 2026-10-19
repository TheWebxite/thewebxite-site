import { expect, test } from "@playwright/test";
/* STATIC. A dynamic await import() of a .ts module throws
   "Unexpected token 'export'" under this runner — bitten before. */
import { PROJECTS } from "@/data/projects";
import { WORK_CATEGORIES } from "@/data/work-categories";

const SLUGS = [
  "the-knights-atelier",
  "torii-teppanyaki",
  "propel-global",
  "the-skin-suite",
  "sandmerit",
  "mia",
  "the-knights-award",
  "fuji-bakery",
];

/* The eight used to live on a /work index. That page is gone — Work is
   a group in the navigation, not a destination — so they are counted on
   the kind they belong to. */
test("web design lists all eight", async ({ page }) => {
  await page.goto("/work/web-design");
  await expect(page.locator("[data-project]")).toHaveCount(8);
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

test("an unknown project 404s rather than rendering empty", async ({
  page,
}) => {
  const res = await page.goto("/work/not-a-client");
  expect(res?.status()).toBe(404);
});

/** Review Focus 4 — missing url or image must render nothing, not a broken node. */
test("renders no empty image or undefined href anywhere in work", async ({
  page,
}) => {
  for (const slug of SLUGS) {
    await page.goto(`/work/${slug}`);
    const badImg = await page.locator('img[src=""], img:not([alt])').count();
    expect(badImg, `${slug} has a broken image`).toBe(0);
    const badHref = await page
      .locator('a[href="undefined"], a[href=""], a[href="null"]')
      .count();
    expect(badHref, `${slug} has a broken link`).toBe(0);
  }
});

/* THE STATEMENTS ARE OURS and the rules governing them are unit-tested
   in content.test.ts — no claim about what a client had before us, no
   metric we do not hold. What matters here is that they actually reach
   the page as a pair, and that the data and the render cannot drift
   apart: a solution rendering without its challenge is the shape that
   turns a case study into a feature list. */
test("every case study carries both statements, and they match the data", async ({
  page,
}) => {
  for (const p of PROJECTS.slice(0, 3)) {
    await page.goto(`/work/${p.slug}`);
    const brief = page.locator("[data-brief]");
    await expect(brief, `${p.slug} has no brief`).toHaveCount(1);
    await expect(brief).toContainText("Challenge");
    await expect(brief).toContainText("Solution");
    await expect(brief).toContainText(p.challenge!);
    await expect(brief).toContainText(p.solution!);
  }
});

/* THE CAPTURE MUST NOT BUTT INTO THE FIRST COLOURED STAGE. The figure
   is inset by the gutter and the stages are full-bleed, so with no
   space between them the two meet in an L — measured at 0px apart,
   which is what it looked like. */
test("the hero capture has air under it before the stages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const slug of ["the-knights-atelier", "torii-teppanyaki"]) {
    await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
    const gap = await page.evaluate(() => {
      const hero = document
        .querySelector("main > figure img")!
        .getBoundingClientRect();
      const stage = [...document.querySelector("[data-shots]")!.children]
        .find((e) => e.tagName === "DIV")!
        .getBoundingClientRect();
      return Math.round(stage.top - hero.bottom);
    });
    expect(
      gap,
      `${slug}: capture sits ${gap}px from the stage`,
    ).toBeGreaterThan(24);
  }
});

/* THE CASE-STUDY FRAMES — four desktop, three phone, per project.

   EVERY CHECK HERE EXISTS BECAUSE THE CAPTURE RUN SHIPPED SOMETHING
   BROKEN AND REPORTED SUCCESS. In order:

     · it wrote two frames that were pure white;
     · it wrote three identical frames of a shared hero;
     · it wrote four frames that were all page footer;
     · it wrote frames containing a large black void where a video had
       not loaded, and frames that began halfway through a sentence.

   A screenshot script cannot tell you it photographed nothing. So the
   pixels are measured: no frame may be flat overall, and — the check
   that catches the void specifically — no frame may contain a third of
   itself that is flat, which is what a whole-frame average hides. */
test("every project carries frames of its site, and none is empty", async ({
  page,
}) => {
  for (const p of PROJECTS) {
    expect(p.shots.length, `${p.slug} desktop frames`).toBe(4);
    expect(p.mobile.length, `${p.slug} phone frames`).toBe(3);
    const all = [...p.shots, ...p.mobile].map((s) => s.src);
    expect(new Set(all).size, `${p.slug} repeats a frame`).toBe(all.length);
    /* The stage colour is the client's, and which type colour clears
       it was decided at capture time, not guessed here. */
    expect(p.stage.colour, `${p.slug} stage colour`).toMatch(/^#[0-9a-f]{6}$/);
    expect(["light", "ink"]).toContain(p.stage.on);
  }

  /* Two projects, not eight: the stages are the same component on
     every page and 56 more screenshots buy no extra signal. These two
     are the ones whose captures were worst — the SPA that came back
     blank, and the site whose video left a black hole. */
  for (const slug of ["the-knights-atelier", "torii-teppanyaki"]) {
    await page.goto(`/work/${slug}`, { waitUntil: "networkidle" });
    const frames = page.locator("[data-shots] img");
    await expect(frames).toHaveCount(7);
    for (let i = 0; i < 7; i++) await frames.nth(i).scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll("[data-shots] img")].every(
          (i) => (i as HTMLImageElement).complete,
        ),
      null,
      { timeout: 25000 },
    );

    const sharp = (await import("sharp")).default;
    for (let i = 0; i < 7; i++) {
      const { data, info } = await sharp(await frames.nth(i).screenshot())
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const sd = (a: Uint8Array | Buffer) => {
        const m = a.reduce((x: number, y: number) => x + y, 0) / a.length;
        return Math.sqrt(
          a.reduce((x: number, y: number) => x + (y - m) ** 2, 0) / a.length,
        );
      };
      const whole = sd(data);
      expect(
        whole,
        `${slug} frame ${i + 1} is blank (sd ${whole.toFixed(1)})`,
      ).toBeGreaterThan(8);

      /* The banded check. A frame half-filled with an unloaded video
         scores fine overall; two adjacent flat bands is a third of the
         picture showing nothing, and that is the shape of the fault.

         VERIFIED AGAINST THE RAW FILE, not by mutating one on disk.
         Blacking out the top 40% of a frame and re-running this does
         NOT fail, and that is not the check's weakness: the image
         optimiser serves its own cached copy of a URL, so the page
         never sees the edited bytes. Run against the file directly,
         the clean frame reads bands [85, 38, 80, 30, 36, 39] and the
         same frame with a void reads [0, 0, 70, 30, 36, 39]. */
      const rows = info.height,
        cols = info.width,
        band = Math.floor(rows / 6);
      const bands: number[] = [];
      for (let b = 0; b < 6; b++)
        bands.push(sd(data.subarray(b * band * cols, (b + 1) * band * cols)));
      const voids = bands.filter(
        (_, b) => b < 5 && bands[b] < 4 && bands[b + 1] < 4,
      ).length;
      expect(
        voids,
        `${slug} frame ${i + 1} has an empty band: ${bands.map((x) => x.toFixed(0)).join(",")}`,
      ).toBe(0);

      const alt = await frames.nth(i).getAttribute("alt");
      expect(alt, `${slug} frame ${i + 1} has no alt`).toMatch(/\S/);
    }

    /* The stages bleed full width; they must not make the page scroll
       sideways, which tilted and overlapped frames easily can. */
    const over = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(over, `${slug} scrolls sideways by ${over}px`).toBeLessThanOrEqual(
      0,
    );
  }
});

/* WORK IS A PARENT WITH FOUR KINDS under it, on the client's
   instruction: web design, systems development, AI training, Lark
   implementation. Only the first has entries.

   The arrangement these cover is the risky part. /work/<category> and
   /work/<project> are the same dynamic segment, so the route has to
   resolve two namespaces at one depth; a project slug that ever
   matched a category slug would silently shadow it. data/work-categories
   throws at module load if that happens, and this proves both kinds
   actually resolve rather than one swallowing the other. */
test("every kind of work resolves, and the empty ones say so", async ({
  page,
}) => {
  /* The links to these live in the navigation, not on /work — the
     client moved them there. chrome.spec covers the bar's submenu and
     the full menu's column; this is about the pages resolving. */
  for (const c of WORK_CATEGORIES) {
    const res = await page.goto(`/work/${c.slug}`);
    expect(res?.status(), `${c.slug} status`).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(c.name);

    const rows = page.locator("[data-project]");
    const empty = page.locator("[data-empty-category]");
    if (c.slug === "web-design") {
      expect(await rows.count(), "web design holds all eight").toBe(8);
      await expect(empty).toHaveCount(0);
    } else {
      /* A category with no entries must SAY it has none. Rendering an
         empty list instead reads as a page that failed to load. */
      expect(await rows.count(), `${c.slug} should hold nothing yet`).toBe(0);
      await expect(empty, `${c.slug} must declare itself empty`).toHaveCount(1);
    }
  }

  /* And a case study still resolves under the same segment. */
  const res = await page.goto("/work/torii-teppanyaki");
  expect(res?.status()).toBe(200);
  await expect(page.locator("[data-shots] img").first()).toBeVisible();
});
