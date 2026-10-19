# Brand Brief — TheWebxite

> Every value below is either **EXTRACTED** (stated in a client document — cite the
> source file and page) or **INFERRED** (derived from logo, industry, tone or
> convention). Mark every inferred value `[INFERRED]` followed by a one-line
> justification.
>
> The user reviews and corrects this file before anything else runs. Nothing
> downstream may proceed while an `[INFERRED]` line is unreviewed.

**Sources read:** `Company Profile.pdf` (10 pages, Aug 2026) · live site
`thewebxite.com` captured to `./current-site/` (full page 1440×5114, desktop + mobile)

**This is a self-brief.** The client is us. Anything marked `[INFERRED]` is a
guess about our own business, which means it is the cheapest thing in this
project to correct — and the most embarrassing to ship wrong.

---

## Company, industry, market

- **Company:** TheWebxite (wordmark sets as "The Webxite" over two lines in the
  logo lockup; runs as "TheWebxite" in body copy) — *Company Profile.pdf p1, p2*
- **Industry:** Digital agency — web design and development, digital marketing,
  custom systems, AI and automation. Self-described as a **"digital architect"**,
  not an agency — *p2*
- **Market / geography:** Malaysia. Based in **Petaling Jaya, Selangor** (*p2*;
  live site footer: Pusat Dagangan NZX, 47301 Petaling Jaya). Target market is
  **Malaysian SMEs** — *p3, p4*
- **Founded / size:** **Not stated anywhere.** No founding date, no headcount, no
  team page in the profile or on the live site. Three mobile numbers on the
  contact page (*p9*) implies at least three people; that is an observation, not
  a fact to publish.

## Audience

**Malaysian SME owners and directors** — the person who signs off, not a
marketing department. Typically running an established business (bakery,
manufacturing, realty, trade body, clinic — see clientele, *p8*) with a weak or
absent digital presence.

What they are deciding when they arrive:

1. **Are these people real, and have they done this before?** — the single
   biggest job of the site. An SME owner in PJ is deciding whether to hand over
   their website, their systems, and increasingly their data.
2. **Can I afford this, and what does engaging actually involve?** The profile
   answers the second question well (Tech Consultation → Free Demo → Follow-up
   Timeline, *p9*) and the first question only through logos.
3. **Is "AI" here a real capability or a sticker?** — [INFERRED] Justification:
   the profile leads on AI and automation across four pages; a 2026 SME buyer has
   been pitched AI by everyone and discounts the claim by default.

## Positioning

**Accessible-technical.** Not premium.

This is extracted, not chosen: the mission states the offer is **"affordable,
accessible, and future-ready"** (*p3*). The market is SMEs (*p3, p4*). The
clientele is local mid-market — a bakery, a realty firm, a trade centre, a
university, a Lions club (*p8*).

The *technical* half is equally stated and is the differentiator: "We don't just
build websites; we engineer custom systems and AI-driven solutions" (*p2*), a
four-layer ecosystem (*p6*), and six service lines including Business
Intelligence and Business Systems (*p5*).

**Do not let the revamp drift premium.** A dark, expensive-looking agency site
would contradict "affordable, accessible" and would misprice us in the mind of
exactly the buyer the profile targets. The site has to look *capable and
current* without looking *expensive*.

## Tone of voice

Direct, plain, benefit-first, and noticeably unafraid of short sentences.
Consistently addresses the reader as "you" and the company as "we". Avoids
jargon except where the jargon is the product (AI, automation, integrations).

Sample phrases, all the client's own — *Company Profile.pdf*:

- "Elevating Businesses Through Digital Intelligence." — *p1*
- "We don't just build websites; we engineer custom systems and AI-driven
  solutions that automate your growth and simplify your management." — *p2*
- "The tools exist. They're just not connected into one system." — *p4*
- "One Partner. Every Digital Need." — *p5*
- "See it working before you commit — a real demo built around your use case,
  not just slides and promises." — *p9*
- "Build Your Presence. Automate Your Processes. Grow With Confidence." — *p10*

**This voice is good and should survive the revamp.** "The tools exist. They're
just not connected into one system." is the strongest sentence in the deck and
is currently nowhere on the website.

