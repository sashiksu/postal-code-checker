import { AnyCountryCode } from "../types/AnyCountryCode";

import { validatePostalCode } from "./validatePostalCode";

/**
 * Validates an array of postal codes against a single country.
 *
 * Useful for CSV imports, bulk address validation, and form arrays where
 * many codes share the same country. Custom countries registered via
 * `configure()` are honored.
 *
 * @param {AnyCountryCode} countryCode - The ISO 3166-1 country code (alpha-2 or alpha-3).
 * @param {string[]} postalCodes - Postal codes to validate.
 * @returns {boolean[]} Array of validation results, index-aligned with `postalCodes`.
 *
 * @example
 * validatePostalCodes("US", ["12345", "90210", "abc"]);
 * // → [true, true, false]
 */
export const validatePostalCodes = (countryCode: AnyCountryCode, postalCodes: string[]): boolean[] =>
  postalCodes.map((code) => validatePostalCode(countryCode, code));
