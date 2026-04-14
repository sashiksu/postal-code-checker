import { CountryCode } from "../types/CountryCode";

import { validatePostalCode } from "./validatePostalCode";

/**
 * @deprecated Since 1.1.0. Import `validatePostalCode` directly instead.
 *
 * ```ts
 * // Old (still works, but deprecated):
 * const { validatePostalCode } = usePostalCodeValidation();
 *
 * // New (preferred):
 * import { validatePostalCode } from "postal-code-checker";
 * ```
 *
 * Will be removed in 2.0.
 *
 * @returns {Object} An object containing the validatePostalCode function.
 */
export const usePostalCodeValidation = () => {
  return {
    validatePostalCode: (countryCode: CountryCode, postalCode: string): boolean =>
      validatePostalCode(countryCode, postalCode),
  };
};
