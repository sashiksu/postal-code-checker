import { CountryCode } from "../../types/CountryCode";
import { usePostalCodeValidation } from "../../utils/usePostalCodeValidation";

describe("usePostalCodeValidation()", () => {
  const { validatePostalCode } = usePostalCodeValidation();

  it("Should return false for an invalid country code", () => {
    const result = validatePostalCode("INVALID" as CountryCode, "12345");
    expect(result).toBe(false);
  });

  it("Should validate a correct postal code", () => {
    const result = validatePostalCode("US", "12345");
    expect(result).toBe(true);
  });

  it("Should invalidate an incorrect postal code", () => {
    const result = validatePostalCode("US", "ABC12");
    expect(result).toBe(false);
  });
});
