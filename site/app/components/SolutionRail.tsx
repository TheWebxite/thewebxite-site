"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FlowField, { FIELD } from "./FlowField";
import { SERVICES } from "@/data/services";

/**
 * The six solutions as a horizontal editorial rail.
 *
 * REPLACES THE BENTO GRID. The grid stacked everything into one screen and
 * every card had to be the same kind of object. A rail lets the panels be
 * different kinds at ONE SIZE: the opening panel is a title block on the
 * live field, the service panels alternate light and dark, and three panels
 * are only an image. Adding a seventh service adds a panel; it does not
 * re-tile the page.
 *
 * THE FIELD RUNS HERE WITHOUT THE POINTER. FIELD.RAIL is a different seed,
 * scale, drift and pace from the hero's — the same material, not the same
 * picture — and pointer: "none", because the lean belongs to the home hero
 * alone. See FlowField.tsx.
 *
 * THE PAGE'S OWN SCROLL DRIVES IT. From lg up the section PINS: it claims
 * one viewport of height plus exactly as many pixels as the rail has to
 * travel, the inner viewport sticks, and vertical scroll offset becomes
 * horizontal offset at 1:1. Scroll down, the rail runs left; the section
 * releases the moment the last panel lands. Nobody has to find a sideways
 * gesture.
 *
 * THE HEIGHT IS MEASURED, NOT GUESSED. Travel is read off the DOM
 * (scrollWidth − clientWidth) and the spacer is `calc(100svh + travel)`,
 * so the mapping is exact at every width and nothing dead-scrolls at the
 * end. A constant in vh here would be wrong at every viewport but one.
 *
 * BELOW lg, AND UNDER REDUCED MOTION, IT IS AN ORDINARY SWIPE RAIL. Pinning
 * takes the page's scroll away from the reader, which on a phone is the
 * only scroll they have, and someone who has asked for less motion should
 * not be handed a section that moves sideways on its own. Both fall back to
 * native horizontal scrolling of the same markup.
 *
 * SCROLLING IS STILL A REAL CONTROL. The arrow buttons move one panel —
 * while pinned they scroll the PAGE, because that is what moves the rail —
 * and they disable at each end. Tabbing to a card that is off to the right
 * scrolls the page to bring it in, since a transformed row cannot bring
 * itself into view the way a scroll container can.
 *
 * FULL WIDTH FOR REAL. The track is a direct child of <main>, which no
 * longer carries the page gutter — the shells around it do (see
 * app/services/page.tsx). Nothing here is measured in viewport units:
 * `100vw` counts the scrollbar and the layout does not, which is how a
 * full-bleed block gives a page a sideways scroll.
 */

/** EVERY PANEL IS THIS SIZE. The reference's rhythm comes from panels of
 *  one size whose CONTENT differs — title block, text card, bare image — not
 *  from panels of different sizes. A rail of mixed widths reads as a grid
 *  that fell over. */
const PANEL_W = "clamp(18rem, 26vw, 24rem)";
const PANEL_H = "clamp(28rem, 74vh, 42rem)";

/** Image panels, by the index of the service they follow.
 *
 *  STOCK, NOT CLIENT WORK. Client screenshots were here first and were
 *  wrong twice over: squeezed into a tall portrait panel a full-page
 *  screenshot becomes a crop of somebody's navigation bar, and sitting
 *  between two service cards it implies THAT project bought THAT service —
 *  the one mapping we do not have (see app/services/page.tsx).
 *
 *  Abstract over office photography. The alternative on the shelf was the
 *  usual stock: four people around a laptop. The site's own art is
 *  geometric, the palette is blue, and these three are architecture and
 *  structure in that blue — so they read as the brand rather than as
 *  filler bought by the pound.
 *
 *  Unsplash, free licence, no attribution required. IDs kept so the
 *  originals can be found again: 1FxMET2U5dU, guP3BPyB99I, iaquA2snPbk. */
const IMAGE_AFTER: Record<number, { src: string; alt: string }> = {
  0: { src: "/img/rail-structure.webp", alt: "" },
  2: { src: "/img/rail-light.webp", alt: "" },
  4: { src: "/img/rail-weave.webp", alt: "" },
};

/** Gap between panels, in px. Must match the `gap-4` on the row — it is
 *  part of one panel's step. */
const GAP = 16;

