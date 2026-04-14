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

  describe("Canada (CA) — Canada Post letter rules (issue #29)", () => {
    it.each([["K1A 0T6"], ["M5V 3L9"], ["H0H 0H0"], ["T2X 1V4"], ["V6B 4Y8"]])(
      "Should accept valid Canadian postal code %s",
      (code) => {
        expect(validatePostalCode("CA", code)).toBe(true);
      },
    );

    it.each([["D1A 0T6"], ["F1A 0T6"], ["I1A 0T6"], ["O1A 0T6"], ["Q1A 0T6"], ["U1A 0T6"], ["W1A 0T6"], ["Z1A 0T6"]])(
      "Should reject invalid first letter in %s",
      (code) => {
        expect(validatePostalCode("CA", code)).toBe(false);
      },
    );

    it.each([["K1D 0T6"], ["K1F 0T6"], ["K1I 0T6"], ["K1O 0T6"], ["K1Q 0T6"], ["K1U 0T6"]])(
      "Should reject disallowed letter in 3rd position %s",
      (code) => {
        expect(validatePostalCode("CA", code)).toBe(false);
      },
    );

    it.each([["K1A 0D6"], ["K1A 0F6"], ["K1A 0I6"], ["K1A 0O6"], ["K1A 0Q6"], ["K1A 0U6"]])(
      "Should reject disallowed letter in 5th position %s",
      (code) => {
        expect(validatePostalCode("CA", code)).toBe(false);
      },
    );

    it("Should reject missing space", () => {
      expect(validatePostalCode("CA", "K1A0T6")).toBe(false);
    });

    it("Should accept lowercase (normalized to uppercase in 1.1.0)", () => {
      expect(validatePostalCode("CA", "k1a 0t6")).toBe(true);
    });

    it("Should accept surrounding whitespace (trimmed in 1.1.0)", () => {
      expect(validatePostalCode("CA", "  K1A 0T6  ")).toBe(true);
    });
  });
});
