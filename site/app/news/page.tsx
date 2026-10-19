import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "News",
  // PLACEHOLDER: written by us, not quoted from the client's deck.
  description: "Writing from TheWebxite.",  /* Canonical. metadataBase makes this absolute. Without it every
     variant Google reaches this page by is a separate candidate it has
     to pick between. */
  alternates: { canonical: "/news" },
};

/**
 * Honest empty state. There is nothing published here — the old WordPress
 * install held only theme-demo articles, none of which survives — and
 * nothing is invented to fill the gap. See `site/data/news.ts` for why.
 *
 * NEWS AND EVENTS ARE TWO PAGES NOW, at the client's request: this one is
 * for writing, /events is for activities. They were a single nav item
 * ("News & Events") while both were empty; the events have arrived and
 * the writing has not.
 */
export default function NewsIndex() {
  return (
    <main>
      <section
        data-hero
        className="ground-deep relative overflow-hidden px-[var(--space-gutter)] pb-[clamp(3rem,6vw,5rem)] pt-[calc(var(--nav-h)+clamp(3rem,9vh,6rem))] -mt-[var(--nav-h)]"
      >
        <div aria-hidden="true" className="work-grid" />
        <div className="relative mx-auto max-w-[84rem]">
          <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-[-0.045em]">News</h1>
          {/* PLACEHOLDER */}
          <p className="mt-8 max-w-[44ch] text-lead leading-[1.5] text-text-muted">
            Nothing published here yet. In the meantime, here is where the
            studio has been, and what it has built.
          </p>
        </div>
      </section>
      <section className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
        <ul className="mx-auto grid max-w-[84rem] gap-6 md:grid-cols-12">
          {[
            { href: "/events", label: "Events", line: "Trainings, shoots, talks and launches — and our Instagram.", img: "/events/newton-ai-training/1.webp", span: "md:col-span-7" },
            { href: "/work", label: "Work", line: "Every site we can show, live and linked.", img: "/work/index/torii.webp", span: "md:col-span-5" },
          ].map((c) => (
            <li key={c.href} className={c.span}>
              <Link href={c.href} className="group relative block overflow-hidden rounded-[var(--radius-md)] bg-ink text-text">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt="" className="aspect-[4/3] w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-[1.04] md:aspect-auto md:h-[32rem]" />
                <span style={{ background: "linear-gradient(0deg, rgba(0,9,63,0.92) 0%, rgba(0,9,63,0) 100%)" }} className="absolute inset-x-0 bottom-0 p-[clamp(1.25rem,3vw,2.25rem)] pt-24">
                  <span className="block font-display text-[clamp(2.25rem,4.5vw,4rem)] font-bold leading-none tracking-[-0.035em]">{c.label} →</span>
                  <span className="mt-3 block max-w-[36ch] text-text-muted">{c.line}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
