import { CountryCode } from "../../types/CountryCode";
import { validatePostalCodes } from "../../utils/validatePostalCodes";

describe("validatePostalCodes()", () => {
  it("Should return index-aligned boolean results for a batch", () => {
    expect(validatePostalCodes("US", ["12345", "90210", "abc"])).toEqual([true, true, false]);
  });

  it("Should return an empty array for an empty input", () => {
    expect(validatePostalCodes("US", [])).toEqual([]);
  });

  it("Should return all false for an unknown country", () => {
    expect(validatePostalCodes("XXX" as CountryCode, ["12345", "90210"])).toEqual([false, false]);
  });

  it("Should normalize each input (lowercase, padding)", () => {
    expect(validatePostalCodes("CA", ["k1a 0t6", "  M5V 3L9  ", "bad"])).toEqual([true, true, false]);
  });

  it("Should accept alpha-3 country code", () => {
    expect(validatePostalCodes("USA", ["12345", "90210"])).toEqual([true, true]);
  });
});
