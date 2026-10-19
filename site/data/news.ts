export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  body: string[];
};

/**
 * There is no real news yet. The old WordPress install held only
 * theme-demo articles — about machine learning, not about us — and none
 * of that survives here. Earlier drafts of this file derived "<Client> is
 * live" entries from each project's screenshot date, but that date records
 * when a capture was taken, not when the site launched; nobody knows the
 * real launch dates, so no entry is manufactured from it. See `captured`
 * on `Project` in `./projects` for the field this must never be confused
 * with — do NOT import `PROJECTS` into this file.
 *
 * Entries are added here by hand, one at a time, when the owner actually
 * writes one. `SiteNav` keeps the News & Events link hidden while
 * `NEWS.length < 3`, so the nav only reveals the section once there is
 * enough here to not read as abandoned.
 */
export const NEWS: NewsItem[] = [];

export const newsBySlug = (slug: string) => NEWS.find((n) => n.slug === slug);
export const NEWS_SLUGS = NEWS.map((n) => n.slug);
