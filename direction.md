# Design Direction — TheWebxite

Selected from the library, not invented. Every id below traces back to a vetted
entry, so any choice can be challenged on its own terms.

**Tokens are frozen** in `tokens.css`. Changing one means re-running
`/design-direction`, which re-triggers approval.

---

## The one-sentence argument

**Commit the blue to the ground instead of keeping it in a logo and a button.**

The current site puts `#2356F5` in the wordmark, the links and the footer, and
sets everything else on white. That is the same arrangement as almost every
other agency and consultancy site, which is why they are hard to tell apart.
The profile deck already does the opposite — pages 1, 3, 4, 7 and 10 are
committed blue fields — so this direction is not a departure from the brand, it
is the deck's own logic applied to the website.

That single decision does the differentiation the layout would otherwise have to
strain for, which lets everything else stay calm and plain-spoken.

---

## Selections

| Slot | Selected | id |
|---|---|---|
| Hero archetype | Stacked statement | `stacked-statement-hero` |
| Page archetype | Sticky column narrative | `sticky-column-narrative` |
| About | Single statement | `single-statement` |
| Services + ecosystem | Sticky list / detail | `sticky-list-detail` |
| Process | Numbered steps, horizontal | `numbered-steps-horizontal` |
| Proof | Restrained logo marquee | `logo-marquee-restrained` |
| Closing CTA | Full-bleed statement | `full-bleed-statement` |
| Contact | Editorial contact block | `editorial-contact-block` |
| Typography | Modern grotesk | `modern-grotesk` |
| Palette | Client brand, structured by | `ultramarine-civic` |
| Motion | Tier 2 — one pinned column | `pinned-column` |

### Hero — `stacked-statement-hero`

Three lines at three genuinely different sizes (112 / 40 / 17px), left aligned
across eight of twelve columns, with the remaining four left empty. No image, no
second button, one text link.

Its positioning triple in the library is *direct, capable, plain-spoken* — which
is the brief's description of the brand voice almost word for word.

It is also the most content-honest hero available, and that matters here: there
is no photography, no team portrait and no product screenshot in either source.
A hero that needs an image would have forced a stock photograph into the first
screen of a web design agency's own website.

**I first selected `full-bleed-type-hero` and rejected it.** That pattern's own
rules say to avoid setting it in a face with no display cut, and it names four
typography entries that qualify — `modern-grotesk` is not among them. Open Sauce
One is a grotesk without a separate display cut, so the combination was ruled
out by the library rather than by preference.

### About — `single-statement`

One paragraph at 40–56px, alone on the screen, with the most generous padding on
the page. The copy is the client's own, unedited:

> "We don't just build websites; we engineer custom systems and AI-driven
> solutions that automate your growth and simplify your management." — *p2*

Thirty-six words, which sits inside the pattern's 30–50 word working range. This
pattern fails with generic copy; it earns its place because that sentence is
specific.

### Services and ecosystem — `sticky-list-detail`, inside `sticky-column-narrative`

**This is the page's one pinned section, and the only T2 moment.**

The left column holds the four-layer ecosystem from *p6* — Build Brand → Improve
Operations → Work Smarter → Grow Faster — and stays put. The right column scrolls
the six solutions from *p5* with their descriptions. As each solution reaches the
vertical centre, its layer lights up in the held diagram.

The motion *is* the explanation. The deck asserts "every layer feeds the next"
and then draws a static diagram; pinning the diagram while the services scroll
through it is the only way a website can actually demonstrate that claim rather
than restate it.

It also solves a real problem: "Business Systems" and "Digital Transformation"
are not self-explanatory, so the descriptions have to be present — which ruled
out `full-bleed-rule-list`, the pattern for services that need no explaining.

**One inference to confirm:** mapping each of the six solutions onto one of the
four layers is mine, not the deck's. Current mapping — Digital Presence →
Build Brand; Business Systems and Digital Transformation → Improve Operations;
AI & Automation → Work Smarter; Customer Growth and Business Intelligence →
Grow Faster.

### Process — `numbered-steps-horizontal`

The 4D framework from *p7*, as a horizontal sequence with one hairline rule
running edge to edge behind the numerals so it reads as a single process rather
than four separate items. Step widths are unequal, allocated by content length.

The numerals are the client's own (01–04 in the deck). The ruleset bans invented
numbered meta-labels like "SECTION 01"; it does not ban a sequence the client
already numbers.

### Proof — `logo-marquee-restrained`

One row, monochrome, slow continuous movement, **no heading above it**. Removing
"Trusted by leading companies" is what makes it credible.

**Currently rendered as wordmarks, not logos.** No vector client logos were
supplied — the marks exist only as raster inside the PDF. Real logos drop in
without a layout change. Nothing here is invented: every name is a real client
from *p8*.

### Closing — `full-bleed-statement`

