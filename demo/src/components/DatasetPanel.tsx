import { useMemo, useState, type RefObject } from "react";
import {
  getAllCountries,
  getCountryByCode,
  type Country,
} from "postal-code-checker";
import styles from "./DatasetPanel.module.scss";

type Props = {
  activeCountry?: string;
  onPickCountry?: (countryCode: string) => void;
  searchRef?: RefObject<HTMLInputElement>;
};

type Row = {
  code: string;
  name: string;
  example: string;
  hasPostal: boolean;
};

function buildRows(): Row[] {
  return getAllCountries()
    .map((c): Row => {
      const full: Country | null = getCountryByCode(c.countryCode);
      return {
        code: c.countryCode,
        name: c.countryName,
        example: full?.examplePostalCodes[0] ?? "",
        hasPostal: (full?.postalCodePatterns.length ?? 0) > 0,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function DatasetPanel({
  activeCountry,
  onPickCountry,
  searchRef,
}: Props) {
  const rows = useMemo(buildRows, []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.example.toLowerCase().includes(q),
    );
  }, [rows, query]);

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3>Dataset browser</h3>
          <p>{rows.length} countries. Click a row to load it above.</p>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={searchRef}
          type="search"
          className={styles.search}
          placeholder="Search country, ISO code, or postal example…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          aria-label="Filter countries"
        />
      </div>

      <div className={styles.list} role="list">
        {filtered.length === 0 ? (
          <div className={styles.empty}>No countries match “{query}”.</div>
        ) : (
          filtered.map((r) => {
            const selected = activeCountry === r.code;
            return (
              <button
                type="button"
                role="listitem"
                key={r.code}
                className={`${styles.row} ${selected ? styles.selected : ""}`}
                onClick={() => onPickCountry?.(r.code)}
                aria-pressed={selected}
              >
                <span className={styles.name}>{r.name}</span>
                <span className={styles.codeTag}>{r.code}</span>
                <span
                  className={`${styles.example} ${!r.hasPostal ? styles.none : ""}`}
                >
                  {r.hasPostal ? r.example || "—" : "no postal codes"}
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className={styles.summary}>
        Showing <strong>{filtered.length}</strong> of{" "}
        <strong>{rows.length}</strong>
      </div>
    </div>
  );
}
