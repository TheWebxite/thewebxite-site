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
