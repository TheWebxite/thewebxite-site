"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

/**
 * The mark in /about's "What sets us apart" — a still that becomes the
 * live object where it can be one.
 *
 * IT LEANS TOWARD THE POINTER, which is why this exists at all. The
 * section used to hold a flat render with a CSS drift and an explicit
 * note that the pointer gesture belonged to the home hero alone; the
 * client asked for it here too. Rather than fake a tilt on an image,
 * this mounts the SAME renderer the hero uses, so the lean is the real
 * object turning and not a photograph being skewed.
 *
 * `behind` is passed for its COLOUR, not its meaning. The flag was
 * written for the hero's receded state — a solid brand-blue object
 * sitting under white type — and the still this replaces,
 * mark-3d-behind.webp, is a frame of exactly that configuration. So
 * the live object and the still are the same object, and a reader who
 * crosses the lg boundary sees no change.
 *
 * THREE CASES, AND THE FALLBACK IS THE DEFAULT:
 *
 *   · No JavaScript, or narrow: the still, with its CSS drift. The
 *     section is complete without the canvas and never waits for it.
 *   · Reduced motion: the still, at ANY width. A solid turning under
 *     a sine and chasing the pointer is motion however tasteful; the
 *     drift on the still is already disabled under the same query.
 *     Checked BEFORE the canvas mounts, not torn down after.
 *   · Wide, scripted, motion allowed: the canvas.
 *
 * This is a second GL context on a page that already runs the field,
 * which the earlier note here refused. The home page has run both for
 * as long as the mark has existed, the renderer stops itself when it
 * is off screen or the tab is hidden, and it is behind next/dynamic,
 * so nothing about first paint depends on it.
 */
const Canvas = dynamic(() => import("./HeroMarkCanvas"), { ssr: false });

export default function AboutMark() {
  const [live, setLive] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLive(wide.matches && !still.matches);
    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  /* One box either way, sized here and nowhere else, so the swap moves
     nothing on the page: 4:3 is the still's own 1200×900. */
  return (
    <div
      aria-hidden="true"
      className="relative mt-[clamp(2rem,5vw,3.25rem)] aspect-[4/3] w-[min(56%,20rem)]"
    >
      {live ? (
        /* pointer-events-none: the lean listens on the window, so the
           canvas needs no hit area and must not take one. */
        <div className="pointer-events-none absolute inset-0">
          <Canvas reducedMotion={false} behind />
        </div>
      ) : (
        <Image
          src="/brand/mark-3d-behind.webp"
          alt=""
          width={1200}
          height={900}
          sizes="(max-width: 640px) 52vw, 20rem"
          className="mark-drift h-full w-full object-contain"
        />
      )}
    </div>
  );
}
