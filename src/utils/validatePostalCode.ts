import { AnyCountryCode } from "../types/AnyCountryCode";

import { matchesPostalCode } from "./matchesPostalCode";

/**
 * Validates a postal code for a given country.
 *
 * Input is normalized before validation: surrounding whitespace is trimmed
 * and letters are uppercased, so `"  k1a 0t6  "` and `"K1A 0T6"` are
 * treated identically. Custom countries registered via `configure()` are
 * validated the same way.
 *
 * To additionally require a specific state/province, use `isInSubdivision`
 * from the subdivision utilities — kept separate so consumers who only
 * validate never pay for the subdivision dataset.
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
export const validatePostalCode = (countryCode: AnyCountryCode, postalCode: string): boolean =>
  matchesPostalCode(countryCode, postalCode);
