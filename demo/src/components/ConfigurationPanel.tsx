import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COUNTRIES,
  ConfigurationError,
  configure,
  getCountryByCode,
  guessCountries,
  resetConfig,
  validatePostalCode,
  type PostalCodeConfig,
} from "postal-code-checker";
import styles from "./ConfigurationPanel.module.scss";

const DEFAULT_CONFIG_JSON = `{
  "countries": {
    "XK": {
      "patterns": ["/^(?:[1-7]\\\\d{4})$/"],
      "example": ["10000", "20000"],
      "country": "Kosovo",
      "alpha3": "XKX"
    },
    "US": {
      "patterns": ["/^(?:\\\\d{5}-\\\\d{4})$/"],
      "example": ["12345-6789"],
      "country": "United States"
    }
  }
}
`;

type DiffEntry = {
  code: string;
  kind: "added" | "replaced";
  country: string;
};

type AppliedState =
  | { kind: "idle" }
  | { kind: "applied"; diff: DiffEntry[]; at: number }
  | { kind: "reset"; at: number };

function encodeConfigToHash(text: string): string {
  try {
    return "#config=" + btoa(unescape(encodeURIComponent(text)));
  } catch {
    return "";
  }
}

function decodeConfigFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith("#config=")) return null;
  try {
    const raw = hash.slice("#config=".length);
    return decodeURIComponent(escape(atob(raw)));
  } catch {
    return null;
  }
}

function computeDiff(config: PostalCodeConfig): DiffEntry[] {
  const entries: DiffEntry[] = [];
  for (const [code, entry] of Object.entries(config.countries ?? {})) {
    if (!entry) continue;
    entries.push({
      code,
      kind: COUNTRIES[code as keyof typeof COUNTRIES] ? "replaced" : "added",
      country: entry.country,
    });
  }
  return entries.sort((a, b) => a.code.localeCompare(b.code));
}

