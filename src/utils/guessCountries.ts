import { CountryOption } from "../types/CountryOption";

import { getActiveData } from "./activeData";

/**
 * Given a postal code with no country context, returns every country whose
 * postal code pattern accepts the input. Honors custom countries registered
 * via `configure()`.
 *
 * Input is normalized before matching: surrounding whitespace is trimmed and
 * letters are uppercased. Countries with no postal code system are skipped.
 * Results are sorted alphabetically by `countryName` (locale-insensitive) so
 * the array is ready to render as a picker.
 *
 * @param {string} postalCode - The postal code to match against every country.
 * @returns {CountryOption[]} Matching countries as `{ countryName, countryCode }`.
 *
 * @example
 * guessCountries("K1A 0T6"); // [{ countryName: "Canada", countryCode: "CA" }]
 * guessCountries("12345");   // many countries — any 5-digit scheme matches
 * guessCountries("");        // []
 */
export const guessCountries = (postalCode: string): CountryOption[] => {
  const normalized = postalCode.trim().toUpperCase();
  if (normalized === "") return [];

  const { countries } = getActiveData();
  const matches: CountryOption[] = [];
  for (const [code, country] of Object.entries(countries)) {
    if (country.patterns.length === 0) continue;
    const hit = country.patterns.some((wrapped) => {
      const pattern = wrapped.slice(1, -1);
      return new RegExp(pattern).test(normalized);
    });
    if (hit) {
      matches.push({ countryName: country.country, countryCode: code });
    }
  }

  return matches.sort((a, b) => a.countryName.localeCompare(b.countryName));
};
