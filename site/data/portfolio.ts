/**
 * THE PORTFOLIO INDEX — every site on /work, as Xin listed them on
 * 2026-10-19. `priority` projects are featured first and largest.
 *
 * WHAT EACH LINE MAY SAY. `built` is one factual sentence written from the
 * live site as captured on 2026-10-19 (salvage/captures-2026-10-19/): who
 * the client is and what the site visibly does. No results, no numbers we
 * did not see, no quotes. If a line cannot be checked against the capture,
 * it does not belong here.
 *
 * Images: /work/index/<capture>.webp is the first screen at 1440x900;
 * -scroll is the page top-down (up to four screens) for the browser-window
 * scroll on the featured stage; -m is the first screen on a 375 phone.
 * Regenerate with `node scripts/portfolio-images.mjs`.
 *
 * Limerick Castle Hotel has NO URL and NO capture yet (the site is still
 * migrating). It is listed by name only until screenshots are supplied.
 */
export type Sector = "fnb" | "health" | "industrial" | "institutions" | "hospitality";

export const SECTORS: { key: Sector; label: string }[] = [
  { key: "fnb", label: "Food & beverage" },
  { key: "health", label: "Health & beauty" },
  { key: "industrial", label: "Industrial & B2B" },
  { key: "institutions", label: "Events & institutions" },
  { key: "hospitality", label: "Hospitality & services" },
];

export type PortfolioItem = {
  key: string;
  client: string;
  sector: Sector;
  /** The client's field, in plain words. */
  field: string;
  place: string;
  url: string | null;
  priority: boolean;
  built: string;
  /** Capture basename in /work/index, or null where none exists. */
  shot: string | null;
  /** First-screen image override (an older curated capture). */
  desktop?: string;
  mobile?: string;
  /** Case study at /work/<detail>, where one exists. */
  detail?: string;
};

const img = (s: string) => `/work/index/${s}.webp`;
export const desktopOf = (p: PortfolioItem) => p.desktop ?? (p.shot ? img(p.shot) : null);
export const mobileOf = (p: PortfolioItem) => p.mobile ?? (p.shot ? img(`${p.shot}-m`) : null);
export const scrollOf = (p: PortfolioItem) => (p.shot ? img(`${p.shot}-scroll`) : desktopOf(p));
export const hostOf = (p: PortfolioItem) =>
  p.url ? new URL(p.url).hostname.replace(/^www\./, "") : null;

