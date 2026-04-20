import { AnyCountryCode } from "../types/AnyCountryCode";
import { Country } from "../types/Country";

import { getCountryByCode } from "./getCountryByCode";

/**
 * Validates a postal code for a given country.
 *
 * Input is normalized before validation: surrounding whitespace is trimmed
 * and letters are uppercased, so `"  k1a 0t6  "` and `"K1A 0T6"` are
 * treated identically. Custom countries registered via `configure()` are
 * validated the same way.
 *
 * @param {AnyCountryCode} countryCode - The ISO 3166-1 country code (alpha-2 or alpha-3).
 * @param {string} postalCode - The postal code to validate.
 * @returns {boolean} True if the postal code is valid for the given country, false otherwise.
 *
 * @example
 * validatePostalCode("US", "12345"); // true
 * validatePostalCode("CA", "K1A 0T6"); // true
 * validatePostalCode("CA", "k1a 0t6"); // true (case-insensitive)
 */
export const validatePostalCode = (countryCode: AnyCountryCode, postalCode: string): boolean => {
  const country: Country | null = getCountryByCode(countryCode);
  if (!country) return false;
  if (country.postalCodePatterns.length === 0) return false;
  const normalized = postalCode.trim().toUpperCase();
  return country.postalCodePatterns.some((wrapped) => {
    const pattern = wrapped.slice(1, -1);
    return new RegExp(pattern).test(normalized);
  });
};
