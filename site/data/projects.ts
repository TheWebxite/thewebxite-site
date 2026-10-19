export type Shot = {
  src: string;
  width: number;
  height: number;
  /** The site's own name for the page this frame came from. */
  label: string;
};

export type Project = {
  slug: string;
  /** Which kind of work this was. All eight are websites; see
   *  work-categories.ts for the three kinds that have no entries. */
  category:
    | "web-design"
    | "systems-development"
    | "ai-training"
    | "lark-implementation";
  client: string;
  sector: string;
  country: "MY" | "NZ" | "VN";
  /** Live site, or null where no URL has been supplied. */
  url: string | null;
  /** Capture in /public/work, or null. NEVER a stock photograph. */
  image: string | null;
  alt: string;
  /** Facts legible in the capture or on the live site. Verifiable, not narrative. */
  observed: string[];
  /** THE TWO STATEMENTS: what the site had to solve, and what was
   *  built about it. Written by us at the client's instruction — they
   *  declined to supply them — and therefore written under a rule.
   *
   *  NOTHING HERE CLAIMS WHAT THE CLIENT HAD BEFORE. "They had no way
   *  to sell online", "their old site was slow" — none of that is
   *  knowable from a capture of the site as it stands today, and each
   *  is a false statement about a named, real company if it happens to
   *  be wrong. So every `challenge` describes the JOB THE SITE HAS TO
   *  DO, which is legible from the site itself, and every `solution`
   *  is drawn from `observed` above it — the same facts a reader can
   *  check against the frames on the page.
   *
   *  No metrics either. There are no uplift figures, conversion rates
   *  or percentages anywhere in this file, because we hold none; a
   *  unit test enforces both rules.
   *
   *  They are a PAIR: a solution with no challenge is a feature list,
   *  so the page renders them only when both are present. */
  challenge: string | null;
  solution: string | null;
  /** The date this screenshot was taken. NOT a launch date — we do not know
   *  when any of these sites actually launched, and this field must never be
   *  used to announce one. */
  captured: string;
  /** Further frames of the live site, for the case-study page. `label` is
   *  the page's own nav wording, so it is the client's name for it and not
   *  ours. Empty where none were taken. */
  shots: Shot[];
  /** The same site on a 390x844 phone. Three per project. */
  mobile: Shot[];
  /** The client's OWN colour, sampled from their site's header band, and
   *  which of our two type colours clears 7:1 on it. */
  stage: { colour: string; on: "light" | "ink" };
};

/**
 * Eight clients, publication permission granted 2026-10-02.
 *
 * `observed` is written from the CAPTURE and the live site, which is the one
 * kind of claim a reader can check against the image beside it. `story` stays
 * null for every project until the client supplies a written record: the
 * Company Profile deck contains no per-project content (page 8 is a logo wall),
 * so there is nothing to draw on and nothing will be invented.
 *
 * Ordered to maximise contrast between neighbours — the range argument depends
 * on the jolt between consecutive captures, not on alphabetical order.
 *
 * `shots` ARE SECTION FRAMES, CAPTURED 2026-10-08, four per project, and
 * every one is a 1440x900 viewport of the live site rather than a full-page
 * capture: a whole modern page is 4000-8000px tall and shows nothing legible
 * once scaled into a column. `captured` above still refers to the lead image
 * and is deliberately not reused for these.
 *
 * THE FRAMES WERE CHOSEN BY MEASUREMENT, not by eye and not at scroll 0.
 * Three rounds of capture were wrong in three different ways and each is
 * worth knowing before anyone re-runs it:
 *
 *   · A hash-router SPA (The Knights Atelier) renders nothing on a cold load
 *     of its hash — two frames came back pure white. The route has to be set
 *     client-side after the app has booted.
 *   · Sites whose inner pages share a hero (sandmerit) give three identical
 *     frames if each is shot at scroll 0.
 *   · A footer is dense, high-contrast text and outscores most real content,
 *     so a naive "most content" rule returns four footers (mia). The scan
 *     finds the <footer> and stays above it; a fixed clearance does not work
 *     because that footer is over two screens tall on its own.
 *
 * The capture scripts are not kept in the repo — they are a one-off against
 * eight third-party sites, and re-running them would silently replace a
 * curated set with whatever those sites look like that day. The notes above
 * are what a repeat needs.
 *
 * `label` is the wording from each site's OWN navigation, so the captions are
 * the clients' names for their pages and not ours.
 */
