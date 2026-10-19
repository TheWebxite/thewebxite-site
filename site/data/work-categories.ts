/**
 * The four kinds of work, given by the client 2026-10-09: Work is the
 * parent and these are its subpaths.
 *
 * ONLY ONE OF THEM HAS ANYTHING IN IT. All eight projects we hold are
 * websites; the repo contains no record of a single systems build, AI
 * training engagement or Lark rollout — not a client name, not a date,
 * not a capture. The other three categories therefore ship as declared
 * empty states, the same shape /news uses, rather than as pages that
 * imply work we cannot evidence. The client is sending the content.
 *
 * `name` is the client's own wording, trimmed to the site's sentence
 * case. Nothing here describes what the work involves: that would be a
 * claim about engagements I have not seen, and /services already
 * describes the offering in the deck's own words.
 *
 * SLUGS ARE CHECKED AGAINST PROJECT SLUGS at module load, because both
 * live under /work and are resolved by the same dynamic segment. A
 * collision would mean one silently shadowing the other, which is the
 * kind of fault that only shows up on the one page nobody opens.
 */
import { PROJECT_SLUGS } from "./projects";

export type CategorySlug =
  | "web-design"
  | "systems-development"
  | "ai-training"
  | "lark-implementation";

export type WorkCategory = {
  slug: CategorySlug;
  /** The client's own name for it. */
  name: string;
};

export const WORK_CATEGORIES: WorkCategory[] = [
  { slug: "web-design", name: "Web design" },
  { slug: "systems-development", name: "Systems development" },
  { slug: "ai-training", name: "AI training" },
  { slug: "lark-implementation", name: "Lark implementation" },
];

export const CATEGORY_SLUGS = WORK_CATEGORIES.map((c) => c.slug);

export const categoryBySlug = (slug: string) =>
  WORK_CATEGORIES.find((c) => c.slug === slug);

/* Both namespaces share /work/<segment>. If this ever throws, rename
   one of them rather than reordering the route's lookup. */
const clash = CATEGORY_SLUGS.filter((c) => (PROJECT_SLUGS as string[]).includes(c));
if (clash.length > 0) {
  throw new Error(`work category slug collides with a project slug: ${clash.join(", ")}`);
}
