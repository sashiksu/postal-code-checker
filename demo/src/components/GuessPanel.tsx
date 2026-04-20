import { useCallback, useMemo, useState } from "react";
import { guessCountries } from "postal-code-checker";
import { readShareParam } from "../data/share";
import { ShareButton } from "./ui/ShareButton";
import styles from "./BatchPanel.module.scss";

type Props = {
  onPickCountry?: (code: string) => void;
};

function loadInitialInput(): string {
  const raw = readShareParam("guess");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { input?: unknown };
      if (typeof parsed.input === "string") return parsed.input;
    } catch {
      // fall through
    }
  }
  return "12345";
}

export function GuessPanel({ onPickCountry }: Props) {
  const [raw, setRaw] = useState(() => loadInitialInput());
  const matches = useMemo(() => guessCountries(raw), [raw]);
  const hasInput = raw.trim() !== "";

  const getShareValue = useCallback(() => JSON.stringify({ input: raw }), [raw]);

  return (
    <div className={styles.panel}>
      <div className={styles.shareCorner}>
        <ShareButton paramName="guess" getValue={getShareValue} ariaLabel="Share this guess example" />
      </div>
      <div className={styles.header}>
        <div>
          <h3>Country guessing</h3>
          <p>guessCountries() — every country whose pattern accepts the input.</p>
        </div>
      </div>

      <div className={styles.controls} style={{ gridTemplateColumns: "1fr" }}>
        <input
          type="text"
          className={styles.textarea}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          aria-label="Postal code to guess countries for"
          placeholder="Try 12345, K1A 0T6, SW1A 1AA"
          style={{ minHeight: "auto", height: 40 }}
        />
      </div>

      <div className={styles.results}>
        {!hasInput ? (
          <div className={styles.empty}>Type a postal code to see likely countries.</div>
        ) : matches.length === 0 ? (
          <div className={styles.empty}>No country pattern accepts this input.</div>
        ) : (
          matches.map((m) => (
            <div
              key={m.countryCode}
              className={styles.row}
              onClick={() => onPickCountry?.(m.countryCode)}
              role={onPickCountry ? "button" : undefined}
              tabIndex={onPickCountry ? 0 : undefined}
              style={onPickCountry ? { cursor: "pointer" } : undefined}
            >
              <span className={`${styles.icon} ${styles.ok}`} aria-hidden="true">
                ·
              </span>
              <span className={styles.code}>{m.countryName}</span>
              <span className={`${styles.status} ${styles.ok}`}>{m.countryCode}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <strong>{matches.length}</strong> {matches.length === 1 ? "country" : "countries"} matched{" "}
        {hasInput && (
          <>
            · input <strong>{raw}</strong>
          </>
        )}
      </div>
    </div>
  );
}
