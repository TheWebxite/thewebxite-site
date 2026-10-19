import Reveal from "./Reveal";

/** Company Profile p4, verbatim. The vertical rule starts here and runs the
 *  length of the page, so the argument reads as one object. */
const FAILURES = [
  {
    title: "Digital Adoption Gap",
    body: "Customers judge you in seconds — a weak or missing website loses them before you say a word.",
  },
  {
    title: "Manual Workflow",
    body: "Spreadsheets, follow-ups and admin quietly eat hours every week and don't scale.",
  },
  {
    title: "Missed Growth Opportunities",
    body: "Big brands run on AI for support, content and decisions. Most SMEs still do it all by hand.",
  },
];

export default function Gap() {
  return (
    <section id="the-gap" className="ground-flat px-[var(--space-gutter)] py-[var(--space-section)]">
      <div className="mx-auto max-w-[84rem]">
        <p className="max-w-[40ch] text-lead">
          1.2 million SMEs run Malaysia, yet most have no real brand, no automation
          and no AI working for them.
        </p>

        <ul className="mt-[var(--space-block)] border-t border-hairline-ink">
          {FAILURES.map((f, i) => (
            <Reveal as="li" key={f.title} delayIndex={i} className="grid gap-3 border-b border-hairline-ink py-8 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] md:gap-10">
              <h2 className="font-display text-section font-bold leading-[1.05] tracking-[-0.02em]">{f.title}</h2>
              <p className="max-w-[52ch] text-ink-muted">{f.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
