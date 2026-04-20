import { Fragment, useState, type ReactNode } from "react";
import { FAQS } from "../data/content";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./Faq.module.scss";

// Render inline `backtick` spans as <code>; leave everything else alone.
// ReactNode values pass through untouched so richer answers still work.
function renderAnswer(answer: ReactNode): ReactNode {
  if (typeof answer !== "string") return answer;
  const parts = answer.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Faq() {
  const [open, setOpen] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <SectionHeading
        headingId="faq-heading"
        title="FAQ"
        subtitle="The questions that come up most often in issues and on npm."
      />
      <div className={styles.list}>
        {FAQS.map((item) => {
          const isOpen = open === item.id;
          const panelId = `faq-panel-${item.id}`;
          const triggerId = `faq-trigger-${item.id}`;
          return (
            <div
              key={item.id}
              className={`${styles.item} ${isOpen ? styles.open : ""}`}
            >
              <button
                type="button"
                id={triggerId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : item.id)}
              >
                <span>{item.question}</span>
                <svg
                  className={styles.chevron}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                aria-hidden={!isOpen}
                className={styles.panel}
              >
                <div className={styles.panelInner}>
                  <div className={styles.answer}>
                    <p>{renderAnswer(item.answer)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
