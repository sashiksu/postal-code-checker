import { useMemo, useState } from "react";
import { format } from "postal-code-checker";
import { CountryCombobox } from "./ui/CountryCombobox";
import styles from "./BatchPanel.module.scss";

export function FormatPanel() {
  const [countryCode, setCountryCode] = useState("CA");
  const [raw, setRaw] = useState("k1a0t6");

  const formatted = useMemo(() => format(countryCode, raw), [countryCode, raw]);
  const ok = formatted !== null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3>Canonical formatting</h3>
          <p>format() — returns the storable form, or null if invalid.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <CountryCombobox value={countryCode} onChange={setCountryCode} ariaLabel="Country for canonical formatting" />
        <input
          type="text"
          className={styles.textarea}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
          aria-label="Postal code to format"
          style={{ minHeight: "auto", height: 40 }}
        />
      </div>

      <div className={styles.results}>
        {raw.trim() === "" ? (
          <div className={styles.empty}>Type a postal code to see its canonical form.</div>
        ) : (
          <div className={styles.row}>
            <span className={`${styles.icon} ${ok ? styles.ok : styles.bad}`} aria-hidden="true">
              {ok ? "✓" : "✗"}
            </span>
            <span className={styles.code}>{ok ? formatted : raw}</span>
            <span className={`${styles.status} ${ok ? styles.ok : styles.bad}`}>{ok ? "canonical" : "null"}</span>
          </div>
        )}
      </div>

      <div className={styles.summary}>
        Input <strong>{raw || "—"}</strong> · country <strong>{countryCode}</strong> · output{" "}
        <strong>{ok ? formatted : "null"}</strong>
      </div>
    </div>
  );
}
