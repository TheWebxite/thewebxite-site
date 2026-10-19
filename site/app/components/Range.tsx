import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";

/**
 * The proof section: a filing cabinet of projects.
 *
 * NOT a logo marquee. A greyscale logo says someone paid us; a screenshot says
 * we built that. The captures are deliberately unalike — a gold perfume
 * maison, a black particle-horse awards site, a red teppanyaki mascot, a
 * corporate engineering group, a yellow B2B SaaS — and the jolt between
 * consecutive cards IS the argument.
 *
 * THE TAB IS THE WHOLE IDEA. Every card carries an angled folder tab, offset
 * one slot further right than the card before it, sitting at the card's
 * BOTTOM edge. Each card rises, overlaps the one before, and parks with its
 * tab on a row along the foot of the screen — the drawer fills as you scroll
 * and the next section only arrives once every tab is in. Each card's tab
 * strip is transparent apart from its own tab, which keeps the tabs already
 * in the row visible beneath the card on top.
 *
 * WHY `top`, NOT `bottom`. `position: sticky; bottom: 0` holds an element
 * BEFORE its natural position, so every card would start pinned at the foot
 * and peel away as you scroll — backwards. `top` holds AFTER, which is what
 * makes each card arrive, park, and be climbed over by the next. The offset
 * clears the sticky header.
 *
 * The stack is `position: sticky` — CSS, not script. With JavaScript off the
 * cards read as a plain sequence, which is why there is no GSAP here.
 *
 * Five are featured here; the full set lives on /work/web-design — there
 * is no /work index, the kinds of work ARE the pages. NO COUNT appears in
 * the headline or the link — the studio keeps adding work, and a number
 * baked into the copy goes stale the day it does.
 */

const HOME_COUNT = 5;
const FEATURED = PROJECTS.slice(0, HOME_COUNT);

/** Tab geometry. The slot width sets how far each tab steps right; five tabs
 *  have to fit across the card, so this and HOME_COUNT move together. */
const TAB_H = "3.25rem";
/** Every card is exactly this tall, so the sticky offset below can put the
 *  card's foot on the viewport floor. It cannot become `auto`: the offset is
 *  100svh - CARD_H - TAB_H and that needs a known height. */
const CARD_H = "clamp(23rem, 58vh, 36rem)";
const TAB_SLOT = 11.5; // rem
/** The gap between cards in flow — how far each one travels to climb into the
 *  row. EVERY card carries it as a bottom margin, the last one included.
 *
 *  That last margin looks redundant (nothing follows the card) but it is what
 *  makes the stack leave as one piece. A sticky element releases when its
 *  MARGIN BOX reaches the container's bottom, so its release scroll position
 *  works out to `containerBottom - top - height - marginBottom`: identical for
 *  every card, and dependent on nothing else. Give the last card 0 here and it
 *  releases a full STEP after the other four, which merges the row and then
 *  strands one card behind as the rest scroll away. */
const STEP = 62; // vh
/** How long the completed row holds before the stack leaves together. With the
 *  margins equal this is pure dwell: it buys the beat after the last tab lands
 *  and plays no part in whether the cards reach the row. */
const TAIL = 25; // vh

/* --- The heading leaves WITH the stack -------------------------------------
   A sticky element releases at `containerBottom - (top + height)`. The cards
   release together because that expression is identical for all five. The
   heading is in the same section but is much shorter, so left to itself it
   released far later and sat alone in an empty section after the stack had
   gone.

   The fix is to give the heading the same `top + height` as a card. FOOT is
   exactly that for a card — `top` is max()'d, so the sum is too — and the
   heading's band is sized to FOOT minus its own offset. The band is a tall
   transparent box with the heading at its top; LEAD is the part of it that is
   empty, pulled back off the cards so the layout is unchanged.

   This is why the band needs a FIXED height: the release maths cannot be
   written against content that measures itself. BAND below must therefore
   clear the tallest the block measures at ANY width — verify it after any
   change to the headline, the paragraph or the type scale. */
/* The bar's height PLUS air. At exactly --nav-h the heading sat flush under
   the bar with no gap at all. */
const HEAD_TOP = "calc(var(--nav-h) + 4rem)";
/* Reserved height for the heading block, which shrank when the headline went
   to one line. Measured, not guessed — see the note above. */
