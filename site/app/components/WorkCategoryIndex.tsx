import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import type { WorkCategory } from "@/data/work-categories";
import { WORK_CATEGORIES } from "@/data/work-categories";

/**
 * One kind of work, and what we can show of it.
 *
 * THREE OF THE FOUR ARE EMPTY and say so. All eight projects in the
 * repo are websites; there is no record of a systems build, an AI
 * training engagement or a Lark rollout — no client, no date, no
 * capture. The categories exist because the client says the work
 * does, and the pages state plainly that nothing is published yet
 * rather than filling themselves with language that implies otherwise.
 * This is the shape /news has used since launch for the same reason.
 *
 * It is a declared absence, not a placeholder: when the engagements
 * arrive they are entries in data/projects.ts with a different
 * `category`, and this page lists them with no change here.
 */
export default function WorkCategoryIndex({
  category,
  projects,
}: {
  category: WorkCategory;
  projects: Project[];
}) {
  return (
    <main className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        {/* NO BACK-LINK. There is no /work index above this page — the
            four kinds are the top of the section — so a "back" here
            would have to invent a parent. The sibling nav at the foot
            is how a reader moves across them. */}
        <h1 className="font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
          {category.name}
        </h1>

        {projects.length > 0 ? (
          <ul className="mt-[var(--space-block)] border-t border-hairline-ink">
            {projects.map((p) => (
              <li
                key={p.slug}
                data-project={p.slug}
                className="grid min-w-0 gap-x-10 gap-y-6 border-b border-hairline-ink py-[clamp(1.75rem,3.5vw,3rem)] lg:grid-cols-12"
              >
                {p.image ? (
                  <Link
                    href={`/work/${p.slug}`}
                    aria-hidden="true"
                    tabIndex={-1}
                    className="group block min-w-0 lg:col-span-7"
                  >
                    <Image
                      src={p.image}
                      alt={p.alt}
                      width={2048}
                      height={1280}
                      sizes="(max-width: 1024px) 100vw, 52rem"
                      className="h-auto w-full max-w-full rounded-[0.75rem] transition-opacity group-hover:opacity-90"
                    />
                  </Link>
                ) : null}
                <div className="flex min-w-0 flex-col lg:col-span-5 lg:h-full">
                  <h2 className="font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">
                    <Link
                      href={`/work/${p.slug}`}
                      className="hover:text-ink-muted"
                    >
                      {p.client}
                    </Link>
                  </h2>
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-5 lg:mt-auto lg:pt-10">
                    <ul className="min-w-0 text-xs uppercase tracking-[0.16em] text-ink-muted">
                      <li>{p.sector}</li>
                      <li className="mt-1">
                        {p.country === "NZ" ? "New Zealand" : p.country === "VN" ? "Vietnam" : "Malaysia"}
                      </li>
                    </ul>
                    <Link
                      href={`/work/${p.slug}`}
                      className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-canvas px-6 text-xs uppercase tracking-[0.16em] text-text transition-opacity hover:opacity-90"
                    >
                      Explore<span className="sr-only"> {p.client}</span>
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          /* PLACEHOLDER: ours. Says only that nothing is published —
             no claim about the work itself, which we have no record
             of either way. */
          <div
            data-empty-category
            className="mt-[var(--space-block)] max-w-[52ch]"
          >
            <p className="text-lead leading-[1.55] text-ink-muted">
              Nothing published here yet. The work exists; the write-ups do not.
              In the meantime, see{" "}
              <Link
                href="/work/web-design"
                className="border-b border-ink text-ink hover:text-canvas"
              >
                the sites we have built
              </Link>{" "}
              or{" "}
              <Link
                href="/contact"
                className="border-b border-ink text-ink hover:text-canvas"
              >
                ask us about this directly
              </Link>
              .
            </p>
          </div>
        )}

        {/* The other three kinds, from wherever you have landed. */}
        <nav
          aria-label="Other work"
          className="mt-[var(--space-section)] border-t border-hairline-ink pt-[var(--space-block)]"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
            Other work
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {WORK_CATEGORIES.filter((c) => c.slug !== category.slug).map(
              (c) => (
                <li key={c.slug}>
                  <Link
                    href={`/work/${c.slug}`}
                    className="inline-flex min-h-[44px] items-center font-display text-lead font-bold tracking-[-0.02em] hover:text-canvas"
                  >
                    {c.name}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </main>
  );
}