/** Shared by every panel. The cards used to be outlined; now they sit on
 *  the page instead of being drawn on it.
 *
 *  THE SHADOW IS NOT DECORATION HERE, IT IS THE EDGE. The light card's
 *  surface and the page's own ground are nearly the same off-white — the
 *  blue border was the only thing separating them. Take the border away
 *  and the shadow has to do that work, so it is tuned to be visible on the
 *  light card rather than to look pretty on the dark ones. */
const PANEL_SKIN =
  "rounded-[1.25rem] shadow-[0_14px_36px_-18px_rgba(6,12,46,0.45)] transition-[transform,box-shadow,background-color,color] duration-200 hover:-translate-y-1 hover:shadow-[0_26px_54px_-20px_rgba(6,12,46,0.55)]";

/** Card colours cycle through three, not two.
 *
 *  INK IS NOT A BLUE. #1C1B21 is the client's pick and it is the only
 *  thing on the page that is neither brand blue nor paper, which is
 *  exactly why it works as the third beat — a run of alternating
 *  blue/white reads as a checkerboard. White on it is 12.6:1 and
 *  --color-text-muted is 9.9:1, so both are comfortable.
 *
 *  The cycle is light → blue → ink, so no two adjacent cards share a
 *  colour and each colour lands twice across the six. */
const SKINS = [
  /* WHITE, not --color-surface. The page's own ground IS --color-surface
     (#F3F2F0 via .ground-flat), so a surface-coloured card is the same
     colour as the page and the blue border was doing 100% of the work of
     separating them. With the border gone it disappeared entirely. White
     is a real step up from the warm off-white and the shadow sits under
     it properly; ink on white is 17.2:1 against 16.28:1 on surface. */
  { card: "bg-white text-ink", dim: "text-ink-muted" },
  { card: "bg-canvas text-text", dim: "text-text-muted" },
  { card: "text-text", dim: "text-text-muted", bg: "#1C1B21" },
] as const;

