"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { LAYERS, LAYER_COLOR } from "@/data/services";


/** Clockwise, as the deck draws it. */
const ORDER = ["brand", "ops", "ai", "grow"] as const;

/* One beat of the assembly is 0.34s — see globals.css, which owns the
   timing. BEAT below is the order. */

/** Position in the sequence. Clockwise from the front end, each arrow
 *  between the two boxes it joins, the caption when the loop closes. */
const BEAT = {
  brand: 0, toOps: 1, ops: 2, toAi: 3, ai: 4, toGrow: 5, grow: 6, toBrand: 7, caption: 8,
} as const;

function Arrow({ dir, beat, className = "" }: { dir: "right" | "down" | "left" | "up"; beat: number; className?: string }) {
  const rotate = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg
      aria-hidden="true"
      data-eco="arrow"
      data-beat={beat}
      data-dir={dir}
      viewBox="0 0 48 16"
      className={`text-ink-muted ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, "--beat": beat } as React.CSSProperties}
      fill="none"
    >
      <path d="M0 8h44M38 2l6 6-6 6" stroke="currentColor" strokeWidth="1.5" pathLength={1} />
    </svg>
  );
}

function Box({ layerKey, beat }: { layerKey: (typeof ORDER)[number]; beat: number }) {
  const layer = LAYERS.find((l) => l.key === layerKey)!;
  return (
    <div
      data-eco="box"
      data-beat={beat}
      data-layer={layerKey}
      className="flex min-w-0 flex-col justify-center rounded-md p-[clamp(1.25rem,2.4vw,2rem)] text-text"
      style={{ background: LAYER_COLOR[layer.key], "--beat": beat } as React.CSSProperties}
    >
      <p className="text-xs uppercase tracking-[0.16em]">{layer.eyebrow}</p>
      <p className="mt-2 font-display text-lead font-bold leading-[1.15] tracking-[-0.02em]">
        {layer.name}
      </p>
      <p className="mt-1 text-base">{layer.sub}</p>
    </div>
  );
}

/** useLayoutEffect on the client, useEffect on the server render, so the
 *  hide happens before paint without warning during SSR. */
const useIsoLayout = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Ecosystem() {
  /* The DIAGRAM, not the section. Watching the section meant its heading
     crossing the fold was enough to start the sequence: the section is
     ~600px tall, so a quarter of it was satisfied while the boxes were
     still entirely below the viewport, and the whole assembly played out
     before anyone could see it. */
  const diagram = useRef<HTMLDivElement>(null);

  /* One attribute, set imperatively rather than rendered, so the server
     and client markup stay identical and hydration has nothing to
     reconcile. See the note in globals.css. */
  useIsoLayout(() => {
    const el = diagram.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.ecoStage = "armed";
  }, []);

  useEffect(() => {
    const el = diagram.current;
    if (!el || el.dataset.ecoStage !== "armed") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        /* Once. A diagram that re-assembles every time it scrolls past
           stops being an explanation and becomes a fidget. */
        if (entry.isIntersecting) {
          el.dataset.ecoStage = "run";
          io.disconnect();
        }
      },
      /* Enough of the diagram on screen that the sequence is not
         half-finished before the reader has looked at it. */
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="ecosystem" className="mt-[var(--space-section)]">
      <h2
        id="ecosystem"
        className="max-w-[20ch] font-display text-section font-bold leading-[1.05] tracking-[-0.02em]"
      >
        Full-Stack Digital Solutions Ecosystem
      </h2>
      {/* Company Profile.pdf p6, verbatim. */}
      <p className="mt-5 max-w-[48ch] text-ink-muted">
        Supporting your digital journey from brand building to business growth —
        one connected system, not scattered tools.
      </p>

      <div ref={diagram}>
      {/* ---- md and up: the loop ---- */}
      <div
        data-eco="loop"
        className="mt-[var(--space-block)] hidden gap-x-6 gap-y-6 md:grid"
        style={{ gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)" }}
      >
        <Box layerKey="brand" beat={BEAT.brand} />
        <div className="flex items-center justify-center">
          <Arrow dir="right" className="h-4 w-12" beat={BEAT.toOps} />
        </div>
        <Box layerKey="ops" beat={BEAT.ops} />

        <div className="flex items-center justify-center">
          <Arrow dir="up" className="h-12 w-12" beat={BEAT.toBrand} />
        </div>
        <p
          data-eco="caption"
          className="flex items-center justify-center text-center text-xs uppercase leading-[1.5] tracking-[0.16em] text-ink-muted"
          style={{ "--beat": BEAT.caption } as React.CSSProperties}
        >
          One
          <br />
          connected
          <br />
          system
        </p>
        <div className="flex items-center justify-center">
          <Arrow dir="down" className="h-12 w-12" beat={BEAT.toAi} />
        </div>

        <Box layerKey="grow" beat={BEAT.grow} />
        <div className="flex items-center justify-center">
          <Arrow dir="left" className="h-4 w-12" beat={BEAT.toGrow} />
        </div>
        <Box layerKey="ai" beat={BEAT.ai} />
      </div>

      {/* ---- below md: one column, arrows turned down ---- */}
      <div className="mt-[var(--space-block)] grid gap-3 md:hidden">
        {ORDER.map((key, i) => (
          <div key={key} className="grid gap-3">
            <Box layerKey={key} beat={i * 2} />
            <div className="flex justify-center">
              <Arrow dir="down" className="h-7 w-7" beat={i * 2 + 1} />
            </div>
            {i === ORDER.length - 1 ? (
              <p className="text-center text-xs uppercase tracking-[0.16em] text-ink-muted">
                Back to the front end — one connected system
              </p>
            ) : null}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
