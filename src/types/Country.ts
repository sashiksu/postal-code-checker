import { CountryCode } from "./CountryCode";

export type Country = {
  postalCodePatterns: string[];
  examplePostalCodes: string[];
  isGenericRegex: boolean;
  countryName: string;
  countryCode: CountryCode;
};
