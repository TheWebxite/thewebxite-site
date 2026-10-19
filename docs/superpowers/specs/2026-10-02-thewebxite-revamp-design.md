# TheWebxite Revamp — Design Spec

**Date:** 2026-10-02
**Supersedes:** `direction.md` (Stage A), `stage-a.html`
**Status:** awaiting review

---

## 1. Why this exists

thewebxite.com is down, serving a holding page. The site it replaced was a
ThemeForest AI/robotics theme whose demo content was never fully removed: the
database still carries fourteen placeholder blog posts about machine learning,
a Portfolio page containing `neuros@mail.co` and a New York address, and a
portfolio grid that illustrated each client with a stock photograph of the
client's subject matter rather than a screenshot of the site we built for them.

Stage A replaced that with a single-page pitch built from the company deck. It
was accurate and plain, and the client's assessment is that it is too simple
for a company whose product is web design.

This spec defines the replacement.

**The job of the site, in priority order:**

1. Prove the work is real and good. The brand brief identifies this as the
   single biggest decision a visitor makes: *are these people real, and have
   they done this before.*
2. Explain what TheWebxite sells, in the language SMEs search for.
3. Be, itself, a demonstration of capability. The site is the portfolio piece
   that matters most.

**Audience:** Malaysian SME owners and directors — the person who signs off,
not a marketing department.

---

## 2. Positioning, settled

| Question | Answer | Source |
|---|---|---|
| Based where | **Petaling Jaya** | Company Profile p2, live-site footer |
| What we call ourselves | **digital architect**, not an agency or a marketing firm | Company Profile p2 |
| Register | accessible-technical. **Not premium.** | brand brief; mission states "affordable, accessible, future-ready" |

The old WordPress home page described the company as *"a Kuala Lumpur-based
marketing firm"*. That is contradicted by the deck and by the registered
address, and does not survive.

**Do not drift premium.** A dark, expensive-looking agency site would
contradict the stated positioning and mis-price the company to exactly the
buyer it targets. The site must look *capable and current* without looking
*expensive*. Impressiveness comes from craft — type, motion, surface, and real
work — not from luxury signalling.

### Voice

The client's own, unedited where possible. The strongest line in the deck is:

> **"The tools exist. They're just not connected into one system."** — *p4*

It appears nowhere on the current or Stage A site. It becomes the hero.

Banned: "Elevate" and the rest of the agency-cliché register. The deck's own
cover line, *"Elevating Businesses Through Digital Intelligence"*, is not used.

---

## 3. Content inventory

### 3.1 Real and usable

**Eight clients, with captures.** Six captured live at 1440×900 @2x on
2026-10-02; two from the client's own 2025 media library.

| Client | Sector | Capture | Live URL |
|---|---|---|---|
| The Knights Atelier | luxury fragrance e-commerce | live 2026 | theknightsatelier.com |
| The Knights Award | awards / black-tie events | live 2026 | theknightsaward.com |
| Torii Teppanyaki | F&B chain | live 2026 | torii.com.my |
| Propel Global Berhad | engineering, three divisions | live 2026 + 3× 2025 | propelglobal.com.my |
| Sandmerit | B2B KPI software, 7 countries | live 2026 | sandmerit.com |
| MIA — Malaysian Institute of Art | education | live 2026 | mia.edu.my |
| Fuji Bakery | food manufacturing | live 2026 + 2025 | fujibakery.com.my |
| The Skin Suite | cosmetic clinic, **Hawke's Bay, New Zealand** | live 2026 + 2025 | theskinsuite.co.nz |

The Skin Suite is in New Zealand, not Malaysia. It is the only overseas client
in the set and it is worth saying so rather than burying it: a PJ studio
shipping for a Hawke's Bay clinic is evidence of reach, and it costs nothing
to state.

Stored in `salvage/client-sites/`. Publication permission granted
2026-10-02.

**Removed at client instruction:** VTEG (no longer a client), Vitalz, GK Germ
Killer, Studio Anise.

**Logo suite.** `salvage/logo/` — Primary, Secondary, Tertiary and Icon
lockups at 1080×1080 PNG, recovered from the WordPress media library. The
brand brief recorded "Files provided: none"; that is now wrong. Still raster;
vector originals should be requested.

