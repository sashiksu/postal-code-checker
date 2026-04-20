import {
  MIGRATION_AFTER,
  MIGRATION_BEFORE,
  MIGRATION_CHECKLIST,
} from "../data/content";
import { CodeBlock } from "./ui/CodeBlock";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./MigrationGuide.module.scss";

export function MigrationGuide() {
  return (
    <section
      id="migration"
      className={styles.section}
      aria-labelledby="migration-heading"
    >
      <SectionHeading
        headingId="migration-heading"
        title="Migration: 1.x → 2.x"
        subtitle="Two changes to know about. Everything else is additive."
      />

      <div className={styles.block}>
        <SectionHeading
          title="Country shape: postalCodeRegex → postalCodePatterns"
          subtitle="getCountryByCode() now returns an array of patterns instead of a single slash-wrapped string."
          badge="breaking"
        />
        <div className={styles.diff}>
          <div className={`${styles.side} ${styles.before}`}>
            <h4>Before — 1.x</h4>
            <CodeBlock code={MIGRATION_BEFORE} ariaLabel="Before 1.x snippet" />
          </div>
          <div className={`${styles.side} ${styles.after}`}>
            <h4>After — 2.x</h4>
            <CodeBlock code={MIGRATION_AFTER} ariaLabel="After 2.x snippet" />
          </div>
        </div>
        <ul className={styles.checklist}>
          {MIGRATION_CHECKLIST.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={styles.block}>
        <SectionHeading
          title="usePostalCodeValidation is deprecated"
          subtitle="The u-prefix tripped React's rules-of-hooks lint for non-React consumers. Still works in 2.x — removal scheduled for 3.0.0."
          badge="removal in 3.0.0"
        />
        <p className={styles.note}>
          Replace any call to <code>usePostalCodeValidation()(code, postal)</code> with a
          direct <code>validatePostalCode(code, postal)</code>. No semantic
          difference — the factory wrapper was only ever forwarding arguments.
        </p>
      </div>
    </section>
  );
}
