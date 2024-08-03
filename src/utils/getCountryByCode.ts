import { Country } from "../types/Country";

import { COUNTRIES } from "../assets/index";
import { CountryCode } from "../types/CountryCode";

/**
 * Retrieves country information based on the provided country code.
 *
 * @param {CountryCode} countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns {Country | null} An object containing country information if found, or null if not found.
 *
 * @example
 * const countryInfo = getCountryByCode('US');
 * if (countryInfo) {
 *   console.log(countryInfo.countryCode);       // "US"
 *   console.log(countryInfo.countryName);       // "United States"
 *   console.log(countryInfo.postalCodeRegex);   // Regular expression for US postal codes
 *   console.log(countryInfo.examplePostalCodes);// Array of example US postal codes
 *   console.log(countryInfo.isGenericRegex);    // Boolean indicating if the regex is generic
 * }
 */
export const getCountryByCode = (countryCode: CountryCode): Country | null => {
  const country = COUNTRIES[countryCode];
  return country
    ? {
        postalCodeRegex: country.regex,
        examplePostalCodes: country.example,
        isGenericRegex: country.isGenericRegex,
        countryName: country.country,
        countryCode: countryCode,
      }
    : null;
};
