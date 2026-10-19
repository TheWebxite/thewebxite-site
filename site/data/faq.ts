/**
 * The services FAQ.
 *
 * THE QUESTIONS ARE MINE. The client asked for "whatever you think is
 * suitable", so the wording of every question below is written by me, and
 * the research behind the choice is the set of questions agency services
 * pages actually answer: what it costs, what happens next, whether you
 * have to buy everything, what it is built on, how it starts.
 *
 * THE ANSWERS ARE NOT INVENTED, AND THAT IS THE POINT. Each one carries a
 * `source` naming where it comes from, and nothing claims a fact we do
 * not hold:
 *
 *   · "deck p7"/"p9" — Company Profile.pdf, the client's own words, used
 *     verbatim or trimmed, never embellished.
 *   · "data/services" and "data/partners" — copy that already exists on
 *     this site and has already been approved.
 *   · "ours" — connective wording written by me. Every one of these is
 *     a restatement of something already on the page, not a new claim.
 *
 * WHAT IS DELIBERATELY NOT ANSWERED HERE: price. Every comparable agency
 * page publishes a figure — WebFX leads with $3,000/month, Cloudix's own
 * enquiry form starts at RM1,500 — and the research is consistent that a
 * published range raises inbound quality because people self-qualify. We
 * have no figure, so the answer says how a price is arrived at instead of
 * pretending to one. The moment a real starting range exists, that answer
 * should be replaced; it is logged in FOLLOW-UPS.
 *
 * Also absent, for the same reason: how long a project takes, how big the
 * team is, and how many clients there have been. All answerable only by
 * the client.
 */
export type FaqItem = {
  q: string;
  /** Paragraphs. Kept short — an FAQ that needs scrolling is a page. */
  a: string[];
  /** Where the answer comes from. Not rendered; it is here so nobody has
   *  to re-derive whether a sentence was sourced or written. */
  source: string;
};

export const FAQ: FaqItem[] = [
  {
    q: "Do we have to take the whole stack?",
    a: [
      "No. Each of the six solutions is a layer of the same system rather than a separate purchase, so you can start with one.",
      "The reason to know about the others is that they connect: no scattered tools, every layer feeding the next.",
    ],
    source: "deck p6 (One Connected System) + the solutions lead already on this page",
  },
  {
    q: "What happens after we get in touch?",
    a: [
      "A tech consultation first: we get to know your business, map where the gaps are, and pinpoint where web, automation or AI will actually move the needle.",
      "Then a free demo — see it working before you commit, a real demo built around your use case, not just slides and promises.",
      "Once we are rolling you get clear milestones and regular check-ins, so you always know what is shipping and when.",
    ],
    source: "deck p9, verbatim",
  },
  {
    q: "How do you decide what to build first?",
    a: [
      "Four stages. Discover: identify business challenges, opportunities and objectives. Design: define the strategy, solution architecture and implementation roadmap.",
      "Deliver: develop, test and integrate the solution. Drive: measure performance, optimise results and support long-term growth.",
    ],
    source: "deck p7 (Our 4D Approach & Delivery Framework), verbatim",
  },
  {
    q: "Can you work with the systems we already run?",
    a: [
      "Yes — that is what the Business Systems layer is for: custom applications, portals, and the integrations that connect what you already run.",
      "When off-the-shelf software nearly fits, the gap is where the manual work lives.",
    ],
    source: "data/services — Business Systems summary and detail, verbatim",
  },
  {
    q: "What do you build on?",
    a: [
      "WordPress and WooCommerce for sites and e-commerce, Zapier and n8n for automation, Lark for internal workflow, and ServerFreak for hosting.",
      "Custom systems are built where an off-the-shelf tool cannot reach, not instead of one that can.",
    ],
    source: "data/partners (the stack) + data/services; the second line is ours",
  },
  {
    q: "What does it cost?",
    a: [
      "There is no standard price, because the six solutions are scoped differently and most engagements start with one layer rather than all of them.",
      "The consultation exists to answer exactly this: we map the gaps first, then quote against the scope that comes out of it.",
    ],
    source: "ours — states how a price is reached, because no published range exists yet. See FOLLOW-UPS.",
  },
];
