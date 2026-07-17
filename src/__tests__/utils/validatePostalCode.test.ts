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

  describe("ISO 3166-1 alpha-3 country codes (1.1.0)", () => {
    it.each([
      ["USA", "12345"],
      ["CAN", "K1A 0T6"],
      ["GBR", "SW1A 1AA"],
    ])("Should validate using alpha-3 code %s with postal %s", (cc, code) => {
      expect(validatePostalCode(cc as CountryCode, code)).toBe(true);
    });

    it("Should return false for unknown alpha-3 code", () => {
      expect(validatePostalCode("XXX" as CountryCode, "12345")).toBe(false);
    });
  });

  describe("Input normalization (1.1.0)", () => {
    it.each([
      ["CA", "k1a 0t6"],
      ["CA", "K1a 0T6"],
      ["GB", "sw1a 1aa"],
    ])("Should accept lowercase input: %s %s", (cc, code) => {
      expect(validatePostalCode(cc as CountryCode, code)).toBe(true);
    });

    it.each([
      ["US", "  12345  "],
      ["CA", "  K1A 0T6 "],
      ["CA", " K1A 0T6"],
    ])("Should accept surrounding whitespace: %s '%s'", (cc, code) => {
      expect(validatePostalCode(cc as CountryCode, code)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("Should reject an empty string", () => {
      expect(validatePostalCode("US", "")).toBe(false);
    });

    it("Should reject a whitespace-only string", () => {
      expect(validatePostalCode("US", "     ")).toBe(false);
    });

    it("Should reject a very long junk string", () => {
      expect(validatePostalCode("US", "x".repeat(500))).toBe(false);
    });

    it.each([
      ["US", "12 345"],
      ["US", "12-345"],
      ["CA", "K1A-0T6"],
    ])("Should reject structurally invalid input with stray separators: %s '%s'", (cc, code) => {
      expect(validatePostalCode(cc as CountryCode, code)).toBe(false);
    });

    it.each([
      ["Us", "12345"],
      ["uS", "12345"],
      ["uSa", "12345"],
      ["UsA", "12345"],
    ])("Should accept mixed-case country codes: %s", (cc, code) => {
      expect(validatePostalCode(cc as CountryCode, code)).toBe(true);
    });

    it.each([
      ["", "12345"],
      ["U", "12345"],
      ["USAA", "12345"],
      ["1US", "12345"],
    ])("Should return false for malformed country code: '%s'", (cc, code) => {
      expect(validatePostalCode(cc as CountryCode, code)).toBe(false);
    });

    it("Should validate across a broad alpha-3 sample", () => {
      const samples: Array<[string, string]> = [
        ["DEU", "10115"],
        ["FRA", "75008"],
        ["JPN", "100-0001"],
        ["AUS", "2000"],
        ["IND", "110001"],
        ["BRA", "01310-100"],
      ];
      for (const [cc, code] of samples) {
        expect(validatePostalCode(cc as CountryCode, code)).toBe(true);
      }
    });
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
