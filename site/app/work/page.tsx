import type { Metadata } from "next";
import Link from "next/link";
import WorkStage from "@/app/components/WorkStage";
import WorkIndex from "@/app/components/WorkIndex";
import ClienteleWall from "@/app/components/ClienteleWall";

export const metadata: Metadata = {
  title: "Work",
  // PLACEHOLDER: written by us.
  description:
    "Websites designed and built by TheWebxite for restaurants, clinics, manufacturers, associations and universities — every live one linked.",
  alternates: { canonical: "/work" },
};

/**
 * /work — the portfolio, built for showing on a screen in a room.
 *
 *   1. the featured stage: a browser and a phone that load whichever
 *      priority project you pick (WorkStage);
 *   2. the full index, filterable by sector, with a preview that follows
 *      the pointer (WorkIndex);
 *   3. the clientele wall;
 *   4. one ask.
 *
 * Every line about a project is in data/portfolio.ts and is written from
 * the live site itself. No results, no quotes, no numbers.
 */
export default function WorkPage() {
  return (
    <main>
      <section
        data-hero
        className="ground-deep relative overflow-hidden px-[var(--space-gutter)] pb-[clamp(5rem,9vw,8rem)] pt-[calc(var(--nav-h)+clamp(2.5rem,7vh,5rem))] -mt-[var(--nav-h)]"
      >
        <div aria-hidden="true" className="work-grid" />
        <div className="relative mx-auto max-w-[84rem]">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[clamp(3.25rem,9vw,8.75rem)] font-bold leading-[0.9] tracking-[-0.04em] lg:col-span-8">
              Built, shipped,
              <br />
              <span className="text-accent">live.</span>
            </h1>
            {/* PLACEHOLDER: ours. */}
            <p className="max-w-[38ch] text-lead leading-[1.45] text-text-muted lg:col-span-4 lg:pb-3">
              Restaurants, clinics, manufacturers, associations and a university
              library. Pick one and its live site loads into the screens below.
            </p>
          </div>

          <div className="mt-[clamp(3rem,7vw,5.5rem)]">
            <WorkStage />
          </div>
        </div>
      </section>

      <section
        id="index"
        aria-labelledby="index-h"
        className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]"
      >
        <div className="mx-auto max-w-[84rem]">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <h2
              id="index-h"
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.035em] lg:col-span-7"
            >
              The full index
            </h2>
            <p className="max-w-[44ch] text-ink-muted lg:col-span-5">
              Every site we can show, by sector. Point at a name to see it; the
              square marks the featured ones. Case studies open here, live sites
              in a new tab.
            </p>
          </div>
          <div className="mt-[var(--space-block)]">
            <WorkIndex />
          </div>
        </div>
      </section>

      <ClienteleWall id="clientele" tone="deep" />

      <section
        aria-labelledby="work-close"
        className="ground-flat px-[var(--space-gutter)] py-[clamp(5rem,10vw,8rem)]"
      >
        <div className="mx-auto grid max-w-[84rem] gap-x-12 gap-y-8 lg:grid-cols-12 lg:items-end">
          {/* Company Profile.pdf p9, verbatim. */}
          <h2
            id="work-close"
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.035em] lg:col-span-8"
          >
            See it working before you commit.
          </h2>
          <div className="lg:col-span-4">
            <p className="max-w-[40ch] text-ink-muted">
              A real demo built around your use case, not just slides and
              promises.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex min-h-[48px] items-center gap-3 rounded-[var(--radius-sm)] bg-canvas px-6 text-base font-medium text-text transition-opacity hover:opacity-90"
            >
              Ask for a free demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
