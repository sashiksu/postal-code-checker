import { Country } from "../types/Country";

import { COUNTRIES } from "../assets/index";
import { CountryCode } from "../types/CountryCode";

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
