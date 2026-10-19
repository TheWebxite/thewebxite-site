export type LayerKey = "brand" | "ops" | "ai" | "grow";

/** The four layers, Company Profile.pdf p6. Names are the deck's; the
 *  one-line glosses are written in the brand voice. */
export const LAYERS: {
  key: LayerKey;
  name: string;
  /** Ours, written in the brand voice. */
  gloss: string;
  /** Deck p6 verbatim — the label above the name in the ecosystem diagram. */
  eyebrow: string;
  /** Deck p6 verbatim — the line beneath the name. */
  sub: string;
}[] = [
  { key: "brand", name: "Build Brand", gloss: "Front end — how you are judged in the first seconds", eyebrow: "Front-End Layer", sub: "Web Design & Development" },
  { key: "ops", name: "Improve Operations", gloss: "Back end — the systems the front end runs on", eyebrow: "Back-End Layer", sub: "Custom Systems & Transformation" },
  { key: "ai", name: "Work Smarter", gloss: "Intelligence — the repetitive work stops being manual", eyebrow: "Intelligence Layer", sub: "AI & Automation Solutions" },
  { key: "grow", name: "Grow Faster", gloss: "Growth — and what it tells you to build next", eyebrow: "Growth & Insights", sub: "Digital Marketing & Analytics" },
];

/**
 * The deck's own colour ramp for the four layers, p6, light to dark
 * around the loop — WITH ONE CORRECTION. The deck's lightest box is
 * #4f86e2, which gives white 3.60:1: fine for a layer name set large,
 * short of 4.5 for the small type beside it. #3a68c8 is 5.26:1 and is
 * still visibly the lightest of the four, so the ramp survives.
 *
 * It lives here rather than inside one component because two pages draw
 * these layers now, and a second copy of a contrast-checked palette is
 * a second copy that can drift out of compliance quietly.
 */
export const LAYER_COLOR: Record<LayerKey, string> = {
  brand: "#3a68c8", // 5.26:1 with white
  ops: "#2c4fc9", // 6.84:1
  ai: "#1f27ae", // 10.72:1
  grow: "#1a1e9c", // 12.28:1
};

export type Service = {
  slug: string;
  deckName: string;
  title: string;
  summary: string;
  layer: LayerKey;
  detail: string[];
  /** The deck's p5 summary, as the items it lists. */
  included: string[];
  /** From the old WordPress Services page (thewebxite.WordPress.2026-10-02.xml),
   *  lightly edited: cliché words ("seamless", "elevate") removed. Empty where
   *  the old site had no matching service. */
  more: string[];
};

/**
 * Six solutions from p5. `deckName` and `summary` are the deck's words
 * verbatim; `title` and `slug` add the term Malaysian SMEs actually search,
 * so the brand language leads and the searched language still reaches the
 * H1, the slug and the meta description.
 *
 * The layer mapping is ours, not the deck's — flagged for confirmation.
 */
export const SERVICES: Service[] = [
  {
    slug: "web-design-development-malaysia",
    deckName: "Digital Presence",
    title: "Digital Presence — Web Design & Development in Malaysia",
    summary: "Websites, e-commerce, and branding.",
    layer: "brand",
    detail: [
      "A website is the first thing a customer judges you on, and most of the time it is the only thing they see before deciding whether to call.",
      "We design and build the site, the brand it carries, and the e-commerce behind it when you sell online.",
    ],
    included: ["Websites", "E-commerce", "Branding"],
    more: ["We design and develop modern, responsive websites: visually engaging, functional sites that invite interaction, strengthen your brand and help you reach your business goals online.", "Graphic design that tells your brand's story visually \u2014 from logos and marketing materials to digital graphics \u2014 so you leave a lasting impression."],
  },
  {
    slug: "seo-digital-marketing-malaysia",
    deckName: "Customer Growth",
    title: "Customer Growth — SEO & Digital Marketing in Malaysia",
    summary: "Digital marketing, SEO, and lead generation.",
    layer: "grow",
    detail: [
      "A site nobody finds is a brochure in a drawer.",
      "Search, paid campaigns and the lead capture that turns attention into an enquiry you can answer.",
    ],
    included: ["Digital marketing", "SEO", "Lead generation"],
    more: ["Our SEO work raises your search rankings, organic traffic and visibility, using keyword optimisation, technical SEO and content strategy to position the brand for the long term.", "Social media campaigns that grow your audience and drive enquiries: creative content, targeted ads and platform management."],
  },
  {
    slug: "ai-automation-malaysia",
    deckName: "AI & Automation",
    title: "AI & Automation — Workflow Automation for Malaysian SMEs",
    summary: "AI assistants, automation, and workflow optimisation.",
    layer: "ai",
    detail: [
      "Spreadsheets, follow-ups and admin quietly eat hours every week and do not scale.",
      "We automate the repetitive work so the team runs lean and nothing slips.",
    ],
    included: ["AI assistants", "Automation", "Workflow optimisation"],
    more: [],
  },
  {
    slug: "custom-systems-malaysia",
    deckName: "Business Systems",
    title: "Business Systems — Custom Applications & Portals in Malaysia",
    summary: "Custom applications, portals, and integrations.",
    layer: "ops",
    detail: [
      "When off-the-shelf software nearly fits, the gap is where the manual work lives.",
      "Custom applications, customer and staff portals, and the integrations that connect what you already run.",
    ],
    included: ["Custom applications", "Portals", "Integrations"],
    more: ["We develop and code systems around your own business requirements. Whether it is a web application, a portal or an internal tool, it is built to give you the functionality you need to operate smarter and scale faster."],
  },
  {
    slug: "business-intelligence-malaysia",
    deckName: "Business Intelligence",
    title: "Business Intelligence — Dashboards & Reporting in Malaysia",
    summary: "Dashboards, analytics, and reporting.",
    layer: "grow",
    detail: [
      "Most businesses have the data and no way to look at it.",
      "Dashboards and reporting that answer the question you actually asked, built on the systems you already have.",
    ],
    included: ["Dashboards", "Analytics", "Reporting"],
    more: [],
  },
  {
    slug: "digital-transformation-malaysia",
    deckName: "Digital Transformation",
    title: "Digital Transformation — Technology Strategy in Malaysia",
    summary: "Technology strategies for long-term growth.",
    layer: "ops",
    detail: [
      "Transformation is a sequence, not a purchase.",
      "We map what to change, in what order, and what each step has to be worth before it is worth doing.",
    ],
    included: ["Technology strategy", "Roadmaps", "Long-term growth"],
    more: [],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);
