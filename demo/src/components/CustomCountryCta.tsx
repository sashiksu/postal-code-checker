import { useCallback } from "react";
import styles from "./CustomCountryCta.module.scss";

export function CustomCountryCta() {
  const handleJump = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("configuration");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#configuration");
    }
  }, []);

  return (
    <aside
      className={styles.banner}
      aria-labelledby="custom-country-cta-heading"
    >
      <div className={styles.iconWrap} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>
      <div className={styles.copy}>
        <h3 id="custom-country-cta-heading">
          Don't see your country? <em>Add your own.</em> Or tighten an existing
          one.
        </h3>
        <p>
          Add brand-new entries (internal codes, Kosovo, a dev sandbox) or
          replace a bundled pattern when your business rules are stricter than
          the defaults. One <code>configure()</code> call at app boot and every
          utility reads the merged dataset.{" "}
          <span className={styles.badge}>new in 2.1.0</span>
        </p>
      </div>
      <a
        href="#configuration"
        className={styles.cta}
        onClick={handleJump}
      >
        Try it live
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
    </aside>
  );
}
