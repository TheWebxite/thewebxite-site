import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, projectBySlug, PROJECT_SLUGS } from "@/data/projects";
import CaseStages from "@/app/components/CaseStages";
import WorkCategoryIndex from "@/app/components/WorkCategoryIndex";
import { CATEGORY_SLUGS, categoryBySlug } from "@/data/work-categories";

export const dynamicParams = false;

/* ONE DYNAMIC SEGMENT SERVES TWO NAMESPACES. /work/<category> and
   /work/<project> sit at the same depth, and Next allows only one
   dynamic segment per level, so this route resolves both: a category
   renders its index, a slug renders its case study, anything else is a
   404. The alternative — nesting case studies under their category —
   would read well and would move every existing /work/<slug> URL, so
   it is a change to make deliberately rather than as a side effect of
   adding three empty categories.

   work-categories.ts throws at module load if the two namespaces ever
   collide, which is the failure this arrangement is exposed to. */
export function generateStaticParams() {
  return [...CATEGORY_SLUGS, ...PROJECT_SLUGS].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryBySlug(slug);
  if (category) {
    return {
      title: category.name,
      // PLACEHOLDER: written by us.
      description: `${category.name} by TheWebxite, a Petaling Jaya digital architect.`,
      alternates: { canonical: `/work/${category.slug}` },
    };
  }
  const p = projectBySlug(slug);
  if (!p) return {};
  return {
    title: p.client,
    // PLACEHOLDER: written by us, not quoted from the client's deck.
    description: `${p.client} — ${p.sector}. Built by TheWebxite, a Petaling Jaya digital architect.`,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

/**
 * One template, eight pages. Carries ONLY what can be verified: the capture,
 * the live URL, and facts legible on the site itself.
 *
 * `story` is null for every project because no written record exists — the
 * Company Profile deck's page 8 is a logo wall with no per-project content.
 * Rather than invent one, the page renders an explicit gap. When the client
 * supplies three or four lines, it drops in here with no layout change.
 */
export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = categoryBySlug(slug);
  if (category) {
    return (
      <WorkCategoryIndex
        category={category}
        projects={PROJECTS.filter((x) => x.category === category.slug)}
      />
    );
  }

  const p = projectBySlug(slug);
  if (!p) notFound();

  const i = PROJECTS.indexOf(p);
  const next = PROJECTS[(i + 1) % PROJECTS.length];

  let host: string | null = null;
  if (p.url) {
    try {
      host = new URL(p.url).hostname.replace(/^www\./, "");
    } catch {
      host = p.url;
    }
  }

  return (
    /* THE GUTTER LIVES OUT HERE, NOT ON THE BLOCKS INSIDE.
       With `max-w-[84rem] px-gutter` on each block, the padding sits
       INSIDE the 84rem box, so past that width the text starts one
       whole gutter further in than the header logo and the footer —
       measured 336 against 288 at 1920. Moving it to the parent makes
       the 84rem box the CONTENT box, which is what the chrome, the
       home page, /work and /events have always done. Borders do not
       move: they stay on the same 84rem elements. */
    <main className="ground-flat px-[var(--space-gutter)]">
      <div className="mx-auto max-w-[84rem] pt-10">
        {/* BACK MEANS ITS OWN KIND OF WORK. There is no /work index to
            return to — the four kinds are the pages — and "all work"
            was never where a reader came from anyway. */}
        <Link
          href="/work"
          className="inline-flex min-h-[44px] items-center text-xs text-ink-muted hover:text-canvas"
        >
          ← All work
        </Link>
      </div>

      <header className="mx-auto max-w-[84rem] pb-[var(--space-block)] pt-6">
        <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
          {p.sector}
          {p.country === "NZ" ? " · Hawke's Bay, New Zealand" : p.country === "VN" ? " · Ho Chi Minh City, Vietnam" : " · Malaysia"}
        </p>
        <h1 className="mt-5 max-w-[16ch] break-words font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          {p.client}
        </h1>
        {p.url ? (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-[44px] items-center border-b border-ink text-base hover:text-canvas"
          >
            Visit {host} ↗
          </a>
        ) : null}
      </header>

      {p.image ? (
        /* THE CAPTURE NEEDS AIR UNDER IT. The stages that follow are
             full-bleed colour and this figure is inset by the gutter,
             so with no space between them the two met in an L — the
             capture's bottom edge landing exactly on the colour, 0px
             apart, measured. */
        <figure className="mx-auto mb-[clamp(2.5rem,6vw,5rem)] max-w-[84rem] px-[var(--space-gutter)]">
          <Image
            src={p.image}
            alt={p.alt}
            width={2048}
            height={1280}
            priority
            sizes="(max-width: 1024px) 100vw, 84rem"
            className="h-auto w-full max-w-full"
          />
        </figure>
      ) : null}

      {/* ---- what they needed, and what was built ----
          THE LABELS ARE THIS SITE'S, NOT THE REFERENCE'S. The first
          cut set them in outlined pills, which is the reference's own
          device and the thing that would have made this read as
          copied — the two-column Challenge/Solution structure is
          standard across the trade and belongs to nobody, but that
          pill is theirs. A small letter-spaced label over a hairline
          is what every other section of this site uses, so this one
          uses it too.

          FIVE COLUMNS, A GAP, FIVE COLUMNS. The first cut gave the
          challenge seven of twelve and then capped its measure at
          22ch, so it filled half its own column and left a hole in
          the middle of the block. Equal columns with an empty one
          between them is the same air, placed deliberately, and the
          display line gets a measure it can fill.

          THE TWO SIZES ARE CLOSE ON PURPOSE. The challenge first ran
          at text-section — 40px bold display against 17px body, a
          2.35x jump — and over three sentences that is five heavy
          lines shouting at a quiet paragraph beside it. It is 20-28px
          now, about 1.6x the body, which still reads as the statement
          of the page without flattening the answer next to it. The
          sentences were cut back in the same pass: display type is
          for one thought, and what the challenge lost moved into the
          solution, where body copy can carry it.

          THE REFERENCE OPENS ON THIS, and it is the one thing
          that makes a case study out of a screenshot gallery: the
          frames below show WHAT was made, and nothing else on the page
          says WHY. Two statements, side by side, the challenge set
          large because it is the question the rest of the page
          answers.

          BOTH OR NEITHER. A solution with no challenge is a feature
          list, and a challenge with no solution is a complaint, so the
          block renders only when the pair exists.

          IT IS EMPTY FOR ALL EIGHT TODAY. No written record exists —
          the Company Profile deck's page 8 is a logo wall with no
          per-project content — and inventing one is specifically
          forbidden here and asserted against. The declared gap below
          is the hook for that test. Three or four lines per project
          from the client and this appears with no further change. */}
      {p.challenge && p.solution ? (
        <section
          aria-labelledby="brief"
          data-brief
          className="mx-auto max-w-[84rem] pb-[var(--space-section)]"
        >
          <h2 id="brief" className="sr-only">
            The brief
          </h2>
          <div className="grid gap-x-[clamp(2rem,6vw,5rem)] gap-y-12 lg:grid-cols-12">
            <div className="border-t border-hairline-ink pt-6 lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                Challenge
              </p>
              <p className="mt-6 font-display text-[clamp(1.25rem,1.9vw,1.75rem)] font-bold leading-[1.3] tracking-[-0.015em]">
                {p.challenge}
              </p>
            </div>
            <div className="border-t border-hairline-ink pt-6 lg:col-span-5 lg:col-start-8">
              <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                Solution
              </p>
              <p className="mt-6 max-w-[48ch] leading-[1.75] text-ink-muted">
                {p.solution}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---- the site itself, staged ----
          See CaseStages: the client's own colour, a phone, and an
          order that rotates so eight case studies do not open the same
          way. The flat stack this replaced is described there too.

          FULL BLEED, and it breaks OUT of the gutter rather than the
          page giving the gutter up. Moving the padding off <main> and
          onto each block looked equivalent and is not: `max-w-[84rem]
          px-gutter` puts the padding INSIDE the 84rem box, so past
          that width the text starts one whole gutter further in than
          the header and footer — 336 against 288 at 1920, which is
          the exact fault the note at the top of this file describes
          and which the alignment spec caught within the hour. The
          gutter stays on <main>; CaseStages cancels it with a
          negative margin. */}
      <CaseStages project={p} index={i} />

      <section className="mx-auto grid max-w-[84rem] gap-x-12 gap-y-6 py-[var(--space-section)] lg:grid-cols-12">
        <h2 className="font-display text-[clamp(2.25rem,4.6vw,4.25rem)] font-bold leading-[0.98] tracking-[-0.035em] lg:col-span-4">
          On the site
        </h2>
        <ul
          data-observed
          className="grid border-t border-hairline-ink md:grid-cols-2 md:gap-x-10 lg:col-span-8"
        >
          {p.observed.map((o) => (
            <li
              key={o}
              className="border-b border-hairline-ink py-5 text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.4]"
            >
              {o}
            </li>
          ))}
        </ul>
      </section>

      <nav
        aria-label="More work"
        className="mx-auto max-w-[84rem] border-t border-hairline-ink py-[var(--space-block)]"
      >
        <Link
          href={`/work/${next.slug}`}
          className="group inline-flex min-h-[44px] flex-col justify-center"
        >
          <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Next
          </span>
          <span className="mt-2 font-display text-section font-bold tracking-[-0.02em] group-hover:text-canvas">
            {next.client}
          </span>
        </Link>
      </nav>
    </main>
  );
}
