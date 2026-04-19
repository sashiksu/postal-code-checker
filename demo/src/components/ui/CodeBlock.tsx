import { useCallback, useMemo, useState } from "react";
import { tokenize, type Segment } from "../../data/highlight";
import styles from "./CodeBlock.module.scss";

type Props = {
  code: string;
  ariaLabel?: string;
};

export function CodeBlock({ code, ariaLabel }: Props) {
  const segments = useMemo(() => tokenize(code), [code]);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API fails silently on non-HTTPS pages — fall back to selection.
      const range = document.createRange();
      const pre = document.createElement("pre");
      pre.textContent = code;
      document.body.appendChild(pre);
      range.selectNode(pre);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand("copy");
      window.getSelection()?.removeAllRanges();
      document.body.removeChild(pre);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  }, [code]);

  return (
    <div className={styles.block}>
      <button
        type="button"
        className={`${styles.copy} ${copied ? styles.copied : ""}`}
        onClick={handleCopy}
        aria-label={ariaLabel ? `Copy ${ariaLabel}` : "Copy code"}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className={styles.pre}>
        <code>
          {segments.map((s, idx) => (
            <SegmentSpan key={idx} segment={s} />
          ))}
        </code>
      </pre>
    </div>
  );
}

function SegmentSpan({ segment }: { segment: Segment }) {
  if (segment.kind === "text") return <>{segment.text}</>;
  return <span className={styles[segment.kind]}>{segment.text}</span>;
}
