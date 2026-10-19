# Follow-ups after the revamp build

From the final whole-branch review, 2026-10-02. Everything Critical and every
Important the reviewer required before merge has been fixed. These are what it
flagged and we consciously did not do.

Ordered by how much they matter.

---

## 1. BLOCKER before the site goes live — which contact email is correct?

`site/data/site.ts` ships `sales@thewebxite.com`. The sources disagree:

| Source | Address |
|---|---|
| `Company Profile.pdf` p9 — June 2026, the deck handed to prospects | `contact@thewebxite.com` |
| Old WordPress site | `sales@` (13 uses), `info@` (4 uses) |
| Current holding page | obfuscated, unreadable |

Kept `sales@` because it is what the live site actually published and it
survived review. **Nobody but the owner can resolve this**, and the contact
page's email is the site's primary call to action — the wrong mailbox means
every enquiry is lost silently. One line to change.

## 2. The favicon is still Create Next App's default

`site/app/favicon.ico` is byte-identical to the Next.js scaffold default
(md5 `c30c7d42…`). On a web studio's own website that is the kind of detail a
prospective client notices.

The recovered brand assets in `salvage/logo/` include Icon lockups at
1080×1080 which would make a good source. Choosing which lockup and how to
crop it is a design decision for the owner, which is why it was not done
unasked.

Also still present from the scaffold: five unreferenced SVGs in
`site/public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`,
`window.svg`), and `site/README.md` is boilerplate that claims the project
uses Geist. It uses Open Sauce One.

## 3. Instagram is in the data but on no page

`SITE.instagram` (`@thewebxite`) is dead data — the contact page never renders
it, though the spec's §5.7 lists it. Either surface it or drop the field.

## 4. `Stack.tsx` forks the services data

`site/app/components/Stack.tsx` declares its own `LAYERS` and `SOLUTIONS`
arrays that duplicate `site/data/services.ts`. They are identical today and
will drift. Relatedly, the six solutions on the home page link nowhere — each
could link to its `/services/<slug>` page, which exists.

## 5. Smaller things, none urgent

- `globals.css` — the grain data URI uses the non-standard `;utf8` charset
  token rather than `;charset=utf-8`. Renders correctly in all three engines.
- `Circles.tsx` — a comment still explains why `#0074DD` is used there. It is
  no longer used anywhere on the site; the comment is now false.
- `Circles.tsx` — `rounded-full/none` is not a valid Tailwind class and does
  nothing.
- Roughly 75 lines of dead CSS in `globals.css`: marquee rules left by the
  deleted `ClientMarquee` component, and `.steps` mobile rules never wired to
  `Process.tsx`.
- `data-layer` is used as two different interfaces — a layer key in
  `Stack.tsx`, a descriptive block on the service pages.
- The sitemap's priority heuristic keys off path-segment count. Correct for
  today's routes, implicit if route depth ever changes.
- `NewsItem` has no `project` field, so a news entry cannot link to a work
  page until whoever writes the first entry adds one.
- `playwright.config.ts` uses `reuseExistingServer` outside CI. A stale
  orphaned server on port 3100 will serve an outdated build and cause
  confusing, spurious failures. Worth hardening.

---

## Content that would materially improve the site

None of this blocks anything; all of it has a slot waiting.

1. ~~**Project stories.**~~ Written 2026-10-09, by us, at the client's
   instruction — they declined to supply them. `Project.challenge` and
   `Project.solution` now carry a pair of statements per project and
   render as a Challenge / Solution block at the head of each case
   study.

   **They are still worth replacing with the client's own account**, and
   that is the open item. What we wrote is bounded by what a capture can
   support: every `challenge` describes the job the site has to do, and
   every `solution` restates facts from `observed`. None of it says what
   the client had before us, or what changed afterwards — a capture of a
   site as it stands cannot know either, and both would be false
   statements about a named company whenever they were wrong. Two unit
   tests enforce exactly that, and a third forbids any metric.

   The client can say what we cannot: what the business could not do
   before, what the engagement cost or saved, what moved afterwards.
   Those sentences replace ours line for line.