const BAND = "15.5rem";
const FOOT = `max(calc(5rem + ${CARD_H} + ${TAB_H}), 100svh)`;

/* Each card gets its own ground so consecutive cards never share one, and the
   accent card gives the run a bright beat the way the reference's yellow does.
   Frozen tokens only, used as surfaces rather than as text colours. */
const CARD = [
  { bg: "var(--color-ink)", fg: "var(--color-surface)", muted: "rgba(243,242,240,0.70)" },
  { bg: "var(--color-canvas)", fg: "var(--color-text)", muted: "var(--color-text-muted)" },
  { bg: "var(--color-accent)", fg: "var(--color-ink)", muted: "rgba(7,18,56,0.70)" },
  { bg: "var(--color-ink)", fg: "var(--color-surface)", muted: "rgba(243,242,240,0.70)" },
  { bg: "var(--color-canvas)", fg: "var(--color-text)", muted: "var(--color-text-muted)" },
];

/** The angled right edge that makes it read as a folder tab, not a button. */
const TAB_CLIP = "polygon(0 0, calc(100% - 1.15rem) 0, 100% 100%, 0 100%)";

export default function Range() {
  return (
    <section id="range" className="ground-flat relative px-[var(--space-gutter)] py-[var(--space-section)]">
      {/* Draughting grid, as in the reference. Decorative, very low contrast. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(7,18,56,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(7,18,56,0.055) 1px, transparent 1px)",
          backgroundSize: "clamp(2.5rem, 5vw, 4.5rem) clamp(2.5rem, 5vw, 4.5rem)",
        }}
      />

      <div
        className="relative mx-auto max-w-[84rem]"
        style={
          {
            "--head-top": HEAD_TOP,
            "--head-band": `calc(${FOOT} - ${HEAD_TOP})`,
            "--head-lead": `calc(${FOOT} - ${HEAD_TOP} - ${BAND})`,
          } as React.CSSProperties
        }
      >
        {/* The heading STICKS, so the claim the stack is evidence for is on
            screen the whole time the drawer fills — and it LEAVES WITH THE
            STACK, because its band is sized to FOOT (see above).

            An earlier sticky heading produced three artefacts, and all three
            came from the same two mistakes rather than from stickiness
            itself: it carried an opaque band (which hid the tabs of cards
            passing behind it and sliced departing cards in half), and it
            sat ABOVE the cards in z-order. Here it is transparent and
            z-0 while every card is z-index >= 1, so the cards simply pass
            over it — nothing to hide, nothing to slice.

            Below lg the heading does not stick at all: the cards are nearly
            full-height there, so a pinned heading would spend the section
            competing with them for the screen. */}
        <div className="lg:sticky lg:top-[var(--head-top)] lg:z-0 lg:h-[var(--head-band)]">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pb-[var(--space-block)]">
          <div className="min-w-0">
            {/* PLACEHOLDER: headline is ours, pending the client's own wording. */}
            {/* ONE LINE from ~768 up. The 19ch cap forced two rows; without
                it the size has to come down enough that 36 characters fit the
                container — 4.4vw does at every width from 768, and below that
                it wraps rather than overflowing, which is the right trade on
                a phone. */}
            <h2 className="font-display font-bold leading-[1.0] tracking-[-0.03em] text-[clamp(1.6rem,4.4vw,4.5rem)]">
              Built to look like you, not like us.
            </h2>
            {/* PLACEHOLDER: copy is ours, not quoted from the client's deck. */}
            <p className="mt-6 max-w-[52ch] text-ink-muted">
              Most studios ship one template in several colourways. These came
              from the same studio.
            </p>
          </div>

          <Link
            href="/work"
            className="inline-flex min-h-[44px] shrink-0 items-center border-b border-ink text-xs uppercase tracking-[0.16em] hover:text-canvas"
          >
            All projects →
          </Link>
        </div>
        </div>

        {/* The negative margin cancels the LAST card's trailing step.
            That step has to exist — it is what makes every card release at
            the same scroll position (see STEP) — but it is pure timing, not
            layout: left to stand it reserved a card's worth of empty
            section below the stack, so once the cards had gone the section
            went on scrolling past nothing.

            A margin on this div does not move its CONTENT box, so every
            sticky release point inside it is untouched; only the space the
            div claims in the page shrinks, which brings the next section up
            to meet the departing stack. */}
        <div className="lg:mt-[calc(-1*var(--head-lead))]" style={{ marginBottom: `-${STEP}vh` }}>
          {FEATURED.map((p, i) => {
            const skin = CARD[i % CARD.length];
            const num = String(i + 1).padStart(2, "0");
            return (
              <article
                key={p.slug}
                data-capture={p.slug}
                className="sticky"
                style={{
                  /* Pinned so the card's FOOT — and therefore its tab — sits
                     on the viewport floor, leaving the sticky heading clear
                     air above. */
                  /* The card's FOOT sits on the viewport floor, so the tab
                     row rides low on the screen and the cards rise into it.
                     max() keeps it sane on a very short viewport. */
                  top: `max(5rem, calc(100svh - ${CARD_H} - ${TAB_H}))`,
                  zIndex: i + 1,
                  /* A card is fully read before the next begins to cover it.
                     At 1.25rem the cards were nearly contiguous in flow, so
                     four of them arrived almost at once and the stack read as
                     a squashed accordion of half-clipped titles. */
                  marginBottom: `${STEP}vh`,
                }}
              >



                {/* The folder tab, on TOP of the card where a tab belongs. The strip
                    is transparent apart from this card's own tab, so the tabs
                    already in the row stay visible beneath the card that
                    climbs over them. */}
                <div className="relative" style={{ height: TAB_H }}>
                  <div
                    className="absolute bottom-0 flex items-center gap-2 px-5 text-xs uppercase tracking-[0.18em] tabular-nums"
                    style={{
                      /* Clamped inside the card: five tabs stepping
                         11.5rem each reach 46rem, which overflows a 390px
                         screen outright. min() keeps the last tab against
                         the card's right edge instead. */
                      left: `min(${i * TAB_SLOT}rem, calc(100% - ${TAB_SLOT + 1.15}rem))`,
                      height: TAB_H,
                      minWidth: `${TAB_SLOT + 1.15}rem`,
                      background: skin.bg,
                      color: skin.fg,
                      clipPath: TAB_CLIP,
                    }}
                  >
                    <span aria-hidden="true" style={{ color: skin.muted }}>◆</span>
                    Project {num}
                  </div>
                </div>

                <Link
                  href={`/work/${p.slug}`}
                  className="group block overflow-hidden rounded-md"
                  style={{ background: skin.bg, color: skin.fg, height: CARD_H }}
                >
                  <div className="grid h-full items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]">
                    <div className="min-w-0 p-[clamp(2rem,3.6vw,3.5rem)]">
                      <h3 className="font-display text-section font-bold leading-[1.02] tracking-[-0.02em]">
                        {p.client}
                      </h3>

                      <p className="mt-3 text-base" style={{ color: skin.muted }}>
                        {p.sector}
                        {p.country === "NZ" ? " · Hawke's Bay, New Zealand" : p.country === "VN" ? " · Ho Chi Minh City, Vietnam" : " · Malaysia"}
                      </p>

                      <p className="mt-5 max-w-[40ch] text-base leading-[1.55]">
                        {p.observed[0]}
                      </p>

                      <span
                        className="mt-8 inline-flex min-h-[44px] items-center gap-2 border-b pb-1 text-xs uppercase tracking-[0.16em]"
                        style={{ borderColor: "currentColor" }}
                      >
                        View project
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>

                    {/* The capture is framed by the card on every side and
                        shown whole — it is the evidence, so cropping it
                        defeats the point. object-contain rather than a
                        natural-height image: the card has a fixed height so
                        its foot can land on the viewport floor, and at
                        2048x1280 a full-width image overran that height and
                        was clipped on shorter screens. */}
                    {p.image ? (
                      <span className="flex min-h-0 min-w-0 items-center justify-end p-[clamp(2rem,3.6vw,3.5rem)] lg:pl-0">
                        <Image
                          src={p.image}
                          alt={p.alt}
                          width={2048}
                          height={1280}
                          sizes="(max-width: 1024px) 100vw, 40rem"
                          priority={i === 0}
                          className="max-h-full w-full rounded-sm object-contain object-right"
                        />
                      </span>
                    ) : null}
                  </div>
                </Link>
              </article>
            );
          })}

          <div aria-hidden="true" style={{ height: `${TAIL}vh` }} />
        </div>

      </div>
    </section>
  );
}