**The deck**, `Company Profile.pdf`, 10 pages — mission and vision (p3), the
three-part problem (p4), six solutions (p5), the four-layer ecosystem (p6),
the 4D framework (p7), nine client logos and six tech partners (p8), the
three-step engagement and contact details (p9).

**The Knights Atelier** has a full written project record in the client's own
workspace (`the-knights-atelier/README.md`): the five-world SCENT code, 14
fragrances with real note pyramids, bespoke per-fragrance SVG flacons, a
working cart, a hash router chosen for static hosting. This is the model for
what a case study should contain.

### 3.2 Missing, and must not be invented

- **Project stories for seven of the eight clients.** `Company Profile.pdf`
  was identified as the portfolio document. It is not one. Page 8 is a logo
  wall: two headings, one sentence — *"Meet Our Clientele highlights the
  diverse brands and individuals we work with"* — and fifteen logo images with
  no accompanying text. `pdftotext` over all ten pages returns no per-project
  content of any kind. There is no brief, no scope, no outcome, no date for
  any project.

  Case studies are therefore built from **what is verifiable in the capture
  and the live site** (§5.4), not from narrative. Each page leaves a marked
  slot for a written story whenever one is supplied.
- **Team.** No names, roles or photographs, by client decision. The About page
  carries no people.
- **Testimonials.** None exist in writing.
- **Metrics.** The only figure in the deck is "1.2 million SMEs", a market
  statistic, not a result produced by TheWebxite. It may be used to frame the
  problem; it may never be presented as proof.
- **News.** Zero real articles.

### 3.3 Honesty rules

These are binding on implementation.

1. No stock photograph may illustrate a client project. If there is no
   capture, there is no image.
2. No invented metric, testimonial, team member, award or client.
3. Nothing from the old theme's demo content survives.
4. Where copy is written rather than quoted from a client source, it is
   marked `<!-- PLACEHOLDER -->` in the markup until approved.

---

## 4. Information architecture

```
/                       the argument
/services               six solutions, the ecosystem, the 4D framework
/services/[slug]        six pages, SEO-targeted
/work                   eight projects, arranged to show range
/work/[client]          eight case studies
/about                  who we are, mission and vision — no team
/news                   launches and writing (nav link gated, see 5.6)
/news/[slug]
/contact
```

Nav order: **Services · Work · About · News & Events · Contact**

No blog in the old sense, no pricing page, no careers page.

---

## 5. Pages

### 5.1 Home — the argument

The page is one sustained argument, and every section is a step in it. A
single vertical rule enters at section 2 and runs to the end, so the page
reads as one object rather than stacked bands.

| # | Section | Ground | Content |
|---|---|---|---|
| 1 | Hero | grain blue | "The tools exist. They're just not connected into one system." One text link. No image. |
| 2 | The gap | grain blue | The three failures from p4 — Digital Adoption Gap, Manual Workflow, Missed Growth Opportunities |
| 3 | The connected system | grain blue | **The pinned section.** See below. |
| 4 | Proof — range | flat surface | Eight client captures, full-bleed, one per screen |
| 5 | How we work | flat surface | The 4D sequence, horizontal, client's own numerals |
| 6 | Engagement | grain blue | The three concentric circles from p9, scroll-scaled |
| 7 | Contact | flat surface | Typography, no form card. Email set largest. |

**Section 3, the pinned section, is the centrepiece.** The four layers from p6
hold still in the left column — Build Brand → Improve Operations → Work
Smarter → Grow Faster. The six solutions from p5 scroll past in the right
column, and as each reaches the vertical centre, the layer it belongs to
lights up in the held diagram.

The deck asserts "every layer feeds the next" and then draws a static diagram.
Pinning the diagram while the services move through it is the only way a
website can demonstrate that claim rather than restate it. The motion *is* the
explanation.

Mapping of solution to layer (inferred, not from the deck — confirm):

| Solution | Layer |
|---|---|
| Digital Presence | Build Brand |
| Business Systems | Improve Operations |
| Digital Transformation | Improve Operations |
| AI & Automation | Work Smarter |
| Customer Growth | Grow Faster |
| Business Intelligence | Grow Faster |