2. **Which services each project used.** We hold no mapping, so each service
   page's "Recent work" block has to state explicitly that it is a sample
   rather than a list of projects that used that service. With the mapping it
   becomes real evidence.
3. **Vector logo originals.** The recovered suite is 1080px raster.
4. **The seven logo-only clients** — MITC, DS, TAR UMT, CYL, Kingsman Realty,
   Nextloop, Lions International appear on deck p8 but have no captures.
   Decide whether they get a secondary logo row.
5. **Confirmation of the solution-to-layer mapping** in `data/services.ts`,
   which is our inference, not the deck's.

## Reserved: the deck's bright blue (Company Profile p-04, "The Problem")

Extracted and kept at `salvage/deck/` — `p04-plate.png` is the largest
text-free region of the page at full resolution (grain included),
`p04-full-reference.png` is the whole page.

`.ground-deep` was already derived from this page, but DELIBERATELY CAPPED.
The reason it cannot simply be used at the deck's own brightness:

| measured | value |
|---|---|
| brightest luminance on p-04 | **0.2821** |
| white body text on that | **3.16:1** — under the 4.5 floor |
| `--color-text-muted` on that | **1.90:1** |
| ceiling for a WHITE-ONLY surface | 0.1833 |
| ceiling for a surface using the muted token | 0.0903 |

The deck gets away with it because its hotspot sits in the empty
bottom-left and every line of its type is on the darker right. A moving
field cannot make that promise — the hotspot wanders under the text — which
is why the live variants are bounded by their two colours instead.

**So it is usable at roughly double the current brightness (up to about
`#3069e8`, luminance 0.1656, white 4.87:1) on one condition: the surface
must use WHITE body copy only, no `--color-text-muted`.** Every deep
surface today uses the muted token, which is why this is reserved rather
than applied.

**APPLIED** to the 4D section (`#process`) as `.ground-deck` in globals.css
— the page's own ground reproduced as a static gradient under grain, NOT the
flowing shader wearing its colours. Every stop is sampled from p-04 in
text-free regions.

One departure: the page's glow peaks at `#007dcc` (0.1903), which is 4.37:1
against white. The cap is `#00649f`, which measures ~5.4:1 rendered with the
grain on top. An intermediate `#0070b8` measured 4.56:1 rendered — passing,
but too close to the floor to survive later copy drifting into the glow.

Its body copy is white, and that is what buys the brightness. A Playwright
check asserts the ground class, its base colour, and that zero muted-token
text survives anywhere inside the section.

Still open: `#the-gap` carries this same deck page's content and could take
the same treatment. That needs two decisions — switch its copy from ink to
white, and accept two deep surfaces in a row (hero → gap), losing the light
relief immediately after the hero.


## Which partner list is true?

The services page carries a logo row built from Company Profile p8's "Tech
Partners": **ServerFreak, WordPress, WooCommerce, Zapier, n8n**.

The current thewebxite.com shows a DIFFERENT set: **Exabytes, DigitalOcean
Partner, WordPress, Google Analytics Certified Professional, Google Tag
Manager Certified, Google Partner, Meta Business Partner**. Only WordPress
appears in both.

Three things need a decision:

1. **Which list is current.** The deck's, the site's, or both merged.
2. **The certifications are not reproduced.** Google Partner, GA/GTM
   Certified and Meta Business Partner are statements of fact with official
   badge assets and brand rules. They need the real files, not a logo lifted
   from a screenshot — supply them and they go in.
3. **The heading says "The stack we build on", not "Tech Partners".**
   WordPress, WooCommerce, Zapier and n8n are open platforms anyone can
   build on; calling them partners asserts a relationship. If any of them
   are genuine partnerships, confirm and the heading changes.

The deck also lists The Knights Award in that row; it is excluded, because it
is a client with a case study at /work/the-knights-award.

## Events page — open questions for the client

Added 2026-10-05 with `/events`. The page ships photographs and dates and
nothing else, by the client's own decision, so none of these block it —
but each is something only they can answer.

- ~~**Real titles.**~~ Answered 2026-10-08. Four were replaced with the
  client's own names — Torii Teppanyaki Content Shooting, Podcast with
  Andy, The Knights Award 2026 Press Conference, TARUMT Music Fiesta
  2025. "Newton AI Training" and "Santan" were already right. Slugs did
  not move, so existing /events#... links still resolve.
