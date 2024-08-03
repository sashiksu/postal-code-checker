import { Country } from "../types/Country";
import { CountryCode } from "../types/CountryCode";

import { getCountryByCode } from "./getCountryByCode";

/**
 * A custom hook for validating postal codes based on country codes.
 *
 * @returns {Object} An object containing the validatePostalCode function.
 * @property {function} validatePostalCode - A function to validate postal codes.
 */
export const usePostalCodeValidation = () => {
  /**
   * Validates a postal code for a given country.
   *
   * @param {CountryCode} countryCode - The country code to validate against.
   * @param {string} postalCode - The postal code to validate.
   * @returns {boolean} True if the postal code is valid for the given country, false otherwise.
   */
  const validatePostalCode = (countryCode: CountryCode, postalCode: string): boolean => {
    const country: Country | null = getCountryByCode(countryCode);
    if (!country) return false;
    const regexPattern = country.postalCodeRegex.slice(1, -1);
    const regex = new RegExp(regexPattern);
    return regex.test(postalCode);
  };
  return { validatePostalCode };
};
