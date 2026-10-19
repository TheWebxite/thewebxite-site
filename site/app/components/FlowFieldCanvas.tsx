"use client";

import { useEffect, useRef } from "react";
import { Color, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";

/**
 * The flowing ground behind the deep surfaces.
 *
 * NOT a fluid simulation. A real one runs several framebuffer passes every
 * frame — advection, divergence, pressure, projection — and on a laptop it is
 * felt immediately in the fans. This is one full-screen quad with a
 * domain-warped noise field: fbm sampled at coordinates that are themselves
 * displaced by another fbm, which is what produces the slow folding that
 * reads as liquid. The pointer adds a local displacement that decays with
 * distance and over time, so touching it disturbs the flow and the
 * disturbance drifts away.
 *
 * CONTRAST IS BOUNDED BY CONSTRUCTION, NOT BY LUCK. An animated ground means
 * the background under the type changes every frame, and no screenshot can
 * prove a frame you did not capture. So the shader can only ever output a mix
 * of DEEP and LIFT, and both are below the luminance ceiling that
 * --color-text-muted needs for 4.5:1 (0.0903, derived from the token). The
 * brightest pixel the field can physically produce is LIFT. No amount of
 * animation can breach it, because there is nothing brighter to reach.
 *
 * Cost control: the field renders to a buffer at RESOLUTION_SCALE and is
 * stretched up. It is soft by nature, so half resolution is indistinguishable
 * and quarters the fragment work. The loop stops when the hero is off screen
 * or the tab is hidden, and reduced motion gets a single frame.
 */

/** Half resolution. The field has no edges to soften, so nothing is lost. */
const RESOLUTION_SCALE = 0.5;

export type FieldTuning = {
  /** How this surface answers a pointer, if at all.
   *  "none"   — it does not. Most surfaces.
   *  "lean"   — the field is pushed away locally and heals. THE HERO'S, and
   *             the hero's alone; it is the page's signature gesture.
   *  Named rather than a boolean so a second surface cannot quietly
   *  acquire the hero's gesture by flipping a flag. */
  pointer: "none" | "lean";
  /** Feature size. Lower is broader — but NOT below ~0.9.
   *  The noise cell is one unit, and p spans roughly [-aspect/2, aspect/2].
   *  At scale 0.62 the whole screen fell inside a single cell, fbm returned
   *  a near-constant under the smoothstep floor, and the surface rendered
   *  flat black that barely changed with time — it looked frozen when it was
   *  in fact running at 60fps. Broadness has to come from the warp and the
   *  pace, not from shrinking the domain to nothing. */
  scale: number;
  /** How fast the warp evolves. */
  speed: number;
  /** Strength of the domain warp — how hard the field folds into itself. */
  warp: number;
  /** Slow global swell. The respiration: the whole field inhales and
   *  exhales rather than only drifting sideways.
   *  BEWARE: its phase is uSeed — `sin(uTime * 0.09 + uSeed) * breathe` —
   *  so the seed that chooses the picture also chooses where in a
   *  ~70-second cycle the swell begins. A large breathe plus an unlucky
   *  seed holds f below the floor for half a minute and the surface
   *  renders flat. Keep it small unless you have checked the phase. */
  breathe: number;
  /** Where the mix starts answering the field: smoothstep(floor, 0.92, f).
   *  fbm here averages near 0.47 and rarely passes 0.6, so this is the
   *  single strongest control over how much of the surface lifts off DEEP.
   *  0.18 suits a full-screen hero, where even a thin bright fraction is
   *  hundreds of pixels wide. A SMALL surface needs a lower floor or it
   *  reads as flat black — not because it is static, but because the lit
   *  part of the field never lands inside it. */
  floor: number;
  /** Direction the field travels, so two surfaces never drift alike. */
  drift: [number, number];
  /** Offsets every noise lookup, so the same maths yields a different
   *  picture. Without it the variants are the same image at different
   *  speeds, which is exactly the repetition we are avoiding. */
  seed: number;
  deep: string;
  lift: string;
};

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  /* highp. The hash is sin(dot(p, k)) * 43758.5, which multiplies
     coordinates by large constants; mediump loses that quickly once the
     coordinates grow. A precaution rather than a fix for anything observed. */
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uAspect;
  uniform vec2  uPointer;   // -1..1, eased in JS
  uniform float uPointerAmp;// decays to 0 when the pointer rests
  uniform vec3  uDeep;
  uniform vec3  uLift;
  uniform float uScale;
  uniform float uSpeed;
  uniform float uWarp;
  uniform float uBreathe;
  uniform float uFloor;
  uniform vec2  uDrift;
  uniform float uSeed;
  uniform float uLean;

  // Value noise — cheap, and smooth enough for a slow field.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 p = (vUv - 0.5) * uAspect;

    /* The pointer shoves the field locally. Falloff is
       gaussian-ish so the disturbance has no edge, and uPointerAmp decays in
       JS so it heals. */
    vec2  toP = p - uPointer * uAspect * 0.5;
    float d = length(toP);
    float touch = exp(-d * d * 3.2) * uPointerAmp * uLean;
    p += normalize(toP + 1e-5) * touch * 0.38;


    /* Domain warp: fbm sampled through fbm. This is what folds. */
    float t = uTime * uSpeed;
    vec2  o = vec2(uSeed, uSeed * 1.7);
    vec2  dr = uDrift * t;
    vec2  sp = p * uScale + o;

    vec2 q = vec2(fbm(sp + vec2(0.0, t) + dr), fbm(sp + vec2(5.2, 1.3 - t) + dr));
    vec2 r = vec2(fbm(sp + uWarp * q + vec2(1.7, 9.2) + 0.35 * t),
                  fbm(sp + uWarp * q + vec2(8.3, 2.8) - 0.28 * t));
    float f = fbm(sp + 2.4 * r);

    /* The respiration: one slow swell across the whole field, so it reads as
       breathing rather than only travelling. */
    f += sin(uTime * 0.09 + uSeed) * uBreathe;

    /* smoothstep keeps the mix inside 0..1; the output can never be outside
       the two capped colours, so the luminance ceiling holds every frame —
       breathe included, because it moves f and f is clamped after it. */
    float m = smoothstep(uFloor, 0.92, f);
    m = clamp(m + touch * 0.22, 0.0, 1.0);

    gl_FragColor = vec4(mix(uDeep, uLift, m), 1.0);
  }
