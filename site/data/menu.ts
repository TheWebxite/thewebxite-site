/**
 * The site map the menu draws. One node per top-level page, in the order
 * a visitor meets them. `note` lines are ours (PLACEHOLDER: written in the
 * brand voice, not quoted from the deck) except Contact's, which is the
 * deck's own three-step engagement, Company Profile p9.
 *
 * `preview` is a capture of OUR OWN page (1440x900, top of page), taken
 * from the running site — refresh with the capture step in CLAUDE.md
 * whenever a page's first screen changes.
 */
export type MenuNode = {
  href: string;
  label: string;
  note: string;
  preview: string;
};

export const MENU_NODES: MenuNode[] = [
  { href: "/", label: "Home", note: "The whole stack, on one page.", preview: "/menu/home.webp" },
  { href: "/work", label: "Work", note: "Sites we have built — live, linked, filterable.", preview: "/menu/work.webp" },
  { href: "/services", label: "Services", note: "Six solutions. One connected system.", preview: "/menu/services.webp" },
  { href: "/about", label: "About", note: "A Petaling Jaya digital architect.", preview: "/menu/about.webp" },
  { href: "/events", label: "Events", note: "Trainings, shoots, talks — and our Instagram.", preview: "/menu/events.webp" },
  { href: "/contact", label: "Contact", note: "Tech consultation → free demo → follow-up timeline.", preview: "/menu/contact.webp" },
];
