import { AnyCountryCode } from "./AnyCountryCode";

export type Country = {
  postalCodePatterns: string[];
  examplePostalCodes: string[];
  isGenericRegex: boolean;
  countryName: string;
  countryCode: AnyCountryCode;
};
