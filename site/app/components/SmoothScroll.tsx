"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis, mounted once. Disabled entirely under prefers-reduced-motion —
 * checked BEFORE construction, per the motion rule, not torn down after.
 *
 * IT OWNS THE SCROLL POSITION WHILE IT IS RUNNING, which is why the two
 * functions below exist. Lenis takes the wheel, prevents the default and
 * writes the scroll position itself from a rAF loop. `body { overflow:
 * hidden }` — the ordinary way to stop the page moving behind a modal —
 * therefore does nothing to it: it clips a box Lenis is not using to
 * scroll. Measured, with the menu open: the page ran on 1988px behind it.
 * The lock only ever appeared to work because headless Chromium reports
 * prefers-reduced-motion, so no test had ever had Lenis on the page.
 *
 * Anything that needs the page held still asks HERE, and keeps its own
 * body-overflow lock as well: these two are no-ops under reduced motion,
 * where there is no Lenis and body overflow is the whole mechanism.
 */
let instance: Lenis | null = null;

/** Hold the page still. Safe to call when Lenis is not running. */
export function lockPageScroll() {
  instance?.stop();
}

/** Release it. Safe to call when Lenis is not running. */
export function unlockPageScroll() {
  instance?.start();
}

export default function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.add("js");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    instance = lenis;
    let raf = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      /* Only if it is still ours: a Strict Mode remount constructs the
         next instance before this cleanup runs. */
      if (instance === lenis) instance = null;
    };
  }, []);

  return null;
}
