"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MENU_NODES } from "@/data/menu";
import { SERVICES } from "@/data/services";
import { SITE } from "@/data/site";
import { lockPageScroll, unlockPageScroll } from "./SmoothScroll";

/**
 * THE SITE MAP, DRAWN LIVE — the menu as an object from a web agency's own
 * world. Every project we run starts as a blueprint: a root, a trunk, a
 * branch per page. Opening the menu draws that sitemap for this site on a
 * blueprint grid (the trunk drops, each branch shoots out to its page, the
 * page names are set as the nodes), and on a desktop a browser window beside
 * it renders the page you point at — so choosing where to go is previewing
 * it first, which is what we do for clients.
 *
 * Desktop ≥1024: tree + live preview window, pointer crosshair on the grid.
 * Tablet 768–1023: the tree alone, full width, with the service leaves.
 * Phone <768: the tree runs down the left edge with large names, no leaves,
 * no previews (the preview images are never requested there).
 *
 * It is a real modal dialog: focus moves in and is trapped, Escape closes and
 * returns focus to the toggle, the page behind is locked (body overflow AND
 * Lenis — see SmoothScroll), aria-modal, aria-current on this page's node.
 * Reduced motion: no drawing, no crosshair — the map is simply there.
 */
export default function BlueprintMenu({
  id,
  open,
  onClose,
  returnFocusTo,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  returnFocusTo: React.RefObject<HTMLButtonElement | null>;
}) {
  const pathname = usePathname() || "/";
  const panel = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  if (open && !mounted) setMounted(true);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const currentHref = MENU_NODES.find((n) => isCurrent(n.href))?.href ?? "/";
  const [active, setActive] = useState(currentHref);
  /* Reset the preview to this page every time the map opens. Adjusted in
     render (React's pattern for state derived from a prop change). */
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) setActive(currentHref);
  }

  useEffect(() => {
    if (!open) return;
    const toggle = returnFocusTo.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lockPageScroll();

    const focusables = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);

    /* Land on this page's node — "you are here" — or the first link. */
    const here = panel.current?.querySelector<HTMLElement>('[aria-current="page"]');
    (here ?? focusables()[0])?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    /* The drafting crosshair: two hairlines that follow a fine pointer
       across the grid. Desktop pointer only, never under reduced motion. */
    let raf = 0;
    const fine = window.matchMedia("(pointer: fine) and (min-width: 1024px)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        cross.current?.style.setProperty("--cx", `${e.clientX}px`);
        cross.current?.style.setProperty("--cy", `${e.clientY}px`);
        cross.current?.setAttribute("data-live", "true");
      });
    };
    const node = panel.current;
    if (fine && !still) node?.addEventListener("pointermove", onMove);

    return () => {
      document.removeEventListener("keydown", onKey);
      node?.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      unlockPageScroll();
      toggle?.focus();
    };
  }, [open, onClose, returnFocusTo]);

  /* The preview window hangs off the node you point at: it slides to that
     node's height (clamped inside the drawing) with a dashed connector
     running back to it, so the map and the window read as one drawing. */
  const body = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!mounted || !body.current || !preview.current) return;
    if (window.innerWidth < 1024) return;
    const place = () => {
      const b = body.current!.getBoundingClientRect();
      const node = body.current!.querySelector<HTMLElement>('.bp-node[data-active="true"] .bp-label');
      const win = preview.current!.querySelector<HTMLElement>(".bp-window");
      if (!node || !win) return;
      const n = node.getBoundingClientRect();
      const h = win.getBoundingClientRect().height;
      const total = preview.current!.getBoundingClientRect().height;
      const y = n.top + n.height / 2 - b.top - h / 2;
      const max = Math.max(0, b.height - total);
      preview.current!.style.setProperty("--py", `${Math.round(Math.min(Math.max(y, 0), max))}px`);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, mounted]);

  const activeNode = MENU_NODES.find((n) => n.href === active) ?? MENU_NODES[0];

  return (
    <div
      ref={panel}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site map"
      data-open={open ? "true" : "false"}
      data-lenis-prevent
      className="bp-panel"
      inert={!open}
      onTransitionEnd={(e) => {
        if (e.target === panel.current && !open) setMounted(false);
      }}
    >
      {mounted ? (
        <>
          <div aria-hidden="true" className="bp-grid" />
          <div ref={cross} aria-hidden="true" className="bp-cross" />

          <div className="bp-shell">
            {/* ---- the drawing's title block ---- */}
            <div className="bp-top">
              <Link href="/" onClick={onClose} className="bp-mark" aria-label={`${SITE.name} home`}>
                <Image src="/brand/logo-mark.webp" alt="" width={248} height={180} className="h-[1.4rem] w-auto sm:h-[1.7rem]" />
              </Link>
              <p className="bp-title" aria-hidden="true">
                Site map <span className="text-text-muted">— thewebxite.com</span>
              </p>
              <div className="flex items-center gap-3 sm:gap-5">
                <Link href="/contact" onClick={onClose} className="bp-cta hidden sm:inline-flex">
                  Start a project <span aria-hidden="true">→</span>
                </Link>
                <button type="button" onClick={onClose} className="bp-close">
                  <span className="sr-only">Close menu</span>
                  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" fill="none">
                    <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={body} className="bp-body">
              {/* ---- the tree ---- */}
              <nav aria-label="Site map" className="bp-tree-wrap">
                <p className="bp-root" aria-hidden="true">
                  <span className="bp-root-box" />
                  thewebxite.com
                </p>
                <ol className="bp-tree">
                  {MENU_NODES.map((n, i) => {
                    const here = isCurrent(n.href);
                    return (
                      <li
                        key={n.href}
                        className="bp-node"
                        style={{ "--i": i } as React.CSSProperties}
                        data-active={active === n.href ? "true" : "false"}
                        onPointerEnter={() => setActive(n.href)}
                      >
                        <span aria-hidden="true" className="bp-v" />
                        <span aria-hidden="true" className="bp-h" />
                        <span aria-hidden="true" className="bp-dot" />
                        <Link
                          href={n.href}
                          onClick={onClose}
                          onFocus={() => setActive(n.href)}
                          aria-current={here ? "page" : undefined}
                          className="bp-link"
                        >
                          <span className="bp-path">
                            {n.href === "/" ? "/" : n.href}
                            {here ? <span className="bp-here">you are here</span> : null}
                          </span>
                          <span className="bp-label">{n.label}</span>
                        </Link>
                        <p className="bp-note">{n.note}</p>
                        {n.href === "/services" ? (
                          <ul className="bp-leaves" aria-label="Services">
                            {SERVICES.map((s) => (
                              <li key={s.slug}>
                                <Link
                                  href={`/services/${s.slug}`}
                                  onClick={onClose}
                                  onFocus={() => setActive(n.href)}
                                  aria-current={pathname === `/services/${s.slug}` ? "page" : undefined}
                                  className="bp-leaf"
                                >
                                  {s.deckName}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </nav>

              {/* ---- the live preview: a browser window rendering the
                  page under the pointer. Decorative to a screen reader:
                  every destination it shows is a link in the tree. ---- */}
              <div ref={preview} className="bp-preview" aria-hidden="true">
                <div className="bp-window">
                  <div className="bp-chrome">
                    <span className="bp-chrome-mark" />
                    <span className="bp-address" key={activeNode.href}>
                      thewebxite.com{activeNode.href === "/" ? "" : activeNode.href}
                    </span>
                  </div>
                  <div className="bp-viewport">
                    {/* The wireframe the page renders over. */}
                    <div className="bp-wire">
                      <span className="w-[38%]" />
                      <span className="w-[62%] h-[18%]" />
                      <span className="w-[28%]" />
                      <span className="w-full h-[30%]" />
                    </div>
                    {MENU_NODES.map((n) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={n.href}
                        src={n.preview}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="bp-shot"
                        data-on={n.href === activeNode.href ? "true" : "false"}
                      />
                    ))}
                  </div>
                </div>
                <p className="bp-caption">
                  <span className="bp-caption-rule" />
                  Previewing <strong className="font-medium text-text">{activeNode.label}</strong>
                </p>
              </div>
            </div>

            {/* ---- the foot of the drawing ---- */}
            <div className="bp-foot">
              <Link href="/contact" onClick={onClose} className="bp-cta sm:hidden">
                Start a project <span aria-hidden="true">→</span>
              </Link>
              <a href={`mailto:${SITE.email}`} className="bp-foot-link">
                {SITE.email}
              </a>
              <a href={`tel:${SITE.phones[0].replace(/[\s-]/g, "")}`} className="bp-foot-link">
                {SITE.phones[0]}
              </a>
              <a
                href="https://www.instagram.com/thewebxite/"
                target="_blank"
                rel="noopener noreferrer"
                className="bp-foot-link"
              >
                Instagram {SITE.instagram}
              </a>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
