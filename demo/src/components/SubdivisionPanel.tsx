import { useCallback, useMemo, useState } from "react";
import { getCountryByCode, hasSubdivisionData, inferSubdivision } from "postal-code-checker";
import { readShareParam } from "../data/share";
import { ShareButton } from "./ui/ShareButton";
import styles from "./BatchPanel.module.scss";

function loadInitial(): { cc: string; code: string } {
  const raw = readShareParam("sub");
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { cc?: unknown; code?: unknown };
      if (typeof parsed.cc === "string" && typeof parsed.code === "string") {
        return { cc: parsed.cc, code: parsed.code };
      }
    } catch {
      // fall through
    }
  }
  // K1A 0T6 is genuinely ambiguous — Ontario and Quebec. Showing that first
  // teaches the array return before anyone hits it by surprise.
  return { cc: "CA", code: "K1A 0T6" };
}

export function SubdivisionPanel() {
  const [{ cc, code }, setState] = useState(loadInitial);
  const matches = useMemo(() => inferSubdivision(cc, code), [cc, code]);
  const supported = useMemo(() => hasSubdivisionData(cc), [cc]);
  const countryName = getCountryByCode(cc)?.countryName ?? cc;
  const getShareValue = useCallback(() => JSON.stringify({ cc, code }), [cc, code]);

  return (
    <div className={styles.panel}>
      <div className={styles.shareCorner}>
        <ShareButton paramName="sub" getValue={getShareValue} ariaLabel="Share this subdivision example" />
      </div>
      <div className={styles.header}>
        <div>
          <h3>Subdivision inference</h3>
          <p>inferSubdivision() — which state or province a postal code belongs to.</p>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          className={styles.textarea}
          value={cc}
          onChange={(e) => setState((s) => ({ ...s, cc: e.target.value.toUpperCase() }))}
          spellCheck={false}
          aria-label="Country code"
          placeholder="US"
          style={{ minHeight: "auto", height: 40 }}
        />
        <input
          type="text"
          className={styles.textarea}
          value={code}
          onChange={(e) => setState((s) => ({ ...s, code: e.target.value }))}
          spellCheck={false}
          aria-label="Postal code to infer a subdivision from"
          placeholder="90210"
          style={{ minHeight: "auto", height: 40 }}
        />
      </div>

      <div className={styles.results}>
        {!supported ? (
          <div className={styles.empty}>
            The upstream dataset publishes no subdivision data for {countryName}.{" "}
            <code>inferSubdivision</code> returns <code>[]</code> here — a data limit, not a
            validation failure. 24 of 249 countries carry this data.
          </div>
        ) : matches.length === 0 ? (
          <div className={styles.empty}>
            No subdivision matched — the postal code is not valid for {countryName}.
          </div>
        ) : (
          matches.map((m) => (
            <div key={m.code} className={styles.row}>
              <span className={`${styles.icon} ${styles.ok}`} aria-hidden="true">
                ·
              </span>
              <span className={styles.code}>{m.name}</span>
              <span className={`${styles.status} ${styles.ok}`}>{m.code}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <strong>{matches.length}</strong> {matches.length === 1 ? "subdivision" : "subdivisions"}{" "}
        matched
        {matches.length > 1 && <> · this prefix is shared, so every match is returned</>}
      </div>
    </div>
  );
}
