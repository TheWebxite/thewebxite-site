import Image from "next/image";
import { INDUSTRIES } from "@/data/industries";

/**
 * Industries, in the client's reference layout: numbered rows, the
 * industry named, a photograph at the right edge.
 *
 * NOTHING HERE IS CLICKABLE, by instruction. The rows are plain list
 * items: no link, no handler, nothing to tab to and nothing to press.
 * An earlier version pointed each row at a case study, and a row that
 * looks like a link and is not is worse than a row that never offered.
 * So the whole interaction is hover, and hover is a courtesy that
 * costs a reader nothing when it does not arrive.
 *
 * WHAT HOVER DOES. The row fills with brand blue and its type turns
 * white — the thing that was asked for — and three smaller things ride
 * along with it:
 *
 *   · the photograph widens and scales inside its frame, so the image
 *     seems to open rather than the row merely changing colour;
 *   · the number brightens to the accent, which is the only hint of
 *     the site's cyan on this page;
 *   · the whole thing takes 300ms, slow enough to read as a reveal.
 *
 * It is CSS only: group-hover and a transition, no state, no script,
 * nothing to hydrate. Under prefers-reduced-motion the colour still
 * changes and the movement does not — the information survives, the
 * animation goes.
 *
 * The photographs are STOCK and illustrate the industry; they are not
 * pictures of the studio's work, which is why none of them links
 * anywhere and why their alt is empty — the row's own heading is the
 * information, and a decorative photograph repeating it would be noise
 * to a screen reader.
 */
export default function IndustryRows() {
  return (
    <section
      aria-labelledby="industries"
      className="mt-[var(--space-section)] grid gap-x-12 border-t border-hairline-ink pt-[var(--space-block)] lg:grid-cols-12"
    >
      <div className="lg:col-span-4 lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
      <h2
        id="industries"
        className="max-w-[12ch] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-bold leading-[0.98] tracking-[-0.035em]"
      >
        Industries and clients we serve
      </h2>
      {/* PLACEHOLDER: ours. */}
      <p className="mt-5 max-w-[46ch] text-ink-muted">
        The businesses we build for, whatever they sell and whoever they
        answer to.
      </p>
      </div>

      <ul className="mt-[var(--space-block)] border-t border-hairline-ink lg:col-span-8 lg:mt-0">
        {INDUSTRIES.map((ind, i) => (
          <li
            key={ind.slug}
            className="group flex items-center gap-4 border-b border-hairline-ink px-[clamp(0.5rem,1.5vw,1.25rem)] py-3 transition-colors duration-300 hover:bg-canvas sm:gap-8"
          >
            <span className="w-8 shrink-0 text-xs tabular-nums text-ink-muted transition-colors duration-300 group-hover:text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>

            <h3 className="min-w-0 flex-1 font-display text-lead font-bold leading-[1.2] tracking-[-0.02em] transition-colors duration-300 group-hover:text-text">
              {ind.name}
            </h3>

            {/* The frame widens; the picture scales inside it. Two
                transitions on two elements, so the image opens out
                rather than simply getting bigger. */}
            <span className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-ink transition-[width] duration-300 ease-out motion-reduce:transition-none sm:w-32 sm:h-20 sm:group-hover:w-52">
              <Image
                src={ind.image}
                alt=""
                aria-hidden="true"
                width={720}
                height={420}
                sizes="10rem"
                className="h-full w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
