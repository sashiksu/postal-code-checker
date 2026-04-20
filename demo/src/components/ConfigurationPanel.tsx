import { useCallback, useEffect, useMemo, useState } from "react";
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
import { readShareParam } from "../data/share";
import { CodeBlock } from "./ui/CodeBlock";
import { ShareButton } from "./ui/ShareButton";
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

const WIRING_EXAMPLE = `// 1. Load your config — usually a JSON file imported at app boot.
import customCountries from "./custom-countries.json";
import { configure } from "postal-code-checker";

// 2. Call once. configure() is a module-level singleton, so every
//    downstream import reads the merged dataset without extra wiring.
configure(customCountries);

// 3. Everything else just works — validate, format, guess, lookups
//    all read the new patterns with no per-call threading.
import {
  validatePostalCode,
  guessCountries,
} from "postal-code-checker";

validatePostalCode("XK", "10000");         // true
guessCountries("10000").map(c => c.countryCode);
// → ["FR", "IT", "XK", …]
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
    () => readShareParam("config") ?? DEFAULT_CONFIG_JSON,
  );
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<AppliedState>({ kind: "idle" });
  const [testCode, setTestCode] = useState("XK");
  const [testInput, setTestInput] = useState("10000");
  const [guessInput, setGuessInput] = useState("10000");

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

  const getShareValue = useCallback(() => text, [text]);

  // Reactive values re-read the live dataset whenever `applied` changes, so
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
      <div className={styles.shareCorner}>
        <ShareButton paramName="config" getValue={getShareValue} ariaLabel="Share this config" />
      </div>
      <div className={styles.header}>
        <div>
          <h3>configure() — custom country data</h3>
          <p>
            Drop in a JSON config and every utility in the package picks it up —
            one call at app boot, no per-call wiring. The config lives in a
            module-level singleton, so the same three-line setup works in
            React, Vue, Angular, Svelte, Node, Bun, Deno, and plain browser JS.
          </p>
        </div>
      </div>

      <div className={styles.wiringBlock}>
        <div className={styles.wiringIntro}>
          <strong>How it wires into your app</strong>
          <span>
            Three steps, one file. The JSON on the left is shorthand for this —
            call <code>configure()</code> once and every utility reads the
            merged dataset.
          </span>
        </div>
        <CodeBlock code={WIRING_EXAMPLE} ariaLabel="configure() wiring example" />
      </div>

      <ol className={styles.steps} aria-label="How to try a custom configuration">
        <li>
          <span className={styles.stepNum}>1</span>
          <div>
            <strong>Edit the JSON</strong> on the left. Add a new country code, or replace an
            existing one's patterns.
          </div>
        </li>
        <li>
          <span className={styles.stepNum}>2</span>
          <div>
            Click <strong>Apply config</strong>. The panel calls <code>configure()</code> for real;
            invalid configs throw <code>ConfigurationError</code> and show inline.
          </div>
        </li>
        <li>
          <span className={styles.stepNum}>3</span>
          <div>
            Test it on the right — <strong>validatePostalCode()</strong> and{" "}
            <strong>guessCountries()</strong> read from the live dataset.
          </div>
        </li>
        <li>
          <span className={styles.stepNum}>4</span>
          <div>
            Click <strong>Share</strong> to copy a URL with this config baked in, or{" "}
            <strong>resetConfig()</strong> to revert to the 249 bundled countries.
          </div>
        </li>
      </ol>

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
          <div className={styles.editorActions}>
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
          </div>
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
