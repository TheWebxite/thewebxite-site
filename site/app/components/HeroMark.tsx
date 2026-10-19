"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Mount point for the 3D hero mark. Everything that makes it REVERSIBLE and
 * cheap lives here rather than in the renderer:
 *
 *   · three.js is behind next/dynamic with ssr:false, so it is a separate
 *     chunk fetched after the page is interactive. Nothing about the hero's
 *     first paint depends on it.
 *   · It mounts only from `lg` up. Not a guess: at 768 the lead paragraph
 *     runs the full column, the mark sits over its right end, and the
 *     white solid under light type measured 1.65:1. From 1024 the paragraph
 *     stops short of the mark and the same reading is 7.65:1.
 *   · With JavaScript off, nothing renders and nothing is missing: the hero
 *     is complete without it.
 *
 * To remove the mark entirely, delete the <HeroMark /> line in Hero.tsx; to
 * switch it off without a code change, set SHOW_HERO_MARK to false there.
 */
const Canvas = dynamic(() => import("./HeroMarkCanvas"), { ssr: false });

export default function HeroMark({ behind = false }: { behind?: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(wide.matches);
      setReduced(motion.matches);
    };
    sync();
    wide.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  if (!enabled) return null;

  return (
    /* Fills the stage it is given, so placement lives with the composition in
       Hero.tsx rather than here. `pointer-events-none` keeps the canvas off
       the links around it — the mark leans toward the pointer by listening on
       the window, so it needs no hit area of its own. */
    <div className="pointer-events-none absolute inset-0 hidden lg:block">
      <Canvas reducedMotion={reduced} behind={behind} />
    </div>
  );
}
