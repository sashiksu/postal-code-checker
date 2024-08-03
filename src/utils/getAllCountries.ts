import { CountryOption } from "../types/CountryOption";

import { COUNTRIES } from "../assets/index";

/**
 * Retrieves all countries as an array of CountryOption objects.
 *
 * @returns {CountryOption[]} An array of CountryOption objects, each containing:
 *   - countryName: The name of the country
 *   - countryCode: The code of the country
 *
 * @example
 * const countries = getAllCountries();
 * // Returns: [
 * //   { countryName: "United States", countryCode: "US" },
 * //   { countryName: "Canada", countryCode: "CA" },
 * //   ...
 * // ]
 */
export const getAllCountries = (): CountryOption[] => {
  return Object.entries(COUNTRIES).map(([code, country]) => ({
    countryName: country.country,
    countryCode: code.toString(),
  }));
};
