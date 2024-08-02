import COUNTRIES from "./output.json";

export type CountryCode = keyof typeof COUNTRIES;
export type Country = {
  regex: string;
  example: string[];
  isGenericRegex: boolean;
  country: string;
};
export type CountryWithCode = Country & { code: CountryCode };

export const getCountryByCode = (countryCode: CountryCode): CountryWithCode | null => {
  const country = COUNTRIES[countryCode];
  return country ? { ...country, code: countryCode } : null;
};

export const getAllCountries = (): CountryWithCode[] => {
  return Object.entries(COUNTRIES).map(([code, country]) => ({
    ...country,
    code: code as CountryCode,
  }));
};