## Colour

**Stated values:** none — there is no brand guidelines document, only the profile
deck.

**Sampled from `Company Profile.pdf`** (rendered at 72dpi with `pdftoppm`,
dominant-colour count per page with PIL — these are exact, not eyeballed):

| Hex | Role in the deck | Evidence |
|---|---|---|
| `#0325a8` | Primary deep blue — Mission card, "Digital Evolution", "TheWebxite" in text, footer bar | p2 1.5%, p3 26.1%, p5 16.6% |
| `#0074dd` | Secondary mid blue — Vision card, "Customer Growth", contact-page circle | p3 26.7%, p5 7.0%, p7 12.7%, p9 12.9% |
| `#8cdbff` | Light blue — "AI & Automation", "01 Discover" | p5 7.0%, p7 12.6% |
| `#000000` | Black — "Business Systems", "Business Intelligence", "04 Drive" | p5 16.4%, p7 13.0% |
| `#f3f2f0` | Off-white page ground | p2 94.9%, p8 93.3% |
| `#e3e3e3` | Grey ground — ecosystem and contact pages | p6 81.3%, p9 30.3% |
| `#999999` `#b4b4b4` `#d8d8d8` | Supporting greys | p2, p9 |

**Sampled from the live site** (`current-site/desktop.png`, quarter-scale
dominant-colour count):

| Hex | Share | Role |
|---|---|---|
| `#ffffff` | 63.6% | Page ground |
| `#2356f5` | 11.5% | The site's single blue — headings, links, footer field |
| `#f4f4f4` | 0.7% | Section tint |

**🔴 The two blues are not the same colour.** The deck is `#0325a8` (deep,
almost navy-violet); the site is `#2356f5` (bright, lighter, more saturated).
Neither is wrong, but they cannot both be the brand. **This is the first
decision of the revamp** and it blocks the token freeze.

- `#0325a8` on white → **11.45:1**, and 10.23:1 on the deck's `#f3f2f0` ground.
  Passes everything at any size. Reads institutional, serious, closer to
  IBM/Klein blue.
- `#2356f5` on white → **5.64:1**, and white-on-`#2356f5` is the same 5.64:1.
  Passes body text and passes as a footer field, but leaves no headroom for a
  lighter tint or a hover state. Reads energetic, startup — the current site's
  character.
- `#0074dd` on white → **4.62:1**. Clears the 4.5:1 floor by a hair, so it is
  safe for links and large text but should not carry small print.

**Restrictions:** none stated.

**Gradient warning.** Deck pages 1, 4, 7 and 10 are heavy blue gradient washes
with visible noise. That is *presentation* styling and should not be read as
licence for gradient backgrounds on the site — it is the exact thing you have
called out as AI-slop, and here it comes from our own deck. Treat the flat
colour blocks of p3, p5 and p9 as the brand's real surface language.
[INFERRED] Justification: gradients appear only on full-bleed title/divider
slides, never behind content; flat blocks carry every content page.

## Typography

**🔴 The deck and the site use four different typefaces between them.**

**In `Company Profile.pdf`** — embedded fonts, read with `pdffonts`, so this is
exact:

- **Open Sauce One** — Light, Regular, Medium, Bold. Carries every headline and
  nearly all body copy.
- **IBM Plex Sans** — appears on several pages alongside it.

**On the live site** — from the page's own CSS:

- **Manrope** (400/500/600/700) and **Sora** (400/500/600), both loaded from
  **Google Fonts**.

**Licence held:** yes, for all four — no Stage B blocker.

- **Open Sauce One** — SIL Open Font License, free for commercial use,
  self-hostable. Not on Google Fonts; ships from the foundry's own site.
- **IBM Plex Sans** — SIL OFL, on Google Fonts, self-hostable.
- **Manrope**, **Sora** — SIL OFL, on Google Fonts, self-hostable.

No commercial licence is at risk. The problem is not cost, it is that **the
company that sells brand consistency is running two typographic systems.**

