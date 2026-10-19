"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Shape,
  WebGLRenderer,
} from "three";
import { MARK_SHAPES } from "@/data/mark-shapes";

/**
 * The brand W, extruded and lit, floating in the hero.
 *
 * THIS IS THE ONLY WebGL ON THE SITE and it is loaded on demand — the parent
 * imports it with next/dynamic so three.js never enters the first-load bundle
 * and never blocks the headline.
 *
 * Imports are NAMED, from "three" directly, so the bundler can drop the rest
 * of the library. A default `import * as THREE` pulls in the whole thing.
 *
 * It is deliberately NOT a spinning logo. The mark drifts a few degrees and
 * leans toward the pointer; there is no constant rotation, because a logo
 * turning on a timer is the thing that makes this look like a tech demo
 * rather than a brand.
 *
 * Everything here is disposable and disposed: geometry, material and the GL
 * context all go on unmount, and the loop stops whenever the hero is off
 * screen or the tab is hidden.
 */

/* Brand values only — no colour is invented here. */
const MARK_COLOUR = 0xf3f2f0; // --color-surface
const KEY_COLOUR = 0xffffff;
const RIM_COLOUR = 0x8cdbff; // --color-accent
const FILL_COLOUR = 0x0325a8; // --color-canvas, bouncing the ground back up

/* Behind the wordmark — a SOLID OBJECT, not a ghost.
   It is re-coloured rather than faded, and that is the whole trick: a white
   object behind white type is unreadable at any opacity worth looking at, and
   fading it to the point of safety leaves a smudge. Saturated brand blue,
   fully lit, stays an object you can read the facets of while leaving white
   type on top of it at better than 6:1. */
const BEHIND_COLOUR = 0x1536c8;

type Props = { reducedMotion: boolean; behind?: boolean };

export default function HeroMarkCanvas({ reducedMotion, behind = false }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the hero simply has no mark
    }

    renderer.setClearAlpha(0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    const scene = new Scene();
    /* Distance is framing, not taste: visible height = 2*d*tan(fov/2), and the
       mark is 0.73 units tall. At d=4.2 it filled 30% of the frame and read as
       a trinket. d=2.3 puts it near 60% and gives the extrusion enough
       perspective divergence to look solid rather than axonometric. */
    const camera = new PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 2.3);

    /* --- the mark ------------------------------------------------------- */
    const shapes = MARK_SHAPES.map((loop) => {
      const s = new Shape();
      loop.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
      s.closePath();
      return s;
    });

    const geometry = new ExtrudeGeometry(shapes, {
      depth: 0.26,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.014,
      bevelSegments: 3,
      curveSegments: 2,
    });
    /* The traced polygons are centred in X/Y but extrude runs 0..depth in Z,
       so the solid would orbit around its own back face without this. */
    geometry.translate(0, 0, -0.13);
    geometry.computeVertexNormals();

    /* metalness stays near zero ON PURPOSE. A metal surface in three.js
       renders what it REFLECTS, so without an environment map it has almost
       nothing to show and collapses to flat grey — which is exactly how this
       looked at 0.42. Loading an environment to fix that would cost more
       bundle than the whole mark. A near-dielectric surface lit by three
       lights needs no environment, and matte suits the deck anyway. */
    const material = new MeshStandardMaterial({
      color: new Color(behind ? BEHIND_COLOUR : MARK_COLOUR),
      metalness: 0.06,
      roughness: behind ? 0.5 : 0.46,
    });

    const mark = new Mesh(geometry, material);
    const pivot = new Group();
    pivot.add(mark);
    scene.add(pivot);

    /* --- light: one key, one accent rim, one bounce ---------------------- */
    /* A hard key high and left gives the extrusion a lit face and a shaded
       one — without that split the solid reads as a flat sticker. */
    const key = new DirectionalLight(KEY_COLOUR, behind ? 2.6 : 3.4);
    key.position.set(-2.4, 3.0, 2.6);
    scene.add(key);

    /* Accent rim low and right, picking out the bevel against the ground. */
    const rim = new PointLight(RIM_COLOUR, behind ? 26 : 40, 20, 2);
    rim.position.set(2.8, -1.6, 1.4);
    scene.add(rim);

    /* The ground bouncing back up, so the shaded side is brand blue rather
       than dead grey. */
    const bounce = new DirectionalLight(FILL_COLOUR, behind ? 1.9 : 2.4);
    bounce.position.set(1.8, -2.2, -0.6);
    scene.add(bounce);

    scene.add(new AmbientLight(0xffffff, behind ? 0.3 : 0.34));

    /* --- sizing ---------------------------------------------------------- */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    /* --- pointer: a lean, not a drag ------------------------------------- */
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reducedMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    /* --- the loop, paused whenever nothing can see it --------------------- */
    let raf = 0;
    let visible = true;
    const start = performance.now();

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      eased.x += (target.x - eased.x) * 0.045;
      eased.y += (target.y - eased.y) * 0.045;

      pivot.rotation.y = eased.x * 0.42 + Math.sin(t * 0.26) * 0.2;
      pivot.rotation.x = eased.y * 0.26 + Math.sin(t * 0.21 + 1.1) * 0.08;
      pivot.position.y = Math.sin(t * 0.34) * 0.075;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const run = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };

    if (reducedMotion) {
      /* One frame, held. A static three-quarter pose still reads as a solid. */
      pivot.rotation.set(0.1, -0.34, 0);
      renderer.render(scene, camera);
    } else {
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
        else stop();
      });
      io.observe(el);

      const onVisibility = () => (document.hidden ? stop() : run());
      document.addEventListener("visibilitychange", onVisibility);
      run();

      return () => {
        stop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onPointer);
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    return () => {
      stop();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion, behind]);

  return <div ref={host} aria-hidden="true" className="h-full w-full" />;
}
