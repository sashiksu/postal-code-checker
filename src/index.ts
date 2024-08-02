import { Country, CountryCode, getAllCountries, getCountryByCode, validatePostalCode } from "./utils";

export const usePostalCodeValidation = () => {
  return {
    getCountryByCode,
    getAllCountries,
    validatePostalCode,
  };
};

export { getAllCountries, getCountryByCode, validatePostalCode };
export type { Country, CountryCode };

