import { CountryOption } from "../types/CountryOption";

import { COUNTRIES } from "../assets/index";

export const getAllCountries = (): CountryOption[] => {
  return Object.entries(COUNTRIES).map(([code, country]) => ({
    countryName: country.country,
    countryCode: code.toString(),
  }));
};
