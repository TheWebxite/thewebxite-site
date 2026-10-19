"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { FieldTuning } from "./FlowFieldCanvas";

/**
 * The flowing ground.
 *
 * The tuning below stays parameterised even with a single caller: the
 * values are what the surface IS, and every one of them was arrived at by
 * measurement rather than taste. See the notes on `scale` in
 * FlowFieldCanvas for the one that has a hard floor.
 *
 * ONE GESTURE, NOT ONE SURFACE. The field now runs in two places — the home
 * hero and the opening panel of the services rail — but the LEAN, the steady
 * push that follows the cursor, belongs to the hero alone and is the page's
 * signature. Every other tuning is pointer: "none". The menu briefly had a
 * field with a ripple on it; both are gone. It did not earn the complexity,
 * and a second pointer effect was competing with the one that matters.
 *
 * The two tunings share no numbers but their colours. A second surface
 * wearing the same picture at a different speed would be the repetition we
 * were asked to avoid, so RAIL carries its own seed, scale, drift and pace.
 *
 * Not every deep surface takes it either. The 4D section carries the deck
 * page's own ground (.ground-deck) rather than a shader in its colours —
 * a flowing field wearing a palette is not the same thing as the printed
 * page it came from. The work section carries client screenshots and a
 * moving ground would fight the evidence; the engagement section
 * reproduces a deck page and owns its grey.
 *
 * Purely additive: the surface underneath already carries .ground-deep,
 * whose capped gradient is a correct static version. If WebGL is missing,
 * JavaScript is off, or this chunk never loads, the surface keeps a ground
 * that was already measured — nothing falls back to blank.
 *
 * BOTH COLOURS ARE UNDER THE CEILING. --color-text-muted needs its
 * background at or below 0.0903 luminance for 4.5:1; the shader can only
 * output a mix of the two below, so no frame can breach it. Measured
 * values are noted per colour, and any change to either must be checked
 * the same way.
 */
const Canvas = dynamic(() => import("./FlowFieldCanvas"), { ssr: false });


const HERO: FieldTuning = {
  pointer: "lean",
  scale: 1.15,
  speed: 0.045,
  warp: 3.0,
  breathe: 0,
  floor: 0.18,
  drift: [0, 0],
  seed: 0,
  deep: "#00093f", // 0.0055
  lift: "#17409f", // 0.0635
};

/**
 * The services rail's opening panel. SAME MATERIAL, DIFFERENT PICTURE —
 * which is the whole point of the seed: it offsets every noise lookup, so
 * this is not the hero's image running at another speed.
 *
 * pointer: "none" is not a detail. The lean is the home hero's gesture and
 * nowhere else's; a surface elsewhere that answered the cursor would make
 * the hero ordinary.
 *
 * PACED TO THE HERO, MEASURED THE SAME WAY. It first ran at speed 0.03,
 * which was flowing but so slowly that it read as a still image — the
 * client called it static and the measurement agreed: 0.015 of frame-to
 * -frame change per 2s against the hero's 0.041. A small panel needs a
 * faster pace than a full-screen field to read as moving at all, because
 * there is far less travel on screen for the eye to catch. At speed 0.14
 * with this drift it measures 0.041 — the hero's rate exactly.
 *
 * BREATHE IS SMALL BECAUSE SEED IS ITS PHASE. In the shader the swell is
 * `f += sin(uTime * 0.09 + uSeed) * uBreathe` — the seed that picks the
 * picture also picks where in a ~70-SECOND cycle the swell starts. At
 * breathe 0.25 and seed 17.3, sin(17.3) is about -1, so f sat a quarter
 * BELOW the smoothstep's 0.18 floor and the panel rendered flat near-black
 * for half a minute at a time: running, animating, invisible. Proven by
 * painting the field red and green, which came back 94% red. At 0.08 the
 * worst the phase can do is shift the average slightly.
 *
 * IT IS BRIGHTER THAN THE HERO ON PURPOSE, AND THAT COSTS SOMETHING. The
 * hero's LIFT is held at 0.0635 because --color-text-muted sits on it and
 * needs its background at or below 0.0903. In a 21rem panel that cap reads
 * as near-black: the field is there, it is moving, and you cannot see it.
 * So this panel carries NO MUTED TEXT — every word on it is white — which
 * raises the ceiling to 0.1833 and lets LIFT go to 0.1238. Put a muted
 * token back on that panel and this colour becomes a contrast bug.
 */
const RAIL: FieldTuning = {
  pointer: "none",
  scale: 2.0,
  speed: 0.14,
  warp: 2.2,
  breathe: 0.08,
  floor: 0.02,
  drift: [0.07, -0.11],
  seed: 7.9,
  deep: "#00093f", // 0.0055
  lift: "#2a5ad0", // 0.1238 — white-only ceiling is 0.1833
};

export const FIELD = { HERO, RAIL };

export default function FlowField({ tune = HERO }: { tune?: FieldTuning }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(motion.matches);
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  /* No mounted/ready gate: the canvas is already behind dynamic(ssr:false),
     so it cannot render on the server, and an extra state flag here only
     bought a second render pass. */
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[2]">
      <Canvas reducedMotion={reduced} tune={tune} />
    </div>
  );
}
