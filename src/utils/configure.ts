import { ALPHA3_TO_ALPHA2 as DEFAULT_ALPHA3_MAP } from "../assets/alpha3Map";
import { COUNTRIES as DEFAULT_COUNTRIES } from "../assets/index";
import { PostalCodeConfig } from "../types/PostalCodeConfig";
import { PostalCodeData } from "../types/PostalCodeData";

import { ConfigurationError } from "./ConfigurationError";
import { setActiveData } from "./activeData";

const SLASH_WRAPPED = /^\/.+\/$/;
const ALPHA2 = /^[A-Z]{2}$/;
const ALPHA3 = /^[A-Z]{3}$/;

/**
 * Registers a user-supplied country dataset. Subsequent calls to any
 * utility (`validatePostalCode`, `getCountryByCode`, `getAllCountries`,
 * `guessCountries`, `format`, …) read from the merged result.
 *
 * Semantics:
 * - **Replace per country.** Each entry wholesale replaces the built-in
 *   entry for that alpha-2 code, or adds a new country if the code is
 *   previously unknown. Fields are not merged.
 * - **Idempotent across calls.** Each call starts from the bundled defaults
 *   and layers the given overrides on top. Prior calls are not cumulative.
 * - **Fail fast.** The configuration is validated synchronously. A shape or
 *   value error throws {@link ConfigurationError} before any state changes.
 *
 * @throws {ConfigurationError} When the configuration is structurally
 *   invalid. The message names the offending field path.
 *
 * @example
 * ```ts
 * import { configure } from "postal-code-checker";
 *
 * configure({
 *   countries: {
 *     XK: {
 *       patterns: ["/^(?:[1-7]\\d{4})$/"],
 *       example: ["10000", "20000"],
 *       country: "Kosovo",
 *       alpha3: "XKX",
 *     },
 *   },
 * });
 * ```
 */
export const configure = (config: PostalCodeConfig): void => {
  validateConfig(config);

  const mergedCountries: PostalCodeData = { ...DEFAULT_COUNTRIES };
  const mergedAlpha3Map: Record<string, string> = { ...DEFAULT_ALPHA3_MAP };

  for (const [code, entry] of Object.entries(config.countries)) {
    mergedCountries[code] = {
      patterns: entry.patterns,
      example: entry.example,
      country: entry.country,
      isGenericRegex: false,
    };
    if (entry.alpha3) {
      mergedAlpha3Map[entry.alpha3] = code;
    }
  }

  setActiveData({ countries: mergedCountries, alpha3Map: mergedAlpha3Map });
};

function validateConfig(config: unknown): asserts config is PostalCodeConfig {
  if (!isPlainObject(config)) {
    throw new ConfigurationError('"config" must be an object');
  }
  const countries = (config as { countries?: unknown }).countries;
  if (!isPlainObject(countries)) {
    throw new ConfigurationError('"config.countries" must be an object');
  }

  for (const [code, entry] of Object.entries(countries as Record<string, unknown>)) {
    if (!ALPHA2.test(code)) {
      throw new ConfigurationError(`"countries.${code}": country code must be a 2-letter uppercase string`);
    }
    if (!isPlainObject(entry)) {
      throw new ConfigurationError(`"countries.${code}" must be an object`);
    }
    const e = entry as Record<string, unknown>;

    if (!Array.isArray(e.patterns)) {
      throw new ConfigurationError(`"countries.${code}.patterns" must be an array of strings`);
    }
    e.patterns.forEach((pattern, i) => {
      if (typeof pattern !== "string" || !SLASH_WRAPPED.test(pattern)) {
        throw new ConfigurationError(
          `"countries.${code}.patterns[${i}]" must be a regex wrapped in slashes (e.g. "/^\\\\d{5}$/")`,
        );
      }
      try {
        new RegExp(pattern.slice(1, -1));
      } catch {
        throw new ConfigurationError(`"countries.${code}.patterns[${i}]" is not a valid regex: ${pattern}`);
      }
    });

    if (!Array.isArray(e.example) || e.example.some((x) => typeof x !== "string")) {
      throw new ConfigurationError(`"countries.${code}.example" must be an array of strings`);
    }

    if (typeof e.country !== "string" || e.country.trim() === "") {
      throw new ConfigurationError(`"countries.${code}.country" must be a non-empty string`);
    }

    if (e.alpha3 !== undefined && (typeof e.alpha3 !== "string" || !ALPHA3.test(e.alpha3))) {
      throw new ConfigurationError(`"countries.${code}.alpha3" must be a 3-letter uppercase string`);
    }
  }
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
