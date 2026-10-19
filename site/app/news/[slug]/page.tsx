import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWS_SLUGS, newsBySlug } from "@/data/news";

export const dynamicParams = false;

export function generateStaticParams() {
  return NEWS_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = newsBySlug(slug);
  return n
    ? {
        title: n.title,
        description: n.body[0],
        alternates: { canonical: `/news/${n.slug}` },
      }
    : {};
}

/**
 * One template for every entry in NEWS. NEWS is empty today, so
 * generateStaticParams returns zero slugs and every /news/<slug> 404s via
 * `notFound()` below — correct, since `dynamicParams = false` means Next
 * will not fall back to server-rendering an unknown slug. The template is
 * ready the moment an entry is added by hand to `site/data/news.ts`.
 */
export default async function NewsEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = newsBySlug(slug);
  if (!n) notFound();

  return (
    <main className="ground-flat mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[var(--space-section)]">
      <Link href="/news" className="inline-flex min-h-[44px] items-center text-xs text-ink-muted hover:text-canvas">
        ← News &amp; Events
      </Link>
      <time dateTime={n.date} className="mt-8 block text-xs tabular-nums text-ink-muted">
        {n.date}
      </time>
      <h1 className="mt-4 max-w-[20ch] break-words font-display text-major font-bold leading-[0.98] tracking-[-0.03em]">
        {n.title}
      </h1>
      <div className="mt-8 max-w-[62ch] space-y-4 text-lead leading-[1.55]">
        {n.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </main>
  );
}
