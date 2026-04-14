import { Country } from "../types/Country";
import { CountryCode } from "../types/CountryCode";

import { getCountryByCode } from "./getCountryByCode";

/**
 * Validates a postal code for a given country.
 *
 * @param {CountryCode} countryCode - The ISO 3166-1 country code (alpha-2 or alpha-3).
 * @param {string} postalCode - The postal code to validate.
 * @returns {boolean} True if the postal code is valid for the given country, false otherwise.
 *
 * @example
 * validatePostalCode("US", "12345"); // true
 * validatePostalCode("CA", "K1A 0T6"); // true
 */
export const validatePostalCode = (countryCode: CountryCode, postalCode: string): boolean => {
  const country: Country | null = getCountryByCode(countryCode);
  if (!country) return false;
  const regexPattern = country.postalCodeRegex.slice(1, -1);
  const regex = new RegExp(regexPattern);
  return regex.test(postalCode);
};
