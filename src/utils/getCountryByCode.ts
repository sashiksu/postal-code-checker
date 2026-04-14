import { Country } from "../types/Country";

import { ALPHA3_TO_ALPHA2 } from "../assets/alpha3Map";
import { COUNTRIES } from "../assets/index";
import { CountryCode } from "../types/CountryCode";

/**
 * Retrieves country information based on the provided country code.
 *
 * Accepts ISO 3166-1 alpha-2 (`"US"`) and alpha-3 (`"USA"`) codes, as well
 * as lowercase variants (`"us"`, `"usa"`).
 *
 * @param {CountryCode} countryCode - ISO 3166-1 alpha-2 or alpha-3 country code.
 * @returns {Country | null} Country information if found, or null.
 *
 * @example
 * getCountryByCode('US');   // → { countryCode: 'US', countryName: 'United States of America', ... }
 * getCountryByCode('USA');  // → same as above (alpha-3 resolved to alpha-2)
 * getCountryByCode('us');   // → same as above (case-insensitive)
 */
export const getCountryByCode = (countryCode: CountryCode): Country | null => {
  const upper = countryCode.toUpperCase();
  const alpha2 = upper.length === 3 ? ALPHA3_TO_ALPHA2[upper] : upper;
  if (!alpha2) return null;
  const country = COUNTRIES[alpha2];
  return country
    ? {
        postalCodeRegex: country.regex,
        examplePostalCodes: country.example,
        isGenericRegex: country.isGenericRegex,
        countryName: country.country,
        countryCode: alpha2,
      }
    : null;
};
