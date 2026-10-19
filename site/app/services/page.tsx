import type { Metadata } from "next";
import Link from "next/link";
import Ecosystem from "@/app/components/Ecosystem";
import Faq from "@/app/components/Faq";
import IndustryRows from "@/app/components/IndustryRows";
import ClienteleWall from "@/app/components/ClienteleWall";
import { SERVICES } from "@/data/services";
import SolutionRail from "@/app/components/SolutionRail";

export const metadata: Metadata = {
  title: "Services",
  // PLACEHOLDER: description sentence written for SEO, not quoted from the deck.
  description:
    "Web design, SEO, AI automation, custom business systems, business intelligence and digital transformation — one connected stack, from a Petaling Jaya digital architect.",  /* Canonical. metadataBase makes this absolute. Without it every
     variant Google reaches this page by is a separate candidate it has
     to pick between. */
  alternates: { canonical: "/services" },
};

/**
 * The page was a headline, a paragraph, six one-line rows and a logo strip.
 * It now carries the deck's actual argument, and none of it is invented:
 *
 *   · the ecosystem loop from p6, which the site made nowhere;
 *   · a block per solution carrying BOTH of its paragraphs, which were
 *     written long ago, live in data/services.ts, and had only ever
 *     appeared on the detail pages. Six services times two paragraphs is
 *     the substance this page was missing, and none of it needed writing.
 *
 * STILL MISSING, AND IT NEEDS THE CLIENT: which project used which service.
 * That is the one addition that would put proof on this page, and it cannot
 * be inferred from anything we hold.
 */
export default function ServicesIndex() {
  return (
    /* The gutter lives on the SHELLS, not on <main>, so the rail can be a
       direct child at the full width of the page. The alternative — a
       negative margin in viewport units — is how pages acquire a sideways
       scrollbar, because 100vw counts the scrollbar and the layout does
       not. */
    /* pt only: the closing band is full bleed and ends the page, so a
       bottom padding here would leave a strip of the flat ground under it
       and make it look inset all over again. */
    <main className="ground-flat">
      {/* ---- hero, 2026-10-19: the deck's p5 headline over the six
          solutions in the deck's own colour blocks — every block a link. ---- */}
      <section
        data-hero
        className="ground-deep relative overflow-hidden px-[var(--space-gutter)] pb-[clamp(4rem,8vw,7rem)] pt-[calc(var(--nav-h)+clamp(2.5rem,7vh,5rem))] -mt-[var(--nav-h)]"
      >
        <div aria-hidden="true" className="work-grid" />
        <div className="relative mx-auto max-w-[84rem]">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[clamp(3rem,7.4vw,7.25rem)] font-bold leading-[0.9] tracking-[-0.045em] lg:col-span-8">
              One Partner.
              <br />
              Every Digital Need.
            </h1>
            {/* Company Profile.pdf p4, verbatim. */}
            <p className="max-w-[30ch] text-lead leading-[1.4] text-text-muted lg:col-span-4 lg:pb-3">
              The tools exist. They&rsquo;re just not connected into one system.
            </p>
          </div>
          <ul className="svc-mosaic mt-[clamp(2.5rem,6vw,4.5rem)]">
            {SERVICES.map((s) => (
              <li key={s.slug} className="svc-tile" data-k={s.slug}>
                <Link href={`/services/${s.slug}`} className="svc-tile-link">
                  <span className="svc-tile-name">{s.deckName}</span>
                  <span className="svc-tile-sum">{s.summary}</span>
                  <span aria-hidden="true" className="svc-tile-arrow">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="px-[var(--space-gutter)]">
        <div className="mx-auto max-w-[84rem]">
        <Ecosystem />
        </div>
      </div>

      {/* Full width: the rail runs edge to edge and scrolls past both. */}
      <SolutionRail />

      <div className="px-[var(--space-gutter)]">
        <div className="mx-auto max-w-[84rem]">
        {/* Who the solutions are for, and the first route from them to
            the proof. */}
        <IndustryRows />


        {/* Before the ask, not after it. */}
        <Faq />
        </div>
      </div>

      {/* The clientele, as Xin listed it on 2026-10-19 (data/clientele.ts). */}
      <div className="mt-[var(--space-section)]">
        <ClienteleWall id="clientele-services" tone="deep" />
      </div>

      {/* ---- the close ----
          FULL BLEED, NOT A FLOATING PANEL. A rounded blue box inset from
          both margins read as a banner dropped onto the page — one more
          card after a page of cards, and the weakest-looking thing on it.
          Edge to edge it is a change of ground, which is what the end of a
          page should be. It is a direct child of <main> for the same
          reason the rail is: the gutter lives on the shells.

          NO DECORATION. A brand glyph sat in the top-right corner at 16%
          opacity. It was ornament with nothing to say, and at this size it
          read as a watermark on a letterhead.

          ONE BLOCK WITH THE FOOTER, DELIBERATELY. This band and the
          footer are now the same surface, which is a reversal: the band
          was moved to .ground-deep precisely BECAUSE canvas-on-canvas
          merged invisibly into the footer. That merge was the right
          instinct badly executed — the problem was never that they
          matched, it was that nothing marked where one ended.

          What .ground-deep bought instead was worse. Measured across the
          join, the two blues differed by 36 at the left of the page and
          87 at the right, because the deep ground carries a gradient
          that darkens rightward while the footer is flat. A seam whose
          strength changes across the width reads as a rendering fault,
          not a decision. Two surfaces nearly the same colour is the bad
          case: too close to be a change, too far to be continuous.

          So: identical surfaces, and a hairline where the argument stops
          and the small print starts. White on canvas is 11.45:1, muted
          is 6.88:1 — the same numbers the footer has always run on. */}
      <section
        aria-labelledby="services-cta"
        /* No bottom padding: the hairline's breathing room above comes from
           the inner block and below from the footer's own. Three paddings
           stacked left a void under the rule. */
        className="ground-grain mt-[var(--space-section)] px-[var(--space-gutter)] pt-[clamp(4rem,10vw,7.5rem)]"
      >
        <div className="mx-auto max-w-[84rem] border-b border-hairline pb-[clamp(3rem,6vw,4.5rem)]">
          <h2
            id="services-cta"
            className="max-w-[16ch] font-display text-section font-bold leading-[1.02] tracking-[-0.03em] sm:text-major"
          >
            Not sure which layer you need?
          </h2>
          {/* PLACEHOLDER: ours. It promises a conversation and nothing else,
              which is the only thing that can be promised without knowing
              who is reading. */}
          <p className="mt-6 max-w-[46ch] text-lead text-text-muted">
            Most people arrive needing one thing and leave having found the
            layer underneath it. Tell us what is slow, and we will tell you
            where it actually starts.
          </p>
          {/* One affordance, not two. The email used to sit beside this
              link and the footer repeats it about 200px below — fine
              when a strip of page separated them, plainly redundant now
              that they share a surface. The footer keeps it. */}
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center border-b border-accent text-base text-accent"
            >
              Start a conversation →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
