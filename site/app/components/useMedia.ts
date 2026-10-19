"use client";

import { useSyncExternalStore } from "react";

/** A media query as state, without a set-state-in-effect. `server` is the
 *  value assumed before hydration. */
export function useMedia(query: string, server = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}
