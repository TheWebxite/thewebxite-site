/**
 * The industries served, as a general list.
 *
 * THIS IS A CLAIM, AND IT IS THE CLIENT'S TO MAKE. An earlier version of
 * this section generated its rows from the eight case studies, so every
 * line was a project and nothing could appear that had not been built.
 * The client asked for general industries instead, as the reference
 * does, and that is a statement about the markets the studio works in
 * rather than a list of receipts — the same kind of claim as "Tech
 * Partners", and theirs to assert.
 *
 * SO THE NAMES ARE NOT INVENTED EITHER. Rather than copy the
 * reference's list ("Pharma & Healthcare", "SaaS", "Local Businesses"),
 * each line here generalises a client the studio actually has, which is
 * why there are eight and not a round ten:
 *
 *   Retail & F&B                 Fuji Bakery, Torii Teppanyaki
 *   Beauty & Wellness            The Skin Suite
 *   Engineering & Manufacturing  Propel Global, Fuji Bakery
 *   Education                    MIA, TAR UMT
 *   Property & Real Estate       Kingsman Realty
 *   Software & SaaS              Sandmerit
 *   Non-profit & Associations    Lions International, The Knights Award
 *   Startups & SMEs              the deck's own stated audience, p4
 *
 * Those pairings are NOT rendered — the client asked for the industry
 * heading alone, no client names — but they are recorded here so the
 * list can be checked, and so nobody adds a ninth row for an industry
 * nobody has worked in.
 *
 * THE PHOTOGRAPHS ARE STOCK and say so: they illustrate an industry,
 * they are not pictures of the studio's work. Unsplash, free licence,
 * no attribution required; IDs kept so the originals can be found.
 */
export type Industry = {
  slug: string;
  name: string;
  image: string;
  /** Unsplash photo ID the image came from. */
  credit: string;
};

export const INDUSTRIES: Industry[] = [
  { slug: "retail-fnb", name: "Retail & F&B", image: "/industries/retail-fnb.webp", credit: "2AfUl89-34w" },
  { slug: "beauty-wellness", name: "Beauty & Wellness", image: "/industries/beauty-wellness.webp", credit: "Md_DhaFsnCQ" },
  { slug: "engineering-manufacturing", name: "Engineering & Manufacturing", image: "/industries/engineering-manufacturing.webp", credit: "pWUyHVJgLhg" },
  { slug: "education", name: "Education", image: "/industries/education.webp", credit: "wAgfqXpYqug" },
  { slug: "property", name: "Property & Real Estate", image: "/industries/property.webp", credit: "4453DIQWtsQ" },
  { slug: "software-saas", name: "Software & SaaS", image: "/industries/software-saas.webp", credit: "JKUTrJ4vK00" },
  { slug: "nonprofit", name: "Non-profit & Associations", image: "/industries/nonprofit.webp", credit: "ABVE1cyT7hk" },
  { slug: "startups-smes", name: "Startups & SMEs", image: "/industries/startups-smes.webp", credit: "dU3KJqyYlO0" },
];
