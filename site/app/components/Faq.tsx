import { FAQ } from "@/data/faq";

/**
 * The questions a services page is actually asked, answered before the
 * CTA rather than after it — the objection comes first, the ask second.
 *
 * NATIVE <details>, NO JAVASCRIPT. An accordion is the one widget the
 * platform already ships correctly: keyboard operable, announced as a
 * disclosure, findable by the browser's own find-in-page (which expands
 * the match), and working with scripting off. A hand-rolled one is a
 * pile of aria-expanded and arrow-key handling to arrive back where
 * <details> starts.
 *
 * THE FIRST ONE IS OPEN. A column of closed rows reads as empty, which
 * is the problem this section was added to solve; one open answer shows
 * what kind of thing is inside the others.
 *
 * Every answer is sourced — see data/faq.ts, where each carries the deck
 * page or the data file it comes from. Nothing here states a fact the
 * site cannot support, which is why there is no price and no timeline.
 */
export default function Faq() {
  return (
    <section
      aria-labelledby="faq"
      className="mt-[var(--space-section)] grid gap-x-12 border-t border-hairline-ink pt-[var(--space-block)] lg:grid-cols-12"
    >
      <h2
        id="faq"
        className="max-w-[10ch] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-bold leading-[0.98] tracking-[-0.035em] lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:col-span-4 lg:self-start"
      >
        Questions we get asked
      </h2>

      {/* NOT a <dl>. A description list may only contain dt/dd (or divs
          wrapping them), and <details> is not permitted inside one — the
          first cut nested them and produced invalid markup, which is
          exactly the kind of thing assistive tech is left to guess at.
          A heading inside <summary> gives the outline instead. */}
      <div className="mt-[var(--space-block)] border-t border-hairline-ink lg:col-span-8 lg:mt-0">
        {FAQ.map((item, i) => (
          <details
            key={item.q}
            name="services-faq"
            open={i === 0}
            className="group border-b border-hairline-ink"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <h3 className="max-w-[46ch] font-display text-lead font-bold leading-[1.25] tracking-[-0.02em]">
                {item.q}
              </h3>
              {/* A plus that becomes a minus. Rotating one bar is cheaper
                  than swapping icons and cannot get out of step. */}
              <span
                aria-hidden="true"
                className="relative mt-1 h-4 w-4 shrink-0 text-ink-muted"
              >
                <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:rotate-90" />
              </span>
            </summary>
            <div className="max-w-[62ch] pb-7 text-ink-muted">
              {item.a.map((para) => (
                <p key={para} className="mt-0 leading-[1.6] [&+p]:mt-4">
                  {para}
                </p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
