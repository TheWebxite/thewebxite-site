/**
 * THE CLIENTELE WALL, as Xin listed it on 2026-10-19 — and only those
 * names. A separate row lists the vendors and products we build on.
 *
 * `logo` is the file in /public. Every mark was taken from the brand's own
 * website (see data/clients.ts for the earlier ones, and the 2026-10-19
 * entry in ../CLAUDE.md for the new ones). Where `logo` is missing, or the
 * file is not on disk, the wall sets the name in the brand font instead —
 * a trademark is never redrawn or approximated.
 *
 * The wall shows every mark in one colour (white on blue, ink on paper)
 * through a CSS filter, so the row reads as one set.
 */
export type WallEntry = {
  name: string;
  /** Shown under the mark, for the two international clients. */
  note?: string;
  logo?: string;
  /** Logos that are a wide wordmark get a little less height. */
  wide?: boolean;
  /** A second mark shown beside the first (one client, two brands). */
  logo2?: string;
  /** The mark is a filled shape with knocked-out lettering, so a one-colour
   *  silhouette would erase it. Shown in greyscale instead. */
  knockout?: boolean;
};

export const CLIENTELE: WallEntry[] = [
  { name: "The Knights Award", logo: "/clients/knightsaward.webp" },
  { name: "HLM Research Centre – Universiti Malaya", logo: "/clients/hlmrcum.webp", wide: true },
  { name: "Dr Dylan", logo: "/clients/dylan-aligner.webp" },
  { name: "Lions Clubs", logo: "/clients/lions-club.webp" },
  { name: "Torii Teppanyaki", logo: "/clients/torii.webp" },
  { name: "Fuji Bakery", logo: "/clients/fuji-bakery.webp" },
  { name: "MIECO", logo: "/clients/mieco.webp", wide: true },
  { name: "Propel Global", logo: "/clients/propel-global.webp", wide: true },
  { name: "CYL", logo: "/clients/cyl.webp", wide: true, knockout: true },
  { name: "Newton", logo: "/clients/newton.webp" },
  { name: "Crayon", logo: "/partners/crayon.webp" },
  { name: "LSL", logo: "/clients/lsl.webp", knockout: true },
  { name: "GeoTrust", logo: "/clients/geotrust-trimmed.webp", wide: true },
  { name: "JUE Cantonese Cuisine", logo: "/clients/juecuisine.webp" },
  { name: "HYPE and Carhartt WIP Malaysia", logo: "/clients/hype.webp", logo2: "/clients/carhartt-wip.webp", wide: true },
  { name: "Leister Malaysia", logo: "/clients/leister.webp", wide: true, knockout: true },
  { name: "KIM Health & Beauty", note: "Vietnam", logo: "/clients/kimhealth.webp", wide: true },
  { name: "Limerick Castle Hotel", note: "Australia", logo: "/clients/limerick.webp" },
  { name: "TARUMT", logo: "/clients/tarumt.webp", wide: true, knockout: true },
  { name: "Alfameli", logo: "/clients/alfameli.webp" },
  { name: "Daie", logo: "/clients/daie.webp" },
  { name: "MITC", logo: "/clients/mitc.webp" },
  { name: "Kingsman", logo: "/clients/kingsman.webp" },
];

export const VENDORS: WallEntry[] = [
  { name: "ServerFreak", logo: "/partners/serverfreak.webp", wide: true },
  { name: "Lark", logo: "/partners/lark.webp" },
  { name: "WordPress", logo: "/partners/wordpress.webp", wide: true },
  { name: "WooCommerce", logo: "/partners/woocommerce.webp", wide: true, knockout: true },
  { name: "Shopify", logo: "/partners/shopify.webp", wide: true },
  { name: "n8n", logo: "/partners/n8n.webp" },
];
