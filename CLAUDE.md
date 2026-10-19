# TheWebxite (TWX) — own agency website

## Overview
- TheWebxite's own site (owner: Xin). Next.js 16 + Tailwind 4 app in `site/`, built with the fe-web-design pipeline (`brand-brief.md`, `direction.md`, frozen `tokens.css`).
- Brand: deep blue `#0325A8` ground, off-white `#F3F2F0` surface, light-blue accent `#8CDBFF`, ink `#071238`; Open Sauce One (self-hosted via @fontsource); W logo mark.
- Shown locally for now (no deploy). Run: `cd site && npm run build && npm run start -- -p 4917`.
- No git repo. Backups are folder copies: `site-backup-2026-10-19/` = the site before the 2026-10-19 event pass.

## Key files
- `site/app/page.tsx` → Home (Hero, Gap, Stack, Range, ClienteleWall, Process, Circles, ContactBlock).
- `site/app/components/BlueprintMenu.tsx` + `site/app/blueprint.css` → the site-map menu (sitemap drawn live on a blueprint grid, live preview window). Node list in `site/data/menu.ts`; previews in `site/public/menu/` (recapture with `node scripts/menu-previews.mjs <url>` against a running server).
- `site/app/components/SiteNav.tsx` → bar: logo, "Start a project" CTA, Menu toggle.
- `site/app/work/page.tsx` → /work: WorkStage (featured browser + phone stage), WorkIndex (filterable index, cursor preview), ClienteleWall. Data: `site/data/portfolio.ts`. Styles: `site/app/work.css`.
- `site/app/work/[slug]/page.tsx` → case studies (data `site/data/projects.ts`, 15 projects) and the four category pages.
- `site/data/clientele.ts` + `site/app/components/ClienteleWall.tsx` → clientele wall + Vendors/Products row (Home light, Work/About/Services deep).
- `site/app/services/page.tsx`, `site/app/services/[slug]/page.tsx`, `ServiceStack.tsx`, `site/app/services.css` → services index (deck p5 colour mosaic) and premium detail template.
- `site/app/about/page.tsx` → About (ScrubText manifesto, Mission/Vision halves, wall, events).
- `site/app/events/page.tsx` + `InstagramFeed.tsx` → Events with filmstrip and "From our Instagram" (official embeds, lazy).
- `site/scripts/portfolio-images.mjs` → turns `salvage/captures-2026-10-19/<slug>/` Playwright captures into `site/public/work/index/*.webp`.
- `salvage/logos-raw-2026-10-19/` → raw logo downloads (+ `_final-check.png`).
- `qa-2026-10-19/` → screenshots of menu, work stage/index and logo walls.

## Client preferences / rules
- Keep brand tokens, Open Sauce One, logo and the home page (light touches only).
- Owner's name is Xin — never write "Yong".
- Never invent results, stats, quotes or clients. Only list clients Xin gave (2026-10-19 list in `data/clientele.ts`). Project lines are factual, written from the live site.
- Logos: real files from each brand's own site, shown monochrome; never redraw a trademark — missing ones are set as text.
- Limerick Castle Hotel (Australia): no link and no screens until its migration finishes.
- No banned/AI fonts; reduced motion respected; 375/768/1440 checked.

## Workflow notes
- Captures: `node "<skill>/scripts/screenshot.mjs" <url> <dir> --settle 4000` (sandbox off), then `node scripts/portfolio-images.mjs`.
- Layout: `node "<skill>/scripts/layout-check.mjs" <urls> --widths 375,768,1440`. Its sparse-screen metric ignores solid-colour blocks, so colour tiles read as "empty" to it; judge those by eye.
- Unit tests: `npx vitest run` (41 pass). The Playwright e2e suite predates the 2026-10-19 redesign (menu, nav links) and has not been updated.

## Open items
- Logos not found (shown as text): Newton (Newton iEstate — no site found), Kingsman (Kingsman Realty — no site), Alfameli, Daie. Possible deck-p8 crops in `salvage/logos-raw-2026-10-19/_company-profile-p8/` if Xin approves using them.
- Limerick Castle Hotel: add screenshots + link once live.
- Leister, CYL, LSL, TARUMT, WooCommerce marks are knock-out logos; shown greyscale (on a light chip over blue) rather than as a one-colour silhouette.
- e2e tests need updating for the new menu/nav; home page's own Range section still trips layout-check's empty-band warnings (pre-existing, home kept as-is).
- Decide whether to keep the old /work/<category> pages (only web-design has entries).

## Change log
- 2026-10-19 — Event pass: new blueprint site-map menu (replaces overlay; CTA in bar); new /work page (featured device stage, filterable index, 18 projects captured live) + 7 new case studies; clientele wall + vendors row on Home/Work/About/Services; About (manifesto, mission/vision halves); services index hero mosaic + premium service detail template (layer stack object, 4D blocks, work strip, p9 steps); Events filmstrip + Instagram embeds; Contact and News heroes. Backup at `site-backup-2026-10-19/`.