**Section 4 is the strongest asset on the site and its framing matters.** The
eight captures are deliberately unalike: a gold-serif perfume maison, a
black-and-gold particle-horse awards site, a bright red teppanyaki brand with
a cartoon mascot, a corporate engineering group, a yellow B2B SaaS, an art
college. Most agencies ship one template in several colourways. The argument
is **range** — eight clients, no house style — and the jolt between
consecutive captures carries it. The section is not a greyscale logo marquee;
a logo says someone paid us, a screenshot says we built that.

Headline placeholder: *"Eight clients. No house style."*

### 5.2 /services and /services/[slug]

`/services` carries the six solutions, the four-layer ecosystem and the 4D
framework in full — the material the home page samples.

Six detail pages. **Naming carries both registers.** The deck's names are
positioning language; the terms Malaysian SMEs search are different, and the
old site used the second set. Each page title leads with the brand name and
contains the searched term in the H1, the slug and the meta description.

| Deck name | Page title | Slug |
|---|---|---|
| Digital Presence | Digital Presence — Web Design & Development in Malaysia | `web-design-development-malaysia` |
| Customer Growth | Customer Growth — SEO & Digital Marketing in Malaysia | `seo-digital-marketing-malaysia` |
| AI & Automation | AI & Automation — Workflow Automation for Malaysian SMEs | `ai-automation-malaysia` |
| Business Systems | Business Systems — Custom Applications & Portals | `custom-systems-malaysia` |
| Business Intelligence | Business Intelligence — Dashboards & Reporting | `business-intelligence-malaysia` |
| Digital Transformation | Digital Transformation — Technology Strategy | `digital-transformation-malaysia` |

Each page: what it is, what you get, which ecosystem layer it sits in, which
projects used it (cross-linked to `/work`), and one call to action.

### 5.3 /work

The eight projects, ordered to maximise contrast between neighbours rather
than alphabetically or chronologically — the range argument depends on the
jolt. Each entry: capture, client, sector, one line.

### 5.4 /work/[client]

One template, eight pages. Carries only what can be verified:

- the capture, large
- client, sector, live URL
- what is visibly on the site, described from the capture
- a written story **where one has been supplied**, and an explicit gap where
  one has not

The Knights Atelier page is built in full from the existing project record and
serves as the reference implementation. The other seven ship with the factual
header and a marked gap until the portfolio PDF arrives.

No invented narrative, no fabricated results, no stock imagery.

### 5.5 /about

Mission and vision from p3, the "Petaling Jaya digital architect" statement
from p2, the company's own positioning sentence, and the 4D framework.

**No team section** — client decision. An agency About page with no people is
unusual and is recorded here as a deliberate choice rather than an omission.

### 5.6 /news — "News & Events"

There is no existing content. The section is built to be seeded by **project
launches**, which are real, dated, self-refreshing, and fed by the Work
section — "The Knights Atelier is live" is genuine news.

**The nav link stays hidden until there are three or more entries.** A news
section showing one item reads as abandoned. The route, template and index all
ship; only the nav entry is gated. Nothing needs retrofitting later.

### 5.7 /contact

Contact details as typography. Email largest, because it is what most visitors
want. Three phone numbers, the PJ address, Instagram. No form card, no map, no
icon set.

---

## 6. Surface, colour and type

### 6.1 The matte treatment

The client identified the blue on deck p4 as the look to pursue. That page is
a blue gradient wash with heavy visible noise. **What makes it read as a
printed matte surface is the grain, not the gradient** — and `direction.md`
bans gradient grounds, correctly, as the SaaS register.

So: **flat `#0325A8` with a tiled SVG `feTurbulence` noise layer over it.**
Same quality, none of the register problem, a few hundred bytes, no library.

**Applied selectively, not everywhere.** Grain carries the argument sections —
on the home page that is the hero, the gap, the ecosystem and the engagement
circles (§5.1 table). Flat `#F3F2F0` carries the proof, the 4D sequence, the
contact block, and the whole of `/work` and `/services`, because a textured
ground fights a screenshot. The texture arriving and departing becomes the
page's rhythm.

### 6.2 Colour

Values unchanged from `tokens.css`. All contrast ratios previously measured
and recorded there.