export function ConfigurationPanel() {
  const [text, setText] = useState<string>(
    () => decodeConfigFromHash() ?? DEFAULT_CONFIG_JSON,
  );
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedState>({ kind: "idle" });
  const [testCode, setTestCode] = useState("XK");
  const [testInput, setTestInput] = useState("10000");
  const [guessInput, setGuessInput] = useState("10000");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const shareTimer = useRef<number | null>(null);

  // Reset any leftover config from prior sessions when the tab mounts.
  useEffect(() => {
    resetConfig();
    return () => {
      resetConfig();
    };
  }, []);

  const handleApply = useCallback(() => {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      setError(err instanceof Error ? `JSON parse error: ${err.message}` : "Invalid JSON");
      setApplied({ kind: "idle" });
      return;
    }

    try {
      configure(parsed as PostalCodeConfig);
    } catch (err) {
      if (err instanceof ConfigurationError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : String(err));
      }
      setApplied({ kind: "idle" });
      return;
    }

    setError(null);
    setApplied({
      kind: "applied",
      diff: computeDiff(parsed as PostalCodeConfig),
      at: Date.now(),
    });
  }, [text]);

  const handleReset = useCallback(() => {
    resetConfig();
    setError(null);
    setApplied({ kind: "reset", at: Date.now() });
  }, []);

  const handleShare = useCallback(async () => {
    const base = `${window.location.origin}${window.location.pathname}${window.location.search}`;
    const hash = encodeConfigToHash(text);
    const url = `${base}${hash}`;
    history.replaceState(null, "", url);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Ignore — URL is still in the address bar.
    }
    setShareState("copied");
    if (shareTimer.current) window.clearTimeout(shareTimer.current);
    shareTimer.current = window.setTimeout(() => setShareState("idle"), 1400);
  }, [text]);

  useEffect(() => {
    return () => {
      if (shareTimer.current) window.clearTimeout(shareTimer.current);
    };
  }, []);

  // Reactive values — re-read the live dataset whenever `applied` changes so
  // the right-pane cards reflect what `configure()` / `resetConfig()` just did.
  const validatorResult = useMemo(() => {
    const country = getCountryByCode(testCode);
    if (!country) return { ok: false, reason: "country-unknown" as const };
    const ok = validatePostalCode(testCode, testInput);
    return { ok, reason: ok ? "match" : ("no-match" as const), country };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testCode, testInput, applied]);

  const guessMatches = useMemo(
    () => guessCountries(guessInput),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guessInput, applied],
  );

  const diff = applied.kind === "applied" ? applied.diff : [];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h3>configure() — custom country data</h3>
          <p>
            Drop in a JSON config and every utility in the package picks it up — one call at app
            boot, no per-call wiring. Same idea as an <code>i18next.init()</code> but for postal
            codes.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.button} ${styles.apply}`}
            onClick={handleApply}
          >
            Apply config
          </button>
          <button type="button" className={styles.button} onClick={handleReset}>
            resetConfig()
          </button>
          <button type="button" className={styles.button} onClick={handleShare}>
            {shareState === "copied" ? "Link copied" : "Share"}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.editorWrap}>
          <div className={styles.paneLabel}>
            <span>custom-countries.json</span>
            <span>{text.split("\n").length} lines</span>
          </div>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            data-state={error ? "error" : undefined}
            aria-label="Postal code configuration JSON"
          />
          {error ? (
            <div className={styles.errorBanner} role="alert">
              {error}
            </div>
          ) : applied.kind === "applied" ? (
            <div className={styles.appliedBanner}>
              Config applied — {diff.length} {diff.length === 1 ? "country" : "countries"} in effect.
            </div>
          ) : applied.kind === "reset" ? (
            <div className={styles.appliedBanner}>
              Reset to bundled defaults. Nothing is overridden.
            </div>
          ) : null}
        </div>

        <div className={styles.right}>
          <div className={styles.card}>
            <h4 className={styles.cardTitle}>Diff vs bundled dataset</h4>
            {applied.kind === "applied" && diff.length > 0 ? (
              diff.map((d) => (
                <div key={d.code} className={styles.diffRow}>
                  <span className={`${styles.tag} ${styles[d.kind]}`}>{d.kind}</span>
                  <strong>{d.code}</strong>
                  <span>{d.country}</span>
                </div>
              ))
            ) : (
              <p className={styles.diffNone}>
                {applied.kind === "reset"
                  ? "No overrides. The 249 bundled countries are active."
                  : "Click Apply config to see what changed."}
              </p>
            )}
          </div>

          <div className={styles.card}>
            <h4 className={styles.cardTitle}>validatePostalCode()</h4>
            <div className={styles.validatorRow}>
              <span className={styles.validatorLabel}>Country</span>
              <input
                className={styles.input}
                value={testCode}
                onChange={(e) => setTestCode(e.target.value.toUpperCase())}
                maxLength={3}
                spellCheck={false}
                aria-label="Country code to test"
              />
              <span
                className={`${styles.status} ${
                  validatorResult.reason === "country-unknown" ? styles.bad : styles.bundled
                }`}
              >
                {validatorResult.reason === "country-unknown"
                  ? "unknown"
                  : validatorResult.country?.countryName.slice(0, 18)}
              </span>
            </div>
            <div className={styles.validatorRow} style={{ marginTop: 6 }}>
              <span className={styles.validatorLabel}>Postal</span>
              <input
                className={styles.input}
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                spellCheck={false}
                aria-label="Postal code to validate"
              />
              <span
                className={`${styles.status} ${validatorResult.ok ? styles.ok : styles.bad}`}
              >
                {validatorResult.ok ? "valid" : "invalid"}
              </span>
            </div>
          </div>

          <div className={styles.card}>
            <h4 className={styles.cardTitle}>guessCountries()</h4>
            <div className={styles.validatorRow} style={{ gridTemplateColumns: "88px 1fr" }}>
              <span className={styles.validatorLabel}>Postal</span>
              <input
                className={styles.input}
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                spellCheck={false}
                aria-label="Postal code to guess countries for"
              />
            </div>
            <div className={styles.guessList} style={{ marginTop: 10 }}>
              {guessMatches.length === 0 ? (
                <span className={styles.chip}>No country accepts this input</span>
              ) : (
                guessMatches.slice(0, 24).map((m) => (
                  <span key={m.countryCode} className={styles.chip}>
                    <strong>{m.countryCode}</strong> · {m.countryName}
                  </span>
                ))
              )}
              {guessMatches.length > 24 && (
                <span className={styles.chip}>+{guessMatches.length - 24} more</span>
              )}
            </div>
          </div>

          <p className={styles.note}>
            <strong>When to call <code>resetConfig()</code>?</strong> In tests (so configs don't
            leak between specs), in dev tools that switch datasets at runtime, and after a hot
            module reload so stale overrides don't pile up.
          </p>
        </div>
      </div>
    </div>
  );
}