- ~~**"Torri" or "Torii"?**~~ Answered 2026-10-05: Torii. Name, slug and
  asset path all corrected; the source folder is still spelled Torri.
- **Two photographs excluded from TARUMT MF-25.** `Copy of edited-03426`
  and `-03428` were captured 2021-07-29, four years before everything
  else in that folder. Either they belong to a different event or the
  folder's name is wrong; publishing them under a 2025 heading would
  assert something we cannot support. Originals untouched.
- **The Podcast event is a single photograph**, and that same file was
  also sitting in the Newton AI Training folder. Kept once, under
  Podcast. Worth confirming which event it actually belongs to.
- **Dates are the earliest capture in each folder**, not dates anybody
  told us. Good evidence for an event — the camera was there — but if a
  shoot spanned days, the one shown is the first.

## Engagement section contrast — pre-existing, 4.01:1

Found 2026-10-06 while measuring the travelling mark, and NOT caused by
it: measured identically with the mark present and hidden, because that
section's circles are opaque and the mark never reaches behind them.

"Free Demo" and its body line read 4.01:1 against the grey ground —
below the 4.5:1 body floor. The heading may pass as large text; the
body line does not. The component already carries a note about this
ground being tight (3.30:1 on #B4B4B4 before it was lightened), so it
was a known squeeze that did not quite land.

Not fixed here because it is unrelated to the work in hand and the fix
is a colour decision: either the ground lightens again or the text
darkens. Worth doing — it is the only sub-4.5 reading on the site.

## One client logo needs a light-ground version

Added 2026-10-06 with the clientele row. The mark came off the client's
own live site, which is the right source, but it is built for a dark
header and reads faint on our near-white grid:

- **Coribot** publishes only an on-dark file — the wordmark is white.
  The only other image on their site is a set of app screenshots.

Recolouring somebody else's logo is not ours to do, so it is shown as
published. Ask for a dark or mono version, or accept that it sits
quietly in the grid.

Team Ryan 1995 had the same problem and is no longer on the list: the
client withdrew it on 2026-10-07, along with Snap Law and the Dream of
the Red Chamber Research Centre. Eighteen names remain. The three
image files are still in `public/clients/` in case they come back.

GeoTrust and Conceptine arrived with a white box baked in and have
been flood-filled transparent from the corners, so white inside the
letterforms survives.

## Industries list — a claim, now on the record

Added 2026-10-06 at the client's request. The section used to generate
its rows from the eight case studies, so every line was a project and
nothing unverifiable could appear. It is a general list now, which is
a statement about the markets the studio works in rather than a list
of receipts — the same kind of claim as "Tech Partners", and theirs to
make.

The names were not copied from the reference. Each generalises a
client that exists, and data/industries.ts records which — Retail &
F&B from Fuji Bakery and Torii, Education from MIA and TAR UMT, and so
on. That mapping is not rendered, by instruction, but it is the reason
there are eight rows and not a round ten. **A ninth row should only be
added for an industry somebody has actually worked in.**

The photographs are stock and illustrate the industry; they are not
the studio's work, which is why no row links anywhere.

## Services page — what the deck still owes us

Added 2026-10-05, alongside the Clientele row and p6's three statements.

- **Name the four products.** p6 says "The Suite — Four in-house
  products power it" and stops there. That line is no longer on the
  site at all: it came in with p6's three statements on the services
  page and went out with them when those turned out to repeat /about.
  It was never worth showing unnamed — a promise with nothing behind
  it. Four NAMED in-house products would be the strongest claim the
  site could make and the one thing no competitor can copy, and they
  would earn a section of their own rather than a line in a trio.
- **Seven clients have a logo and nothing else** — MITC, TAR UMT, CYL,
  DS, Kingsman Realty, Nextloop, Lions. They are in the Clientele row
  now. Any of them that would allow a case study is worth more than the
  logo.
- **Which project used which service** — still the single highest-value
  missing fact, and still unanswerable from anything we hold.

### The FAQ's one hole

The services FAQ answers "what does it cost?" by explaining how a price
is reached, because no figure exists to publish. Every comparable page
publishes one — WebFX leads with $3,000/month, Cloudix's own enquiry
form starts at RM1,500 — and the consistent finding is that a published
range raises inbound quality, because people self-qualify before the
call. A real starting range would replace that answer outright.

Also unanswered there, for the same reason: how long a project takes,
how big the team is, how many clients there have been. A test asserts
the FAQ contains no price, duration or client count, so none can appear
by accident later.

## Contact form — two things to decide

Added 2026-10-05 with the enquiry form.

- **Set ENQUIRY_WEBHOOK_URL.** The form is built, validated and tested
  end to end against a local receiver, but it forwards nowhere until
  this is set. Point it at a Zapier or n8n catch hook — both are
  already in the stack — and it is live. Until then the form answers
  503 and tells people to email, which is honest but is not a form.
- **Budget bands.** Deliberately absent. Every comparable form has them
  and they are how prospects self-qualify, but a band is a public
  statement of what this studio charges and no figure exists to base
  one on. A test fails the build if one appears. Give a starting range
  and both this and the services FAQ answer change.

## About page — the three facts it is normally built on

> Note: p1's cover line stays unused. The spec bans "Elevate" and the
> agency-cliché register by name and names that sentence specifically.
> It was added to this page and removed again the same hour when the
> sweep caught it. It is absent on purpose.


Added 2026-10-05. The page went from 149 words to 211 using only the
deck's own unused lines, the clientele and the events. What no amount
of rearranging can supply:

- **When the company started.** An About page almost always opens on
  it. There is no founding year anywhere in the deck or the old site.
- **How many people.** The client decided against a team section and
  that stands — but even "a team of N in Petaling Jaya" is a fact we
  do not have. Worth revisiting: the event photographs already show
  faces, and a named team is the strongest trust signal an agency
  About page carries.
- **How many businesses served.** Cloudix leads with "over 150 small
  to medium businesses". We have nine logos and eight case studies and
  no idea what the real total is.

A test fails the build if a founding year, a headcount or a client
tally appears on that page, so none can arrive by guess.

### Resolved

- ~~"The tools exist. They're just not connected into one system."~~ had
  no home on the site and lived only in the OpenGraph image. It is now
  the lead under the services h1, replacing a sentence that was
  duplicated from the ecosystem section 350px below it.

## The /about band photograph is 1600px, and it runs full width

Added 2026-10-07 with the About rebuild. The page's one full-bleed
image is `events/newton-ai-training/1.webp` at 1600×1200 — the largest
file we hold for it. Measured at a 1440px viewport:

| display | needs | gets | ratio |
|---|---|---|---|
| 1× | 1440 | 1600 | 1.11× — fine |
| 2× | 2880 | 1600 | 0.56× — soft |

The optimiser is behaving correctly; it cannot serve pixels the source
does not have. On a retina laptop the band will look noticeably softer
than everything around it, because nothing else on the site is asked
to fill the full width from a phone-sized original.

**Ask the client for the original camera file** for this one
photograph. Nothing else needs it — every other use of the event
photos is a tile a few hundred pixels wide, where 1600 is ample.

## Three Work categories are empty and waiting on content

Added 2026-10-09. The client's IA: Work is the parent, and under it sit
web design, systems development, AI training and Lark implementation.
All eight projects in the repo are websites — there is no record of a
single systems build, AI training engagement or Lark rollout. No client
name, no date, no capture.

So three of the four categories ship as declared empty states. They say
nothing is published yet; they claim nothing about the work either way.

**What each entry needs**, matching what the website case studies carry:

- the client, the sector, and whether publication is permitted;
- three or four lines on what the business needed and what changed —
  this is the `story` field, still null for all eight websites too;
- evidence, and the client has said it will be one of two kinds:
  photographs of the engagement (AI training already has the Newton
  session in `data/events.ts`), or captures of the system or Lark
  workspace that was built. **Captures of private systems need the
  client's explicit permission and need to be supplied by them** — we
  cannot take them ourselves.

The case-study template takes both without change: `shots` is a list of
images with captions and does not care whether they are web pages,
photographs or dashboards. A category with entries renders them with no
code change at all.
