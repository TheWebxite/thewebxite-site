"use client";

import { useEffect, useRef, useState } from "react";

/**
 * "From our Instagram" — Instagram's official embeds (blockquote.instagram-media
 * + //www.instagram.com/embed.js), chosen by Xin on 2026-10-19.
 *
 * NOTHING LOADS UNTIL THE SECTION IS NEAR. The blockquotes are rendered, and
 * embed.js requested, only once the section comes within ~800px of the
 * viewport, so the page's first load carries none of Instagram's weight.
 * Each blockquote is itself the fallback: if the script is blocked (privacy
 * tools, a strict network), the visitor still gets a plain link to the post.
 */
const REELS = ["DYwG1XCR2Hp", "DYELrdDgZRo", "DV-Lzs_gCd5", "DbiJ4SqzU20", "DbnYn05T2JY", "DejAaVjv4s3"];
const POSTS = ["DPoKFBHkVW7", "DcIE6XpE5Hb", "Dd0gBKuEdDp", "DeMN3QGEih6", "DbsfuPqE-Nl"];
const PROFILE = "https://www.instagram.com/thewebxite/";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function Embed({ code, reel }: { code: string; reel?: boolean }) {
  const url = `https://www.instagram.com/p/${code}/`;
  return (
    <blockquote
      className="instagram-media ig-embed"
      data-instgrm-permalink={`${url}?utm_source=ig_embed`}
      data-instgrm-version="14"
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="ig-fallback">
        View this {reel ? "reel" : "post"} on Instagram ↗
      </a>
    </blockquote>
  );
}

export default function InstagramFeed() {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (document.getElementById("ig-embed-js")) return;
    const s = document.createElement("script");
    s.id = "ig-embed-js";
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    s.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(s);
  }, [near]);

  return (
    <section ref={ref} id="instagram" aria-labelledby="ig-h" className="ig ground-deep relative isolate z-0 px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-x-12 gap-y-5 lg:grid-cols-12 lg:items-end">
          <h2 id="ig-h" className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.035em] lg:col-span-7">
            From our Instagram
          </h2>
          <div className="lg:col-span-5">
            <p className="max-w-[40ch] text-text-muted">
              Reels and posts from the studio — trainings, shoots, launches and the work in progress.
            </p>
            <a href={PROFILE} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-[44px] items-center gap-2 border-b border-text text-base hover:text-accent">
              Follow @thewebxite <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <p className="label mt-[var(--space-block)]">Reels</p>
        <ul className="ig-rail" aria-label="Instagram reels">
          {REELS.map((c) => (
            <li key={c} className="ig-card ig-card-reel">
              {near ? <Embed code={c} reel /> : <Placeholder code={c} reel />}
            </li>
          ))}
        </ul>

        <p className="label mt-[clamp(3rem,6vw,4.5rem)]">Posts</p>
        <ul className="ig-masonry" aria-label="Instagram posts">
          {POSTS.map((c) => (
            <li key={c} className="ig-card">
              {near ? <Embed code={c} /> : <Placeholder code={c} />}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Placeholder({ code, reel }: { code: string; reel?: boolean }) {
  const url = `https://www.instagram.com/p/${code}/`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`ig-ph${reel ? " ig-ph-reel" : ""}`}>
      <span>View on Instagram ↗</span>
    </a>
  );
}
