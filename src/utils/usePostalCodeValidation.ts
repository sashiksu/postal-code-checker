import { Country } from "../types/Country";
import { CountryCode } from "../types/CountryCode";

import { getCountryByCode } from "./getCountryByCode";

export const usePostalCodeValidation = () => {
  const validatePostalCode = (countryCode: CountryCode, postalCode: string): boolean => {
    const country: Country | null = getCountryByCode(countryCode);
    if (!country) return false;
    const regexPattern = country.postalCodeRegex.slice(1, -1);
    const regex = new RegExp(regexPattern);
    return regex.test(postalCode);
  };
  return { validatePostalCode };
};
