"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * T1 reveal — once, on entry. IntersectionObserver, never a raw scroll
 * listener; animates opacity and transform only. Under prefers-reduced-motion
 * the content is shown immediately and no observer is created.
 */
export default function Reveal({
  as: Tag = "div",
  delayIndex = 0,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  delayIndex?: number;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = entry.target as HTMLElement;
          target.style.transitionDelay = `${Math.min(delayIndex, 3) * 80}ms`;
          target.classList.add("is-in");
          observer.unobserve(target);
        });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayIndex]);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
