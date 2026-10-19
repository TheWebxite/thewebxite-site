import Reveal from "./Reveal";

/**
 * numbered-steps-horizontal. Company Profile p7 verbatim — the numerals are
 * the client's own, which is why they are allowed: the ruleset bans invented
 * meta-labels like "SECTION 01", not a sequence the client already numbers.
 *
 * One hairline runs edge to edge behind the row so it reads as a single
 * process rather than four separate items.
 */
const STEPS = [
  { n: "01", name: "Discover", lead: "Understand Your Business", body: "Identify business challenges, opportunities, and objectives." },
  { n: "02", name: "Design", lead: "Plan The Right Solution", body: "Define the strategy, solution architecture, and implementation roadmap." },
  { n: "03", name: "Deliver", lead: "Build The Solution", body: "Develop, test, and integrate the solution." },
  { n: "04", name: "Drive", lead: "Accelerate Growth", body: "Measure performance, optimise results, and support long-term growth." },
];

export default function Process() {
  return (
    <section
      id="process"
      className="ground-deck relative overflow-hidden px-[var(--space-gutter)] py-[var(--space-section)]"
    >
      {/* No shader here. This is the deck page's OWN ground — see
          .ground-deck in globals.css — because a flowing field wearing
          these colours is not the same thing as the page it came from.
          The copy on it is white, and that is what allows the brightness:
          .ground-deck reaches 0.118 luminance, over the 0.0903 ceiling
          --color-text-muted would need. */}

      <div className="relative mx-auto max-w-[84rem]">
        <h2 className="max-w-[20ch] font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">
          Our 4D approach and delivery framework
        </h2>

        <ol className="mt-[var(--space-block)] grid border-t border-hairline md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.n}
              data-step-4d={s.n}
              delayIndex={i}
              className="min-w-0 border-b border-hairline py-8 md:border-b-0 md:pr-8"
            >
              <p className="font-display text-lead font-bold tabular-nums">
                {/* No opacity here: a translucent colour is not what
                     getComputedStyle reports, so it would make the contrast
                     measurement lie. The ordinal is simply white, as it is
                     on the deck page. */}
                <span>{s.n}</span> {s.name}
              </p>
              <p className="mt-3 text-base font-medium">{s.lead}</p>
              <p className="mt-2 max-w-[34ch] text-base text-text">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
