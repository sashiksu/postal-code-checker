import { guessCountries } from "../../utils/guessCountries";

describe("guessCountries()", () => {
  it("Should return exactly Canada for a specific Canadian format", () => {
    const result = guessCountries("K1A 0T6");
    const codes = result.map((r) => r.countryCode);
    expect(codes).toEqual(["CA"]);
  });

  it("Should return exactly United Kingdom for a specific GB format", () => {
    const result = guessCountries("SW1A 1AA");
    const codes = result.map((r) => r.countryCode);
    expect(codes).toEqual(["GB"]);
  });

  it("Should return multiple countries for a generic 5-digit code", () => {
    const result = guessCountries("12345");
    const codes = result.map((r) => r.countryCode);
    expect(codes.length).toBeGreaterThan(10);
    expect(codes).toEqual(expect.arrayContaining(["US", "DE", "FR", "ES", "IT"]));
  });

  it("Should return results sorted alphabetically by countryName", () => {
    const result = guessCountries("12345");
    const names = result.map((r) => r.countryName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it("Should return an empty array for an empty string", () => {
    expect(guessCountries("")).toEqual([]);
  });

  it("Should return an empty array for whitespace-only input", () => {
    expect(guessCountries("     ")).toEqual([]);
  });

  it("Should return an empty array for input that no pattern accepts", () => {
    expect(guessCountries("NOT-A-POSTCODE-!!!")).toEqual([]);
  });

  describe("Input normalization", () => {
    it("Should normalize lowercase input before matching", () => {
      const lower = guessCountries("k1a 0t6");
      const upper = guessCountries("K1A 0T6");
      expect(lower).toEqual(upper);
    });

    it("Should strip surrounding whitespace before matching", () => {
      const padded = guessCountries("  K1A 0T6  ");
      const clean = guessCountries("K1A 0T6");
      expect(padded).toEqual(clean);
    });
  });

  describe("Return shape", () => {
    it("Should return objects with exactly countryName and countryCode", () => {
      const result = guessCountries("12345");
      expect(result.length).toBeGreaterThan(0);
      for (const entry of result) {
        expect(Object.keys(entry).sort()).toEqual(["countryCode", "countryName"]);
        expect(typeof entry.countryName).toBe("string");
        expect(typeof entry.countryCode).toBe("string");
      }
    });

    it("Should not include countries with empty postal code patterns", () => {
      const result = guessCountries("12345");
      const codes = result.map((r) => r.countryCode);
      expect(codes).not.toContain("AE");
      expect(codes).not.toContain("ZW");
    });
  });
});
