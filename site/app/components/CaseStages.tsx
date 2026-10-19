import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * The frames of a client's site, staged.
 *
 * THIS REPLACED EIGHT IDENTICAL STACKS. The first cut rendered four
 * desktop captures one under another, full width, on paper, for every
 * project — and the client's reaction was the right one: every case
 * study looked the same, there was no mobile view anywhere, and
 * nothing about a stack of screenshots says who the client is. The
 * reference they pointed at does three things this now does.
 *
 *   1. THE STAGE WEARS THE CLIENT'S OWN COLOUR. Not ours, and not
 *      invented: each one is sampled from the header band of that
 *      client's own site — the brand colour lives in a nav bar, not in
 *      the photography. Sampling the whole capture was tried first and
 *      is why this is worth writing down: warm photographic tone
 *      dominates every histogram, and five of the eight came back as
 *      the same amber. The header band gives espresso, red, navy,
 *      pink, amber, deep red, black and yellow.
 *
 *      Each colour then moved by the SMALLEST amount that clears 7:1
 *      against whichever of our two type colours suits it — five did
 *      not move at all, three moved by 0.14 lightness or less. The
 *      stored `on` says which colour won, so nothing here guesses at
 *      contrast at render time.
 *
 *   2. THERE IS A PHONE. Three per project, captured at 390x844 on a
 *      real mobile context rather than a narrowed desktop one.
 *
 *   3. THE ORDER ROTATES. Three stage types, and which comes first is
 *      keyed off the project's index, so consecutive case studies do
 *      not open the same way. That is the whole reason the previous
 *      version read as a template.
 *
 * The frames are tilted a degree or two and overlapped. `overflow-x`
 * is clipped on body (see layout.tsx), so a frame that leans past the
 * gutter costs no horizontal scrollbar.
 */

type Props = { project: Project; index: number };

/** A browser frame: the capture, cornered and shadowed. */
function Desktop({
  src,
  width,
  height,
  label,
  className = "",
  sizes,
  priority = false,
}: {
  src: string;
  width: number;
  height: number;
  label: string;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={label}
      width={width}
      height={height}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      className={`h-auto w-full rounded-[0.5rem] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] ${className}`}
    />
  );
}

/** A phone: the capture inside a drawn handset. */
function Phone({
  src,
  width,
  height,
  alt,
  className = "",
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] border-[5px] border-[#14141a] bg-[#14141a] shadow-[0_26px_50px_-20px_rgba(0,0,0,0.6)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 640px) 60vw, 15rem"
        loading="lazy"
        className="h-auto w-full rounded-[1.4rem]"
      />
    </div>
  );
}

export default function CaseStages({ project: p, index }: Props) {
  if (p.shots.length === 0) return null;

  const tone = p.stage.on === "light" ? "text-white" : "text-[#071238]";
  const dim = p.stage.on === "light" ? "text-white/70" : "text-[#071238]/70";
  const cap = `text-xs uppercase tracking-[0.16em] ${dim}`;

  /* Two desktop frames, the second dropped and overlapped. */
  const pair = (
    <div
      key="pair"
      style={{ background: p.stage.colour }}
      className="overflow-hidden"
    >
      <div className="mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[clamp(3rem,7vw,6rem)]">
        <div className="relative grid gap-6 lg:grid-cols-12">
          {/* THE FIRST CAPTION SITS ABOVE ITS FRAME. Below it, the
              second frame — which is deliberately pulled up over this
              one — lands on top of it and crushes it. Moving the
              caption to the head of the figure is what lets the two
              frames overlap at all. */}
          <figure className="lg:col-span-8">
            <figcaption className={`mb-4 ${cap}`}>
              {p.shots[0].label}
            </figcaption>
            <Desktop
              {...p.shots[0]}
              priority
              sizes="(max-width: 1024px) 100vw, 56rem"
              className="rotate-[-1.1deg]"
            />
          </figure>
          {p.shots[1] ? (
            <figure className="lg:col-span-7 lg:col-start-6 lg:-mt-[11%]">
              <Desktop
                {...p.shots[1]}
                sizes="(max-width: 1024px) 100vw, 48rem"
                className="rotate-[1.4deg]"
              />
              <figcaption className={`mt-5 ${cap}`}>
                {p.shots[1].label}
              </figcaption>
            </figure>
          ) : null}
        </div>
      </div>
    </div>
  );

  /* One frame, as wide as the page allows, on paper — the breath
     between two coloured stages. */
  const wide = (
    <div
      key="wide"
      className="px-[var(--space-gutter)] py-[clamp(3rem,7vw,6rem)]"
    >
      <div className="mx-auto max-w-[84rem] space-y-[clamp(2rem,4vw,3.5rem)]">
        {p.shots.slice(2).map((s) => (
          <figure key={s.src}>
            <Desktop {...s} sizes="(max-width: 1024px) 100vw, 84rem" />
            <figcaption className="mt-5 text-xs uppercase tracking-[0.16em] text-ink-muted">
              {s.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );

  /* The phones, in a row, the middle one lifted. */
  const phones =
    p.mobile.length > 0 ? (
      <div
        key="phones"
        style={{ background: p.stage.colour }}
        className="overflow-hidden"
      >
        <div className="mx-auto max-w-[84rem] px-[var(--space-gutter)] py-[clamp(3rem,7vw,6rem)]">
          <p className={cap}>On a phone</p>
          <ul className="mt-8 flex flex-wrap items-start justify-center gap-[clamp(1rem,3vw,2.5rem)]">
            {p.mobile.map((m, i) => (
              <li key={m.src} className="w-[min(42%,15rem)]">
                <Phone
                  {...m}
                  alt={`${p.client} on a phone`}
                  className={i === 1 ? "lg:-translate-y-8" : ""}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : null;

  /* Which stage opens the page rotates with the project's position in
     the list, so two case studies read in a row do not begin alike. */
  const order = [
    [pair, wide, phones],
    [phones, pair, wide],
    [wide, phones, pair],
  ][index % 3];

  return (
    /* -mx-gutter cancels the page's gutter so the coloured stages
       reach the window edge. <main> keeps that padding because every
       other block on the page aligns to it — see the note where this
       is rendered. body clips overflow-x, so this costs no sideways
       scroll. */
    <section
      aria-labelledby="frames"
      data-shots
      className={`-mx-[var(--space-gutter)] ${tone}`}
    >
      <h2 id="frames" className="sr-only">
        Through the {p.client} site
      </h2>
      {order}
    </section>
  );
}
