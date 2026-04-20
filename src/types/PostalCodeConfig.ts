/**
 * Shape of a single country entry in a {@link PostalCodeConfig}.
 *
 * Mirrors the internal country record but omits the internal `isGenericRegex`
 * flag — user-supplied entries are never treated as generic fallback.
 */
export type CountryConfigEntry = {
  /**
   * One or more regular expressions, each wrapped in slashes (e.g. `"/^\\d{5}$/"`).
   * A postal code is valid if it matches *any* pattern after normalization
   * (trim + uppercase). Pass an empty array to declare that the country has
   * no postal code system — validation will return false for every input.
   */
  patterns: string[];
  /**
   * Example codes that satisfy the patterns. Used by demos and documentation;
   * not used by the validator. Pass an empty array if you have none.
   */
  example: string[];
  /**
   * Human-readable country name (e.g. `"Kosovo"`). Returned by
   * `getCountryByCode` and `getAllCountries` under `countryName`.
   */
  country: string;
  /**
   * Optional ISO 3166-1 alpha-3 code (e.g. `"XKX"` for Kosovo). When set,
   * `getCountryByCode` will resolve this alpha-3 value to the entry.
   * Must be a 3-letter uppercase string.
   */
  alpha3?: string;
};

/**
 * User-supplied configuration for {@link configure}.
 *
 * Each entry under `countries` either replaces a built-in country (when the
 * key matches an existing alpha-2 code) or adds a brand-new country (when it
 * doesn't). Replace semantics per country — the full default entry is
 * swapped, not merged field-by-field.
 *
 * @example
 * ```ts
 * const config: PostalCodeConfig = {
 *   countries: {
 *     XK: {
 *       patterns: ["/^(?:[1-7]\\d{4})$/"],
 *       example: ["10000", "20000"],
 *       country: "Kosovo",
 *       alpha3: "XKX",
 *     },
 *   },
 * };
 * ```
 */
export type PostalCodeConfig = {
  countries: {
    [countryCode: string]: CountryConfigEntry;
  };
};
