import { AnyCountryCode } from "../types/AnyCountryCode";
import { Country } from "../types/Country";

import { getCountryByCode } from "./getCountryByCode";

/**
 * Returns the canonical form of a postal code for a given country, ready to
 * store in a database, or `null` if the code is not valid for that country.
 *
 * Canonicalization trims surrounding whitespace and uppercases letters — the
 * same normalization `validatePostalCode` applies internally. No country-
 * specific separator insertion is performed. Custom countries registered via
 * `configure()` are honored.
 *
 * @param {AnyCountryCode} countryCode - The ISO 3166-1 country code (alpha-2 or alpha-3).
 * @param {string} postalCode - The postal code to format.
 * @returns {string | null} The canonical postal code if valid, otherwise `null`.
 *
 * @example
 * format("US", "  12345 "); // "12345"
 * format("CA", "k1a 0t6");  // "K1A 0T6"
 * format("US", "ABC12");    // null
 */
export const format = (countryCode: AnyCountryCode, postalCode: string): string | null => {
  const country: Country | null = getCountryByCode(countryCode);
  if (!country) return null;
  if (country.postalCodePatterns.length === 0) return null;
  const normalized = postalCode.trim().toUpperCase();
  const matches = country.postalCodePatterns.some((wrapped) => {
    const pattern = wrapped.slice(1, -1);
    return new RegExp(pattern).test(normalized);
  });
  return matches ? normalized : null;
};
