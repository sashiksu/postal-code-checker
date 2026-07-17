import { AnyCountryCode } from "../types/AnyCountryCode";
import { Country } from "../types/Country";

import { getCountryByCode } from "./getCountryByCode";

/**
 * Core postal-code check: does the normalized code match any of the country's
 * patterns? This is the two-argument behaviour of `validatePostalCode`,
 * extracted so both `validatePostalCode` (which layers a subdivision
 * constraint on top) and `inferSubdivision` (which uses it as a validate-first
 * guard) can share it without importing each other.
 *
 * Keeping it here breaks what would otherwise be a
 * `validatePostalCode ↔ subdivisions` import cycle. Internal.
 */
export const matchesPostalCode = (countryCode: AnyCountryCode, postalCode: string): boolean => {
  const country: Country | null = getCountryByCode(countryCode);
  if (!country) return false;
  if (country.postalCodePatterns.length === 0) return false;
  const normalized = postalCode.trim().toUpperCase();
  return country.postalCodePatterns.some((wrapped) => {
    const pattern = wrapped.slice(1, -1);
    return new RegExp(pattern).test(normalized);
  });
};