| Role | Value | Contrast |
|---|---|---|
| Canvas | `#0325A8` | — |
| Text on canvas | `#FFFFFF` | 11.45:1 |
| Muted on canvas | `#BCC7F5` | 6.88:1 |
| Surface | `#F3F2F0` | — |
| Ink on surface | `#071238` | 16.28:1 |
| Muted ink | `#4A5578` | 6.56:1 |
| Accent | `#8CDBFF` | 7.47:1 on canvas |

`#0074DD` remains illustration-only — it measures 2.48:1 against the canvas
and may never carry text or a border there. Its sanctioned use is the p9
concentric circles, which are illustration on the light surface. No change
needed.

### 6.3 Typography

Open Sauce One, self-hosted via `@fontsource`, three weights (Regular, Medium,
Bold). No Google Fonts. Scale as frozen, with one amendment below.

### 6.4 Token amendment

The freeze in `tokens.css` holds except for two additions. Both are specific
and neither introduces a typeface, radius, shadow or palette colour.

1. **Grain.** A new token for the noise overlay opacity and tile size.
2. **Display step.** `--step-4` moves from a fixed `7rem` to a clamp rising to
   approximately `8.75rem` on wide viewports. The hero carries the site's
   whole argument on one line and 112px does not hold a 1920px screen.

Everything else is consumed as frozen.

---

## 7. Motion

Tier 2, as selected.

- **Exactly one pin** — the ecosystem column. The library caps it at one per
  page and two make page length unpredictable.
- The detail column scrolls natively and is **never scrubbed**.
- Active-layer changes are **instant, not faded**. A transitioning highlight
  reads as lag.
- The concentric circles and the hero lines are scroll-linked transforms and
  reveals, **not pins**. This is consistent with the one-pin rule.
- Everything else is Tier 1: one per-line hero reveal, and hover states.
- All scroll-driven behaviour is **disabled below 1024px and under
  `prefers-reduced-motion`**, checked before the trigger is created rather
  than torn down after.
- With JavaScript off, every section must still read as plain, ordered text.

---

## 8. Technical

Built on the existing `site/` app.

| Layer | Choice |
|---|---|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind 4 + `tokens.css` |
| Motion | GSAP 3 + ScrollTrigger + SplitText |
| Smooth scroll | Lenis |
| Images | `next/image` |
| Fonts | `@fontsource/open-sauce-one`, self-hosted |
| Hosting | Vercel |

GSAP including SplitText, MorphSVG and DrawSVG is free for commercial use
since Webflow's April 2025 licence change.

**No component or block library.** Not shadcn/ui, Tailark, Efferd, KokonutUI,
React Bits or spartan. A marketing site has almost no components, and
pre-made marketing blocks produce the generic look this rebuild exists to
escape. For a company that sells web design, a visitor recognising the blocks
is itself the failure. Techniques may be studied and reimplemented against
these tokens; components may not be installed.

Bklit UI was considered for charts and rejected: there is no data to chart,
and manufacturing some would breach §3.3.

---

## 9. Out of scope

- Team page, in any form
- Testimonials
- Pricing page
- Careers
- E-commerce or client portal
- CMS migration — content is authored in the repo until a CMS is justified
- Any retention of old WordPress content

---

## 10. Open questions

1. **Project stories.** No written record exists for seven of the eight
   (§3.2). Either the client supplies three or four lines per project — what
   the business needed, what was built, what changed — or the case studies
   stand on observable facts alone. Both are honest; the first is stronger.
2. **The seven logo-only clients.** Deck p8 also shows MITC, DS, TAR UMT, CYL,
   Kingsman Realty, Nextloop and Lions International. None has a capture and
   only Fuji Bakery and Propel Global overlap with the eight in §3.1. Decide
   whether they appear as a secondary logo row or are dropped.
3. **Solution-to-layer mapping** (§5.1) is inferred and needs confirming.
4. **Vector logo originals** — the recovered set is 1080px raster.
5. **Hero detail line and the "no house style" headline** are placeholders in
   the client's voice, pending approval.

---

## 11. What this spec does not decide

Implementation order, component boundaries, file layout and testing approach
belong to the implementation plan, written next.
