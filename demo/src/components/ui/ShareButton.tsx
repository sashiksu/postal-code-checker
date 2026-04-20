import { useCallback, useEffect, useRef, useState } from "react";
import { copyShareUrl } from "../../data/share";
import styles from "./ShareButton.module.scss";

type Props = {
  paramName: string;
  getValue: () => string;
  ariaLabel?: string;
};

export function ShareButton({ paramName, getValue, ariaLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(async () => {
    await copyShareUrl(paramName, getValue());
    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1400);
  }, [paramName, getValue]);

  return (
    <button
      type="button"
      className={`${styles.button} ${copied ? styles.copied : ""}`}
      onClick={handleClick}
      aria-label={ariaLabel ?? "Share — copy link"}
      title={copied ? "Link copied" : "Copy shareable link"}
    >
      {copied ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
      )}
    </button>
  );
}
