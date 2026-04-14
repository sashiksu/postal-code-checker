import { CountryCode } from "../../types/CountryCode";
import { validatePostalCode } from "../../utils/validatePostalCode";

describe("validatePostalCode()", () => {
  it("Should return false for an invalid country code", () => {
    expect(validatePostalCode("INVALID" as CountryCode, "12345")).toBe(false);
  });

  it("Should validate a correct US postal code", () => {
    expect(validatePostalCode("US", "12345")).toBe(true);
  });

  it("Should invalidate an incorrect US postal code", () => {
    expect(validatePostalCode("US", "ABC12")).toBe(false);
  });

  it("Should validate a correct Canadian postal code", () => {
    expect(validatePostalCode("CA", "K1A 0T6")).toBe(true);
  });

  it("Should reject a Canadian postal code with disallowed letters", () => {
    expect(validatePostalCode("CA", "D1A 0T6")).toBe(false);
  });
});

describe("usePostalCodeValidation() → validatePostalCode delegation", () => {
  it("Deprecated hook should produce identical results to the direct function", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { usePostalCodeValidation } = require("../../utils/usePostalCodeValidation");
    const { validatePostalCode: hookValidate } = usePostalCodeValidation();

    const cases: Array<[CountryCode, string]> = [
      ["US", "12345"],
      ["US", "ABC12"],
      ["CA", "K1A 0T6"],
      ["CA", "D1A 0T6"],
      ["GB", "SW1A 1AA"],
    ];

    for (const [cc, code] of cases) {
      expect(hookValidate(cc, code)).toBe(validatePostalCode(cc, code));
    }
  });
});
