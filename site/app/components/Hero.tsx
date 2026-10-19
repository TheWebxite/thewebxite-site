import Image from "next/image";
import Link from "next/link";
import FlowField from "./FlowField";
import HeroGlyphs from "./HeroGlyphs";
import HeroMark from "./HeroMark";
import { SITE } from "@/data/site";

/* ---------------------------------------------------------------------------
   Two switches, one line each.
     MARK   — the WebGL object behind the wordmark (lg and up).
     GLYPHS — the floating brand pattern shapes. Off: they were ornament.

   Earlier cuts of this hero, if any is ever wanted back whole:
     e6ef2b4  mark in front of the name set as scenery, glyphs on
     197804e  the claim sentence as the hero type, object receded behind it
--------------------------------------------------------------------------- */
const SHOW_HERO_MARK = false; // PageMark now carries the object for the whole page
const SHOW_GLYPHS = false;

/**
 * NO `isolate` ON THIS SECTION. It creates a stacking context, and the
 * travelling mark is fixed at the root — isolated, the whole section
 * paints above it and the object simply never appears here, which is
 * exactly what happened. The grain and the field are on the ladder in
 * globals.css instead.
 *
 * The hero: the name, the object directly behind it, one line underneath.
 *
 * THE OBJECT IS A SOLID, NOT A WATERMARK. It sits immediately behind the
 * letterforms at full strength — the depth comes from the overlap, not from
 * fading it back. What makes that legible is colour rather than opacity: the
 * mark renders in saturated brand blue (see BEHIND_COLOUR in
 * HeroMarkCanvas), so white type crosses it at better than 6:1 while the
 * object keeps its facets and its bevel. Faded to be safe, it would be a
 * smudge; recoloured, it stays an object.
 *
 * The line sits low, in the space between the foot of the object and the end
 * of the section, rather than tucked under the name — that gap is what keeps
 * the composition from reading as a stacked logo-and-tagline.
 *
 * Below lg the object is a pre-rendered still of the same geometry, lit
 * identically, so a phone gets the composition without a WebGL context.
 */
export default function Hero() {
  return (
    /* The hero runs UNDER the bar: pulled up by --nav-h and padded back down
       by the same, so its ground is what shows through the transparent
       header. Without that the bar is transparent onto the body background —
       a different blue — and the merge reads as a seam. Because it now owns
       that strip, the min-height is a full 100svh rather than 100svh minus
       the bar. */
    <section data-hero className="ground-deep relative flex min-h-[100svh] flex-col overflow-hidden px-[var(--space-gutter)] pb-[clamp(2.5rem,7vh,5rem)] pt-[calc(var(--nav-h)+clamp(1.25rem,3vw,2.5rem))] -mt-[var(--nav-h)]">
      {/* The flowing ground. It REPLACES the arc artwork rather than joining
          it: the arcs were a lightening layer over the ground and needed a
          scrim to stop them eating contrast, and two moving-looking fields
          at once is noise. The field's own two colours are capped below the
          luminance ceiling, so no frame of it can erode anything and no
          scrim is needed. */}
      <FlowField />

      {SHOW_GLYPHS ? <HeroGlyphs /> : null}

      <div className="relative mx-auto flex w-full max-w-[84rem] flex-1 flex-col">
        {/* ---- the name, with the object directly behind it ---- */}
        <div className="relative flex flex-1 items-center justify-center">
          {/* Centred on the wordmark and larger than it on every side, so the
              object reads as standing behind the letters rather than being
              boxed by them. */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] aspect-[4/3] w-[clamp(18rem,52vw,50rem)] -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/brand/mark-3d-behind.webp"
              alt=""
              aria-hidden="true"
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 86vw, 52vw"
              priority
              className="h-full w-full object-contain lg:hidden"
            />
            {SHOW_HERO_MARK ? <HeroMark behind /> : null}
          </div>

          <h1
            className="relative text-center font-display font-bold leading-[0.9] tracking-[-0.035em]"
            style={{ fontSize: "clamp(2.75rem, 11vw, 10rem)" }}
          >
            {SITE.name}
          </h1>
        </div>

        {/* ---- the line, low: between the foot of the object and the end ---- */}
        <div className="flex flex-col items-center gap-[clamp(1rem,2.4vh,1.75rem)] text-center">
          {/* PLACEHOLDER: recombines the "Petaling Jaya digital architect" line
              (p2) with the connected-stack idea (p6). Both halves are the
              client's; the join is ours. */}
          <p className="max-w-[56ch] text-base text-text-muted sm:text-lead">
            We build the brand, the systems, the automation and the growth as
            one stack — not four purchases.
          </p>

          <Link
            href="/work"
            className="inline-flex min-h-[44px] items-center border-b border-accent text-base text-accent"
          >
            See the work
          </Link>
        </div>
      </div>
    </section>
  );
}
