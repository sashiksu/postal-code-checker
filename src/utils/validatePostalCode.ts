import { AnyCountryCode } from "../types/AnyCountryCode";

import { matchesPostalCode } from "./matchesPostalCode";
import { inferSubdivision } from "./subdivisions";

export type ValidatePostalCodeOptions = {
  /**
   * Require the code to belong to this subdivision — the unprefixed
   * ISO 3166-2 code (`"CA"`, not `"US-CA"`).
   *
   * Returns false for countries with no subdivision data, rather than
   * ignoring the constraint: the caller believes they checked something, and
   * quietly passing would be worse than failing.
   */
  subdivision?: string;
};

/**
 * Validates a postal code for a given country.
 *
 * Input is normalized before validation: surrounding whitespace is trimmed
 * and letters are uppercased, so `"  k1a 0t6  "` and `"K1A 0T6"` are
 * treated identically. Custom countries registered via `configure()` are
 * validated the same way.
 *
 * Pass `{ subdivision }` to additionally require the code to belong to a
 * specific state/province — the unprefixed ISO 3166-2 code. Only 24 countries
 * carry subdivision data; the constraint fails (returns false) for the rest.
 *
 * @param {AnyCountryCode} countryCode - The ISO 3166-1 country code (alpha-2 or alpha-3).
 * @param {string} postalCode - The postal code to validate.
 * @param {ValidatePostalCodeOptions} [options] - Optional subdivision constraint.
 * @returns {boolean} True if the postal code is valid for the given country, false otherwise.
 *
 * @example
 * validatePostalCode("US", "12345"); // true
 * validatePostalCode("CA", "K1A 0T6"); // true
 * validatePostalCode("CA", "k1a 0t6"); // true (case-insensitive)
 * validatePostalCode("US", "90210", { subdivision: "CA" }); // true
 * validatePostalCode("US", "90210", { subdivision: "NY" }); // false
 */
export const validatePostalCode = (
  countryCode: AnyCountryCode,
  postalCode: string,
  options?: ValidatePostalCodeOptions,
): boolean => {
  if (!matchesPostalCode(countryCode, postalCode)) return false;
  if (!options?.subdivision) return true;

  const wanted = options.subdivision.toUpperCase();
  return inferSubdivision(countryCode, postalCode).some((s) => s.code.toUpperCase() === wanted);
};
