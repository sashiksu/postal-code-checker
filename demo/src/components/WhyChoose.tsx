import { SectionHeading } from "./ui/SectionHeading";
import styles from "./WhyChoose.module.scss";

type Capability = {
  title: string;
  body: string;
  highlight?: string;
};

const CAPABILITIES: Capability[] = [
  {
    title: "249 countries, synced live",
    body: "The full ISO 3166-1 list, sourced from Google's libaddressinput. Regenerated per release — the same dataset behind Chromium, Android, and Google Pay.",
    highlight: "249",
  },
  {
    title: "Batch validation, built in",
    body: "validatePostalCodes(country, codes[]) returns an index-aligned boolean[]. Purpose-built for CSV imports, bulk uploads, and form arrays.",
    highlight: "batch",
  },
  {
    title: "Alpha-2 and alpha-3, interchangeable",
    body: 'Call with "US" or "USA", "GB" or "GBR". No branching at your call sites — same result either way.',
    highlight: "iso",
  },
  {
    title: "Forgiving input",
    body: 'Case-insensitive and whitespace-tolerant. "k1a 0t6", " K1A 0T6 ", and "K1A0T6" all validate equivalently where the country allows it.',
    highlight: "trim",
  },
  {
    title: "Zero runtime dependencies",
    body: "One install, nothing else pulled in. Keeps your node_modules small and your supply-chain surface minimal.",
    highlight: "0",
  },
  {
    title: "TypeScript-first",
    body: "Full .d.ts bundled. No separate @types package. Autocomplete and inline docs work immediately in any TS-aware editor.",
    highlight: "ts",
  },
  {
    title: "Dual ESM + CommonJS",
    body: "Modern import and legacy require() both work out of the box. No bundler gymnastics to use it in a mixed codebase.",
    highlight: "esm",
  },
  {
    title: "Works everywhere JS runs",
    body: "React, Next.js, Vue, Svelte, Angular, Node.js, Deno, Bun, plain browser JS. No framework assumptions.",
    highlight: "any",
  },
];

export function WhyChoose() {
  return (
    <section
      id="why"
      className={styles.section}
      aria-labelledby="why-heading"
    >
      <SectionHeading
        headingId="why-heading"
        title="Why postal-code-checker?"
        subtitle="Built for real product teams — not a weekend regex toy."
      />
      <ul className={styles.grid}>
        {CAPABILITIES.map((c) => (
          <li key={c.title} className={styles.card}>
            {c.highlight && (
              <span className={styles.mark} aria-hidden="true">
                {c.highlight}
              </span>
            )}
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