export const PROJECTS: Project[] = [
  {
    slug: "the-knights-atelier",
    category: "web-design",
    client: "The Knights Atelier",
    sector: "Luxury fragrance e-commerce",
    country: "MY",
    url: "https://theknightsatelier.com",
    image: "/work/the-knights-atelier.webp",
    alt: "The Knights Atelier home page: a warm gold photograph of perfume flacons under the words Sense to Scent",
    observed: [
      "A catalogue organised around five fragrance worlds — Soft, Clean, Energy, Nature, Timeless.",
      "A product page for every fragrance, each with its top, heart and base notes.",
      "A working cart with a slide-out bag, and a quick-view drawer on the shop grid.",
      "Each fragrance is listed with a bespoke SVG flacon tinted to its world, rather than stock product photography.",
    ],
    challenge:
      "Scent cannot be photographed. A fragrance house has to make a reader choose something they cannot smell.",
    solution:
      "A shop grid would flatten the range into thumbnails of bottles, so the catalogue is organised as five fragrance worlds and choosing starts from a mood. Every fragrance has its own page carrying top, heart and base notes, and is drawn as a bespoke flacon tinted to its world rather than photographed. A quick-view drawer and a slide-out bag keep browsing inside the grid.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/the-knights-atelier-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/the-knights-atelier-2.webp",
        width: 1600,
        height: 1000,
        label: "Fragrances",
      },
      {
        src: "/work/shots/the-knights-atelier-3.webp",
        width: 1600,
        height: 1000,
        label: "The atelier",
      },
      {
        src: "/work/shots/the-knights-atelier-4.webp",
        width: 1600,
        height: 1000,
        label: "About",
      },
    ],
    mobile: [
      {
        src: "/work/shots/the-knights-atelier-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/the-knights-atelier-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/the-knights-atelier-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#412402", on: "light" },
  },
  {
    slug: "torii-teppanyaki",
    category: "web-design",
    client: "Torii Teppanyaki",
    sector: "Restaurant chain",
    country: "MY",
    url: "https://torii.com.my",
    image: "/work/torii-teppanyaki.webp",
    alt: "Torii Teppanyaki home page: a red tiled background with the brand's flame mascot and the wordmark set large in yellow",
    observed: [
      "A flame mascot carried as the primary brand device rather than food photography.",
      "A menu browser and an outlet finder reachable from the first screen.",
      "A running announcement ribbon along the foot of the hero.",
    ],
    challenge:
      "A hungry reader decides in seconds, and wants two things from a chain: the menu, and the nearest branch.",
    solution:
      "Both sit on the first screen — a menu browser and an outlet finder — because anything standing in front of them costs the visit. The brand carries itself on a flame mascot rather than food photography, so it holds up at any size and on any dish, and a running ribbon along the foot of the hero takes announcements without displacing either.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/torii-teppanyaki-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/torii-teppanyaki-2.webp",
        width: 1600,
        height: 1000,
        label: "Menu",
      },
      {
        src: "/work/shots/torii-teppanyaki-3.webp",
        width: 1600,
        height: 1000,
        label: "Outlets",
      },
      {
        src: "/work/shots/torii-teppanyaki-4.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
    ],
    mobile: [
      {
        src: "/work/shots/torii-teppanyaki-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/torii-teppanyaki-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/torii-teppanyaki-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#a7191e", on: "light" },
  },
  {
    slug: "propel-global",
    category: "web-design",
    client: "Propel Global Berhad",
    sector: "Engineering group",
    country: "MY",
    url: "https://propelglobal.com.my",
    image: "/work/propel-global.webp",
    alt: "Propel Global Berhad home page: a navy header over a photograph of two engineers at a welding robot, headlined Propel Engineering",
    observed: [
      "Three divisions carried in one site — Engineering, Construction and Maxflo.",
      "An investor relations section alongside the commercial pages.",
      "A rotating hero carousel on the landing page.",
    ],
    challenge:
      "Three divisions and a listed company's obligations, on one site. Each visitor arrives for a different one of them.",
    solution:
      "Engineering, Construction and Maxflo each hold their own path, so none of the three has to be read past to reach another. Investor relations runs alongside the commercial pages rather than beneath them, and a rotating hero carries the group's breadth without committing the landing page to any one division.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/propel-global-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/propel-global-2.webp",
        width: 1600,
        height: 1000,
        label: "Our story",
      },
      {
        src: "/work/shots/propel-global-3.webp",
        width: 1600,
        height: 1000,
        label: "Core businesses",
      },
      {
        src: "/work/shots/propel-global-4.webp",
        width: 1600,
        height: 1000,
        label: "Global footprint",
      },
    ],
    mobile: [
      {
        src: "/work/shots/propel-global-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/propel-global-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/propel-global-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#011973", on: "light" },
  },
  {
    slug: "the-skin-suite",
    category: "web-design",
    client: "The Skin Suite",
    sector: "Cosmetic clinic",
    country: "NZ",
    url: "https://www.theskinsuite.co.nz",
    image: "/work/the-skin-suite.webp",
    alt: "The Skin Suite home page: a soft editorial layout in pink and cream headlined Fresh faced and fine-line free",
    observed: [
      "Online booking and an online shop, both reachable from the header.",
      "A treatment menu split from the retail range.",
      "Hawke's Bay, New Zealand — the one client in this set outside Malaysia.",
    ],
    challenge:
      "A clinic sells two unlike things — appointments and products — and a visitor almost always wants exactly one.",
    solution:
      "Booking and the shop are separate routes, both reachable from the header, and the treatment menu is kept apart from the retail range. Mixed together each makes the other harder to find, and the clinical side starts to read as an upsell.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/the-skin-suite-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/the-skin-suite-2.webp",
        width: 1600,
        height: 1000,
        label: "About",
      },
      {
        src: "/work/shots/the-skin-suite-3.webp",
        width: 1600,
        height: 1000,
        label: "Services",
      },
      {
        src: "/work/shots/the-skin-suite-4.webp",
        width: 1600,
        height: 1000,
        label: "Anti-wrinkle",
      },
    ],
    mobile: [
      {
        src: "/work/shots/the-skin-suite-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/the-skin-suite-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/the-skin-suite-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#f57ab7", on: "ink" },
  },
  {
    slug: "sandmerit",
    category: "web-design",
    client: "Sandmerit",
    sector: "B2B performance-management software",
    country: "MY",
    url: "https://sandmerit.com",
    image: "/work/sandmerit.webp",
    alt: "Sandmerit home page: a yellow field headlined Malaysia's Leading Performance Management System and Corporate KPI Software",
    observed: [
      "Seven countries named along the foot of the hero — Malaysia, Singapore, the Philippines, Thailand, Vietnam, Cambodia, Indonesia.",
      "A language switcher in the primary navigation.",
      "Separate paths for the software, the workshops and the consultants.",
    ],
    challenge:
      "Software, workshops and consultants, sold across seven countries in more than one language.",
    solution:
      "Each of the three has its own path rather than a shared overview, which a single page describing all of it could not give them. The language switcher sits in the primary navigation instead of the footer, and the seven markets are named along the foot of the hero, so a visitor can tell at a glance whether they are one of them.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/sandmerit-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/sandmerit-2.webp",
        width: 1600,
        height: 1000,
        label: "About",
      },
      {
        src: "/work/shots/sandmerit-3.webp",
        width: 1600,
        height: 1000,
        label: "Methodology",
      },
      {
        src: "/work/shots/sandmerit-4.webp",
        width: 1600,
        height: 1000,
        label: "Efficiency improvement",
      },
    ],
    mobile: [
      {
        src: "/work/shots/sandmerit-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/sandmerit-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/sandmerit-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#ecb025", on: "ink" },
  },
  {
    slug: "mia",
    category: "web-design",
    client: "MIA — Malaysian Institute of Art",
    sector: "Higher education",
    country: "MY",
    url: "https://mia.edu.my",
    image: "/work/mia.webp",
    alt: "MIA — Malaysian Institute of Art home page: a mosaic of student work under the words Design the Future",
    observed: [
      "Separate entry points for staff, students and webmail alongside the public site.",
      "Programmes, admissions and student affairs as first-class navigation.",
      "A student-work gallery used as the hero rather than campus photography.",
    ],
    challenge:
      "A campus site answers two audiences at once: students deciding where to apply, and students and staff who need a login.",
    solution:
      "Staff, student and webmail entry points sit beside the public site rather than inside it — serving the second audience badly is what usually buries the first — which leaves programmes, admissions and student affairs as first-class navigation. The hero is student work rather than campus photography; at an art institute the portfolio is the prospectus.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/mia-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/mia-2.webp",
        width: 1600,
        height: 1000,
        label: "Our story",
      },
      {
        src: "/work/shots/mia-3.webp",
        width: 1600,
        height: 1000,
        label: "Programmes",
      },
      {
        src: "/work/shots/mia-4.webp",
        width: 1600,
        height: 1000,
        label: "Gallery",
      },
    ],
    mobile: [
      {
        src: "/work/shots/mia-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/mia-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/mia-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#af0606", on: "light" },
  },
  {
    slug: "the-knights-award",
    category: "web-design",
    client: "The Knights Award",
    sector: "Awards programme",
    country: "MY",
    url: "https://theknightsaward.com",
    image: "/work/the-knights-award.webp",
    alt: "The Knights Award home page: two gold particle horses facing each other on a black field",
    observed: [
      "A black ground carried across the whole site rather than a single dark hero.",
      "The twin-horse emblem rendered as particles rather than a flat logo.",
    ],
    challenge:
      "An awards programme has to feel like the room on the night, not a page with the lights turned down.",
    solution:
      "The black ground is carried across the whole site rather than spent on a single hero, and the twin-horse emblem is rendered as particles rather than placed as a flat logo — so the mark behaves like something staged rather than something pasted on.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/the-knights-award-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/the-knights-award-2.webp",
        width: 1600,
        height: 1000,
        label: "Council of Lords",
      },
      {
        src: "/work/shots/the-knights-award-3.webp",
        width: 1600,
        height: 1000,
        label: "Season 1",
      },
      {
        src: "/work/shots/the-knights-award-4.webp",
        width: 1600,
        height: 1000,
        label: "Season 2",
      },
    ],
    mobile: [
      {
        src: "/work/shots/the-knights-award-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/the-knights-award-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/the-knights-award-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#080808", on: "light" },
  },
  {
    slug: "fuji-bakery",
    category: "web-design",
    client: "Fuji Bakery",
    sector: "Food manufacturing",
    country: "MY",
    url: "https://fujibakery.com.my",
    image: "/work/fuji-bakery.webp",
    alt: "Fuji Bakery home page: a production line of pastries headlined Your One-Stop Pastry and Bakery Manufacturer",
    observed: [
      "A manufacturer's site rather than a shopfront — the hero is the production line.",
      "A product catalogue separated from a where-to-buy section.",
    ],
    challenge:
      "A manufacturer's buyers are wholesalers and retailers, not shoppers.",
    solution:
      "A site that looks like a bakery shopfront invites the wrong enquiry and buries the right one, so the hero is the production line rather than a counter. The product catalogue is kept separate from where-to-buy: a buyer sizing up capacity and a shopper hunting a stockist are never reading the same page.",
    captured: "2026-10-02",
    shots: [
      {
        src: "/work/shots/fuji-bakery-1.webp",
        width: 1600,
        height: 1000,
        label: "Home",
      },
      {
        src: "/work/shots/fuji-bakery-2.webp",
        width: 1600,
        height: 1000,
        label: "OEM products",
      },
      {
        src: "/work/shots/fuji-bakery-3.webp",
        width: 1600,
        height: 1000,
        label: "House brand",
      },
      {
        src: "/work/shots/fuji-bakery-4.webp",
        width: 1600,
        height: 1000,
        label: "Services",
      },
    ],
    mobile: [
      {
        src: "/work/shots/fuji-bakery-m1.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/fuji-bakery-m2.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
      {
        src: "/work/shots/fuji-bakery-m3.webp",
        width: 780,
        height: 1688,
        label: "Phone",
      },
    ],
    stage: { colour: "#fef34a", on: "ink" },
  },
  /* ---- added 2026-10-19: priority projects for the /work index. Frames
     are the 2026-10-19 captures (salvage/captures-2026-10-19); every
     line is written from the live site, under the same two rules. ---- */
  {
    slug: "lions-convention-2027",
    category: "web-design",
    client: "65th MD 308 Lions Convention 2027",
    sector: "Lions Clubs convention",
    country: "MY",
    url: "https://65md308lionsconvention2027.com/",
    image: "/work/lions-convention-2027.webp",
    alt: "65th MD 308 Lions Convention 2027 home page: a Register to Win banner with a car and a motorcycle over a night view of Sunway",
    observed: [
      "Delegate registration sold in dated ticket waves, each with its own price and what the fee includes.",
      "A tentative programme laid out day by day, 22 to 25 April 2027, at Sunway Pyramid Convention Centre.",
      "Live registered-delegate counts by district along the top of the home page.",
      "Hotels, sponsorship and activities each have a menu of their own, with a login for delegates.",
    ],
    challenge:
      "A convention has to sell tickets in waves, explain four days of programme and house its delegates, all from one address.",
    solution:
      "Registration leads: the home page opens on the early-bird offer and the delegate count by district, and every ticket wave carries its dates, its price and what the fee includes. The programme is set day by day beside it, and hotels, sponsorship and activities each get a menu of their own, so a delegate can arrange the whole trip from the site.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/lions-convention-2027-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/lions-convention-2027-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/lions-convention-2027-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/lions-convention-2027-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/lions-convention-2027-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/lions-convention-2027-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/lions-convention-2027-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#23387e", on: "light" },
  },
  {
    slug: "conceptine",
    category: "web-design",
    client: "Conceptine",
    sector: "Data-centre & telecom infrastructure",
    country: "MY",
    url: "https://conceptine.com/",
    image: "/work/conceptine.webp",
    alt: "Conceptine home page: Connecting Data, Powering Possibilities in white and orange over a dark data-centre aisle",
    observed: [
      "A dark, technical look built from a data-centre aisle, with orange carrying every call to action.",
      "Services set out as fibre and copper cabling, fibre-optic fusion splicing and data-centre fit-out.",
      "Representative projects for hyperscale data centres and telecommunications infrastructure.",
      "A send-an-enquiry route in the header and at the foot of every page.",
    ],
    challenge:
      "An infrastructure contractor has to look as precise as the cabling it installs, to buyers who judge on capability.",
    solution:
      "The site is built from the environment the work happens in: a dark data-centre aisle, with one orange carrying every action. Services are split into the specialities buyers search for, representative projects show the scale of job taken on, and an enquiry route sits in the header and at the foot of every page.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/conceptine-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/conceptine-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/conceptine-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/conceptine-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/conceptine-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/conceptine-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/conceptine-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#0c1a2e", on: "light" },
  },
  {
    slug: "dr-dylan-aligner",
    category: "web-design",
    client: "Dr Dylan Dental Clinic",
    sector: "Clear aligner & dental clinic",
    country: "MY",
    url: "https://aligner.drdylan.com.my/",
    image: "/work/dr-dylan-aligner.webp",
    alt: "Dr Dylan Dental Clinic aligner site: Crafting spectacular smiles, uniquely yours, set in a large serif on white",
    observed: [
      "A clear-aligner landing site for the clinic in Sunway Geo, Subang Jaya, covering Angel Aligner and Invisalign.",
      "A free 3D smile preview offered as the first call to action, beside the clinic's phone number.",
      "Instagram reels from the clinic embedded on the page, each with a short write-up.",
      "WhatsApp and appointment booking reachable from every screen.",
    ],
    challenge:
      "Clear aligners are a considered purchase, so the site has to make a nervous patient comfortable enough to book a first visit.",
    solution:
      "The page opens on the clinic's own promise in a large editorial serif and offers the lowest-commitment step first: a free 3D smile preview. Angel Aligner and Invisalign are explained in plain terms, the dentist's own Instagram reels answer common questions, and WhatsApp and booking stay within reach on every screen.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/dr-dylan-aligner-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/dr-dylan-aligner-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/dr-dylan-aligner-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/dr-dylan-aligner-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/dr-dylan-aligner-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/dr-dylan-aligner-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/dr-dylan-aligner-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#1d2b55", on: "light" },
  },
  {
    slug: "mieco",
    category: "web-design",
    client: "MIECO",
    sector: "High-pressure laminate manufacturer",
    country: "MY",
    url: "https://sales-mieco.com/",
    image: "/work/mieco.webp",
    alt: "MIECO online shop home page: Surface the Extraordinary over a living room finished in wood-grain laminate",
    observed: [
      "An online shop for MIECO HPL surfaces, with a cart and customer accounts in the header.",
      "Newest collections shown as swatches, each with its product code and price.",
      "Shopping by category, including a kitchen series, and a project gallery of finished interiors.",
      "A running announcement bar for the HPL collection along the top of every page.",
    ],
    challenge:
      "A laminate is chosen by eye, so an online shop for surfaces has to show the material as it will look in a room.",
    solution:
      "Every collection is shown twice: as a clean swatch with its code and price for the buyer who already knows what they want, and in finished interiors for the one who is still deciding. Shopping by category and a project gallery sit beside the cart, and an announcement bar carries the collection news across every page.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/mieco-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/mieco-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/mieco-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/mieco-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/mieco-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/mieco-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/mieco-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#22601f", on: "light" },
  },
  {
    slug: "kim-health-beauty",
    category: "web-design",
    client: "KIM Health & Beauty",
    sector: "Skin care & therapy centre",
    country: "VN",
    url: "https://kimhealthandbeauty.com/",
    image: "/work/kim-health-beauty.webp",
    alt: "KIM Health & Beauty home page in Vietnamese: a calm treatment-room photograph with a booking form on the first screen",
    observed: [
      "A Vietnamese-language site for a skin care and therapy centre in District 1, Ho Chi Minh City.",
      "A booking form on the first screen: choose a treatment and a date.",
      "Treatment pages with their durations, alongside results, products and news.",
      "Zalo, WhatsApp and phone buttons fixed to the side of every page.",
    ],
    challenge:
      "A spa in Ho Chi Minh City has to feel calm and expert in Vietnamese, and take a booking on its very first screen.",
    solution:
      "The booking form is part of the first screen rather than a page away: pick a treatment, pick a date. Treatments carry their durations, the results and product pages answer the questions that come before a booking, and Zalo, WhatsApp and phone stay fixed at the side, the channels the centre's clients actually use.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/kim-health-beauty-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/kim-health-beauty-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/kim-health-beauty-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/kim-health-beauty-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/kim-health-beauty-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/kim-health-beauty-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/kim-health-beauty-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#2a3b53", on: "light" },
  },
  {
    slug: "hlmrc-universiti-malaya",
    category: "web-design",
    client: "HLM Research Centre, Universiti Malaya",
    sector: "University research library",
    country: "MY",
    url: "https://hlmrcumlibrary.com/",
    image: "/work/hlmrc-universiti-malaya.webp",
    alt: "HLM Research Centre, Universiti Malaya library home page: a search bar over a photograph of rare books in a display case",
    observed: [
      "A Chinese-language digital library for the Dream of the Red Chamber research centre at Universiti Malaya.",
      "Search by title, author or ISBN from the first screen.",
      "New arrivals shown as book covers with author, category and date.",
      "A resource database and featured columns in the main navigation.",
    ],
    challenge:
      "A research library has to make a specialist collection searchable for scholars, in the language it is written in.",
    solution:
      "Search comes first: title, author or ISBN from the opening screen, over a photograph of the collection itself. New arrivals are shown as their covers with author, category and date, and the resource database and featured columns sit in the main navigation, so a scholar can go straight from a question to a book.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/hlmrc-universiti-malaya-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/hlmrc-universiti-malaya-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/hlmrc-universiti-malaya-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/hlmrc-universiti-malaya-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/hlmrc-universiti-malaya-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/hlmrc-universiti-malaya-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/hlmrc-universiti-malaya-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#8f1216", on: "light" },
  },
  {
    slug: "jue-cuisine",
    category: "web-design",
    client: "JUE Cantonese Cuisine",
    sector: "Fine-dining restaurant",
    country: "MY",
    url: "https://juecuisine.com/",
    image: "/work/jue-cuisine.webp",
    alt: "JUE Cantonese Cuisine home page: the restaurant's gold-lit facade at night under its Chinese and English name",
    observed: [
      "A bilingual Chinese and English site for a Cantonese fine-dining restaurant.",
      "Signature dishes shown as large photographs in a browsable carousel.",
      "Private dining rooms listed with the party size each one seats.",
      "An online table booking form and a Book a Table button fixed to every page.",
    ],
    challenge:
      "A fine-dining room is booked for an occasion, so the site has to feel like the room and make reserving it effortless.",
    solution:
      "The site opens on the restaurant's own facade at night and stays in its dark, gold-lit palette throughout. Signature dishes are shown large, each private room is listed with the party size it seats, and the booking form asks only what the restaurant needs, with a Book a Table button fixed to every page in both languages.",
    captured: "2026-10-19",
    shots: [
      { src: "/work/shots/jue-cuisine-1.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/jue-cuisine-2.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/jue-cuisine-3.webp", width: 1280, height: 800, label: "Home" },
      { src: "/work/shots/jue-cuisine-4.webp", width: 1280, height: 800, label: "Home" },
    ],
    mobile: [
      { src: "/work/shots/jue-cuisine-m1.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/jue-cuisine-m2.webp", width: 390, height: 812, label: "Phone" },
      { src: "/work/shots/jue-cuisine-m3.webp", width: 390, height: 812, label: "Phone" },
    ],
    stage: { colour: "#14161c", on: "light" },
  },
];

/** Derived, never typed twice: the home page headline and the "all N
 *  projects" link both read this, so adding or removing a client cannot leave
 *  a stale number in the copy. */
export const TOTAL = PROJECTS.length;

export const projectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
export const PROJECT_SLUGS = PROJECTS.map((p) => p.slug);
