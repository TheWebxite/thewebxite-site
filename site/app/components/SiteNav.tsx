"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/data/site";
import BlueprintMenu from "./BlueprintMenu";

/**
 * News & Events is hidden until there are three or more entries: a news
 * section showing one item reads as abandoned and costs more credibility
 * than having none. The route always exists; only the link is gated.
 *
 * The header is STICKY and it gets out of the way: scrolling down slides it
 * off, scrolling up brings it straight back. Reading downward is the common
 * case and a permanent bar just steals a strip of every screen.
 *
 * IT IS ALSO TRANSPARENT OVER THE HERO. The hero is a full-height
 * composition and a filled bar cuts a lid across the top of it; past the
 * hero the bar crosses grounds of every brightness and needs its own fill to
 * stay readable. So the fill is tied to WHETHER THE HERO IS STILL BEHIND IT,
 * observed directly rather than guessed from a scroll threshold — the hero's
 * height varies with the viewport, and a hardcoded number would be wrong on
 * most of them. Pages with no hero start filled, which is why the observer
 * defaults to "not over the hero".
 *
 * THE FIRST PAINT IS CSS, NOT STATE. `solid` cannot be known on the server,
 * so the bar used to render filled and correct itself once the observer
 * fired — which is a brand-blue lid across the hero for as long as
 * hydration takes. Measured at rgb(3,37,168) over a hero of rgb(17,44,139).
 * Until this component arms itself, the bar carries no inline colours at
 * all and globals.css decides from `body:has([data-hero])`. Arming happens
 * in a layout effect, before paint, so there is no second flash either.
 *
 * With JavaScript off it stays visible and filled — see the
 * `@media (scripting: none)` rule beside those styles.
 */
/** useLayoutEffect in the browser, useEffect during the server render. */
const useIsoLayout =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function SiteNav() {
  /* THE BAR DOES NOT REMOUNT BETWEEN ROUTES. It lives in the root layout,
     so a client-side navigation keeps this component — and everything it
     decided on the previous page. With no dependency here, `solid` stayed
     true after coming back to the home page from a page with no hero, and
     the observer was still observing nothing, because the effect that
     looks for the hero had run once, on a route that had none. The bar
     sat brand blue over the hero until something scrolled, and a reload
     "fixed" it because a reload is a remount. */
  const pathname = usePathname();
  /* Each section hides until it has something to show. News waits for
     three entries — one post reads as abandoned. Events needs no such
     rule: a gallery of one event is still a gallery, so the only
     question is whether there are any. */
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(true);
  /** False until this component has measured for itself. While false the
   *  bar wears no inline colours and CSS owns its appearance. */
  const [armed, setArmed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const last = useRef(0);
  const toggle = useRef<HTMLButtonElement>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    last.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last.current;
      /* A dead band, so a trackpad's jitter cannot flicker the bar. */
      if (Math.abs(dy) < 6) return;
      if (y < 96) setHidden(false);
      else setHidden(dy > 0);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Transparent exactly while the hero is behind the bar. */
  useIsoLayout(() => {
    const hero = document.querySelector("[data-hero]");
    /* Decide SYNCHRONOUSLY, before the browser paints this commit: an
       observer's first callback is a frame or more away, and that frame
       is the flash. */
    const h = Math.round(bar.current?.getBoundingClientRect().height ?? 0);
    /* No hero on this route: filled, and say so explicitly — the previous
       route's answer is not this route's answer. */
    setSolid(hero ? hero.getBoundingClientRect().bottom <= h : true);
    setArmed(true);
  }, [pathname]);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) return; // no hero on this route: stay filled

    /* MEASURED from the bar itself, not written as a number here. The bar's
       height is a design value that has already changed once; a literal in
       this file is a second copy of it that silently goes stale. */
    const barH = Math.round(bar.current?.getBoundingClientRect().height ?? 0);

    const io = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      /* Shrink the root by the bar's height at the top, so "intersecting"
         means the hero still occupies screen BELOW the bar.
         NOT a bottom inset of -100%: that collapses the root box to zero
         height, nothing can ever intersect it, and the bar stays filled
         forever — which is exactly what it did. */
      { rootMargin: `-${barH}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  /* A filled bar is always needed behind an open menu. */
  const filled = solid || menuOpen;

  return (
    <>
      <header
        ref={bar}
        data-nav
        data-armed={armed ? "true" : "false"}
        className="sticky top-0 z-50 flex h-[var(--nav-h)] w-full items-center px-[var(--space-gutter)] motion-safe:transition-[transform,background-color,border-color] motion-safe:duration-300"
        style={{
          /* SOLID brand blue, not a translucent wash. At 62% canvas over a
             transparent backdrop the bar took its colour from whatever was
             behind it — over the light work section that mixed blue with
             near-white and came out periwinkle, a colour the brand does not
             own. Opaque canvas is the same blue on every ground. */
          /* Only once armed. Before that these are undefined and the
             stylesheet decides — an inline value here would beat it. */
          background: armed
            ? filled
              ? "var(--color-canvas)"
              : "transparent"
            : undefined,
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          borderBottomColor: armed
            ? filled
              ? "var(--color-hairline)"
              : "transparent"
            : undefined,
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        <div className="mx-auto flex w-full max-w-[84rem] items-center justify-between gap-6">
          {/* The W mark alone, white-on-blue. The suite has no one-line
              lockup: its horizontal version stacks "The / Webxite" beside
              the mark, which at bar height put two rows of tiny type in a
              space that wants one. The mark on its own is a single element
              at any size, and the name is carried by `alt` — so the bar is
              still labelled for a screen reader exactly as it was. */}
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/brand/logo-mark.webp"
              alt={SITE.name}
              width={248}
              height={180}
              priority
              className="h-[1.4rem] w-auto sm:h-[1.7rem]"
            />
          </Link>

          <div className="flex items-center gap-x-3 sm:gap-x-5">
            {/* THE BAR CARRIES TWO THINGS NOW: the primary CTA, always
                visible, and the site map. The inline link row is gone —
                the menu is the navigation, drawn as a sitemap (see
                BlueprintMenu), and it is one click from every screen. */}
            <Link
              href="/contact"
              data-nav-top
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-sm)] border border-current px-3 text-xs font-medium transition-colors hover:bg-text hover:text-canvas sm:px-4"
            >
              Start a project<span aria-hidden="true" className="hidden sm:inline">→</span>
            </Link>
            <button
              ref={toggle}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-map"
              aria-haspopup="dialog"
              className="group -mr-2 inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-3 px-2 text-xs font-medium hover:text-accent"
            >
              <span className="hidden sm:inline">Menu</span>
              <span className="sr-only sm:hidden">Open menu</span>
              {/* A sitemap glyph: a root and three pages. */}
              <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true" fill="none">
                <rect x="9.5" y="0.75" width="7" height="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13 5.75v4.5M3.5 10.25h19M3.5 10.25v3.5M13 10.25v3.5M22.5 10.25v3.5" stroke="currentColor" strokeWidth="1.4" />
                <rect x="0.75" y="13.75" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" className="origin-center transition-transform group-hover:-translate-y-[1px]" />
                <rect x="10.25" y="13.75" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" />
                <rect x="19.75" y="13.75" width="5.5" height="5.5" stroke="currentColor" strokeWidth="1.4" className="origin-center transition-transform group-hover:-translate-y-[1px]" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <BlueprintMenu
        id="site-map"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        returnFocusTo={toggle}
      />
    </>
  );
}
