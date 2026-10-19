import Hero from "./components/Hero";
import PageMark from "./components/PageMark";
import Gap from "./components/Gap";
import Stack from "./components/Stack";
import Range from "./components/Range";
import Process from "./components/Process";
import Circles from "./components/Circles";
import ContactBlock from "./components/ContactBlock";
import ClienteleWall from "./components/ClienteleWall";
import type { Metadata } from "next";

/* Title and description come from the root layout's defaults — this is
   the page they were written for. Only the canonical is page-specific. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * One sustained argument, in seven moves:
 *   1 the claim        2 the gap it names     3 the system that closes it
 *   4 proof it works   5 how we work          6 how to start   7 contact
 *
 * Grain carries 1-3 and 6; flat carries 4, 5 and 7, where a textured ground
 * would fight a screenshot.
 */
export default function Home() {
  return (
    <main className="w-full max-w-full">
      {/* The 3D mark, for the whole page rather than the hero alone. It
          is fixed at z-index -1 and the grounds paint at -2, so it sits
          between every background and every word — see PageMark. */}
      <PageMark />
      <Hero />
      <Gap />
      <Stack />
      <Range />
      {/* Added 2026-10-19: the clientele wall, after the work it vouches for. */}
      <ClienteleWall id="clientele-home" tone="light" />
      <Process />
      <Circles />
      <ContactBlock />
    </main>
  );
}
