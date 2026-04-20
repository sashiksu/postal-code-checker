import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getAllCountries,
  getCountryByCode,
  validatePostalCode,
  type Country,
} from "postal-code-checker";
import { readShareParam } from "../data/share";
import { CountryCombobox } from "./ui/CountryCombobox";
import { ShareButton } from "./ui/ShareButton";
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

type Shared = { country?: string; code?: string };

function loadInitial(): Shared {
  const raw = readShareParam("hero");
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Partial<Shared>;
    return {
      country: typeof parsed.country === "string" ? parsed.country : undefined,
      code: typeof parsed.code === "string" ? parsed.code : undefined,
    };
  } catch {
    return {};
  }
}

export function Hero({ countryCode, onCountryChange }: HeroProps) {
  const countries = useCountries();
  const initial = useMemo(loadInitial, []);
  const [code, setCode] = useState<string>(initial.code ?? "");

  // When we boot from a shared URL that set a code, the reset effect below
  // would wipe it on the initial-mount fire (and again when onCountryChange
  // runs). Track the country we're hydrating into so we can skip that reset.
  const hydrationTargetRef = useRef<string | null>(
    initial.code ? (initial.country ?? countryCode) : null,
  );

  const country: Country | null = useMemo(
    () => getCountryByCode(countryCode),
    [countryCode],
  );

  const getShareValue = useCallback(
    () => JSON.stringify({ country: countryCode, code }),
    [countryCode, code],
  );

  useEffect(() => {
    if (initial.country && initial.country !== countryCode) {
      onCountryChange(initial.country);
    }
    // Only apply shared state on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  // Skip the one change we trigger ourselves to hydrate a shared URL.
  useEffect(() => {
    if (hydrationTargetRef.current === countryCode) {
      hydrationTargetRef.current = null;
      return;
    }
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
        <div className={styles.shareCorner}>
          <ShareButton
            paramName="hero"
            getValue={getShareValue}
            ariaLabel="Share this validator state"
          />
        </div>
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
