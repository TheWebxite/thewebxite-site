"use client";

import { useEffect, useRef } from "react";

/**
 * A statement that fills in word by word as it crosses the screen
 * (library: scrubbed-text-opacity). The words are real text at full
 * contrast in the markup; only the opacity is driven, and only while
 * motion is allowed — under reduced motion, or without JS, it is simply
 * the sentence.
 */
export default function ScrubText({
  text,
  className = "",
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    el.dataset.scrub = "on";
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* 0 when the block's top reaches 85% of the screen, 1 when its
         bottom reaches 45%. */
      const start = vh * 0.85;
      const end = vh * 0.45;
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end + r.height)));
      const lit = p * words.length;
      words.forEach((w, i) => {
        const o = Math.min(1, Math.max(0.16, lit - i));
        w.style.opacity = String(o);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Tag ref={ref as React.RefObject<HTMLParagraphElement & HTMLHeadingElement>} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} data-w className="transition-opacity duration-150">
          {w}{" "}
        </span>
      ))}
    </Tag>
  );
}
