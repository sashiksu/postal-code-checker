import COUNTRIES from "./output.json";

export type CountryCode = keyof typeof COUNTRIES;
export type Country = {
  regex: string;
  example: string[];
  isGenericRegex: boolean;
  country: string;
  code: CountryCode;
};

export const getCountryByCode = (countryCode: CountryCode): Country | null => {
  const country = COUNTRIES[countryCode];
  return country ? { ...country, code: countryCode } : null;
};

export const getAllCountries = (): Country[] => {
  return Object.entries(COUNTRIES).map(([code, country]) => ({
    ...country,
    code: code as CountryCode,
  }));
};

export const validatePostalCode = (countryCode: CountryCode, postalCode: string): boolean => {
  const country = getCountryByCode(countryCode);
  if (!country) return false;
  const regexPattern = country.regex.slice(1, -1);
  const regex = new RegExp(regexPattern);
  return regex.test(postalCode);
};