`;

export default function FlowFieldCanvas({ reducedMotion, tune }: { reducedMotion: boolean; tune: FieldTuning }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
    } catch {
      return; // no WebGL: the CSS ground underneath is already correct
    }

    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: new Vector2(1, 1) },
        uPointer: { value: new Vector2(0, 0) },
        uPointerAmp: { value: 0 },
        uDeep: { value: new Color(tune.deep) },
        uLift: { value: new Color(tune.lift) },
        uScale: { value: tune.scale },
        uSpeed: { value: tune.speed },
        uWarp: { value: tune.warp },
        uBreathe: { value: tune.breathe },
        uFloor: { value: tune.floor },
        uDrift: { value: new Vector2(tune.drift[0], tune.drift[1]) },
        uSeed: { value: tune.seed },
        uLean: { value: tune.pointer === "lean" ? 1 : 0 },
      },
    });
    scene.add(new Mesh(new PlaneGeometry(2, 2), material));

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * RESOLUTION_SCALE);
      renderer.setSize(w, h, false);
      const a = w / h;
      material.uniforms.uAspect.value.set(a > 1 ? a : 1, a > 1 ? 1 : 1 / a);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = new Vector2(0, 0);
    const eased = new Vector2(0, 0);
    let amp = 0;
    const onPointer = (e: PointerEvent) => {
      target.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      amp = 1;
    };
    /* Pointer only where a surface asks for it, and only in the way it
       asked. Every other surface flows on its own and never reacts. */
    if (!reducedMotion && tune.pointer !== "none") {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    let raf = 0;
    let onScreen = true;
    const start = performance.now();

    const draw = (now: number) => {
      material.uniforms.uTime.value = (now - start) / 1000;
      eased.lerp(target, 0.05);
      amp *= 0.97; // the disturbance heals
      material.uniforms.uPointer.value.copy(eased);
      material.uniforms.uPointerAmp.value = amp;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(draw);
    };
    const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
    const run = () => { if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(draw); };

    let io: IntersectionObserver | undefined;
    let onVisibility: (() => void) | undefined;

    if (reducedMotion) {
      material.uniforms.uTime.value = 12;
      renderer.render(scene, camera);
    } else {
      io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) run();
        else stop();
      });
      io.observe(el);
      onVisibility = () => (document.hidden ? stop() : run());
      document.addEventListener("visibilitychange", onVisibility);
      run();
    }

    return () => {
      stop();
      io?.disconnect();
      if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [reducedMotion, tune]);

  return <div ref={host} data-field aria-hidden="true" className="h-full w-full" />;
}
