import { expect, test } from "@playwright/test";
import { CLIENTS } from "@/data/clients";

test("about carries mission and vision and no people", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("main")).toContainText("Mission");
  await expect(page.locator("main")).toContainText("Vision");
  await expect(page.locator("main")).toContainText("Petaling Jaya");
  await expect(page.locator("main")).not.toContainText(
    /our team|meet the team|founder/i,
  );
});

test("contact gives a mailto and three tel links", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  expect(await page.locator('a[href^="tel:"]').count()).toBeGreaterThanOrEqual(
    3,
  );
});

/* This replaces "contact has no form", which held while there was no
   endpoint to post to. The intent behind it was never "no form" — it was
   "nothing that looks like it sends and does not". Now that there is a
   real endpoint, that intent is: any form here posts somewhere real, and
   never becomes the only way to reach anyone. */
test("contact's form posts somewhere real and never replaces the direct routes", async ({
  page,
}) => {
  await page.goto("/contact");
  const forms = page.locator("form");
  const n = await forms.count();
  for (let i = 0; i < n; i++) {
    const action = await forms.nth(i).getAttribute("action");
    expect(
      action,
      "a form with no action goes nowhere without JS",
    ).toBeTruthy();
    expect(action).toMatch(/^\//);
  }
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
  expect(await page.locator('a[href^="tel:"]').count()).toBeGreaterThanOrEqual(
    3,
  );
});

test("about closes on the deck's own last page, and still never says Elevate", async ({
  page,
}) => {
  await page.goto("/about");
  const main = page.locator("main");
  /* p10, verbatim, previously unused anywhere on the site. */
  await expect(main).toContainText(/build your presence/i);
  await expect(main).toContainText(/grow with confidence/i);
  /* p1's cover line is banned by the spec — "Elevate" and the rest of
     the agency-cliché register — and was briefly added here before the
     sweep caught it. The sweep covers every route; this one keeps the
     reason next to the page it was wrong on. */
  await expect(main).not.toContainText(/elevat/i);
});

test("about shows who they work with and where they show up", async ({
  page,
}) => {
  await page.goto("/about", { waitUntil: "networkidle" });
  /* One grid on both pages, every logo shown at once. */
  await expect(page.locator("[data-logo-grid] li")).toHaveCount(CLIENTS.length);

  const events = page.locator('section[aria-labelledby="events-about"] li');
  await expect(events).toHaveCount(4);
  /* Each one is a real photograph that goes to the full set. */
  for (let i = 0; i < 4; i++) {
    await expect(events.nth(i).locator("img")).toHaveAttribute("alt", /\S/);
    await expect(events.nth(i).locator("a")).toHaveAttribute(
      "href",
      /^\/events#/,
    );
  }
  await expect(page.getByRole("link", { name: /all events/i })).toBeVisible();
});

test("about still names no people, and invents no founding facts", async ({
  page,
}) => {
  await page.goto("/about");
  const text = await page.locator("main").innerText();
  /* The client's decision: no team section. Event photographs are not
     one — they are evidence, not a roster. */
  expect(text).not.toMatch(/our team|meet the team|founder|founded in/i);
  /* No year of founding, headcount or client tally exists to state. */
  expect(text).not.toMatch(/\bsince\s+(19|20)\d{2}\b/i);
  expect(text).not.toMatch(
    /\b\d+\+?\s*(?:clients|businesses|projects|years)\b/i,
  );
});

test("about is not a page of one surface", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/about", { waitUntil: "networkidle" });

  /* It was text on white. The complaint was fair and this is the thing
     that fixes it: distinct grounds down the page, not more words. */
  /* The grounds paint on ::before now — a single fixed object travels
     the home page between every background and its text, and that only
     works if the background is not on the section itself. See the
     z-index ladder in globals.css. */
  const grounds = await page.evaluate(() =>
    [...document.querySelectorAll("main > section")].map((s) => {
      const bg = getComputedStyle(s, "::before");
      return `${bg.backgroundColor}|${bg.backgroundImage !== "none"}|${s.querySelector("img, canvas") ? "media" : "flat"}`;
    }),
  );
  expect(
    new Set(grounds).size,
    `sections all share a surface: ${grounds}`,
  ).toBeGreaterThanOrEqual(3);

  /* The field runs here too, from the shared tuning — not a second copy
     of the shader with its own numbers. */
  expect(await page.locator("main [data-field]").count()).toBe(1);
  /* And the bar goes transparent over it, which is keyed on data-hero. */
  expect(await page.locator("main [data-hero]").count()).toBe(1);
});

