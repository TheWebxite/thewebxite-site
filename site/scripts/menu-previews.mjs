// Capture the first screen of each top-level page for the site-map menu's
// live preview window. Run against a running server:
//   node scripts/menu-previews.mjs http://localhost:4912
import { chromium } from 'playwright'
import sharp from 'sharp'
const base = process.argv[2] || 'http://localhost:3000'
const pages = { home: '/', work: '/work', services: '/services', about: '/about', events: '/events', contact: '/contact' }
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
const page = await ctx.newPage()
for (const [name, path] of Object.entries(pages)) {
  const r = await page.goto(base + path, { waitUntil: 'networkidle' }).catch(() => null)
  if (!r || !r.ok()) { console.log('skip', path); continue }
  await page.waitForTimeout(1800)
  const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } })
  await sharp(buf).resize(960).webp({ quality: 74 }).toFile(new URL(`../public/menu/${name}.webp`, import.meta.url).pathname)
  console.log('ok', name)
}
await browser.close()
