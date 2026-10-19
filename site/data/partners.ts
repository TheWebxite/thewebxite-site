/**
 * The tools the studio builds on, taken from Company Profile p8.
 *
 * SOURCE AND WORDING, both deliberate:
 *
 * "Tech Partners" is the deck's own label and the client has confirmed it,
 * so it is the heading. Noting it here because it is a CLAIM ABOUT A
 * RELATIONSHIP, not a description of tooling: WordPress, WooCommerce,
 * Zapier, n8n and Lark are platforms anyone can build on. The wording is
 * the client's to make and they have made it; it is not something to
 * reword silently later.
 *
 * NOT THE SAME LIST AS THE CURRENT SITE. thewebxite.com shows Exabytes,
 * DigitalOcean Partner, WordPress, Google Analytics Certified Professional,
 * Google Tag Manager Certified, Google Partner and Meta Business Partner —
 * only WordPress appears in both. Those are mostly CERTIFICATIONS, which is
 * a different kind of claim again, and none of them are in the deck. They
 * are not reproduced here: a certification badge is a statement of fact, the
 * official assets have brand rules, and a logo lifted from a screenshot
 * would be neither accurate nor legible.
 *
 * THE KNIGHTS AWARD IS NOT IN THIS LIST, AND HAS CHANGED SIDES TWICE. It
 * is in the deck's partner row; it was excluded here at first as a likely
 * deck error (a client logo among tools); the client put it back; the
 * client has now taken it out again. It remains a client at
 * /work/the-knights-award, which is where it belongs — the logo of a
 * company you built something for is not a tool you build on. Do not
 * restore it without being asked a third time.
 *
 * Logos are the originals embedded in the PDF, recombined with their alpha
 * masks — not screenshots of the rendered page.
 *
 * CRAYON WAS ADDED BY THE CLIENT and is not in the deck either. Its
 * mark is the one its own site serves as an apple-touch-icon — the
 * orange infinity on transparent. The logo in its page header is white
 * on a dark bar and would have vanished on this row, and the automatic
 * pick from that page was a Red Hat logo sitting further down it.
 *
 * LARK IS THE OTHER EXCEPTION. It is not in the deck, so its mark came from
 * larksuite.com's own header — the official asset, at the only size the
 * site serves it (248x72 after trimming). That is thin: it covers the row's
 * display height at 2x with almost nothing to spare. If this row ever gets
 * bigger, Lark is the logo that softens first, and it will need a proper
 * file from the brand kit.
 */
export type Partner = {
  name: string;
  src: string;
  /** Intrinsic size of the exported asset, for next/image. */
  width: number;
  height: number;
};

export const PARTNERS: Partner[] = [
  { name: "ServerFreak", src: "/partners/serverfreak.webp", width: 731, height: 120 },
  { name: "WordPress", src: "/partners/wordpress.webp", width: 515, height: 120 },
  { name: "WooCommerce", src: "/partners/woocommerce.webp", width: 591, height: 120 },
  { name: "Zapier", src: "/partners/zapier.webp", width: 260, height: 120 },
  { name: "n8n", src: "/partners/n8n.webp", width: 433, height: 120 },
  { name: "Lark", src: "/partners/lark.webp", width: 248, height: 72 },
  { name: "Crayon", src: "/partners/crayon.webp", width: 288, height: 160 },
];
