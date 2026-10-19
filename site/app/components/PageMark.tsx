"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The 3D mark, travelling the whole page.
 *
 * FIXED AT z-index -1, WHICH IS THE WHOLE TRICK. Negative z-index boxes
 * are painted before in-flow text, and the section grounds were moved to
 * ::before at -2 (see globals.css), so this layer sits exactly between
 * every background and every word on top of it. No component needed a
 * wrapper or a z-index, and nothing has to be kept in sync as sections
 * are added.
 *
 * ONE OPACITY, TWO COLOURS. An earlier cut held a single colour and
 * faded the object out wherever text crossed it, which made it blink in
 * and out down the page. It holds a constant presence now and changes
 * COLOUR with the ground instead: brand blue on the light sections,
 * off-white on the dark ones. That is what lets the opacity stay put —
 * the reason it had to fade before was that one colour could not read
 * on both grounds.
 *
 * The tone comes from whichever ground owns the middle of the viewport,
 * read off the .ground-* class rather than from a list of sections, so
 * a new section gets the right tone by having a ground at all. Anything
 * with no ground is treated as light, because the page's default
 * surface is paper.
 *
 * THE OPACITY IS A MEASURED NUMBER, not a taste. See the note on
 * PRESENCE below.
 *
 * It is ONE GL context for the whole page, replacing the hero's own —
 * not a second one. lg and up, because below that there is no room
 * beside a text column for it to be anything but in the way.
 *
 * ROTATION COMES FROM SCROLL, not from time: the object turns as the
 * page moves and stops when it stops, so it reads as attached to the
 * scroll rather than animating beside it. Reduced motion keeps the
 * object and drops the turning.
 */
import type { Tone } from "./PageMarkCanvas";

const Canvas = dynamic(() => import("./PageMarkCanvas"), { ssr: false });

/**
 * How present the object is, everywhere, all the way down.
 *
 * Chosen by sweeping every text block on the page at both tones and
 * taking the highest value that left the worst reading at or above the
 * 4.5:1 floor — see the measurement in the commit. It is behind the
 * type, but behind still decides what is behind a glyph, and that is
 * what contrast is made of. Raise it and re-run that sweep.
 */
const PRESENCE = 0.42;

/** Grounds that want a light object on them. Everything else — paper,
 *  the grey engagement band, anything with no ground at all — gets the
 *  blue one. */
const DARK = ["ground-deep", "ground-deck", "ground-grain"];

export default function PageMark() {
  const [on, setOn] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tone, setTone] = useState<Tone>("light");

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setOn(wide.matches);
      setReduced(still.matches);
    };
    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  /* Which ground owns the middle of the screen. elementsFromPoint
     rather than a scan of sections: it answers with what is actually
     painted there, including anything nested, and costs one call. */
  const toneAt = useCallback((): Tone => {
    const stack = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight / 2);
    for (const el of stack) {
      const cls = typeof el.className === "string" ? el.className : "";
      if (DARK.some((g) => cls.includes(g))) return "light";
      if (cls.includes("ground-flat")) return "ink";
      /* The contact block is a photograph with a deep scrim, and it
         carries no ground class. */
      if (el.id === "contact") return "light";
    }
    return "ink";
  }, []);

  useEffect(() => {
    if (!on) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      setTone(toneAt());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [on, toneAt]);

  if (!on) return null;

  return (
    <div
      aria-hidden="true"
      data-pagemark
      className="pointer-events-none fixed inset-0 -z-[1] flex items-center justify-center"
    >
      <div
        style={{ opacity: PRESENCE }}
        className="h-[min(62vh,34rem)] w-[min(62vh,34rem)]"
      >
        <Canvas reducedMotion={reduced} tone={tone} />
      </div>
    </div>
  );
}