Full viewport height on the inverted ground — the light `#F3F2F0` surface, the
one permitted inversion on the page — carrying one line and one link.

The line is the client's own offer, not filler: a real demo built around your
business, not slides and promises (*p9*).

### Contact — `editorial-contact-block`

Contact details as typography, with the email set largest because it is what
most visitors actually want. No form card, no map, no icons.

---

## Typography

**`modern-grotesk` supplies the scale and the rules; Open Sauce One supplies the
face.**

The pairing specifies Satoshi. The client's own embedded typeface wins, by the
same precedence that gives brand colour priority over a library palette — Open
Sauce One is what the profile deck is set in, so it is what a prospect sees
before they ever reach the site.

- Display 112px, Bold, leading 0.94, tracking −0.03em
- Body 17px, Regular, leading 1.65
- Three weights only — Regular, Medium, Bold — per the pairing's ceiling
- Scale ratio 112 / 14 = **8×**, past the 6× floor

**Licence: SIL OFL, no cost, no blocker.** The pitch page loads it from
Fontsource via jsDelivr (verified live). Stage B vendors the woff2 files and
self-hosts — no Google Fonts, per the brief.

This also ends the split the brief found: the deck was Open Sauce One + IBM Plex
Sans, the live site Manrope + Sora. One face now, four sources reduced to one.

## Colour

Brand values throughout. `ultramarine-civic` contributed structure only — which
role takes which value, and the accent restraint rule.

| Role | Value | Contrast |
|---|---|---|
| Canvas (page ground) | `#0325A8` | — |
| Text on canvas | `#FFFFFF` | **11.45:1** |
| Muted text on canvas | `#BCC7F5` | **6.88:1** |
| Surface (text sections, closing) | `#F3F2F0` | — |
| Ink on surface | `#071238` | **16.28:1** |
| Muted ink on surface | `#4A5578` | **6.56:1** |
| Accent | `#8CDBFF` | **7.47:1** on canvas |

**One correction, recorded as the ruleset requires.** The brief proposed
`#0074DD` as the interactive blue. Measured against the blue ground it is
**2.48:1** — nowhere near the 4.5:1 floor — so it cannot carry text, a link or a
border anywhere on the canvas. It survives in the tokens as `--color-blue-mid`,
restricted to separating the four ecosystem layers on the light surface, which
is exactly how *p6* uses it. Interactive states use white and the accent
instead.

**Accent restraint:** `#8CDBFF` appears three times on the page — the active
ecosystem layer, the hero's text link underline, and the closing link. Not once
more.

**No gradients.** The deck's blue gradient washes appear only on title and
divider slides, never behind content. Flat colour blocks carry every content
page, and flat is what the site uses. A blue gradient would drop this straight
into the SaaS register the ruleset bans — and into the AI-slop register you
named at the outset.

## Motion — tier 2

- **One pin**, on the ecosystem column. Never two; the library caps it at one per
  page and two make page length unpredictable.
- The detail column scrolls natively and is **never scrubbed**.
- Active-layer changes are instant, not faded — a transitioning highlight reads
  as lag.
- Everything else is T1: a single per-line reveal on the hero, once, and hover
  states.
- Pin disabled below 1024px and under `prefers-reduced-motion`, checked before
  the trigger is created rather than after.

---

## What was deliberately left out

Four patterns were available and rejected because the content to fill them
honestly does not exist:

- **`people-directory` / `portrait-index`** — there is not one name, role or
  face in either source. This is the biggest gap on the project and no design
  choice fixes it.
- **`quote-single-large`** — no testimonials exist in writing.
- **`metrics-typographic`** — the only number available is "1.2 million SMEs",
  which is a market statistic, not a result we produced. Presenting it as
  proof would be the fabricated-metric failure the ruleset bans.
- **`case-study-strip`** — logos exist; the story of what was built and what
  changed does not.

## Copy still needed

Marked `<!-- PLACEHOLDER -->` in `stage-a.html`:

1. **Hero detail line** — a recombination of the "Petaling Jaya digital
   architect" line (*p2*) with the connected-stack idea (*p6*). Both halves are
   the client's; the join is mine.
2. **Ecosystem layer captions** — the four layer names are the deck's; the
   one-line glosses beneath them are written in the brand voice.
3. **Client wordmarks** — real names, pending real logo files.

## Open, and worth an answer before Stage B

- **"Elevating Businesses Through Digital Intelligence."** is the deck's cover
  line (*p1*), and "Elevate" sits on the ruleset's banned-cliché list. It is not
  used in the page. If it is load-bearing for the brand, it should be reworked
  rather than reinstated — the deck's own "The tools exist. They're just not
  connected into one system." does the same job without the cliché, and now
  carries the hero.
- **Permission to publish the nine client names** (brief Q5).
- **The four in-house products** (brief Q4) — still unnamed, and the strongest
  unused proof available.
