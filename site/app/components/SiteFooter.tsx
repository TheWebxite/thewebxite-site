import { SITE } from "@/data/site";

export default function SiteFooter() {
  return (
    <footer className="ground-grain px-[var(--space-gutter)] py-[var(--space-block)]">
      <div className="mx-auto flex max-w-[84rem] flex-wrap justify-between gap-x-12 gap-y-6 text-xs">
        <p className="max-w-[28ch]">
          {SITE.name} — a {SITE.city}-based {SITE.role}.
        </p>
        <address className="not-italic">
          <a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a>
          <br />
          {SITE.phones[0]}
          <br />
          {SITE.address}
        </address>
      </div>
    </footer>
  );
}
