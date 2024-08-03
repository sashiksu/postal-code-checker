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
});
