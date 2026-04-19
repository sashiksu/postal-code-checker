import { CountryCode } from "../../types/CountryCode";
import { format } from "../../utils/format";

describe("format()", () => {
  it("Should return the trimmed, uppercased input for a valid US code", () => {
    expect(format("US", "  12345 ")).toBe("12345");
  });

  it("Should uppercase a lowercase Canadian code", () => {
    expect(format("CA", "k1a 0t6")).toBe("K1A 0T6");
  });

  it("Should preserve an already-canonical code as-is", () => {
    expect(format("GB", "SW1A 1AA")).toBe("SW1A 1AA");
  });

  it("Should return null for a postal code that does not match the country's pattern", () => {
    expect(format("US", "ABC12")).toBeNull();
  });

  it("Should return null for an unknown country code", () => {
    expect(format("INVALID" as CountryCode, "12345")).toBeNull();
  });

  it("Should return null for a country with no postal code system", () => {
    expect(format("AE", "12345")).toBeNull();
  });

  it("Should return null for an empty string", () => {
    expect(format("US", "")).toBeNull();
  });

  it("Should return null for whitespace-only input", () => {
    expect(format("US", "     ")).toBeNull();
  });

  describe("ISO 3166-1 alpha-3 support", () => {
    it.each([
      ["USA", "12345", "12345"],
      ["CAN", "k1a 0t6", "K1A 0T6"],
      ["GBR", "sw1a 1aa", "SW1A 1AA"],
    ])("Should resolve alpha-3 %s and format %s → %s", (cc, input, expected) => {
      expect(format(cc as CountryCode, input)).toBe(expected);
    });

    it("Should return null for an unknown alpha-3 code", () => {
      expect(format("XXX" as CountryCode, "12345")).toBeNull();
    });
  });

  describe("Contract with validatePostalCode", () => {
    it.each([
      ["US", "12345"],
      ["US", "  12345 "],
      ["CA", "k1a 0t6"],
      ["GB", "sw1a 1aa"],
      ["US", "ABC12"],
      ["AE", "1234"],
      ["INVALID", "12345"],
    ])("format returns a non-null string iff validatePostalCode returns true: %s %s", (cc, code) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { validatePostalCode } = require("../../utils/validatePostalCode");
      const formatted = format(cc as CountryCode, code);
      expect(formatted === null).toBe(!validatePostalCode(cc as CountryCode, code));
    });
  });
});
