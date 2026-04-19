import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllCountries,
  getCountryByCode,
  validatePostalCode,
  type Country,
} from "postal-code-checker";
import { CountryCombobox } from "./ui/CountryCombobox";
import styles from "./Hero.module.scss";

type Verdict = "idle" | "valid" | "invalid" | "none";

type VerdictMeta = {
  state: Verdict;
  label: string;
  sub: string;
};

const IDLE: VerdictMeta = {
  state: "idle",
  label: "Type a postal code",
  sub: "Validation runs on every keystroke.",
};

function useCountries() {
  return useMemo(
    () =>
      getAllCountries().sort((a, b) =>
        a.countryName.localeCompare(b.countryName),
      ),
    [],
  );
}

type HeroProps = {
  countryCode: string;
  onCountryChange: (code: string) => void;
};

export function Hero({ countryCode, onCountryChange }: HeroProps) {
  const countries = useCountries();
  const [code, setCode] = useState<string>("");

  const country: Country | null = useMemo(
    () => getCountryByCode(countryCode),
    [countryCode],
  );

  const hasPatterns = (country?.postalCodePatterns.length ?? 0) > 0;

  const verdict: VerdictMeta = useMemo(() => {
    if (!country) return IDLE;
    if (!hasPatterns) {
      return {
        state: "none",
        label: "No postal code system",
        sub: `${country.countryName} doesn't use postal codes.`,
      };
    }
    if (!code.trim()) return IDLE;
    const ok = validatePostalCode(countryCode, code);
    return ok
      ? {
          state: "valid",
          label: "Valid",
          sub: `Matches the postal code pattern for ${country.countryName}.`,
        }
      : {
          state: "invalid",
          label: "Invalid",
          sub: `Doesn't match any known pattern for ${country.countryName}.`,
        };
  }, [country, hasPatterns, code, countryCode]);

  // Reset the input whenever the country changes — format almost always differs.
  useEffect(() => {
    setCode("");
  }, [countryCode]);

  const fieldState: "valid" | "invalid" | "" =
    verdict.state === "valid" || verdict.state === "invalid"
      ? verdict.state
      : "";

  const pickExample = useCallback((ex: string) => {
    setCode(ex);
  }, []);

  const firstExample = country?.examplePostalCodes[0] ?? "";
  const patternDisplay = hasPatterns
    ? country!.postalCodePatterns.join("  or  ")
    : "no postal code system";

  return (
    <header className={styles.hero}>
      <div className={styles.copy}>
        <span className={styles.eyebrow}>Try it live</span>
        <h1>
          Validate postal codes for <em>{countries.length} countries</em>.
        </h1>
        <p className={styles.lede}>
          TypeScript-first. Zero runtime dependencies. Works everywhere
          JavaScript runs — React, Next.js, Vue, Node.js, Deno, Bun, plain
          browser JS.
        </p>
        <div className={styles.meta}>
          <span><span className={styles.ok}>✓</span> MIT licensed</span>
          <span><span className={styles.ok}>✓</span> Zero dependencies</span>
          <span><span className={styles.ok}>✓</span> ESM + CommonJS</span>
          <span><span className={styles.ok}>✓</span> .d.ts bundled</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardEyebrow}>Live validator</div>
        <div className={styles.row}>
          <div>
            <label htmlFor="hero-country">Country</label>
            <CountryCombobox
              id="hero-country"
              value={countryCode}
              onChange={onCountryChange}
              ariaLabel="Select country"
            />
          </div>
          <div>
            <label htmlFor="hero-code">Postal code</label>
            <input
              id="hero-code"
              type="text"
              className={styles.field}
              placeholder={
                hasPatterns
                  ? `e.g. ${firstExample}`
                  : "this country has no postal codes"
              }
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={!hasPatterns}
              autoComplete="off"
              spellCheck={false}
              data-state={fieldState}
            />
          </div>
        </div>

        <div className={styles.verdict} data-state={verdict.state}>
          <span className={styles.verdictIcon} aria-hidden="true">
            {verdict.state === "valid"
              ? "✓"
              : verdict.state === "invalid"
                ? "✗"
                : verdict.state === "none"
                  ? "!"
                  : "·"}
          </span>
          <div>
            <div className={styles.verdictLabel}>{verdict.label}</div>
            <div className={styles.verdictSub}>{verdict.sub}</div>
          </div>
        </div>

        <div className={styles.hint}>
          <div>
            Pattern: <code>{patternDisplay}</code>
          </div>
          {hasPatterns && (
            <div className={styles.hintRow}>
              Try:
              <div className={styles.chips}>
                {country!.examplePostalCodes.slice(0, 5).map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    className={styles.chip}
                    onClick={() => pickExample(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