export default function SolutionRail() {
  const outer = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  /** Pinned only from lg up, and never under reduced motion. Starts false
   *  so the server and the first client render agree; the effect decides. */
  const [pinned, setPinned] = useState(false);
  /** Horizontal distance the rail has to cover, in px. */
  const [travel, setTravel] = useState(0);
  /** Where it currently is along that distance, in px. */
  const [x, setX] = useState(0);
  /** Only used in the fallback, where the track scrolls itself. */
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setPinned(wide.matches && !still.matches);
    decide();
    wide.addEventListener("change", decide);
    still.addEventListener("change", decide);
    return () => {
      wide.removeEventListener("change", decide);
      still.removeEventListener("change", decide);
    };
  }, []);

  /* Travel is the overflow of the track's own content box. It reads
     correctly whether the track is scrollable or clipped, so the same
     measurement serves both modes. */
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setTravel(Math.max(0, el.scrollWidth - el.clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const li of el.querySelectorAll("li")) ro.observe(li);
    return () => ro.disconnect();
  }, [measure, pinned]);

  /* Page scroll → horizontal offset, 1:1. The span is read from the two
     elements rather than assumed to equal `travel`, so a rounding
     difference in `calc(100svh + …)` cannot leave the last panel short. */
  useEffect(() => {
    if (!pinned) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const o = outer.current;
      const v = viewport.current;
      if (!o || !v) return;
      const span = o.offsetHeight - v.offsetHeight;
      if (span <= 0) return setX(0);
      const p = Math.min(1, Math.max(0, -o.getBoundingClientRect().top / span));
      setX(p * travel);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pinned, travel]);

  /* 2px of slack: these are fractional under zoom and at device pixel
     ratios that are not whole, so an exact comparison never reaches the
     end and the button never disables. */
  const at = pinned ? x : scrollLeft;
  const atStart = at <= 2;
  const atEnd = at >= travel - 2;

  /** One panel, measured from the DOM rather than assumed: the panels are
   *  clamp()-sized and no constant here would survive a breakpoint. */
  const panelStep = () => {
    const first = track.current?.querySelector("li");
    return first ? first.getBoundingClientRect().width + GAP : 320;
  };

  const step = (dir: 1 | -1) => {
    /* While pinned the rail has no scroll of its own — the PAGE moves it.
       Scroll to the ABSOLUTE page position that puts the next panel in
       place, rather than nudging by a panel's width: the button can be
       clicked before the section has reached its pin, and a relative nudge
       then spends itself getting there and the rail barely moves. */
    if (pinned) {
      const o = outer.current;
      const v = viewport.current;
      if (!o || !v || travel <= 0) return;
      const span = o.offsetHeight - v.offsetHeight;
      const top = window.scrollY + o.getBoundingClientRect().top;
      const next = Math.min(travel, Math.max(0, x + dir * panelStep()));
      window.scrollTo({ top: top + (next / travel) * span, behavior: "smooth" });
      return;
    }
    track.current?.scrollBy({ left: dir * panelStep(), behavior: "smooth" });
  };

  /* A transformed row cannot scroll a focused child into view, and the
     clipped box would silently scroll itself out of step with the
     transform. So: keep the box at 0 and move the page instead. */
  const onFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!pinned || !el) return;
    el.scrollLeft = 0;
    const li = (e.target as HTMLElement).closest("li");
    if (!li) return;
    const box = el.getBoundingClientRect();
    const panel = li.getBoundingClientRect();
    const lead = parseFloat(getComputedStyle(el).paddingInlineStart) || 0;
    const overRight = panel.right - box.right;
    const overLeft = box.left + lead - panel.left;
    const delta = overRight > 0 ? overRight : overLeft > 0 ? -overLeft : 0;
    if (delta) window.scrollBy({ top: delta, behavior: "smooth" });
  };

  /* The panels fill the pinned viewport, and keep their own height in the
     fallback where nothing constrains them. */
  const panelH = pinned ? "100%" : PANEL_H;

  const panels: React.ReactNode[] = [];

  SERVICES.forEach((s, i) => {
    const skin = SKINS[i % SKINS.length];
    panels.push(
      <li
        key={s.slug}
        className="shrink-0 snap-start"
        style={{ width: PANEL_W, height: panelH }}
      >
        <Link
          href={`/services/${s.slug}`}
          style={"bg" in skin ? { background: skin.bg } : undefined}
          className={`group flex h-full flex-col p-[clamp(1.5rem,2vw,2rem)] ${PANEL_SKIN} ${skin.card}`}
        >
          <p className={`text-xs uppercase tracking-[0.18em] tabular-nums ${skin.dim}`}>
            /{String(i + 1).padStart(2, "0")}
          </p>

          {/* Set low, as the reference does: the number holds the top, the
              argument sits at the foot where the eye lands last. */}
          <h3 className="mt-auto max-w-[14ch] break-words font-display text-lead font-bold leading-[1.15] tracking-[-0.02em]">
            {s.deckName}
          </h3>
          <p className={`mt-3 max-w-[34ch] text-base leading-[1.6] ${skin.dim}`}>
            {s.detail[0]}
          </p>
          {/* The arrow sits IN the text flow, not in a flex row beside it:
              this label runs to two lines in a narrow panel, and a flex
              arrow floated itself against the middle of the block. */}
          <span className="mt-5 block text-xs uppercase leading-[1.7] tracking-[0.16em]">
            {s.summary.replace(/\.$/, "")}{" "}
            <span
              aria-hidden="true"
              className="inline-block transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </Link>
      </li>
    );

    const img = IMAGE_AFTER[i];
    if (img) {
      panels.push(
        <li
          key={img.src}
          className="shrink-0 snap-start"
          style={{ width: PANEL_W, height: panelH }}
        >
          <div className={`relative h-full overflow-hidden bg-ink ${PANEL_SKIN}`}>
            <Image
              src={img.src}
              alt={img.alt}
              aria-hidden="true"
              width={900}
              height={1500}
              sizes="(max-width: 640px) 70vw, 21rem"
              className="h-full w-full object-cover"
            />
          </div>
        </li>
      );
    }
  });

  return (
    <section aria-labelledby="solutions" className="mt-[var(--space-section)]">
      {/* The spacer. Its height is one viewport plus the rail's own travel,
          which is what makes the section end exactly when the last panel
          arrives instead of holding the reader through dead scroll. */}
      <div
        ref={outer}
        style={pinned && travel > 0 ? { height: `calc(100svh + ${travel}px)` } : undefined}
      >
        <div
          ref={viewport}
          className={
            pinned
              ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-[clamp(1.5rem,4vh,3rem)] pt-[calc(var(--nav-h)+clamp(1.5rem,4vh,3rem))]"
              : ""
          }
        >
      {/* The heading keeps the page's measure; only the track goes wide.
          w-full is load-bearing: inside the pinned column this is a flex
          child, and `mx-auto` cancels the default stretch, so without it
          the whole header shrank to its own text and sat centred. */}
      <div className="px-[var(--space-gutter)]">
      <div className="mx-auto flex w-full max-w-[84rem] flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <h2
            id="solutions"
            className="font-display text-section font-bold leading-[1.05] tracking-[-0.02em]"
          >
            Our Solutions
          </h2>
          <p className="mt-5 max-w-[46ch] text-ink-muted">
            Six solutions, one system. Each one is a layer of the same stack,
            not a separate purchase.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous solutions"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-ink text-ink transition-colors hover:bg-canvas hover:text-text disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next solutions"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-ink text-ink transition-colors hover:bg-canvas hover:text-text disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      </div>

      {/* The track's leading padding matches where the heading starts — the
          page gutter, or half the slack beside the 84rem measure once the
          window is wider than it (the slack alone — the gutter is not
          added on top any more, now that the 84rem box is the content box
          everywhere) — so the first panel lines up under the h2
          and everything after it runs off the right edge. Percentages, not
          vw: a vw here would be a scrollbar's width too wide. */}
      <div
        ref={track}
        onScroll={(e) => setScrollLeft(e.currentTarget.scrollLeft)}
        onFocus={onFocus}
        tabIndex={pinned ? -1 : 0}
        role="region"
        aria-label={
          pinned
            ? "Solutions, moves sideways as the page scrolls"
            : "Solutions, scrolls horizontally"
        }
        /* The track CLIPS (overflow-hidden when pinned, overflow-x:auto
           otherwise, and that makes overflow-y auto too), so the cards'
           shadows need room INSIDE it or they are sliced off square along
           the bottom edge.
           THE HOVER SHADOW IS THE ONE TO SIZE FOR, and it is much bigger
           than the resting one: 0 26px 54px -20px reaches 26+54-20 = 60px
           below the card, and the hover lift raises the card 4px so the
           shadow's own bottom lands ~56px below where the card rests.
           40px was not enough — measured, the shadow was still
           rgb(229,228,228) at the clip and snapped to the page ground in
           a single step, which is exactly the hard line you see. */
        className={`pb-[4.5rem] pt-4 pe-[var(--space-gutter)] ps-[max(var(--space-gutter),calc((100%_-_84rem)/2))] ${
          pinned
            ? "mt-[clamp(1.5rem,4vh,3rem)] min-h-0 flex-1 overflow-hidden"
            : "mt-[var(--space-block)] snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth scroll-ps-[max(var(--space-gutter),calc((100%_-_84rem)/2))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-canvas"
        }`}
      >
        <ul
          className="flex h-full w-max items-stretch gap-4"
          style={pinned ? { transform: `translate3d(${-x}px,0,0)`, willChange: "transform" } : undefined}
        >
          {/* The opening panel: the title block, on the live field. Taller
              type than the cards because it is the only thing on it. */}
          <li
            className={`relative shrink-0 snap-start overflow-hidden ground-deep ${PANEL_SKIN}`}
            style={{ width: PANEL_W, height: panelH }}
          >
            <FlowField tune={FIELD.RAIL} />
            <div className="relative flex h-full flex-col p-[clamp(1.5rem,2vw,2rem)] text-text">
              {/* White, not muted, on both lines. See the note on
                  FIELD.RAIL: this panel's ground is brighter than the
                  hero's and only white clears it. */}
              <p className="text-xs uppercase tracking-[0.18em]">
                Full-stack digital
              </p>
              {/* Company Profile.pdf p5's own framing. */}
              <h3 className="mt-auto max-w-[12ch] font-display text-[clamp(1.75rem,3.2vw,2.75rem)] font-bold leading-[1.02] tracking-[-0.03em]">
                One partner, every layer
              </h3>
              <p className="mt-4 max-w-[26ch] text-base leading-[1.6]">
                Scroll the stack — front end, back end, intelligence, growth.
              </p>
            </div>
          </li>

          {panels}
        </ul>
      </div>
        </div>
      </div>
    </section>
  );
}
