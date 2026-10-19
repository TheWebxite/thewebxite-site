"use client";

import { useRef } from "react";
import Link from "next/link";
import { LAYERS, LAYER_COLOR, SERVICES, type LayerKey } from "@/data/services";

/**
 * The four-layer stack (Company Profile p6) as an object: four plates in
 * isometric, the current service's layer lifted out of the stack and lit.
 * Each plate is a link to the first service in that layer, so the object
 * is also the way across. It leans toward a desktop pointer; under reduced
 * motion it holds still.
 */
export default function ServiceStack({ active }: { active: LayerKey }) {
  const ref = useRef<HTMLDivElement>(null);
  const order = [...LAYERS].reverse(); // grow at the bottom, brand on top

  return (
    <div
      ref={ref}
      className="ss"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ref.current!.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
        ref.current!.style.setProperty("--rz", `${(x * 10).toFixed(2)}deg`);
      }}
      onPointerLeave={() => {
        ref.current!.style.setProperty("--rx", "0deg");
        ref.current!.style.setProperty("--rz", "0deg");
      }}
    >
      <div className="ss-scene">
        {order.map((l, i) => {
          const first = SERVICES.find((s) => s.layer === l.key)!;
          const on = l.key === active;
          return (
            <Link
              key={l.key}
              href={`/services/${first.slug}`}
              className="ss-plate"
              data-on={on ? "true" : "false"}
              style={{ "--i": i, "--c": LAYER_COLOR[l.key] } as React.CSSProperties}
              aria-label={`${l.name} layer — ${l.sub}`}
            >
              <span className="ss-face">
                <span className="ss-eyebrow">{l.eyebrow}</span>
                <span className="ss-name">{l.name}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <p className="ss-caption" aria-hidden="true">
        The stack — this service&rsquo;s layer, lifted
      </p>
    </div>
  );
}
