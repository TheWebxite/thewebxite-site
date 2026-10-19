import { describe, expect, it } from "vitest";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { EVENTS, EVENT_SLUGS } from "@/data/events";

const PUBLIC = join(process.cwd(), "public");

describe("events data", () => {
  it("has unique slugs", () => {
    expect(new Set(EVENT_SLUGS).size).toBe(EVENT_SLUGS.length);
  });

  it("is ordered newest first", () => {
    const dates = EVENTS.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("dates are ISO and not in the future", () => {
    for (const e of EVENTS) {
      expect(e.date, e.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${e.date}T00:00:00`).getTime(), e.slug).toBeLessThanOrEqual(Date.now());
    }
  });

  it("every photograph exists on disk and is not empty", () => {
    for (const e of EVENTS) {
      expect(e.photos.length, `${e.slug} has no photos`).toBeGreaterThan(0);
      for (const p of e.photos) {
        const file = join(PUBLIC, p.src);
        expect(existsSync(file), `${p.src} is missing`).toBe(true);
        expect(statSync(file).size, p.src).toBeGreaterThan(1024);
      }
    }
  });

  it("declares real pixel dimensions, which next/image needs to reserve space", () => {
    for (const e of EVENTS) {
      for (const p of e.photos) {
        expect(p.width, p.src).toBeGreaterThan(0);
        expect(p.height, p.src).toBeGreaterThan(0);
      }
    }
  });

  it("carries no description fields — photographs only, by decision", () => {
    for (const e of EVENTS) {
      expect(Object.keys(e).sort()).toEqual(["date", "name", "photos", "slug"]);
    }
  });
});
