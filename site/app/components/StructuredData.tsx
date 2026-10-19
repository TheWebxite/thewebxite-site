import { SITE } from "@/data/site";

/**
 * Organization / LocalBusiness markup, for the whole site.
 *
 * EVERY VALUE COMES FROM data/site.ts, which is the client's own contact
 * block from Company Profile p2 and p9. Nothing here is inferred or
 * rounded up, and the omissions are deliberate: we hold no opening
 * hours, no founding date, no geo coordinates and no price range, so
 * none is claimed. Google asks for `priceRange` on a LocalBusiness and
 * will say it is missing — that is the correct outcome, because the
 * alternative is inventing a figure the client never gave us. Add them
 * here when the client supplies them, not before.
 *
 * `ProfessionalService` is a subtype of both LocalBusiness and
 * Organization, so one node answers for the business, the place and the
 * publisher rather than three competing ones.
 *
 * The @id is a stable fragment URI so later nodes — a BreadcrumbList, a
 * Service, an Article — can point at this organisation instead of
 * restating it.
 *
 * The address is the one string in SITE split into its parts. That is a
 * decomposition, not an addition: "Pusat Dagangan NZX, 47301 Petaling
 * Jaya, Selangor" carries each field already.
 */
const ORG = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://thewebxite.com/#organization",
  name: SITE.name,
  url: "https://thewebxite.com",
  description:
    "We build the brand, the systems, the automation and the growth as one connected stack.",
  email: SITE.email,
  telephone: [...SITE.phones],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Pusat Dagangan NZX",
    postalCode: "47301",
    addressLocality: SITE.city,
    addressRegion: "Selangor",
    addressCountry: "MY",
  },
  areaServed: {
    "@type": "Country",
    name: "Malaysia",
  },
  logo: "https://thewebxite.com/brand/logo-mark.webp",
  image: "https://thewebxite.com/opengraph-image",
  sameAs: [`https://www.instagram.com/${SITE.instagram.replace("@", "")}/`],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      /* JSON.stringify output is data, not markup, and the only hazard is
         a literal "</script>" inside a string value. None of SITE can
         contain one, and the escape below closes it regardless. */
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(ORG).replace(/</g, "\\u003c"),
      }}
    />
  );
}
