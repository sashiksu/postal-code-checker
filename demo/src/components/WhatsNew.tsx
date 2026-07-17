import { WHATS_NEW } from "../data/content";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./WhatsNew.module.scss";

export function WhatsNew() {
  return (
    <section id="whats-new" className={styles.section} aria-labelledby="whats-new-heading">
      <SectionHeading
        headingId="whats-new-heading"
        title="What's new"
        subtitle="2.3.0 adds inferSubdivision() — resolve a postal code to its state or province — on top of configure(), format() and guessCountries() and the Google libaddressinput data pipeline."
      />
      <div className={styles.grid}>
        {WHATS_NEW.map((item) => (
          <article key={item.title} className={styles.card}>
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
            <div className={styles.body}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
