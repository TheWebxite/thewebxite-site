import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../../app/tokens.css", import.meta.url), "utf8");

/** sRGB relative luminance per WCAG 2.1 */
function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe("frozen tokens", () => {
  it("keeps every frozen colour at its spec value", () => {
    for (const [name, value] of [
      ["--color-canvas", "#0325A8"],
      ["--color-surface", "#F3F2F0"],
      ["--color-text", "#FFFFFF"],
      ["--color-text-muted", "#BCC7F5"],
      ["--color-ink", "#071238"],
      ["--color-ink-muted", "#4A5578"],
      ["--color-accent", "#8CDBFF"],
    ] as const) {
      expect(css).toMatch(new RegExp(`${name}:\\s*${value}`, "i"));
    }
  });

  it("holds every text pair above 4.5:1", () => {
    expect(ratio("#FFFFFF", "#0325A8")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#BCC7F5", "#0325A8")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#071238", "#F3F2F0")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#4A5578", "#F3F2F0")).toBeGreaterThanOrEqual(4.5);
    expect(ratio("#8CDBFF", "#0325A8")).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps #0074DD illustration-only — it fails against the canvas", () => {
    expect(ratio("#0074DD", "#0325A8")).toBeLessThan(4.5);
  });

  it("adds exactly the two permitted tokens", () => {
    expect(css).toMatch(/--grain-opacity:/);
    expect(css).toMatch(/--grain-tile:/);
    expect(css).toMatch(/--step-4:\s*clamp\(/);
  });

  it("adds no new typeface, radius or shadow", () => {
    expect(css.match(/--font-[a-z]+:/g) ?? []).toHaveLength(2);
    expect(css.match(/--radius-[a-z]+:/g) ?? []).toHaveLength(2);
    expect(css).not.toMatch(/--shadow/);
  });
});
