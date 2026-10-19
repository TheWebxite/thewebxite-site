"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * The brand's own glyph shapes, floating at different depths behind the mark.
 *
 * These are from the client's media library, not invented ornament — the same
 * four forms the brand uses as a pattern set. They sit at low opacity and well
 * away from the type column: they are depth cues, and a decorative shape is
 * never allowed to be the reason a word is hard to read.
 *
 * Parallax is pointer-driven and tiny. Each shape moves by its own `depth`
 * factor, which is what separates them in space — a single shared offset would
 * just slide the whole layer and read as a glitch.
 *
 * No GSAP and no scroll listener: one pointermove, one rAF, CSS variables for
 * the transform. With reduced motion the listener is never attached and the
 * shapes are simply still.
 */

const GLYPHS = [
  { src: "/brand/glyph-1.webp", w: 269, h: 520, depth: 26, cls: "left-[5%] top-[16%] w-[clamp(2.5rem,5vw,5rem)] rotate-[-14deg] opacity-[0.17]" },
  { src: "/brand/glyph-2.webp", w: 346, h: 520, depth: 44, cls: "right-[7%] top-[22%] w-[clamp(3rem,6vw,6.5rem)] rotate-[12deg] opacity-[0.15]" },
  { src: "/brand/glyph-3.webp", w: 247, h: 520, depth: 18, cls: "bottom-[14%] left-[11%] w-[clamp(2.5rem,5vw,5.5rem)] rotate-[9deg] opacity-[0.13]" },
  { src: "/brand/glyph-4.webp", w: 444, h: 520, depth: 34, cls: "bottom-[20%] right-[12%] w-[clamp(3rem,6.5vw,7rem)] rotate-[-20deg] opacity-[0.16]" },
] as const;

export default function HeroGlyphs() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;

    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty("--px", cx.toFixed(4));
      el.style.setProperty("--py", cy.toFixed(4));
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[5] hidden select-none md:block"
      style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
    >
      {GLYPHS.map((g) => (
        <Image
          key={g.src}
          src={g.src}
          alt=""
          width={g.w}
          height={g.h}
          className={`absolute h-auto ${g.cls}`}
          style={{
            transform: `translate3d(calc(var(--px) * ${g.depth}px), calc(var(--py) * ${g.depth}px), 0)`,
          }}
        />
      ))}
    </div>
  );
}
