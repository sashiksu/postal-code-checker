import { AnyCountryCode } from "../types/AnyCountryCode";

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
 * Kept functional in 2.x; scheduled for removal in 3.0.
 *
 * @returns {Object} An object containing the validatePostalCode function.
 */
export const usePostalCodeValidation = () => {
  return {
    validatePostalCode: (countryCode: AnyCountryCode, postalCode: string): boolean =>
      validatePostalCode(countryCode, postalCode),
  };
};
