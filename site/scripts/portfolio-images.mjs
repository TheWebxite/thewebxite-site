// Turn the Playwright captures in salvage/captures-2026-10-19/<slug>/ into
// the /work index assets. Run: node scripts/portfolio-images.mjs
import sharp from 'sharp'
import { existsSync, readdirSync } from 'node:fs'
const SRC = new URL('../../salvage/captures-2026-10-19/', import.meta.url).pathname
const OUT = new URL('../public/work/index/', import.meta.url).pathname
for (const slug of readdirSync(SRC)) {
  const d = SRC + slug
  if (!existsSync(`${d}/desktop.png`) || !existsSync(`${d}/mobile.png`)) continue
  const meta = await sharp(`${d}/desktop.png`).metadata()
  await sharp(`${d}/desktop.png`).extract({ left: 0, top: 0, width: 1440, height: 900 }).resize(1280).webp({ quality: 74 }).toFile(`${OUT}${slug}.webp`)
  const h = Math.min(meta.height, 3600)
  await sharp(`${d}/desktop.png`, { limitInputPixels: false }).extract({ left: 0, top: 0, width: 1440, height: h }).resize(960).webp({ quality: 62 }).toFile(`${OUT}${slug}-scroll.webp`)
  const mm = await sharp(`${d}/mobile.png`).metadata()
  await sharp(`${d}/mobile.png`).extract({ left: 0, top: 0, width: mm.width, height: Math.min(812, mm.height) }).resize(390).webp({ quality: 76 }).toFile(`${OUT}${slug}-m.webp`)
  for (const [n, k] of [['33', 2], ['55', 3], ['78', 4]]) {
    if (existsSync(`${d}/desktop-at${n}.png`)) await sharp(`${d}/desktop-at${n}.png`).resize(1280).webp({ quality: 72 }).toFile(`${OUT}${slug}-${k}.webp`)
    if (existsSync(`${d}/mobile-at${n}.png`)) await sharp(`${d}/mobile-at${n}.png`).resize(390).webp({ quality: 74 }).toFile(`${OUT}${slug}-m${k}.webp`)
  }
  console.log('ok', slug, meta.height)
}
