/**
 * The clientele, as the client listed them: eighteen companies, each
 * logo taken from that company's own live site.
 *
 * NOT THE DECK'S NINE ANY MORE. The earlier list was extracted from
 * Company Profile p8 and generalised from there; this one was given
 * directly and is far longer, which is why the row became a moving
 * carousel: this many logos do not sit still on one line at a legible
 * size.
 *
 * FOUR WERE WITHDRAWN BY THE CLIENT, one at a time: UF Engineering
 * first, then Team Ryan 1995, Snap Law and the Dream of the Red Chamber
 * Research Centre. This list is the one place to add or remove a name —
 * both clientele blocks, /about and /services, render it, so neither
 * page holds a list of its own.
 *
 * EVERY LOGO CAME OFF THE COMPANY'S OWN SITE, found by rendering the
 * page and taking the highest-scoring image in its header. That is
 * better than a screenshot of a deck page — it is the mark as its owner
 * publishes it — but it is also why four needed hand-work:
 *
 *   · Crayon's header mark is white on a dark bar, and the automatic
 *     pick was a Red Hat logo sitting elsewhere on the page. Theirs is
 *     the apple-touch-icon, which is the orange mark on transparent.
 *  *   · KIM Health & Beauty and RFY both ship white logos built for dark
 *     headers, which would have been invisible here. Both publish a
 *     dark variant — logo-dark.png and their own site icon.
 *
 * `site` is recorded for provenance — where each mark came from and
 * where to look when one needs replacing. It is not rendered: these are
 * logos in a row, not outbound links.
 *
 * GEOTRUST AND CONCEPTINE ARRIVED WITH A WHITE BOX baked into the file
 * and have had it flood-filled away from the corners, so white inside
 * the letterforms survives. They carry "-trimmed" in the filename for
 * one reason: the first fix replaced the bytes under the same URL, and
 * nothing that caches by URL — the browser, the image optimiser, a CDN
 * later — ever saw it. A new name is the only cache key nothing can
 * already hold.
 *
 * ONE READS FAINT ON A LIGHT GROUND AND IS LEFT THAT WAY. Coribot
 * publishes only an on-dark mark — the wordmark is white, and the only
 * other file on their site is a set of app screenshots. Recolouring it
 * would be altering somebody else's logo, which is not ours to do. It
 * is logged for the client to supply a light-ground version. (Team Ryan
 * was the other, and has since been withdrawn from the list.)
 */
export type Client = {
  name: string;
  src: string;
  /** Intrinsic size of the exported asset, for next/image. */
  width: number;
  height: number;
  /** Where the mark came from. Provenance, not a link. */
  site: string;
};

export const CLIENTS: Client[] = [
  { name: "Talbot Lago Mondial", src: "/clients/talbotlagomondial.webp", width: 999, height: 160, site: "https://talbotlagomondial.com/" },
  { name: "Torii Teppanyaki", src: "/clients/torii.webp", width: 394, height: 160, site: "https://www.torii.com.my/" },
  { name: "GeoTrust", src: "/clients/geotrust-trimmed.webp", width: 588, height: 160, site: "https://geotrust.net.my/" },
  { name: "Coribot", src: "/clients/coribot.webp", width: 874, height: 160, site: "https://coribot.io/" },
  { name: "Nafaz JCS Engineering", src: "/clients/nafazjcs.webp", width: 220, height: 160, site: "https://nafazjcsengineering.my/" },
  { name: "Titans Solutions", src: "/clients/titans.webp", width: 130, height: 160, site: "https://titanssolutionsmy.com/" },
  { name: "LSL", src: "/clients/lsl.webp", width: 383, height: 160, site: "https://lsl.com.my/" },
  { name: "Miracle International", src: "/clients/miracle.webp", width: 293, height: 160, site: "https://miracle-international.com.my/" },
  { name: "Jué Cuisine", src: "/clients/juecuisine.webp", width: 189, height: 160, site: "https://juecuisine.com/" },
  { name: "MG Discovery", src: "/clients/mgdiscovery.webp", width: 205, height: 160, site: "https://mgdiscovery.com/" },
  { name: "The Knights Award", src: "/clients/knightsaward.webp", width: 311, height: 160, site: "https://theknightsaward.com/" },
  { name: "RFY Group", src: "/clients/rfy.webp", width: 158, height: 160, site: "https://rfy.my/" },
  { name: "Dr Dylan Dental Clinic", src: "/clients/dylan-aligner.webp", width: 278, height: 160, site: "https://aligner.drdylan.com.my/" },
  { name: "Conceptine", src: "/clients/conceptine-trimmed.webp", width: 258, height: 160, site: "https://conceptine.com/" },
  { name: "ESI Access", src: "/clients/esi-access.webp", width: 361, height: 160, site: "https://esi-access.com/" },
  { name: "KIM Health & Beauty", src: "/clients/kimhealth.webp", width: 913, height: 160, site: "https://kimhealthandbeauty.com/" },
  { name: "Mieco", src: "/clients/mieco.webp", width: 720, height: 160, site: "https://sales-mieco.com/" },
  { name: "The Knights Atelier", src: "/clients/knightsatelier.webp", width: 190, height: 160, site: "https://theknightsatelier.com/" },
];
