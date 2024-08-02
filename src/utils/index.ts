import COUNTRIES from "./output.json";

type CountryCode = keyof typeof COUNTRIES;
type Country = {
  regex: string;
  example: string[];
  isGenericRegex: boolean;
  country: string;
};

export const getCountryByCode = (countryCode: CountryCode): Country | null => {
  return COUNTRIES[countryCode] || null;
};
