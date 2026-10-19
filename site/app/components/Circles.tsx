"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Company Profile p9, reproduced.
 *
 * Every number here was MEASURED off `.pdfpages/p-09.png` (1440x810) by
 * fitting the rendered arcs, not estimated by eye. Two earlier attempts got
 * the construction wrong, so the findings are recorded:
 *
 *   · The circles are NOT concentric. Rings 1 and 2 are the same size
 *     (59.0% and 59.7% of page width) offset horizontally; ring 3 is smaller
 *     (40.3%) and right-aligned with ring 2. All three share one vertical
 *     centre at 46.9% of page height, and rings 2 and 3 run off the right
 *     edge (right edges at 117% of width).
 *   · The deck's own text colour is #0253C7, not either of our blues, and the
 *     ground is #E3E3E3, not our #F3F2F0 surface.
 *
 * Two deliberate departures, both for legibility, both minimal:
 *   · Ring 2's fill is lightened from the deck's #B4B4B4 to #C6C6C6. #0253C7
 *     on #B4B4B4 measures 3.30:1, below the 4.5:1 body floor; on #C6C6C6 it
 *     clears it. The step between the three rings is preserved.
 *   · Ring 3's text is #FFFFFF rather than the deck's #F3F2F0 — 4.62:1
 *     instead of 4.13:1. Visually indistinguishable at this size.
 */
const DECK = {
  ground: "#E3E3E3",
  ink: "#0253C7",
  ring1: "#D8D8D8",
  ring2: "#C6C6C6",
  ring3: "#0074DD",
  onRing3: "#FFFFFF",
};

/* left edge and diameter as a % of the section's width; cy as % of height.
   Taken straight from the circle fit. */
const RINGS = [
  { left: 35.9, d: 59.0, fill: DECK.ring1, animates: true },
  { left: 57.5, d: 59.7, fill: DECK.ring2, animates: true },
  /* The blue ring NEVER animates. Its column's text is white, so any frame
     where it has slid away or is still fading leaves white type on light
     grey — about 1.1:1. The two grey rings can move freely: the text over
     them is blue, and blue clears 4.5:1 against the page ground, ring 1 and
     ring 2 alike, so no frame of their motion can make it unreadable. */
  { left: 76.7, d: 40.3, fill: DECK.ring3, animates: false },
];
const CY = 46.9;

/* Columns sit just inside their own ring's left edge, so they track the arcs
   at every width rather than drifting out of their band. */
const STEPS = [
  {
    n: 1,
    title: "Tech Consultation",
    body: "We get to know your business, map where the gaps are, and pinpoint where web, automation or AI will actually move the needle.",
    left: 39.4,
  },
  {
    n: 2,
    title: "Free Demo",
    body: "See it working before you commit — a real demo built around your use case, not just slides and promises.",
    left: 61.0,
  },
  {
    n: 3,
    title: "Follow-up Timeline",
    body: "Once we're rolling, you get clear milestones and regular check-ins, so you always know what's shipping and when.",
    left: 80.2,
  },
];

export default function Circles() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (!root.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-ring]", {
        xPercent: 14,
        opacity: 0,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current!, start: "top 75%", end: "bottom 70%", scrub: 0.5 },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="engagement"
      ref={root}
      className="relative overflow-hidden"
      style={{ background: DECK.ground, color: DECK.ink }}
    >
      {/* ---------- desktop: the deck's own composition, to scale ----------
          The deck lays this out on a 1440x810 page but cuts the circles at
          y=659 (81.4%), where its footer bar starts — so the arcs bleed off
          the bottom and no lower curve is ever seen. The clip reproduces that:
          the composition keeps the full 1440x810 geometry, the wrapper shows
          only the top 81.4% of it. */}
      {/* No max-width. Capping the composition at 120rem left bare ground to
          the right of the rings on anything wider than 1920px — the arcs are
          a full-bleed field, like the deck's page, so they must always reach
          both edges. */}
      <div className="relative hidden aspect-[1440/659] w-full overflow-hidden lg:block">
        <div className="absolute inset-x-0 top-0 aspect-[1440/810] w-full">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {RINGS.map((r) => (
            <div
              key={r.left}
              {...(r.animates ? { "data-ring": "" } : {})}
              className="absolute rounded-full"
              style={{
                left: `${r.left}%`,
                top: `${CY}%`,
                width: `${r.d}%`,
                aspectRatio: "1",
                transform: "translateY(-50%)",
                background: r.fill,
              }}
            />
          ))}
        </div>

        <p className="absolute text-base" style={{ left: "3.6%", top: "7.5%" }}>
          Contact Us
        </p>

        {/* Company Profile.pdf p9, verbatim. */}
        <h2
          className="absolute font-display font-bold"
          style={{
            left: "3.6%",
            top: "24%",
            width: "32%",
            fontSize: "clamp(2rem, 3.4vw, 3.4rem)",
            lineHeight: 1.12,
            letterSpacing: "-0.02em",
          }}
        >
          We are always ready to help you and answer your questions
        </h2>

        <ol className="contents">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              data-step={s.n}
              className="absolute"
              style={{
                left: `${s.left}%`,
                top: `${CY}%`,
                width: "15.5%",
                transform: "translateY(-50%)",
                color: i === 2 ? DECK.onRing3 : DECK.ink,
              }}
            >
              <h3 className="font-display text-lead font-bold leading-[1.2]">{s.title}</h3>
              <p className="mt-4 text-base leading-[1.5]" style={{ color: "inherit" }}>
                {s.body}
              </p>
            </li>
          ))}
          </ol>
        </div>
      </div>

      {/* ---------- below lg: the arcs cannot work, so the content leads ---------- */}
      <div className="px-[var(--space-gutter)] py-[var(--space-section)] lg:hidden">
        <p className="text-base">Contact Us</p>
        <h2 className="mt-5 max-w-[18ch] font-display text-2xl font-bold leading-[1.1] tracking-[-0.02em] sm:text-section">
          We are always ready to help you and answer your questions
        </h2>
        <ol className="mt-[var(--space-block)] grid gap-8 sm:grid-cols-3 sm:gap-7">
          {STEPS.map((s) => (
            <li
              key={s.n}
              data-step-stacked={s.n}
              className="min-w-0 border-t pt-5"
              style={{ borderColor: "rgba(2,83,199,0.25)" }}
            >
              <h3 className="font-display text-lead font-bold leading-[1.2]">{s.title}</h3>
              <p className="mt-3 text-base leading-[1.55]">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