**Recommendation:** consolidate on **Open Sauce One**, because it is the face in
the document we hand to prospects, it has the wider weight range (Light through
Bold), and its slightly quirky grotesk character does more work than Manrope's
neutrality. Self-host it — do not load Google Fonts. [INFERRED] Justification:
the deck is the more recent and more considered artefact, and it is what a
client sees before they see the site.

## Logo

- **Files provided:** **none.** No logo file was supplied — the mark exists only
  as raster inside `Company Profile.pdf` and as an image on the live site.
- The mark is a **stylised "W"** — a solid triangle/chevron form with a bar over
  it, reading as both a W and a downward arrow.
- **Lockups observed:** mark + "The / Webxite" stacked two-line wordmark (p1
  reversed on blue, p10 reversed on blue, live site header in blue); mark alone
  as a corner sign-off (p2–p9, black).
- **Clear space / minimum size rules:** none stated.
- **Mono or reversed variants available:** both are *in use* — black on light
  (p2–p9), white on blue (p1, p10). Whether master files exist for them is
  unknown.
- **🟠 Needed before build:** the vector source (SVG or AI). Extracting the mark
  from the PDF gives a raster that will not hold up at hero scale or as a
  favicon — this is the same problem we hit on PMPEMC and it costs an afternoon
  to avoid.

## Imagery direction

- **Assets provided in the deck:** none. Zero photography across ten pages — the
  entire profile is type, colour blocks and one diagram.
- **Assets on the live site:** real project photography for at least four
  portfolio pieces (Fuji Bakery product shot, Propel Global factory/robotics,
  two beauty/aesthetics clinic shots). Quality is good, licensing unknown.
- **Photography style:** [INFERRED] — no stated direction. Observed on the live
  site: literal, well-lit, client-supplied or stock, no consistent treatment
  across pieces.
- **Logos held:** 9 client marks and 6 tech-partner marks appear on *p8* as
  raster. Vector versions not supplied.
- **Gaps the revamp will need:**
  - **Team photography — there is none, and no people anywhere.** For a
    trust-led SME sale this is the largest content gap on the project.
  - Case-study imagery beyond a single hero shot per project.
  - Vector client logos, and permission to display them (see Open questions).

## Motion appetite

**Proposed: T1 baseline, with one T2 set-piece.**

**T1 everywhere** — scroll reveal, subtle parallax, considered hover states.

**One T2 moment: the Full-Stack Digital Solutions Ecosystem** (*p6*). The four
layers — Build Brand → Improve Operations → Work Smarter → Grow Faster — are a
loop with a stated argument ("every layer feeds the next"). That is a genuine
scrollytelling candidate: pin the diagram, advance one layer per scroll step.
It earns motion because the motion *is* the explanation, which is the only test
that matters.

**Why not T0:** we sell websites. The site is the portfolio. A site with no
motion undersells the capability to a buyer who is comparing us against agencies
that do move.

**Why not T3:** WebGL contradicts "affordable, accessible" (*p3*), needs assets
we do not have, and — from your own anti-slop list — a Three.js hero on an SME
agency site reads as decoration, not capability. It also breaks the one promise
we can least afford to break: that the site loads fast for an SME owner on a
phone.

## Content inventory

| Section | Real copy available? | Source |
|---|---|---|
| Hero | **Yes** — two competing lines: "Elevating Businesses Through Digital Intelligence." and "Build Your Presence. Automate Your Processes. Grow With Confidence." | PDF p1, p10 |
| About | **Yes** — full paragraph, plus Mission and Vision statements | PDF p2, p3 |
| Services / offering | **Yes, and more than the site currently shows** — 6 named solutions with descriptions, plus the 4-layer ecosystem | PDF p5, p6 |
| Proof (clients, work, testimonials, metrics) | **Partial.** 9 client logos + 6 tech partners (p8); 4+ portfolio pieces with images and client names on the live site. **No testimonials. No metrics. No case-study narrative — not one sentence about what was done or what changed.** | PDF p8, live site |
| Process | **Yes** — 4D framework (Discover / Design / Deliver / Drive) and the 3-step engagement (Tech Consultation → Free Demo → Follow-up Timeline) | PDF p7, p9 |
| People | **None.** No names, no roles, no photos, no headcount, no founding date, in either source. | — |
| Contact | **Yes** — 3 phone numbers, email, Instagram, and a street address from the live site footer | PDF p9, live site |

