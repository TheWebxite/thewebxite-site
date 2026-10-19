/** Contact details and positioning. Every value is the client's own, from
 *  Company Profile.pdf p2 and p9. */
export const SITE = {
  name: "TheWebxite",
  role: "digital architect",
  city: "Petaling Jaya",
  address: "Pusat Dagangan NZX, 47301 Petaling Jaya, Selangor",
  email: "contact@thewebxite.com",
  phones: ["+6017 777 5971", "+60 11-2522 9855", "+60 12-578 3143"],
  instagram: "@thewebxite",
} as const;

/* `href: null` means a nav row that is NOT a destination. Work is the
   only one: it has no index page — its four kinds are the pages — so in
   the bar it opens a submenu and goes nowhere itself, and in the full
   menu it is a column heading rather than a link. */
export const NAV: { href: string | null; label: string }[] = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];
