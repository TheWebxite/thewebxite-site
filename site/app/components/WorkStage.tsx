"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMedia } from "./useMedia";
import {
  FEATURED,
  desktopOf,
  hostOf,
  mobileOf,
  scrollOf,
} from "@/data/portfolio";

const DWELL = 6500;

/**
 * THE FEATURED STAGE — a browser window and a phone, and the list of
 * priority projects that drives them. Picking a name loads that client's
 * live site into both devices (captured 2026-10-19); pointing at the
 * browser window scrolls the page inside it, top to bottom, the way you
 * would show a client their site on a laptop.
 *
 * It advances on its own while nobody is touching it (a thin line under
 * the current name shows the dwell), stops for good on the first click,
 * pauses on hover or focus, and never auto-advances under reduced motion.
 * The list is a set of toggle buttons (aria-pressed) controlling one live
 * region, so a screen reader hears the client and the line about it.
 */
export default function WorkStage() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [manual, setManual] = useState(false);
  const still = useMedia("(prefers-reduced-motion: reduce)", true);
  const timer = useRef<number | null>(null);
  const p = FEATURED[i];

  const go = useCallback((n: number) => {
    setI((n + FEATURED.length) % FEATURED.length);
  }, []);

  useEffect(() => {
    if (still || paused || manual) return;
    timer.current = window.setTimeout(() => go(i + 1), DWELL);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [i, paused, manual, still, go]);

  /* Warm the next pair so the switch never shows an empty window. */
  useEffect(() => {
    const n = FEATURED[(i + 1) % FEATURED.length];
    [scrollOf(n), mobileOf(n)].forEach((src) => {
      if (!src) return;
      const im = new Image();
      im.src = src;
    });
  }, [i]);

  const running = !still && !paused && !manual;
  const host = hostOf(p);

  return (
    <div
      className="ws"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* ---- the picker ---- */}
      <div className="ws-list-wrap">
        <p className="label">Featured — pick a site</p>
        <ul className="ws-list" aria-label="Featured projects">
          {FEATURED.map((f, k) => (
            <li key={f.key}>
              <button
                type="button"
                aria-pressed={k === i}
                aria-controls="ws-stage"
                onClick={() => {
                  setManual(true);
                  go(k);
                }}
                className="ws-pick"
              >
                <span className="ws-pick-name">{f.client}</span>
                <span className="ws-pick-field">{f.field}</span>
                {k === i && running ? (
                  <span aria-hidden="true" key={`bar-${i}`} className="ws-bar" style={{ animationDuration: `${DWELL}ms` }} />
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ---- the devices ---- */}
      <div id="ws-stage" className="ws-stage">
        <div className="ws-devices">
        <div className="ws-browser">
          <div className="ws-chrome" aria-hidden="true">
            <span className="ws-dots">
              <i />
              <i />
              <i />
            </span>
            <span className="ws-url">{host ?? "launching soon"}</span>
          </div>
          <div className="ws-view">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={p.key}
              src={scrollOf(p) ?? ""}
              alt={`${p.client} website on a desktop screen`}
              className="ws-page"
              decoding="async"
            />
            <span aria-hidden="true" className="ws-hint">
              Point here to scroll the site
            </span>
          </div>
        </div>
        <div className="ws-phone" aria-hidden="true">
          <div className="ws-phone-screen">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={p.key} src={mobileOf(p) ?? desktopOf(p) ?? ""} alt="" className="ws-phone-img" decoding="async" />
          </div>
        </div>
        </div>

        <div className="ws-caption" aria-live="polite">
          <p className="ws-cap-meta">
            {p.field} · {p.place}
          </p>
          <h3 className="ws-cap-name">{p.client}</h3>
          <p className="ws-cap-built">{p.built}</p>
          <div className="ws-cap-links">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="ws-link ws-link-primary">
                Visit {host} <span aria-hidden="true">↗</span>
              </a>
            ) : null}
            {p.detail ? (
              <Link href={`/work/${p.detail}`} className="ws-link">
                Case study <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
