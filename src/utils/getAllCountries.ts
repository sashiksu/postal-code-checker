import { CountryOption } from "../types/CountryOption";

import { getActiveData } from "./activeData";

/**
 * Retrieves all countries as an array of CountryOption objects. Includes any
 * custom countries registered via `configure()`.
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
  const { countries } = getActiveData();
  return Object.entries(countries).map(([code, country]) => ({
    countryName: country.country,
    countryCode: code.toString(),
  }));
};
