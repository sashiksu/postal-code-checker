import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div>
          MIT ©{" "}
          <a
            href="https://sashikasuraweera.com/"
            target="_blank"
            rel="noreferrer"
          >
            Sashika Suraweera
          </a>
        </div>
        <div className={styles.shortcuts} aria-label="Keyboard shortcuts">
          <span className={styles.kbd}>
            <kbd>t</kbd> toggle theme
          </span>
          <span className={styles.kbd}>
            <kbd>/</kbd> focus search
          </span>
          <span className={styles.kbd}>
            <kbd>g</kbd> go to top
          </span>
        </div>
        <div className={styles.links}>
          <a href="https://github.com/sashiksu/postal-code-checker" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.npmjs.com/package/postal-code-checker" target="_blank" rel="noreferrer">npm</a>
          <a href="https://github.com/sashiksu/postal-code-checker#readme" target="_blank" rel="noreferrer">Docs</a>
          <a href="https://github.com/sashiksu/postal-code-checker/issues" target="_blank" rel="noreferrer">Issues</a>
        </div>
      </div>
    </footer>
  );
}
