import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LAYERS, SERVICES, serviceBySlug, SERVICE_SLUGS, type LayerKey } from "@/data/services";
import { FEATURED, desktopOf } from "@/data/portfolio";
import ServiceStack from "@/app/components/ServiceStack";
import ScrubText from "@/app/components/ScrubText";

const LAYER_BY_KEY = Object.fromEntries(LAYERS.map((l) => [l.key, l])) as Record<LayerKey, (typeof LAYERS)[number]>;

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    // PLACEHOLDER: description sentence after the deck copy is written, not quoted.
    description: `${s.summary} ${s.detail[0]} TheWebxite, a Petaling Jaya digital architect serving SMEs across Malaysia.`,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

const STEPS = [
  { n: "01", name: "Discover", lead: "Understand Your Business", body: "Identify business challenges, opportunities, and objectives." },
  { n: "02", name: "Design", lead: "Plan The Right Solution", body: "Define the strategy, solution architecture, and implementation roadmap." },
  { n: "03", name: "Deliver", lead: "Build The Solution", body: "Develop, test, and integrate the solution." },
  { n: "04", name: "Drive", lead: "Accelerate Growth", body: "Measure performance, optimise results, and support long-term growth." },
];

/**
 * One template, six pages, rebuilt 2026-10-19 to carry the weight of the
 * home page. Every word is the deck's (p5, p6, p7, p9), the old WordPress
 * Services page, or the two paragraphs in data/services.ts:
 *
 *   hero — the service's name set huge, its layer lifted out of the stack
 *   what it is — the two paragraphs, and the old site's own description
 *   included — the deck's p5 items as a slow full-bleed band
 *   how we deliver — the 4D framework, p7
 *   recent work — three live sites, explicitly NOT claimed for this service
 *   start — p9's three steps, and one ask
 */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();

  const layer = LAYER_BY_KEY[s.layer];
  const others = SERVICES.filter((o) => o.slug !== s.slug);
  /* Three projects as a sample, rotated per page. NOT filtered by service —
     we hold no record of which service produced which project. */
  const idx = SERVICES.findIndex((o) => o.slug === s.slug);
  const evidence = Array.from({ length: 3 }, (_, k) => FEATURED[(idx * 3 + k) % FEATURED.length]);
  const rest = s.title.replace(`${s.deckName} — `, "");
  const band = [...s.included, ...s.included, ...s.included, ...s.included];

  return (
    <main>
      {/* ---- hero ---- */}
      <section
        data-hero
        className="ground-deep relative overflow-hidden px-[var(--space-gutter)] pb-[clamp(4rem,8vw,7rem)] pt-[calc(var(--nav-h)+clamp(2.5rem,7vh,5rem))] -mt-[var(--nav-h)]"
      >
        <div aria-hidden="true" className="work-grid" />
        <div className="relative mx-auto grid max-w-[84rem] items-center gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
              <Link href="/services" className="hover:text-accent">Services</Link>
              <span aria-hidden="true"> / </span>
              {layer.eyebrow}
            </p>
            <h1 className="mt-6 font-display font-bold tracking-[-0.04em]">
              <span className="block text-[clamp(3.25rem,8.2vw,8rem)] leading-[0.9]">{s.deckName}</span>
              <span className="mt-5 block max-w-[24ch] text-[clamp(1.35rem,2.3vw,2rem)] font-medium leading-[1.2] tracking-[-0.015em] text-text-muted">
                {rest}
              </span>
            </h1>
            <p className="mt-8 max-w-[44ch] text-lead leading-[1.45]">{s.summary}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center gap-3 rounded-[var(--radius-sm)] bg-text px-6 text-base font-medium text-canvas transition-opacity hover:opacity-90"
              >
                Book a tech consultation <span aria-hidden="true">→</span>
              </Link>
              <Link href="/services" className="inline-flex min-h-[44px] items-center border-b border-text-muted text-base text-text-muted hover:text-accent">
                See the whole stack
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <ServiceStack active={s.layer} />
          </div>
        </div>
      </section>

      {/* ---- what it is ---- */}
      <section className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="mx-auto grid max-w-[84rem] gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label !text-ink-muted">What it is</p>
            <p className="mt-6 font-display text-[clamp(2rem,3.4vw,3rem)] font-bold leading-[1] tracking-[-0.03em] text-canvas">{layer.name}</p>
            <p data-layer className="mt-6 max-w-[30ch] text-base text-ink-muted">
              Sits in the <strong className="font-medium text-ink">{layer.name}</strong> layer of the stack — {layer.gloss.toLowerCase()}. <span className="text-ink">{layer.sub}.</span>
            </p>
          </div>
          <div className="lg:col-span-8">
            <ScrubText
              text={s.detail[0]}
              className="max-w-[26ch] font-display text-[clamp(2rem,4.4vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em] text-ink"
            />
            <div className="mt-[var(--space-block)] grid gap-8 md:grid-cols-2">
              {[...s.detail.slice(1), ...s.more].map((d) => (
                <p key={d} className="border-t border-hairline-ink pt-5 text-lead leading-[1.5] text-ink-muted">
                  {d}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---- included, full bleed ---- */}
      <section aria-label="What is included" className="ground-flat pb-[var(--space-section)] text-ink">
        <div className="inc-band">
          <div className="inc-track">
            {band.map((t, k) => (
              <span key={k} className="inc-item" aria-hidden={k >= s.included.length ? "true" : undefined}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- how we deliver: 4D, p7 ---- */}
      <section className="ground-deck relative overflow-hidden px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="relative mx-auto max-w-[84rem]">
          <div className="grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em] lg:col-span-7">
              How we deliver it
            </h2>
            <p className="max-w-[40ch] text-text lg:col-span-5">Our 4D approach and delivery framework — the same four steps on every engagement.</p>
          </div>
          {/* The deck's p7 sets the four as colour blocks, light to dark. */}
          <ol className="mt-[var(--space-block)] grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((st, k) => (
              <li
                key={st.n}
                style={{ background: ["#8CDBFF", "#005fb8", "#2c4fc9", "#071238"][k], color: k === 0 ? "#071238" : "#FFFFFF" }}
                className="group flex min-h-[clamp(16rem,26vw,22rem)] min-w-0 flex-col rounded-[var(--radius-md)] p-[clamp(1.25rem,2vw,1.75rem)] transition-transform duration-500 hover:-translate-y-1.5"
              >
                <p className="font-display text-[clamp(3.5rem,6vw,5.5rem)] font-bold leading-none tabular-nums tracking-[-0.05em]">{st.n}</p>
                <div className="mt-auto pt-8">
                  <p className="font-display text-[clamp(1.5rem,2.2vw,2rem)] font-bold leading-none tracking-[-0.02em]">{st.name}</p>
                  <p className="mt-3 text-base font-medium">{st.lead}</p>
                  <p className="mt-2 max-w-[30ch] text-base opacity-90">{st.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- recent work ---- */}
      <section className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="mx-auto max-w-[84rem]">
          <div className="grid gap-x-12 gap-y-4 lg:grid-cols-12 lg:items-end">
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em] lg:col-span-7">Recent work</h2>
            {/* PLACEHOLDER: written to make explicit that this sample carries no service claim. */}
            <p className="max-w-[44ch] text-sm text-ink-muted lg:col-span-5">
              A sample of the studio&rsquo;s work across all six services — not a list of projects that used this one.
            </p>
          </div>
          <ul className="mt-[var(--space-block)] grid gap-x-8 gap-y-12 lg:grid-cols-12">
            {evidence.map((p, k) => (
              <li key={p.key} className={k === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"}>
                <Link href={p.detail ? `/work/${p.detail}` : "/work"} className="sw-card group">
                  <div className="sw-frame">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={desktopOf(p) ?? ""} alt={`${p.client} website`} loading="lazy" className="sw-img" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.16em] text-ink-muted">{p.field} · {p.place}</p>
                  <p className={`mt-2 font-display font-bold tracking-[-0.025em] group-hover:text-canvas ${k === 0 ? "text-[clamp(1.75rem,3vw,2.75rem)]" : "text-lead"}`}>
                    {p.client} <span aria-hidden="true">→</span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/work" className="mt-10 inline-flex min-h-[44px] items-center border-b border-ink text-base hover:text-canvas">
            All work
          </Link>
        </div>
      </section>

      {/* ---- start: p9 ---- */}
      <section className="ground-grain px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="mx-auto max-w-[84rem]">
          <h2 className="max-w-[18ch] font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.035em]">
            We are always ready to help you and answer your questions
          </h2>
          <ol className="mt-[var(--space-block)] grid gap-8 md:grid-cols-3">
            {[
              ["Tech Consultation", "We get to know your business, map where the gaps are, and pinpoint where web, automation, or AI will actually move the needle."],
              ["Free Demo", "See it working before you commit — a real demo built around your use case, not just slides and promises."],
              ["Follow-up Timeline", "Once we're rolling, you get clear milestones and regular check-ins, so you always know what's shipping and when."],
            ].map(([h, b], k) => (
              <li key={h} className="border-t border-hairline pt-6">
                <p className="text-xs uppercase tracking-[0.16em] text-text-muted">Step {k + 1}</p>
                <p className="mt-3 font-display text-lead font-bold">{h}</p>
                <p className="mt-3 max-w-[36ch] text-text-muted">{b}</p>
              </li>
            ))}
          </ol>
          <Link
            href="/contact"
            className="mt-12 inline-flex min-h-[48px] items-center gap-3 rounded-[var(--radius-sm)] bg-text px-6 text-base font-medium text-canvas transition-opacity hover:opacity-90"
          >
            Start with a tech consultation <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---- the other five ---- */}
      <nav aria-label="Other services" className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
        <div className="mx-auto max-w-[84rem]">
          <p className="label !text-ink-muted">Other services</p>
          <ul className="mt-6 border-t border-ink">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/services/${o.slug}`} className="so-row">
                  <span className="so-name">{o.deckName}</span>
                  <span className="hidden text-ink-muted sm:inline">{o.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </main>
  );
}
