import { CountryCode } from "./CountryCode";

export type Country = {
  postalCodeRegex: string;
  examplePostalCodes: string[];
  isGenericRegex: boolean;
  countryName: string;
  countryCode: CountryCode;
};