export const PORTFOLIO: PortfolioItem[] = [
  {
    key: "lions-convention",
    client: "65th MD 308 Lions Convention 2027",
    sector: "institutions",
    field: "Lions Clubs convention",
    place: "Malaysia",
    url: "https://65md308lionsconvention2027.com/",
    priority: true,
    built:
      "The convention's own site: delegate registration in ticket waves, a day-by-day programme at Sunway Pyramid Convention Centre, hotels and sponsorship.",
    shot: "lions-convention",
    detail: "lions-convention-2027",
  },
  {
    key: "conceptine",
    client: "Conceptine",
    sector: "industrial",
    field: "Data-centre & telecom infrastructure",
    place: "Malaysia",
    url: "https://conceptine.com/",
    priority: true,
    built:
      "A dark, technical corporate site for a fibre-optic splicing and structured-cabling contractor: services, environments served, representative projects and an enquiry route.",
    shot: "conceptine",
    detail: "conceptine",
  },
  {
    key: "dr-dylan",
    client: "Dr Dylan Dental Clinic",
    sector: "health",
    field: "Clear aligner & dental clinic",
    place: "Subang Jaya, Malaysia",
    url: "https://aligner.drdylan.com.my/",
    priority: true,
    built:
      "A clear-aligner site for the Sunway Geo clinic: Angel Aligner and Invisalign treatment, a free 3D smile preview booking, Instagram reels and WhatsApp booking.",
    shot: "dr-dylan-aligner",
    detail: "dr-dylan-aligner",
  },
  {
    key: "mieco",
    client: "MIECO",
    sector: "industrial",
    field: "High-pressure laminate manufacturer",
    place: "Malaysia",
    url: "https://sales-mieco.com/",
    priority: true,
    built:
      "An online shop for MIECO's HPL surfaces: newest collections, shop by category, product codes and prices, and a project gallery.",
    shot: "mieco",
    detail: "mieco",
  },
  {
    key: "fuji-bakery",
    client: "Fuji Bakery",
    sector: "fnb",
    field: "Pastry & bakery manufacturer",
    place: "Malaysia",
    url: "https://fujibakery.com.my/",
    priority: true,
    built:
      "A manufacturer's site: ready-to-serve to raw-dough product ranges, food-safety certifications, a recipe collection and where to buy.",
    shot: "fuji-bakery",
    detail: "fuji-bakery",
  },
  {
    key: "torii",
    client: "Torii Teppanyaki",
    sector: "fnb",
    field: "Restaurant chain",
    place: "Malaysia",
    url: "https://www.torii.com.my/",
    priority: true,
    built:
      "A brand site carried by the 3D flame mascot: the full menu, every outlet with directions and Grab ordering, and a running ribbon of the brand's lines.",
    shot: "torii",
    detail: "torii-teppanyaki",
  },
  {
    key: "kim-health",
    client: "KIM Health & Beauty",
    sector: "health",
    field: "Skin care & therapy centre",
    place: "Ho Chi Minh City, Vietnam",
    url: "https://kimhealthandbeauty.com/",
    priority: true,
    built:
      "A Vietnamese-language site for a District 1 skin and therapy centre, with booking on the first screen, treatments with durations, results, products and news.",
    shot: "kim-health",
    detail: "kim-health-beauty",
  },
  {
    key: "limerick",
    client: "Limerick Castle Hotel",
    sector: "hospitality",
    field: "Hotel",
    place: "Australia",
    url: null,
    priority: true,
    built: "Hotel website, currently migrating to its new home. Screens will be added once it is live.",
    shot: null,
  },
  {
    key: "knights-award",
    client: "The Knights Award",
    sector: "institutions",
    field: "Awards & business community",
    place: "Malaysia",
    url: "https://theknightsaward.com/",
    priority: true,
    built:
      "The awards' own site: the Council of Lords, nominations, seasons and winners, news and media, and the community behind it.",
    shot: "knights-award",
    desktop: "/work/the-knights-award.webp",
    mobile: "/work/shots/the-knights-award-m1.webp",
    detail: "the-knights-award",
  },
  {
    key: "hlmrc-um",
    client: "HLM Research Centre, Universiti Malaya",
    sector: "institutions",
    field: "University research library",
    place: "Kuala Lumpur, Malaysia",
    url: "https://hlmrcumlibrary.com/",
    priority: true,
    built:
      "A Chinese-language digital library for the Dream of the Red Chamber research centre: search by title, author or ISBN, new arrivals and a catalogue of holdings.",
    shot: "hlmrc-um",
    detail: "hlmrc-universiti-malaya",
  },
  {
    key: "jue-cuisine",
    client: "JUE Cantonese Cuisine",
    sector: "fnb",
    field: "Fine-dining restaurant",
    place: "Malaysia",
    url: "https://juecuisine.com/",
    priority: true,
    built:
      "A bilingual restaurant site: signature dishes, private dining rooms by party size, news and an online table booking form.",
    shot: "jue-cuisine",
    detail: "jue-cuisine",
  },
  {
    key: "amsa-power",
    client: "AMSA Power",
    sector: "industrial",
    field: "Smart metering & IoT",
    place: "Shah Alam, Malaysia",
    url: "https://amsapower.com/",
    priority: false,
    built:
      "Product catalogue for an authorised distributor: meter calibration, smart water metering and industrial IoT, with the manufacturers it represents.",
    shot: "amsa-power",
  },
  {
    key: "safeline-asia",
    client: "Safeline Asia",
    sector: "industrial",
    field: "Hand & personal protection",
    place: "Malaysia",
    url: "https://safeline-asia.com/",
    priority: false,
    built:
      "Glove and PPE ranges by product family, quality and compliance, applications by industry and an enquiry form that routes to the right person.",
    shot: "safeline-asia",
  },
  {
    key: "uf-engineering",
    client: "UF Engineering Supply",
    sector: "industrial",
    field: "Civil & structural rubber products",
    place: "Malaysia",
    url: "https://ufengineering.com.my/",
    priority: false,
    built:
      "Bridge bearings, expansion joints and waterstops: a product range with detail pages, downloadable catalogues, projects supplied and quote requests.",
    shot: "uf-engineering",
  },
  {
    key: "esi-access",
    client: "ESI Access",
    sector: "industrial",
    field: "Electromagnetic lock manufacturer",
    place: "Malaysia",
    url: "https://esi-access.com/",
    priority: false,
    built:
      "A manufacturer's site: indoor and outdoor EM locks, brackets and accessories, the in-house process, certificates and quotation requests.",
    shot: "esi-access",
  },
  {
    key: "icar",
    client: "ICAR Auto Detailing",
    sector: "hospitality",
    field: "Car detailing & ceramic coating",
    place: "Ipoh, Malaysia",
    url: "https://icarautodetailing.com.my/",
    priority: false,
    built:
      "A dark, bold site for an Ipoh detailer: wash, ceramic coating, detailing and tint, an Instagram feed, Google reviews and WhatsApp booking.",
    shot: "icar",
  },
  {
    key: "thara-royale-spa",
    client: "Thara Royale Spa",
    sector: "health",
    field: "Outcall spa",
    place: "Kuala Lumpur, Malaysia",
    url: "https://thararoyalespa.com/",
    priority: false,
    built:
      "An outcall spa site: treatments with durations and prices, the hotels and areas covered, and a booking form that continues in WhatsApp.",
    shot: "thara-royale-spa",
  },
  {
    key: "beyond-lohas",
    client: "Beyond Lohas",
    sector: "fnb",
    field: "Premix beverage manufacturer",
    place: "Kajang, Malaysia",
    url: "https://www.beyondlohas.com/",
    priority: false,
    built:
      "A manufacturer's site for 3-in-1 and 2-in-1 premix powders: product series, OEM service, the facility and an enquiry by flavour, volume and cost.",
    shot: "beyond-lohas",
  },
];

export const FEATURED = PORTFOLIO.filter((p) => p.priority && p.shot);
