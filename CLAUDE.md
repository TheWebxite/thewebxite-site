# TheWebxite (TWX) — own agency website

## Overview
- TheWebxite's own site (owner: Xin). Next.js 16 + Tailwind 4 app in `site/`, built with the fe-web-design pipeline (`brand-brief.md`, `direction.md`, frozen `tokens.css`).
- Brand: deep blue `#0325A8` ground, off-white `#F3F2F0` surface, light-blue accent `#8CDBFF`, ink `#071238`; Open Sauce One (self-hosted via @fontsource); W logo mark.
- Repo (public): https://github.com/TheWebxite/thewebxite-site (repo root = this folder; git identity `TheWebxite <thewebxite.ai@gmail.com>`).
- Vercel: project `thewebxite-site` (team thewebxiteai-6218s-projects), Root Directory `site`, every push to `main` deploys to production at https://thewebxite-site.vercel.app. The live thewebxite.com stays on the separate `thewebxite-revamp` project; don't move the domain unless Xin asks.
- LIVE site code is a separate repo: TheWebxite/thewebxite-revamp (private), local clone `~/Desktop/thewebxite-revamp` (same `site/` layout). Pushing its `main` deploys thewebxite.com (Vercel project thewebxite-revamp). This folder (`TW-Website`) is the event-pass version on thewebxite-site.vercel.app; pieces are ported into the live repo on request.
- Local run: `cd site && npm run build && npm run start -- -p 4917`.
- Not in the repo (see root `.gitignore`): qa*/, salvage/, site-backup-*/, .pdfpages/, current-site/, events/ (raw photos), *.pdf (Company Profile), *.xml (WordPress export), .env* except .env.example. Backup before the event pass: `site-backup-2026-10-19/`.

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
- Live menu: keep the existing layout; hover previews of each page sit in the empty space beside the links (2026-10-20).
- Clientele wall shows logos in each brand's own colours (not monochrome). Manifesto + Mission/Vision belong on About. On About, the section after the wall stays the live one. Range project cards must stay big.
- Keep brand tokens, Open Sauce One, logo and the home page (light touches only).
- Owner's name is Xin — never write "Yong".
- Never invent results, stats, quotes or clients. Only list clients Xin gave (2026-10-19 list in `data/clientele.ts`). Project lines are factual, written from the live site.
- Logos: real files from each brand's own site, shown monochrome; never redraw a trademark — missing ones are set as text.
- Limerick Castle Hotel (Australia): no link and no screens until its migration finishes.
- No banned/AI fonts; reduced motion respected; 375/768/1440 checked.

## Workflow notes
- Team edits: push to `main` (or open a PR) on GitHub and Vercel redeploys. Teammates need to be added as collaborators on the repo (Settings → Collaborators) to push.
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
- 2026-10-20 — LIVE fix-ups (ff7cc60): manifesto + Mission/Vision moved to About, colour clientele wall on About too; Range cards back to full size; Home added to the full menu.
- 2026-10-20 — LIVE (thewebxite-revamp e15c39e): menu hover page previews + stagger; home gets colour clientele/vendors wall, "One thing about us" manifesto and Mission/Vision halves; Range tab no longer overlaps the sub-line; first-visit preloader.
- 2026-10-19 — Fixed .gitignore (folder rules now root-anchored) so /events page + photos are in the repo.
- 2026-10-19 — Put on GitHub (public, TheWebxite/thewebxite-site) and Vercel (project thewebxite-site, root site/, auto-deploy from main); secrets scan clean, raw/working folders excluded.
- 2026-10-19 — Event pass: new blueprint site-map menu (replaces overlay; CTA in bar); new /work page (featured device stage, filterable index, 18 projects captured live) + 7 new case studies; clientele wall + vendors row on Home/Work/About/Services; About (manifesto, mission/vision halves); services index hero mosaic + premium service detail template (layer stack object, 4D blocks, work strip, p9 steps); Events filmstrip + Instagram embeds; Contact and News heroes. Backup at `site-backup-2026-10-19/`.
