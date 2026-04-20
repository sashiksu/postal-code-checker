import { ROADMAP } from "../data/content";
import { CodeBlock } from "./ui/CodeBlock";
import styles from "./Roadmap.module.scss";

export function Roadmap() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3>What's next</h3>
          <p>Shipping order for 2.x and 3.0.0. Feedback welcome on issues.</p>
        </div>
      </div>
      <ol className={styles.list}>
        {ROADMAP.map((item) => {
          const shipped = item.milestone.toLowerCase().startsWith("shipped");
          return (
            <li key={`${item.milestone}-${item.title}`} className={styles.item}>
              <div className={styles.topRow}>
                <span
                  className={`${styles.milestone} ${shipped ? styles.shipped : ""}`}
                >
                  {item.milestone}
                </span>
                <h4 className={styles.title}>{item.title}</h4>
              </div>
              <p className={styles.desc}>{item.description}</p>
              <CodeBlock
                code={item.snippet}
                ariaLabel={`${item.title} snippet`}
              />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
