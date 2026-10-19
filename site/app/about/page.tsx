import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FlowField, { FIELD } from "@/app/components/FlowField";
import AboutMark from "@/app/components/AboutMark";
import ClienteleWall from "@/app/components/ClienteleWall";
import ScrubText from "@/app/components/ScrubText";
import { EVENTS } from "@/data/events";
import { LAYERS } from "@/data/services";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  // PLACEHOLDER: description sentence recombines the deck's own phrases, not a direct quote.
  description:
    "TheWebxite is a Petaling Jaya digital architect, bridging the gap between traditional operations and the digital future for Malaysian SMEs.",  /* Canonical. metadataBase makes this absolute. Without it every
     variant Google reaches this page by is a separate candidate it has
     to pick between. */
  alternates: { canonical: "/about" },
};

/**
 * Mission and vision are Company Profile p3 verbatim; the positioning
 * sentence is p2 verbatim. No team section, by client decision.
 *
 * THE SHAPE OF THIS PAGE IS THE CLIENT'S, FROM TWO REFERENCES THEY
 * SENT. An earlier pass redesigned it on my own judgement — mission as
 * display type with the vision offset below it, a full-bleed
 * photograph, a lead event tile at double width — and all of it was
 * rejected on sight. What replaced it:
 *
 *   · MISSION AND VISION ARE THE ORIGINAL MATCHING PAIR again, restored
 *     verbatim. The deck sets them as a pair; they are read as a pair.
 *     Do not make them asymmetric a second time.
 *   · "WHAT SETS US APART" IS ONE CENTRED COLUMN — heading, the 3D
 *     object, paragraph — on their first reference, and it is the ONLY
 *     centred block on the page. The four staggered layer cards it
 *     used to hold are gone; the object is the subject now rather than
 *     a decoration filling an empty grid cell.
 *   · CLIENTELE AND EVENTS CARRY THE SAME HEADER STACK — small label,
 *     heading, one line of sub-copy — from their second reference, but
 *     LEFT ALIGNED. Centring those two was my reading of that
 *     reference and was rejected.
 *   · THE FULL-BLEED PHOTOGRAPH IS REMOVED. It was the answer to this
 *     page having no people on it; that problem is real and is now
 *     unanswered, which is the client's call to make.
 *
 * STILL TRUE, AND NOT FIXABLE HERE: the page states no facts. Almost
 * every word is intention — "we empower", "to be Malaysia's trusted
 * partner". The three facts an About page is normally built on — when
 * the company started, how many people it is, how many businesses it
 * has worked with — are not ours to state, and the client declined to
 * supply them when asked. A test enforces it: no founding year, no
 * headcount, no tally. The hero's layer strip exists partly because of
 * that rule — it is real content from the data where a strip of
 * numbers would have been an invention.
 *
 * IT ALTERNATES GROUNDS, which is most of why it reads as designed:
 * deep field → paper → pale blue → paper → photograph. Every surface
 * and every picture already existed in this repo, except .ground-mist,
 * which was added for the stack section.
 *
 * THE HERO CARRIES data-hero, so the bar goes transparent over it the
 * way it does on the home page.
 *
 * NO COVER LINE. p1's "Elevating Businesses Through Digital
 * Intelligence" was added here once and removed the same hour: the spec
 * bans "Elevate" and the agency-cliché register by name, and names that
 * sentence specifically. /elevat(e|ing|ion)/ guards every route. It is
 * absent on purpose — do not rescue it a third time.
 */

const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  year: "numeric",
});
const monthYear = (iso: string) =>
  MONTH_YEAR.format(new Date(`${iso}T00:00:00`));

