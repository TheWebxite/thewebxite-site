import type { Metadata } from "next";
import { SITE } from "@/data/site";
import ContactBlock from "../components/ContactBlock";
import EnquiryForm from "../components/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact",
  // PLACEHOLDER: description sentence is written for SEO, not quoted from the deck.
  description: `Talk to TheWebxite — ${SITE.email}, or call. Pusat Dagangan NZX, Petaling Jaya, Selangor.`,  /* Canonical. metadataBase makes this absolute. Without it every
     variant Google reaches this page by is a separate candidate it has
     to pick between. */
  alternates: { canonical: "/contact" },
};

/**
 * This page had 56 words, no form, and no way to make an enquiry — on
 * the one page whose entire job is receiving them.
 *
 * THREE THINGS, ANSWERING THE THREE QUESTIONS a person has here: a form,
 * so there is somewhere to write; what happens next, so sending it is
 * not a leap of faith; and the address and phone numbers, so nobody is
 * forced through a form at all. The last is the route that cannot fail,
 * and it sits BESIDE the form rather than below it.
 *
 * "What happens next" is Company Profile p9 — the deck's own contact
 * page — verbatim. It also runs on the home page, and that is the one
 * deliberate repetition on this site: there it is a pitch, here it is
 * the answer to "what am I signing up for by sending this".
 */
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  /* Set by the no-JavaScript path: the API redirects back here with the
     outcome in the query string. */
  const { sent } = await searchParams;

  return (
    <main className="ground-flat">
      {/* The gutter is on the sections, not on <main>: ContactBlock below
          is full-bleed and a padded main would inset its photograph. */}
      <header
        data-hero
        className="ground-deep relative overflow-hidden px-[var(--space-gutter)] pb-[clamp(4rem,8vw,7rem)] pt-[calc(var(--nav-h)+clamp(3rem,9vh,6rem))] -mt-[var(--nav-h)]"
      >
        {/* The deck's p9 graphic: three circles running off the right edge,
            one per step of the engagement. Decoration only. */}
        <div aria-hidden="true" className="ct-rings">
          <span />
          <span />
          <span />
        </div>
        <div className="relative mx-auto max-w-[84rem]">
          {/* Company Profile.pdf p9, verbatim. */}
          <h1 className="max-w-[15ch] font-display text-[clamp(2.75rem,6.6vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            We are always ready to help you and answer your questions
          </h1>
          {/* PLACEHOLDER: supporting line is ours, not quoted from the client's deck. */}
          <p className="mt-8 max-w-[46ch] text-lead text-text-muted">
            One thing about us: we treat and serve every client with heart. Send us a
            message and our team will reach out to you soon.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-lead">
            <a href={`mailto:${SITE.email}`} className="inline-flex min-h-[44px] items-center border-b border-text hover:text-accent">{SITE.email}</a>
            <a href={`tel:${SITE.phones[0].replace(/[\s-]/g, "")}`} className="inline-flex min-h-[44px] items-center border-b border-text-muted text-text-muted hover:text-accent">{SITE.phones[0]}</a>
          </div>
        </div>
      </header>

      <section
        aria-labelledby="enquiry-heading"
        className="px-[var(--space-gutter)] py-[var(--space-section)]"
      >
        <div className="mx-auto grid max-w-[84rem] gap-[var(--space-block)] lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-x-[clamp(3rem,6vw,6rem)]">
          <div className="min-w-0">
            <h2
              id="enquiry-heading"
              className="font-display text-section font-bold leading-[1.05] tracking-[-0.02em]"
            >
              Tell us what is slow
            </h2>
            {/* PLACEHOLDER: ours. It asks for a few lines and promises a
                reply, which is all that can be promised without knowing
                who is writing. */}
            <p className="mt-5 max-w-[46ch] text-ink-muted">
              A few lines is enough. If you are not sure which layer you need,
              say so — working that out is the first conversation, not
              something to have settled before it.
            </p>
            <div className="mt-[var(--space-block)]">
              <EnquiryForm initialState={sent} />
            </div>
          </div>

          <aside className="min-w-0 border-t border-hairline-ink pt-[var(--space-block)] lg:border-l lg:border-t-0 lg:pl-[clamp(2rem,4vw,3.5rem)] lg:pt-0">
            <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              What happens next
            </h2>
            {/* Company Profile.pdf p9, verbatim. */}
            <ol className="mt-[clamp(1.5rem,3vh,2.5rem)]">
              {[
                {
                  t: "Tech Consultation",
                  d: "We get to know your business, map where the gaps are, and pinpoint where web, automation or AI will actually move the needle.",
                },
                {
                  t: "Free Demo",
                  d: "See it working before you commit — a real demo built around your use case, not just slides and promises.",
                },
                {
                  t: "Follow-up Timeline",
                  d: "Once we're rolling, you get clear milestones and regular check-ins, so you always know what's shipping and when.",
                },
              ].map((s, i) => (
                <li key={s.t} className="border-b border-hairline-ink py-5 first:border-t">
                  <p className="flex items-baseline gap-3 font-display text-lead font-bold leading-[1.2] tracking-[-0.02em]">
                    <span className="text-xs tabular-nums text-ink-muted">0{i + 1}</span>
                    {s.t}
                  </p>
                  <p className="mt-2 max-w-[42ch] text-ink-muted">{s.d}</p>
                </li>
              ))}
            </ol>

            <div className="mt-[var(--space-block)]">
              <h2 className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                Or reach us directly
              </h2>
              <p className="mt-4">
                <a
                  href={`mailto:${SITE.email}`}
                  className="border-b border-ink text-lead text-ink hover:text-canvas"
                >
                  {SITE.email}
                </a>
              </p>
              <ul className="mt-3 space-y-1">
                {SITE.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:${p.replace(/\s/g, "")}`} className="text-ink-muted hover:text-canvas">
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <ContactBlock />
    </main>
  );
}