**Read this table before promising a section.** Two rows are the whole story of
this project: *Proof* has logos but no substance, and *People* is empty. Every
other section can be built honestly today.

## Competitors and references

**None named.** The user has not supplied competitors or reference sites for this
project, and the profile names none.

What the current site tells us about existing taste — `current-site/`:

- White ground, one strong blue, generous whitespace
- Pill-shaped nav with a dark active pill; outlined pill CTA
- **Rule-separated service list** (heading left, description right, hairline
  between) — this is the best-designed element on the current site and is
  already the anti-card pattern we favour
- Two-column portfolio grid, rounded image corners, blue project titles
- FAQ accordions
- Blue footer with an oversized cropped wordmark

**Note on the capture:** the hero area of `desktop.png` renders largely empty
below the nav, with only an "About Us" pill visible. That is most likely
scroll-triggered content that had not revealed at capture time rather than an
empty hero — **do not treat the current hero as blank without checking it in a
browser.**

## Constraints

- **Language:** English only. No second locale in the profile or on the site.
- **Accessibility:** no stated obligation. Apply the standing rule — 4.5:1 text,
  3:1 non-text, 44px targets. Relevant to the blue decision above.
- **Existing systems:** the live site is **WordPress** — WordPress and
  WooCommerce appear as tech partners (*p8*), and the site's font loading is a
  WordPress-style enqueued Google Fonts URL. **Whether the revamp stays on
  WordPress or moves to Next.js is unresolved and materially changes Stage B.**
- **Deadline:** not stated.
- **Self-interest constraint:** this site is the primary sales asset for a web
  design agency. It will be judged by prospects as a work sample. That raises
  the bar on craft and lowers tolerance for placeholder content.

## Open questions

Blocking direction:

1. **🔴 Which blue is the brand — `#0325a8` (deck) or `#2356f5` (site)?** Tokens
   cannot be frozen until this is answered. My recommendation: `#0325a8` as the
   primary, with `#0074dd` as the interactive/secondary blue and `#8cdbff` for
   accents — that is a three-step scale the deck already uses coherently, and it
   contrasts 11.45:1 on white.
2. **🔴 Which typeface — Open Sauce One (deck) or Manrope/Sora (site)?**
   Recommendation above: Open Sauce One, self-hosted.
3. **🔴 WordPress or Next.js for Stage B?** Changes the whole build, and the
   answer may be commercial rather than technical.

Blocking honest content:

4. **🟠 "Four in-house products power it" (*p6*) — what are they?** They are
   named nowhere in the deck. Four proprietary products is the single strongest
   proof point available and it is currently an unnamed claim. If they exist,
   they deserve a section. If they are aspirational, the line must not go on the
   site.
5. **🟠 Do we have written permission to display the 9 client logos?** Propel
   Global, MITC, TARUMT and Lions International are institutions. Appearing in
   our own deck is not the same as publishing on a public site.
6. **🟠 Case studies: can we write even three?** Logos alone are the weakest form
   of proof. Three short "problem → what we built → what changed" pieces on Fuji
   Bakery, Propel Global and one system build would do more for conversion than
   any visual decision in this project.
7. **🟠 Testimonials — do any exist in writing?** None found in either source.
8. **🟠 Team: do we put people on the site?** No names or photos exist anywhere
   today. For a trust-led SME sale, a founder and a small team, with faces, is
   usually worth more than another service tile.

Housekeeping:

9. **🟡 `contact@thewebxite.com` (deck p9) vs `sales@thewebxite.com` (site
   footer)** — which is canonical?
10. **🟡 Three phone numbers on the deck, one on the site.** Pick the one that
    gets answered.
11. **🟡 Service taxonomy conflict.** The deck sells **six** solutions; the site
    lists **four** services (Website Design & Development, Social Media
    Marketing, SEO, Custom System Solutions). The deck's six is the more
    ambitious and more current story — confirm it is what we actually sell
    before the site commits to it.
12. **🟡 Vector logo file** — needed before build (see Logo).
