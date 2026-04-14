import { CountryCode } from "../../types/CountryCode";
import { getCountryByCode } from "../../utils/getCountryByCode";

describe("getCountryByCode()", () => {
  it("Should return correct country data for a valid country code", () => {
    const result = getCountryByCode("US");
    expect(result).toEqual({
      postalCodeRegex: "/^(\\d{5}(-\\d{4})?)$/",
      examplePostalCodes: ["11550", " 11550-9999"],
      isGenericRegex: false,
      countryName: "United States of America",
      countryCode: "US",
    });
  });

  it("Should return null for an invalid country code", () => {
    const result = getCountryByCode("XX" as CountryCode);
    expect(result).toBeNull();
  });

  describe("ISO 3166-1 alpha-3 support (1.1.0)", () => {
    it.each([
      ["USA", "US"],
      ["GBR", "GB"],
      ["CAN", "CA"],
      ["LKA", "LK"],
      ["DEU", "DE"],
    ])("Should resolve alpha-3 %s to alpha-2 %s", (alpha3, alpha2) => {
      const viaAlpha3 = getCountryByCode(alpha3);
      const viaAlpha2 = getCountryByCode(alpha2);
      expect(viaAlpha3).not.toBeNull();
      expect(viaAlpha3).toEqual(viaAlpha2);
      expect(viaAlpha3?.countryCode).toBe(alpha2);
    });

    it("Should accept lowercase country codes", () => {
      expect(getCountryByCode("us")).toEqual(getCountryByCode("US"));
      expect(getCountryByCode("usa")).toEqual(getCountryByCode("USA"));
    });

    it("Should return null for an unknown alpha-3 code", () => {
      expect(getCountryByCode("XXX")).toBeNull();
    });
  });
});
