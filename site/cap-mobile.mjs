/* Mobile frames for the case-study pages: three per project, 390x844,
 * chosen the same way the desktop frames were — scanned every half
 * screen, scored on the standard deviation of a greyscale thumbnail,
 * and held apart from one another so a sticky hero cannot be picked
 * three times. See data/projects.ts for why that scan exists.
 *
 * The home page only. The desktop frames walk each site's inner pages;
 * the phones are there to show the same site answering a narrow screen,
 * and three views of one page shows that better than three pages seen
 * once each.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SITES = [
  ["the-knights-atelier", "https://theknightsatelier.com"],
  ["torii-teppanyaki", "https://torii.com.my"],
  ["propel-global", "https://propelglobal.com.my"],
  ["the-skin-suite", "https://www.theskinsuite.co.nz"],
  ["sandmerit", "https://sandmerit.com"],
  ["mia", "https://mia.edu.my"],
  ["the-knights-award", "https://theknightsaward.com"],
  ["fuji-bakery", "https://fujibakery.com.my"],
];

const OUT = "public/work/shots";

const thumb = async (b) => sharp(b).greyscale().resize(48, 96, { fit: "fill" }).raw().toBuffer();
const score = (t) => {
  const m = t.reduce((a, b) => a + b, 0) / t.length;
  return Math.sqrt(t.reduce((a, b) => a + (b - m) ** 2, 0) / t.length);
};
const apart = (a, b) => {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
};

async function dismiss(page) {
  for (const role of ["button", "link"]) {
    const el = page
      .getByRole(role, { name: /^(accept|allow|agree|got it|ok|understood|close|no thanks|dismiss)/i })
      .first();
    if (await el.count().catch(() => 0)) await el.click({ timeout: 1500 }).catch(() => {});
  }
  await page
    .evaluate(() => {
      for (const el of document.querySelectorAll("body *")) {
        const s = getComputedStyle(el);
        if (s.position !== "fixed") continue;
        const r = el.getBoundingClientRect();
        if (r.width > innerWidth * 0.6 && r.height > innerHeight * 0.5) el.remove();
      }
    })
    .catch(() => {});
}

const browser = await chromium.launch();
const manifest = {};

for (const [slug, home] of SITES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await ctx.newPage();
  const out = [];
  console.error(`\n== ${slug}`);
  try {
    await page.goto(home, { waitUntil: "load", timeout: 50000 });
    await page.waitForTimeout(3500);
    await dismiss(page);

    const geom = await page.evaluate(() => {
      const f = document.querySelector("footer, [role='contentinfo'], .footer, #footer");
      return {
        h: document.documentElement.scrollHeight,
        vh: window.innerHeight,
        footerTop: f ? f.getBoundingClientRect().top + window.scrollY : null,
      };
    });
    const usable = geom.footerTop && geom.footerTop > geom.vh ? geom.footerTop : geom.h - geom.vh;

    const cands = [];
    for (let y = 0; y + geom.vh <= usable && y < geom.vh * 10; y += geom.vh * 0.5) {
      await page.evaluate((v) => window.scrollTo(0, v), Math.round(y));
      await page.waitForTimeout(800);
      const shot = await page.screenshot();
      const t = await thumb(shot);
      cands.push({ shot, t, s: score(t), y });
    }
    cands.sort((a, b) => b.s - a.s);

    const taken = [];
    for (const c of cands) {
      if (out.length >= 3) break;
      if (taken.some((t) => apart(c.t, t) < 14)) continue;
      const n = out.length + 1;
      const file = `${OUT}/${slug}-m${n}.webp`;
      const meta = await sharp(c.shot)
        .resize({ width: 780, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(file);
      out.push({ src: `/work/shots/${slug}-m${n}.webp`, width: meta.width, height: meta.height });
      taken.push(c.t);
      console.error(`   m${n} at y=${c.y} score ${c.s.toFixed(1)}`);
    }
  } catch (e) {
    console.error(`  FAILED: ${String(e).slice(0, 110)}`);
  }
  manifest[slug] = out;
  await ctx.close();
}

await browser.close();
await writeFile("cap-mobile.json", JSON.stringify(manifest, null, 2));
console.error("\nwrote cap-mobile.json");
