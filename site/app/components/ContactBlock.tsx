import Image from "next/image";
import { SITE } from "@/data/site";

/**
 * editorial-contact-block. Email largest, because it is what most visitors
 * actually want. No form card, no map, no icons.
 *
 * The photograph is Kuala Lumpur at night, and it earns its place by grounding
 * the one claim this block makes — that there are people in Petaling Jaya at
 * the end of these numbers. It is scenery, not evidence: it illustrates the
 * location, never a project. Photo by Ainur Iman on Unsplash.
 *
 * Contrast is measured, not assumed: the scrim below takes the brightest point
 * of the image down far enough for white display type and #BCC7F5 body text to
 * clear the 4.5:1 floor over the whole left half, where all the text sits.
 */
export default function ContactBlock() {
  return (
    <section id="contact" className="relative isolate overflow-hidden px-[var(--space-gutter)] text-text">
      <Image
        src="/img/kl-night.webp"
        alt=""
        aria-hidden="true"
        width={2000}
        height={1333}
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,9,63,0.94) 0%, rgba(0,9,63,0.88) 46%, rgba(3,37,168,0.62) 100%)",
        }}
      />

      <div className="mx-auto max-w-[84rem] py-[var(--space-section)]">
        <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
          {SITE.city}, Malaysia
        </p>

        <a
          href={`mailto:${SITE.email}`}
          className="mt-6 inline-block max-w-full break-words font-display text-major font-bold leading-[1] tracking-[-0.03em] hover:text-accent"
        >
          {SITE.email}
        </a>

        <ul className="mt-[var(--space-block)] grid gap-x-12 gap-y-3 text-base sm:grid-cols-3">
          {SITE.phones.map((p) => (
            <li key={p} className="tabular-nums">
              <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-accent">
                {p}
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[34ch] text-text-muted">{SITE.address}</p>
      </div>
    </section>
  );
}
