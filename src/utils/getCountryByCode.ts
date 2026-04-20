import { AnyCountryCode } from "../types/AnyCountryCode";
import { Country } from "../types/Country";

import { getActiveData } from "./activeData";

/**
 * Retrieves country information based on the provided country code.
 *
 * Accepts ISO 3166-1 alpha-2 (`"US"`) and alpha-3 (`"USA"`) codes, as well
 * as lowercase variants (`"us"`, `"usa"`). Custom codes registered via
 * `configure()` are also resolvable.
 *
 * @param {AnyCountryCode} countryCode - ISO 3166-1 alpha-2 or alpha-3 country code.
 * @returns {Country | null} Country information if found, or null.
 *
 * @example
 * getCountryByCode('US');   // → { countryCode: 'US', countryName: 'United States of America', ... }
 * getCountryByCode('USA');  // → same as above (alpha-3 resolved to alpha-2)
 * getCountryByCode('us');   // → same as above (case-insensitive)
 */
export const getCountryByCode = (countryCode: AnyCountryCode): Country | null => {
  const { countries, alpha3Map } = getActiveData();
  const upper = countryCode.toUpperCase();
  const alpha2 = upper.length === 3 ? alpha3Map[upper] : upper;
  if (!alpha2) return null;
  const country = countries[alpha2];
  return country
    ? {
        postalCodePatterns: country.patterns,
        examplePostalCodes: country.example,
        isGenericRegex: country.isGenericRegex,
        countryName: country.country,
        countryCode: alpha2,
      }
    : null;
};
