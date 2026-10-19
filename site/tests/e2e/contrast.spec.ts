import { expect, test, type Browser } from "@playwright/test";
import sharp from "sharp";

/**
 * Guards against text that is invisible because it paints the same colour
 * as what's behind it — a failure computed-style assertions cannot see
 * (the CSS can say white-on-blue while a stray -z-10 ring paints over the
 * text's own background). This measures RENDERED PIXELS: screenshot the
 * element, decode it, and compute WCAG 2.1 contrast between the lightest
 * and darkest pixel in the crop. Min/max luminance is a crude proxy for
 * text-vs-background, but it reliably catches vanished text, which is the
 * failure mode this guards against.
 */

function srgbToLinear(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

async function minMaxLuminance(png: Buffer): Promise<{ min: number; max: number }> {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const channels = info.channels; // 4 (RGBA) after ensureAlpha
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < data.length; i += channels) {
    const l = relativeLuminance(data[i], data[i + 1], data[i + 2]);
    if (l < min) min = l;
    if (l > max) max = l;
  }
  return { min, max };
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function measureStepContrast(
  browser: Browser,
  opts: { javaScriptEnabled?: boolean; reducedMotion?: "reduce" | "no-preference" },
): Promise<number> {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: opts.javaScriptEnabled,
    reducedMotion: opts.reducedMotion,
  });
  const page = await ctx.newPage();

  if (opts.javaScriptEnabled === false) {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(500);
  } else {
    await page.goto("/", { waitUntil: "networkidle" });
  }

  const heading = page.locator('#engagement [data-step="3"] h3');
  await heading.scrollIntoViewIfNeeded();
  const png = await heading.screenshot();

  const { min, max } = await minMaxLuminance(png);
  const ratio = contrastRatio(min, max);

  await ctx.close();
  return ratio;
}

test.describe("engagement step 3 heading stays legible as rendered pixels", () => {
  test("JS enabled", async ({ browser }) => {
    const ratio = await measureStepContrast(browser, {});
    expect(ratio, `JS enabled: measured contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });

  test("JS disabled", async ({ browser }) => {
    const ratio = await measureStepContrast(browser, { javaScriptEnabled: false });
    expect(ratio, `JS disabled: measured contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });

  test("prefers-reduced-motion", async ({ browser }) => {
    const ratio = await measureStepContrast(browser, { reducedMotion: "reduce" });
    expect(ratio, `reduced motion: measured contrast ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });
});

/**
 * The services page's closing band.
 *
 * It went full bleed and changed ground to .ground-deep, and the paragraph
 * on it wears --color-text-muted — the token the deep ground's stops were
 * capped for in the first place. This measures the GROUND rather than the
 * min/max of the crop: hide the text, screenshot exactly where it sat, and
 * take the brightest pixel the gradient and grain actually produce there.
 * The paragraph sits over the gradient's brightest radial, so the worst
 * case and the measured case are the same place.
 */
test("the services closing band clears 4.5:1 for its muted paragraph", async ({ page }) => {
  await page.goto("/services", { waitUntil: "networkidle" });

  const clip = await page.evaluate(() => {
    const p = document.querySelector('section[aria-labelledby="services-cta"] p') as HTMLElement;
    p.style.visibility = "hidden";
    p.closest("section")!.scrollIntoView({ block: "center" });
    const r = p.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) };
  });
  const { max } = await minMaxLuminance(await page.screenshot({ clip }));

  /** --color-text-muted #BCC7F5. */
  const MUTED = 0.5813;
  expect(contrastRatio(MUTED, max)).toBeGreaterThanOrEqual(4.5);
});