test("about's closing band keeps white and muted legible over the photograph", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/about", { waitUntil: "networkidle" });

  const clip = await page.evaluate(() => {
    const h = document.querySelector("#about-close") as HTMLElement;
    h.closest("section")!.scrollIntoView({ block: "center" });
    const eyebrow = h.previousElementSibling as HTMLElement;
    [h, eyebrow].forEach((e) => (e.style.visibility = "hidden"));
    const r = h.getBoundingClientRect();
    const e = eyebrow.getBoundingClientRect();
    return {
      x: Math.round(Math.min(r.left, e.left)),
      y: Math.round(e.top),
      width: Math.round(Math.max(r.width, e.width)),
      height: Math.round(r.bottom - e.top),
    };
  });
  const sharp = (await import("sharp")).default;
  const { data } = await sharp(await page.screenshot({ clip }))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    max = Math.max(
      max,
      0.2126 * lin(data[i]) +
        0.7152 * lin(data[i + 1]) +
        0.0722 * lin(data[i + 2]),
    );
  }
  /* A photograph under type needs a scrim, and a scrim is only as good
     as its brightest pixel. --color-text-muted #BCC7F5 is 0.5813. */
  expect((0.5813 + 0.05) / (max + 0.05)).toBeGreaterThanOrEqual(4.5);
});

/* The four staggered layer cards were removed on the client's
   instruction — the stack section is now a centred column of heading,
   object, paragraph — so the test that measured their up-down offsets
   went with them. The 3D object itself survived the change and its
   three tests below did too: they are keyed on the section and the
   image, not on the grid that used to surround it. */

test("the 3D mark has no background of its own", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  /* Freeze the drift: the mark moves, and a sample taken against a
     moving box is a sample taken somewhere other than where it was
     measured. */
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about", { waitUntil: "networkidle" });
  await page.locator("#stack").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);

  /* The render came off a canvas carrying a flat alpha-16 wash over its
     whole frame, which over paper read as a grey rectangle around the
     logo. Sample the page THROUGH the image's own bottom-right corner,
     which is transparent — the top-left sits over the bar of the W, and
     a hand check before this test sampled two pixels ABOVE the box and
     so proved nothing at all. */
  const img = (await page
    .locator('section[aria-labelledby="stack"] img')
    .boundingBox())!;
  const sharp = (await import("sharp")).default;
  const read = async (clip: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const { data } = await sharp(await page.screenshot({ clip }))
      .raw()
      .toBuffer({ resolveWithObject: true });
    return [data[0], data[1], data[2]];
  };
  const inside = await read({
    x: img.x + img.width - 8,
    y: img.y + img.height - 8,
    width: 5,
    height: 5,
  });
  /* THE CONTROL IS LEVEL WITH THE SAMPLE AND JUST OUTSIDE THE IMAGE.
     It used to sit 30px above and 20px in, which was right while the
     object lived in a grid cell on flat paper — the constraint then
     was that 40px to its left landed inside the neighbouring card.
     There are no neighbouring cards now, and the ground beneath it is
     .ground-mist, which carries a soft radial. Two points that far
     apart on a gradient are genuinely different colours, and this
     comparison began failing on a five-value difference that the image
     had nothing to do with. Level and adjacent, the gradient moves by
     less than one value, so equality still means what it is here to
     mean: nothing is baked into the file. */
  const outside = await read({
    x: img.x + img.width + 8,
    y: img.y + img.height - 8,
    width: 5,
    height: 5,
  });
  expect(
    inside,
    `image corner ${inside} should match the page ${outside}`,
  ).toEqual(outside);
});

