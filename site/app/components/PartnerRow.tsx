import Image from "next/image";
import LogoGrid from "./LogoGrid";
import { CLIENTS } from "@/data/clients";
import { PARTNERS } from "@/data/partners";

/**
 * The stack, as a logo row.
 *
 * Every logo is the ORIGINAL asset out of the PDF, recombined with its alpha
 * mask, so each one sits on the page's own surface instead of carrying a
 * rectangle of someone else's background. That is the whole reason this is
 * not a crop of the rendered deck page.
 *
 * They are NOT greyscaled. A greyscale logo row is the agency reflex, and
 * it costs the one thing these marks are for — being recognised in a
 * glance. They are small and quiet enough already.
 *
 * Each is a real `alt`, not `alt=""`: the name is the information. A
 * visitor who cannot see the row still learns what the work is built on,
 * which is the only reason the row exists.
 */

export default function PartnerRow() {
  return (
    <section aria-labelledby="stack-of" className="mt-[var(--space-section)] border-t border-hairline-ink pt-[var(--space-block)]">
      {/* The deck's own heading for the pair, p8. Both labels below are
          its own too, and both assert a relationship — which is the
          client's to assert, not ours to soften or to change back
          without asking. See data/partners.ts and data/clients.ts. */}
      <h2 id="stack-of" className="font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">
        Clientele &amp; Tech Partners
      </h2>
      {/* Company Profile.pdf p8, verbatim. */}
      <p className="mt-5 max-w-[46ch] text-ink-muted">
        Meet Our Clientele highlights the diverse brands and individuals we
        work with.
      </p>

      <div className="mt-[var(--space-block)]">
        {/* Shown all at once rather than slid past. See LogoGrid. */}
        <section aria-labelledby="clientele">
          <h3 id="clientele" className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Clientele
          </h3>
          <LogoGrid logos={CLIENTS} />
        </section>

        {/* The stack stays still and stays on ONE line: it is short
            enough to read at a glance, and a second moving band under
            the first would be noise. */}
        <section aria-labelledby="tech-partners" className="mt-[var(--space-block)]">
          <h3 id="tech-partners" className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Tech Partners
          </h3>
          {/* ONE ROW THAT ACTUALLY FITS. Fixed-width cells and a fixed
              gap overflowed by 112px at 1680 and produced a scrollbar
              under the logos — "one row" with a scrollbar is two rows
              with extra steps. The cells share the width instead:
              flex-1 with a cap, so seven marks always land on one line
              and simply get smaller as the window narrows. */}
          <ul className="mt-[clamp(2rem,4vh,3rem)] flex items-center justify-between gap-x-[clamp(0.5rem,2vw,2rem)]">
            {PARTNERS.map((p) => (
              /* Same uniform cell as the clientele: height alone does
                 not make logos look the same size. */
              <li
                key={p.name}
                className="flex h-[clamp(2.25rem,3.6vw,3rem)] min-w-0 flex-1 basis-0 items-center justify-center"
              >
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  sizes="10rem"
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
