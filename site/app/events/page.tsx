import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENTS } from "@/data/events";
import InstagramFeed from "@/app/components/InstagramFeed";

export const metadata: Metadata = {
  title: "Events",
  // PLACEHOLDER: written for SEO, not quoted from the client.
  description:
    "Talks, trainings, shoots and launches TheWebxite has taken part in, in photographs.",  /* Canonical. metadataBase makes this absolute. Without it every
     variant Google reaches this page by is a separate candidate it has
     to pick between. */
  alternates: { canonical: "/events" },
};

/**
 * Events, separated from News at the client's request: News is for writing,
 * this is for activities.
 *
 * PHOTOGRAPHS AND DATES, NOTHING ELSE. There is no description under any of
 * these and that is deliberate — see the note in data/events.ts. The
 * headings are the client's own folder names and the dates come from the
 * photographs themselves, so every word on this page is something we can
 * point at. The moment real titles and a line of copy arrive, they drop
 * into the data file and this component does not change.
 *
 * COLUMNS, NOT A GRID OF TILES. The set mixes 4:3 landscape, 3:4 portrait
 * and phone verticals. A uniform tile grid would crop all of them to one
 * shape and cut people out of their own photographs; CSS columns let each
 * image keep its aspect ratio. The cost is that reading order runs down
 * each column rather than across, which for a gallery is no cost at all.
 */
const FMT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function EventsIndex() {
  return (
    <main>
      {/* ---- hero: the name, and a filmstrip of every event ---- */}
      <section
        data-hero
        className="ground-deep relative overflow-hidden pb-[clamp(3rem,6vw,5rem)] pt-[calc(var(--nav-h)+clamp(2.5rem,7vh,5rem))] -mt-[var(--nav-h)]"
      >
        <div aria-hidden="true" className="work-grid" />
        <div className="relative mx-auto max-w-[84rem] px-[var(--space-gutter)]">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <h1 className="font-display text-[clamp(3.5rem,10vw,9rem)] font-bold leading-[0.88] tracking-[-0.045em] lg:col-span-7">
              Events
            </h1>
            {/* PLACEHOLDER: ours. It claims nothing about any particular event. */}
            <p className="max-w-[40ch] text-lead leading-[1.45] text-text-muted lg:col-span-5 lg:pb-3">
              Trainings, shoots, talks and launches — in photographs. And at the
              foot of the page, the studio&rsquo;s Instagram.
            </p>
          </div>
        </div>
        <ul className="ev-strip relative mt-[clamp(2.5rem,5vw,4rem)]" aria-label="Jump to an event">
          {EVENTS.map((e) => (
            <li key={e.slug}>
              <Link href={`#${e.slug}`} className="ev-frame group">
                <Image
                  src={e.photos[0].src}
                  alt=""
                  width={e.photos[0].width}
                  height={e.photos[0].height}
                  sizes="(max-width: 768px) 70vw, 24rem"
                  priority
                  className="ev-frame-img"
                />
                <span className="ev-frame-cap">
                  <span className="block font-display text-base font-bold leading-[1.15]">{e.name}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-text-muted">
                    <time dateTime={e.date}>{FMT.format(new Date(`${e.date}T00:00:00`))}</time>
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link href="#instagram" className="ev-frame ev-frame-ig">
              <span className="font-display text-lead font-bold">From our Instagram ↓</span>
            </Link>
          </li>
        </ul>
      </section>

      {/* ---- each event: the record on the left, the photographs on the right ---- */}
      <div className="ground-flat px-[var(--space-gutter)] pb-[var(--space-section)]">
        <div className="mx-auto max-w-[84rem]">
          {EVENTS.map((e) => (
            <section
              key={e.slug}
              id={e.slug}
              aria-labelledby={`event-${e.slug}`}
              className="grid scroll-mt-[calc(var(--nav-h)+1rem)] gap-x-12 gap-y-6 border-t border-hairline-ink pt-[var(--space-block)] mt-[var(--space-block)] first:mt-0 first:border-t-0 lg:grid-cols-12"
            >
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
                  <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                    <time dateTime={e.date}>{FMT.format(new Date(`${e.date}T00:00:00`))}</time>
                  </p>
                  <h2
                    id={`event-${e.slug}`}
                    className="mt-4 font-display text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1] tracking-[-0.03em]"
                  >
                    {e.name}
                  </h2>
                  <p className="mt-4 text-sm text-ink-muted">
                    {e.photos.length} photo{e.photos.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className={`gap-4 [column-fill:_balance] lg:col-span-8 ${e.photos.length > 1 ? "sm:columns-2" : ""} ${e.photos.length > 4 ? "xl:columns-3" : ""}`}>
                {e.photos.map((p) => (
                  <Image
                    key={p.src}
                    src={p.src}
                    alt={e.name}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 27rem"
                    className="mb-4 h-auto w-full rounded-[var(--radius-md)]"
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <InstagramFeed />
    </main>
  );
}