export default function About() {
  return (
    <main className="ground-flat">
      {/* ---- the hero: the site's own deep ground, with the field ---- */}
      <section
        data-hero
        className="ground-deep relative isolate overflow-hidden px-[var(--space-gutter)] pb-[clamp(3rem,7vh,5rem)] pt-[calc(var(--nav-h)+clamp(4rem,12vh,9rem))] -mt-[var(--nav-h)]"
      >
        {/* Same material as the home hero, a different picture, and no
            pointer: the lean belongs to the home page alone. */}
        <FlowField tune={FIELD.RAIL} />
        <div className="relative mx-auto max-w-[84rem]">
          {/* Company Profile.pdf p2, the client's words — set sentence case to match the site's headlines. */}
          <h1 className="max-w-[14ch] font-display text-major font-bold leading-[0.98] tracking-[-0.03em] text-text">
            Your partner in digital evolution
          </h1>
          {/* p2, verbatim. White rather than muted: this field is the
              brighter of the two tunings — see FIELD.RAIL. */}
          <p className="mt-8 max-w-[54ch] text-lead leading-[1.5] text-text">
            We are a Petaling Jaya-based digital architect dedicated to bridging
            the gap between traditional operations and the digital future. We
            don&rsquo;t just build websites; we engineer custom systems and
            AI-driven solutions that automate your growth and simplify your
            management.
          </p>

          {/* THE HERO NEEDED A BASE. One headline and one paragraph left
              the site's most expensive surface mostly empty, and the
              obvious filler — a strip of numbers — is exactly what this
              page may not do: a client tally or a founding year would
              be invented, and a test forbids both. These are the four
              layer names from data/services.ts. They are real content,
              they claim nothing, and they foreshadow the section that
              explains them. */}
          <ul className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/20 pt-6 sm:grid-cols-4">
            {LAYERS.map((l, i) => (
              <li key={l.key} className="min-w-0">
                <p className="text-xs uppercase tracking-[0.16em] tabular-nums text-text-muted">
                  /{String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 font-display text-base font-bold leading-[1.25] tracking-[-0.01em] text-text">
                  {l.eyebrow}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- the manifesto, filling in as it is read ----
          The line is the client's own, from the old WordPress home page
          ("One thing about us: We treat and serve every client with
          heart."), which /contact already carries. Here it is the
          page's turn from what we are to how we behave. */}
      <section
        aria-label="One thing about us"
        className="px-[var(--space-gutter)] pb-[clamp(4rem,8vw,7rem)] pt-[var(--space-section)]"
      >
        <div className="mx-auto max-w-[84rem]">
          <p className="label !text-ink-muted">One thing about us</p>
          <ScrubText
            text="We treat and serve every client with heart — and we stay after launch, to maintain and update the site as your products and services change."
            className="mt-8 max-w-[24ch] font-display text-[clamp(2.25rem,5.4vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink"
          />
        </div>
      </section>

      {/* ---- mission & vision, as two held statements ----
          STILL THE MATCHING PAIR the client asked for — same size, same
          shape, side by side, Company Profile p3 verbatim. What changed
          on 2026-10-19 is the setting: edge to edge instead of two
          rounded cards floating on the page, with each word set as a
          large outline at the foot of its half. */}
      <section aria-labelledby="mission-vision" className="relative">
        <h2 id="mission-vision" className="sr-only">
          Mission &amp; Vision
        </h2>
        <div className="grid md:grid-cols-2">
          {[
            {
              label: "Mission",
              title: "Empowering Digital Growth",
              body: "We empower SMEs with affordable, accessible, and future-ready digital solutions that help them attract customers, improve efficiency, and achieve sustainable growth.",
              bg: "var(--color-canvas)",
            },
            {
              label: "Vision",
              title: "Leading Digital Transformation",
              body: "To be Malaysia's trusted digital transformation partner, helping businesses embrace technology, automation, and AI to unlock their full potential.",
              bg: "#1C1B21",
            },
          ].map((c) => (
            <div
              key={c.label}
              style={{ background: c.bg }}
              className="mv-half relative isolate flex min-h-[clamp(28rem,62vh,40rem)] flex-col overflow-hidden px-[var(--space-gutter)] py-[clamp(3.5rem,7vw,6rem)] text-text"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{c.label}</p>
              <p className="mt-6 max-w-[14ch] font-display text-[clamp(2.25rem,4.2vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
                {c.title}
              </p>
              <p className="mt-6 max-w-[40ch] text-lead leading-[1.5] text-text-muted">{c.body}</p>
              <span aria-hidden="true" className="mv-word">
                {c.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ---- what sets us apart ----
          HEADING, OBJECT, PARAGRAPH, centred — the client's reference.
          It replaced four staggered layer cards with the 3D object
          they used to be arranged around, so the object is the subject
          of the section now rather than a decoration filling an empty
          grid cell.

          THE COPY IS ABOUT US, NOT THE SERVICES, on instruction. It
          used to be the deck's "Front to Back" line — "We cover the
          whole stack…" — which describes the offering and belongs to
          /services in spirit even though /about was where it lived.
          This is an About page; the section says how the studio works
          instead.

          THAT PARAGRAPH IS OURS AND IS THE ONLY SENTENCE ON THIS PAGE
          THAT IS. Every other word is Company Profile verbatim. It
          invents no facts — no year, no headcount, no client tally,
          all of which a test forbids — and it claims nothing the deck
          does not already claim for itself: p5 is headed "One Partner.
          Every Digital Need." and p4's problem statement is that the
          tools exist and are simply not connected into one system.
          Replace it the moment the client writes their own.

          THE MARK IS THE BRAND-BLUE RENDER, mark-3d-behind, not the
          pale mark-3d-on-light that was here first. Its name says
          where it was BORN — receded, behind white type on a dark
          ground — not where it may be used, and on a pale ground it is
          the theme blue the client asked for. The pale one washed out
          against .ground-mist: light object, light ground.

          IT LEANS TOWARD THE POINTER, on the client's instruction.
          This note used to say the opposite twice over — that the
          pointer gesture was the home hero's alone, and that a still
          image was not worth a second GL context. Both were overruled
          and both reversed: AboutMark mounts the hero's own renderer
          where it can, and falls back to the still everywhere it
          cannot. The decision table is in that file; the short version
          is that reduced motion and narrow screens still get the
          flat render, so nothing regressed to get the lean. */}
      <section
        aria-labelledby="stack"
        className="ground-mist relative px-[var(--space-gutter)] py-[var(--space-section)]"
      >
        <div className="mx-auto flex max-w-[84rem] flex-col items-center text-center">
          <h2
            id="stack"
            className="max-w-[18ch] font-display text-[clamp(2.75rem,6vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.035em]"
          >
            What sets us apart
          </h2>

          <AboutMark />

          {/* PLACEHOLDER: ours — the one sentence on this page that is
              not the deck's. See the note above. */}
          <p className="mt-[clamp(2rem,5vw,3.25rem)] max-w-[40ch] text-[clamp(1.3rem,2.1vw,1.9rem)] leading-[1.4] text-ink-muted">
            Most businesses end up with a designer, a developer, an automation
            tool and a marketer who never speak to each other. We are all four,
            under one roof and answerable to one another — which is the whole
            reason the brand, the systems, the AI and the growth actually
            connect.
          </p>
        </div>
      </section>

      {/* ---- who we work with: the clientele wall (2026-10-19) ---- */}
      <ClienteleWall id="clientele-about" tone="deep" />

      {/* ---- where we show up ----
          Photographs, not claims. A trainer in front of a full room and
          a university festival say what a sentence about "engagement"
          cannot, and nobody has to take our word for any of it.

          Same header shape as the clientele above it, left aligned,
          and the four tiles are equal. "All events" sits under the row
          rather than beside the heading: the header is a stack of
          three lines now and has no single baseline to hang it on. */}
      <section
        aria-labelledby="events-about"
        className="px-[var(--space-gutter)] py-[var(--space-section)]"
      >
        <div className="mx-auto max-w-[84rem]">
          <div className="max-w-[46rem]">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              Events
            </p>
            <h2
              id="events-about"
              className="mt-4 font-display text-section font-bold leading-[1.05] tracking-[-0.02em]"
            >
              Where we show up
            </h2>
          </div>

          <ul className="mt-[var(--space-block)] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {EVENTS.slice(0, 4).map((e) => (
              <li key={e.slug} className="min-w-0">
                <Link href={`/events#${e.slug}`} className="group block">
                  <div className="overflow-hidden rounded-[var(--radius-md)] bg-ink">
                    <Image
                      src={e.photos[0].src}
                      alt={e.name}
                      width={e.photos[0].width}
                      height={e.photos[0].height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20rem"
                      className="aspect-[4/5] h-auto w-full object-cover transition-transform duration-700 ease-[var(--ease-standard)] group-hover:scale-[1.05]"
                    />
                  </div>
                  <p className="mt-4 font-display text-base font-bold leading-[1.2] tracking-[-0.02em]">
                    {e.name}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-muted">
                    <time dateTime={e.date}>{monthYear(e.date)}</time>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-[clamp(2rem,4vw,3rem)]">
            <Link
              href="/events"
              className="inline-flex min-h-[44px] items-center border-b border-ink text-xs uppercase tracking-[0.16em] text-ink hover:text-canvas"
            >
              All events &amp; our Instagram →
            </Link>
          </div>
        </div>
      </section>

      {/* ---- the close, on the city it works in ----
          Company Profile.pdf p10, verbatim — the deck's own last page.
          The photograph is the one /contact's block already uses,
          treated the same way: a scrim heavy enough on the left that
          white display type and muted body copy both clear 4.5:1 over
          the half where the words sit. Measured, not assumed. */}
      <section
        aria-labelledby="about-close"
        className="relative isolate overflow-hidden px-[var(--space-gutter)] py-[clamp(4rem,10vw,7.5rem)] text-text"
      >
        <Image
          src="/img/kl-towers.webp"
          alt=""
          aria-hidden="true"
          width={2000}
          height={1333}
          sizes="100vw"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,9,63,0.95) 0%, rgba(0,9,63,0.90) 48%, rgba(3,37,168,0.66) 100%)",
          }}
        />
        <div className="mx-auto max-w-[84rem]">
          <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
            {SITE.city}, Malaysia
          </p>
          <h2
            id="about-close"
            className="mt-6 max-w-[18ch] break-words font-display text-section font-bold leading-[1.08] tracking-[-0.03em] sm:text-major"
          >
            Build your presence. Automate your processes. Grow with confidence.
          </h2>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center border-b border-accent text-base text-accent"
            >
              Start a conversation →
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-[44px] items-center text-base text-text-muted hover:text-accent"
            >
              See what we build
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
