import { existsSync } from "node:fs";
import path from "node:path";
import { CLIENTELE, VENDORS, type WallEntry } from "@/data/clientele";

/**
 * The clientele wall and the vendors row. A server component, so whether
 * a logo file exists is decided at build time: a missing file falls back
 * to the name set in the brand face, never to a broken image.
 *
 * `tone="deep"`: white marks on the deep blue ground (Work, About).
 * `tone="light"`: ink marks on the off-white surface (Home).
 */
const has = (e: WallEntry) =>
  !!e.logo && existsSync(path.join(process.cwd(), "public", e.logo));

function Cell({ e, small }: { e: WallEntry; small?: boolean }) {
  return (
    <li className={`cw-cell${small ? " cw-cell-sm" : ""}`}>
      {has(e) ? (
        <span className="cw-marks">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={e.logo}
            alt={e.name}
            loading="lazy"
            decoding="async"
            className={`cw-logo${e.wide ? " cw-logo-wide" : ""}${e.knockout ? " cw-logo-ko" : ""}`}
          />
          {e.logo2 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={e.logo2} alt="" loading="lazy" decoding="async" className="cw-logo cw-logo-wide" />
          ) : null}
        </span>
      ) : (
        <span className="cw-text">{e.name}</span>
      )}
      <span className="cw-name" aria-hidden="true">
        {e.name}
        {e.note ? ` · ${e.note}` : ""}
      </span>
    </li>
  );
}

export default function ClienteleWall({
  id,
  tone = "deep",
  heading = "Clientele",
}: {
  id?: string;
  tone?: "deep" | "light";
  heading?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id ?? "cw"}-h`}
      data-tone={tone}
      className={`cw ${tone === "deep" ? "ground-deep" : "ground-flat"} relative isolate z-0 px-[var(--space-gutter)] py-[var(--space-section)]`}
    >
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-x-12 gap-y-5 lg:grid-cols-12 lg:items-end">
          <h2
            id={`${id ?? "cw"}-h`}
            className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.035em] lg:col-span-7"
          >
            {heading}
          </h2>
          {/* Company Profile.pdf p8, verbatim. */}
          <p className="cw-sub max-w-[42ch] lg:col-span-5">
            Meet Our Clientele highlights the diverse brands and individuals we
            work with — in Malaysia, Vietnam and Australia.
          </p>
        </div>

        <ul className="cw-grid" aria-label="Clients">
          {CLIENTELE.map((e) => (
            <Cell key={e.name} e={e} />
          ))}
        </ul>

        <div className="mt-[clamp(3rem,6vw,4.5rem)] grid gap-6 lg:grid-cols-12 lg:items-center">
          <p className="label lg:col-span-3">Vendors / Products</p>
          <ul className="cw-grid cw-grid-vendors lg:col-span-9" aria-label="Vendors and products">
            {VENDORS.map((e) => (
              <Cell key={e.name} e={e} small />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
