/**
 * Activities, as photographs and nothing else.
 *
 * NO DESCRIPTIONS, BY DECISION. The client asked for photos only, and
 * that is still the shape: a name, a date, and the pictures.
 *
 * THE NAMES ARE THE CLIENT'S OWN, supplied 2026-10-08. Until then
 * `name` was the raw folder name, because expanding those
 * abbreviations myself would have been inventing the company's
 * history — a shorthand nobody outside the studio can read beats a
 * guess that reads well. Four were replaced:
 *
 *   Torii        → Torii Teppanyaki Content Shooting
 *   Podcast      → Podcast with Andy
 *   TKA 25 PC    → The Knights Award 2026 Press Conference
 *   TARUMT MF-25 → TARUMT Music Fiesta 2025
 *
 * "Newton AI Training" and "Santan" were already right and are
 * unchanged. SLUGS DID NOT MOVE: they are in published URLs and in the
 * asset paths under public/events, and a new title is not a reason to
 * break a link — /events#tka-25-pc still reaches the press conference.
 *
 * DATES COME FROM THE PHOTOGRAPHS. Each date is the earliest capture date
 * in that folder. For an EVENT that is sound evidence — the camera was
 * there — which is not the same argument as the one refused in ./news,
 * where a screenshot's capture date was being used to claim a launch date
 * it could not know.
 *
 * WHAT WAS LEFT OUT, AND WHY. Nothing was deleted; the originals are
 * untouched in /events at the repo root.
 *   - Two exact duplicates: the podcast photo also sat in the Newton AI
 *     Training folder, and TKA's "Copy of Cover.jpg" is byte-identical to
 *     "DSC07686.jpeg".
 *   - "Screenshot 2026-10-01 at 2.59.15 PM.png" in TARUMT MF-25, which is
 *     a screenshot, not a photograph of an event.
 *   - Two files in TARUMT MF-25 captured 2021-07-29 ("Copy of
 *     edited-03426/03428"), four years before the rest of that folder.
 *     NEEDS THE CLIENT: they are either from a different event or the
 *     folder's date is wrong, and publishing them under a 2025 heading
 *     would state something we cannot support.
 *
 * ONE CORRECTION TO THE FOLDER NAMES: the source folder is spelled
 * "Torri"; the client confirmed it is Torii, which also matches the
 * project at /work/torii-teppanyaki. Name, slug and asset path all say
 * Torii here. Every other name on this page is still the folder's own.
 */
export type EventPhoto = { src: string; width: number; height: number };

export type SiteEvent = {
  slug: string;
  /** The event's real name, given by the client. Four of the six were
   *  the raw folder name until 2026-10-08; see the note at the top. */
  name: string;
  /** ISO date, the earliest capture in the folder. */
  date: string;
  photos: EventPhoto[];
};

/** Newest first. */
export const EVENTS: SiteEvent[] = [
  {
    slug: "newton-ai-training",
    name: "Newton AI Training",
    date: "2026-09-30",
    photos: [
      { src: "/events/newton-ai-training/1.webp", width: 1600, height: 1200 },
      { src: "/events/newton-ai-training/2.webp", width: 1600, height: 1200 },
      { src: "/events/newton-ai-training/3.webp", width: 1600, height: 1200 },
      { src: "/events/newton-ai-training/4.webp", width: 1600, height: 1200 },
      { src: "/events/newton-ai-training/5.webp", width: 1600, height: 1200 },
      { src: "/events/newton-ai-training/6.webp", width: 1600, height: 1200 },
      { src: "/events/newton-ai-training/7.webp", width: 1600, height: 1200 },
    ],
  },
  {
    slug: "torii",
    name: "Torii Teppanyaki Content Shooting",
    date: "2026-09-18",
    photos: [
      { src: "/events/torii/1.webp", width: 1067, height: 1600 },
      { src: "/events/torii/2.webp", width: 1067, height: 1600 },
      { src: "/events/torii/3.webp", width: 1067, height: 1600 },
    ],
  },
  {
    slug: "podcast",
    name: "Podcast with Andy",
    date: "2026-07-28",
    photos: [
      { src: "/events/podcast/1.webp", width: 1080, height: 810 },
    ],
  },
  {
    slug: "tka-25-pc",
    name: "The Knights Award 2026 Press Conference",
    date: "2026-07-28",
    photos: [
      { src: "/events/tka-25-pc/1.webp", width: 1600, height: 1067 },
      { src: "/events/tka-25-pc/2.webp", width: 1600, height: 1200 },
    ],
  },
  {
    slug: "santan",
    name: "Santan",
    date: "2026-04-24",
    photos: [
      { src: "/events/santan/1.webp", width: 1200, height: 1600 },
      { src: "/events/santan/2.webp", width: 854, height: 1280 },
      { src: "/events/santan/3.webp", width: 854, height: 1280 },
      { src: "/events/santan/4.webp", width: 854, height: 1280 },
      { src: "/events/santan/5.webp", width: 854, height: 1280 },
      { src: "/events/santan/6.webp", width: 720, height: 1080 },
      { src: "/events/santan/7.webp", width: 720, height: 1080 },
      { src: "/events/santan/8.webp", width: 720, height: 1080 },
    ],
  },
  {
    slug: "tarumt-mf-25",
    name: "TARUMT Music Fiesta 2025",
    date: "2025-09-20",
    photos: [
      { src: "/events/tarumt-mf-25/1.webp", width: 1200, height: 1600 },
      { src: "/events/tarumt-mf-25/2.webp", width: 1200, height: 1600 },
    ],
  },
];

export const EVENT_SLUGS = EVENTS.map((e) => e.slug);
