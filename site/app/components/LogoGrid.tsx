import Image from "next/image";
import type { Client } from "@/data/clients";

/**
 * The clientele, laid out and left alone.
 *
 * THIS REPLACED A TWO-ROW SLIDING CAROUSEL, and the carousel was the
 * wrong instinct. The reference the client pointed at is itself a static
 * wall of logos; motion was my addition, and it brought a whole class of
 * faults with it that a grid cannot have:
 *
 *   · the two rows held eleven logos and ten but shared one duration,
 *     so the longer row travelled further in the same time and visibly
 *     outran the shorter one;
 *   · a strip wider than the window never fires lazy loading for the
 *     cells outside it, so most of the row slid past empty until every
 *     image was forced eager;
 *   · and a reader who wants to find one logo has to wait for it.
 *
 * A grid shows all of them at once, holds still to be read, costs no
 * animation frames, and needs no reduced-motion branch. The only thing
 * the carousel did better was occupy less height — which is not worth
 * any of the above.
 *
 * EVERY LOGO GETS AN IDENTICAL CELL and is fitted inside it. Normalising
 * on height alone is the obvious move and the wrong one: match the
 * heights of a wide wordmark and a compact monogram and they are nothing
 * like the same size. A fixed box with object-contain is what makes a
 * logo wall look deliberate.
 */
export default function LogoGrid({ logos }: { logos: Client[] }) {
  return (
    <ul
      data-logo-grid
      className="mt-[clamp(2rem,4vh,3rem)] grid grid-cols-2 gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-[clamp(2.5rem,5vw,4rem)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
    >
      {logos.map((l) => (
        <li key={l.src} className="flex h-[clamp(2.75rem,4.5vw,3.5rem)] items-center justify-center">
          <Image
            src={l.src}
            alt={l.name}
            width={l.width}
            height={l.height}
            sizes="12rem"
            className="max-h-full w-auto max-w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}
