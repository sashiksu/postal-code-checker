import { CountryCode } from "../types/CountryCode";
import { CountryOption } from "../types/CountryOption";

import COUNTRIES from "./output.json";

export const getAllCountries = (): CountryOption[] => {
  return Object.entries(COUNTRIES).map(([code, country]) => ({
    countryName: country.country,
    countryCode: code as CountryCode,
  }));
};
