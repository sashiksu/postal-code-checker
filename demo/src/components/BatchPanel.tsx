import { useCallback, useMemo, useState } from "react";
import { validatePostalCodes } from "postal-code-checker";
import { readShareParam } from "../data/share";
import { CountryCombobox } from "./ui/CountryCombobox";
import { ShareButton } from "./ui/ShareButton";
import styles from "./BatchPanel.module.scss";

const DEFAULT_BATCH = ["K1A 0T6", "90210", "BAD-CODE", "SW1A 1AA"].join("\n");

type Shared = { country: string; codes: string };

function loadInitial(): Shared {
  const raw = readShareParam("batch");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<Shared>;
      if (typeof parsed.country === "string" && typeof parsed.codes === "string") {
        return { country: parsed.country, codes: parsed.codes };
      }
    } catch {
      // fall through to defaults
    }
  }
  return { country: "CA", codes: DEFAULT_BATCH };
}

export function BatchPanel() {
  const initial = useMemo(loadInitial, []);
  const [countryCode, setCountryCode] = useState(initial.country);
  const [raw, setRaw] = useState(initial.codes);

  const lines = useMemo(
    () => raw.split("\n").map((l) => l.trim()).filter(Boolean),
    [raw],
  );

  const results = useMemo(
    () => validatePostalCodes(countryCode, lines),
    [countryCode, lines],
  );

  const validCount = results.filter(Boolean).length;
  const total = results.length;

  const getShareValue = useCallback(
    () => JSON.stringify({ country: countryCode, codes: raw }),
    [countryCode, raw],
  );

  return (
    <div className={styles.panel}>
      <div className={styles.shareCorner}>
        <ShareButton paramName="batch" getValue={getShareValue} ariaLabel="Share this batch example" />
      </div>
      <div className={styles.header}>
        <div>
          <h3>Batch validation</h3>
          <p>validatePostalCodes() — one code per line, index-aligned output.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <CountryCombobox
          value={countryCode}
          onChange={setCountryCode}
          ariaLabel="Country for batch validation"
        />
        <textarea
          className={styles.textarea}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          aria-label="Postal codes — one per line"
          rows={6}
        />
      </div>

      <div className={styles.results}>
        {lines.length === 0 ? (
          <div className={styles.empty}>Enter one code per line to validate.</div>
        ) : (
          lines.map((line, idx) => {
            const ok = results[idx];
            return (
              <div key={`${idx}-${line}`} className={styles.row}>
                <span
                  className={`${styles.icon} ${ok ? styles.ok : styles.bad}`}
                  aria-hidden="true"
                >
                  {ok ? "✓" : "✗"}
                </span>
                <span className={styles.code}>{line}</span>
                <span
                  className={`${styles.status} ${ok ? styles.ok : styles.bad}`}
                >
                  {ok ? "valid" : "invalid"}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className={styles.summary}>
        <strong>{validCount}</strong> of <strong>{total}</strong> valid ·{" "}
        country <strong>{countryCode}</strong>
      </div>
    </div>
  );
}
