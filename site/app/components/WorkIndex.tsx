"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMedia } from "./useMedia";
import {
  PORTFOLIO,
  SECTORS,
  desktopOf,
  hostOf,
  mobileOf,
  type PortfolioItem,
  type Sector,
} from "@/data/portfolio";

/**
 * THE FULL INDEX — every site, as a typographic list you can filter by
 * sector. On a desktop pointer a preview (the live site's first screen with
 * its phone view tucked in front) follows the cursor over the list; on
 * touch, and under reduced motion, each row carries its own thumbnail.
 *
 * Filters are toggle buttons; the count beside each is the number of rows it
 * leaves, which is a count of this list and nothing more.
 */
export default function WorkIndex() {
  const [filter, setFilter] = useState<Sector | "all">("all");
  const [hover, setHover] = useState<PortfolioItem | null>(null);
  const fine = useMedia("(pointer: fine) and (min-width: 1024px)");
  const still = useMedia("(prefers-reduced-motion: reduce)", true);
  const follow = fine && !still;
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (!follow) return;
    let raf = 0;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.16;
      p.y += (p.ty - p.y) * 0.16;
      preview.current?.style.setProperty("transform", `translate3d(${p.x}px, ${p.y}px, 0)`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [follow]);

  const rows = PORTFOLIO.filter((p) => filter === "all" || p.sector === filter);
  const count = (s: Sector) => PORTFOLIO.filter((p) => p.sector === s).length;

  return (
    <div
      className="wi"
      onPointerMove={(e) => {
        pos.current.tx = e.clientX + 28;
        pos.current.ty = e.clientY - 120;
        if (pos.current.x === 0) {
          pos.current.x = pos.current.tx;
          pos.current.y = pos.current.ty;
        }
      }}
    >
      <div className="wi-filters" role="group" aria-label="Filter by sector">
        <button type="button" aria-pressed={filter === "all"} onClick={() => setFilter("all")} className="wi-filter">
          All <span className="wi-count">{PORTFOLIO.length}</span>
        </button>
        {SECTORS.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={filter === s.key}
            onClick={() => setFilter(s.key)}
            className="wi-filter"
          >
            {s.label} <span className="wi-count">{count(s.key)}</span>
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {rows.length} projects shown
      </p>

      <ul className="wi-list" onPointerLeave={() => setHover(null)}>
        {rows.map((p) => {
          const d = desktopOf(p);
          const href = p.detail ? `/work/${p.detail}` : p.url;
          const host = hostOf(p);
          return (
            <li
              key={p.key}
              className="wi-row"
              data-priority={p.priority ? "true" : "false"}
              onPointerEnter={() => setHover(p)}
            >
              {d ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d} alt="" loading="lazy" decoding="async" className="wi-thumb" />
              ) : (
                <span className="wi-thumb wi-thumb-empty" aria-hidden="true">
                  Screens soon
                </span>
              )}
              <div className="wi-main">
                <h3 className="wi-name">
                  {href ? (
                    p.detail ? (
                      <Link href={href} className="wi-name-link">
                        {p.client}
                      </Link>
                    ) : (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="wi-name-link">
                        {p.client}
                      </a>
                    )
                  ) : (
                    p.client
                  )}
                </h3>
                <p className="wi-built">{p.built}</p>
              </div>
              <p className="wi-meta">
                <span>{p.field}</span>
                <span className="wi-place">{p.place}</span>
              </p>
              <div className="wi-actions">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="wi-act">
                    {host} <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="wi-act wi-act-muted">Migrating — link soon</span>
                )}
                {p.detail ? (
                  <Link href={`/work/${p.detail}`} className="wi-act">
                    Case study<span className="sr-only"> for {p.client}</span> <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      {follow ? (
        <div ref={preview} aria-hidden="true" className="wi-float" data-on={hover && desktopOf(hover) ? "true" : "false"}>
          {PORTFOLIO.filter((p) => desktopOf(p)).map((p) => (
            <div key={p.key} className="wi-float-pair" data-on={hover?.key === p.key ? "true" : "false"}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={desktopOf(p)!} alt="" loading="lazy" className="wi-float-d" />
              {mobileOf(p) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mobileOf(p)!} alt="" loading="lazy" className="wi-float-m" />
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