test("the 3D mark leans toward the pointer", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/about", { waitUntil: "networkidle" });
  await page.locator("#stack").scrollIntoViewIfNeeded();

  /* THIS REPLACED A DRIFT TEST. The mark was a flat render moved by a
     CSS transform, and the old check measured its bounding box
     wandering a few pixels. It is the hero's live renderer now, on the
     client's instruction, and a WebGL object turning in place does not
     move its box at all — so the box is the wrong thing to watch. */
  const canvas = page.locator('section[aria-labelledby="stack"] canvas');
  await expect(canvas).toHaveCount(1);
  await page.waitForTimeout(1200); // let the first frames land

  /* Compare the PIXELS with the pointer parked in two far-apart
     places. The lean is eased at 0.045 per frame, so it needs a moment
     to travel; a snapshot taken immediately after the move catches the
     object still on its way and reads as almost no change. */
  /* DECODED PIXELS, NOT THE ENCODED FILE. The first cut of this
     compared base64 strings, and PNG compression rescrambles the whole
     stream when any pixel moves — both comparisons came back at 0.98
     and the margin between them was noise, which is how it failed once
     on a 0.0002 difference. Mean absolute difference per channel is
     the thing those strings were standing in for. */
  const sharp = (await import("sharp")).default;
  const shoot = async () =>
    (
      await sharp(await canvas.screenshot())
        .raw()
        .toBuffer({ resolveWithObject: true })
    ).data;
  const mad = (a: Buffer, b: Buffer) => {
    const n = Math.min(a.length, b.length);
    let s = 0;
    for (let i = 0; i < n; i++) s += Math.abs(a[i] - b[i]);
    return s / n;
  };

  /* THE OBJECT ALSO TURNS UNDER A SLOW SINE OF ITS OWN, so "the image
     changed" proves nothing. The sine has to be measured and
     subtracted rather than reasoned away: pixel difference SATURATES
     once a solid turns past its own features, so the lean's tenfold
     advantage in RADIANS is nothing like tenfold in pixels. A first
     cut assumed otherwise and asked for a 3x ratio; the real one is
     about 2.6.

     Six shots on one schedule, so each pair sees the same settling and
     differs only in whether the pointer moved across it:

       L   L   R   R   L   L
         held  moved held moved held

     SETTLING IS COUNTED IN FRAMES, NOT MILLISECONDS, and that is the
     whole reason this test was flaky. The lean eases 0.045 per RENDERED
     FRAME while the sine advances per SECOND. On an unloaded machine
     500ms is sixty frames and the lean is three-quarters there; on a
     machine thrashing through an image-optimisation backlog the same
     500ms was a handful of frames, so the lean barely moved while the
     sine kept its full contribution — the ratio collapsed from 2.6 to
     1.25 and the test failed for reasons the page was not responsible
     for. Waiting on rAF makes both sides of the comparison fair at any
     frame rate. */
  const settle = async () => {
    await page.evaluate(
      () =>
        new Promise<void>((done) => {
          let n = 0;
          const tick = () => (++n < 40 ? requestAnimationFrame(tick) : done());
          requestAnimationFrame(tick);
        }),
    );
  };

  const SCHEDULE: [number, number][] = [
    [60, 1020],
    [60, 1020],
    [1380, 60],
    [1380, 60],
    [60, 1020],
    [60, 1020],
  ];
  const shots: Buffer[] = [];
  for (const [x, y] of SCHEDULE) {
    await page.mouse.move(x, y);
    await settle();
    shots.push(await shoot());
  }

  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const held = mean([
    mad(shots[0], shots[1]),
    mad(shots[2], shots[3]),
    mad(shots[4], shots[5]),
  ]);
  const moved = mean([mad(shots[1], shots[2]), mad(shots[3], shots[4])]);

  /* THE ABSOLUTE FLOOR IS THE REAL GUARD. Remove the pointer listener
     and this renderer does not merely stop leaning, it stops entirely —
     measured at 0.00, because the same flag that drops the listener
     also stops the loop. That is the regression worth catching and this
     is what catches it. */
  expect(
    moved,
    `the object never moved at all (${moved.toFixed(2)})`,
  ).toBeGreaterThan(2);
  /* The ratio is the weaker check and is deliberately set low. It
     separates a lean from a drift — 2.6 on an idle machine — but it
     compresses under load even with frame-counted settling, because a
     slower frame rate means more seconds of sine per frame of lean. It
     is here to catch a render that only drifts, not to measure the
     machine. */
  expect(
    moved / Math.max(held, 0.01),
    `moving the pointer (${moved.toFixed(2)}) should change the render more than holding it (${held.toFixed(2)})`,
  ).toBeGreaterThan(1.15);
});

test("the drift stops under prefers-reduced-motion", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto("/about", { waitUntil: "networkidle" });
  await page.locator("#stack").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const y = async () =>
    page.evaluate(
      () =>
        document
          .querySelector('section[aria-labelledby="stack"] img')!
          .getBoundingClientRect().y,
    );
  const a = await y();
  await page.waitForTimeout(1600);
  expect(Math.abs((await y()) - a)).toBe(0);
  await ctx.close();
});
