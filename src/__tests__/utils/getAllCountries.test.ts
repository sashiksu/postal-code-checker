import { getAllCountries } from "../../utils/getAllCountries";
import COUNTRIES from "../../utils/output.json";

describe("getAllCountries()", () => {
  it("Should return an array of CountryOption objects", () => {
    const result = getAllCountries();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(Object.keys(COUNTRIES).length);
  });

  it("Should correctly map country data to CountryOption objects", () => {
    const result = getAllCountries();
    const firstCountry = Object.entries(COUNTRIES)[0];

    expect(result[0]).toEqual({
      countryName: firstCountry[1].country,
      countryCode: firstCountry[0],
    });
  });

  it("Should include all countries from the COUNTRIES object", () => {
    const result = getAllCountries();
    const countryCodes = Object.keys(COUNTRIES);

    countryCodes.forEach((code) => {
      const countryOption = result.find((option) => option.countryCode === code);
      expect(countryOption).toBeDefined();
      expect(countryOption?.countryName).toBe((COUNTRIES as Record<string, { country: string }>)[code].country);
    });
  });
});
