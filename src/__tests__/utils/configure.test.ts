import { ConfigurationError } from "../../utils/ConfigurationError";
import { configure } from "../../utils/configure";
import { format } from "../../utils/format";
import { getAllCountries } from "../../utils/getAllCountries";
import { getCountryByCode } from "../../utils/getCountryByCode";
import { guessCountries } from "../../utils/guessCountries";
import { resetConfig } from "../../utils/resetConfig";
import { validatePostalCode } from "../../utils/validatePostalCode";
import { validatePostalCodes } from "../../utils/validatePostalCodes";

const KOSOVO = {
  patterns: ["/^(?:[1-7]\\d{4})$/"],
  example: ["10000", "20000"],
  country: "Kosovo",
  alpha3: "XKX",
};

describe("configure()", () => {
  afterEach(() => {
    resetConfig();
  });

  describe("Adding a brand-new country", () => {
    it("Should make the new country resolvable via getCountryByCode", () => {
      configure({ countries: { XK: KOSOVO } });

      const kosovo = getCountryByCode("XK");
      expect(kosovo).not.toBeNull();
      expect(kosovo?.countryName).toBe("Kosovo");
      expect(kosovo?.postalCodePatterns).toEqual(["/^(?:[1-7]\\d{4})$/"]);
      expect(kosovo?.examplePostalCodes).toEqual(["10000", "20000"]);
    });

    it("Should resolve the custom alpha-3 code", () => {
      configure({ countries: { XK: KOSOVO } });
      const byAlpha3 = getCountryByCode("XKX");
      expect(byAlpha3?.countryCode).toBe("XK");
    });

    it("Should validate postal codes for the new country", () => {
      configure({ countries: { XK: KOSOVO } });
      expect(validatePostalCode("XK", "10000")).toBe(true);
      expect(validatePostalCode("XK", "20000")).toBe(true);
      expect(validatePostalCode("XK", "99999")).toBe(false);
    });

    it("Should include the new country in getAllCountries()", () => {
      configure({ countries: { XK: KOSOVO } });
      const all = getAllCountries();
      expect(all.find((c) => c.countryCode === "XK")?.countryName).toBe("Kosovo");
    });

    it("Should surface the new country via guessCountries()", () => {
      configure({ countries: { XK: KOSOVO } });
      const matches = guessCountries("10000");
      expect(matches.find((c) => c.countryCode === "XK")).toBeDefined();
    });

    it("Should format a valid postal code for the new country", () => {
      configure({ countries: { XK: KOSOVO } });
      expect(format("XK", "  10000 ")).toBe("10000");
      expect(format("XK", "99999")).toBeNull();
    });

    it("Should honor the new country in batch validation", () => {
      configure({ countries: { XK: KOSOVO } });
      expect(validatePostalCodes("XK", ["10000", "99999", "20000"])).toEqual([true, false, true]);
    });
  });

  describe("Replacing an existing country", () => {
    it("Should replace the US pattern with a stricter 5+4 requirement", () => {
      configure({
        countries: {
          US: {
            patterns: ["/^(?:\\d{5}-\\d{4})$/"],
            example: ["12345-6789"],
            country: "United States",
          },
        },
      });
      expect(validatePostalCode("US", "12345")).toBe(false);
      expect(validatePostalCode("US", "12345-6789")).toBe(true);
    });

    it("Should not merge patterns — user patterns wholesale replace defaults", () => {
      configure({
        countries: {
          US: {
            patterns: ["/^(?:ZIP-\\d{5})$/"],
            example: ["ZIP-12345"],
            country: "United States",
          },
        },
      });
      expect(validatePostalCode("US", "12345")).toBe(false);
      expect(validatePostalCode("US", "ZIP-12345")).toBe(true);
    });
  });

  describe("Idempotent replace across calls", () => {
    it("Should not accumulate overrides from previous calls", () => {
      configure({ countries: { XK: KOSOVO } });
      configure({
        countries: {
          YY: {
            patterns: ["/^(?:Y\\d{3})$/"],
            example: ["Y123"],
            country: "Yland",
          },
        },
      });

      expect(getCountryByCode("XK")).toBeNull();
      expect(getCountryByCode("YY")?.countryName).toBe("Yland");
    });

    it("Should preserve untouched default countries after override", () => {
      configure({ countries: { XK: KOSOVO } });
      expect(validatePostalCode("US", "90210")).toBe(true);
      expect(validatePostalCode("CA", "K1A 0T6")).toBe(true);
    });
  });

  describe("Validation errors", () => {
    it.each([
      [null, '"config" must be an object'],
      [undefined, '"config" must be an object'],
      ["string", '"config" must be an object'],
      [123, '"config" must be an object'],
      [[], '"config" must be an object'],
    ])("Should reject non-object config: %p", (bad, expected) => {
      expect(() => configure(bad as never)).toThrow(ConfigurationError);
      expect(() => configure(bad as never)).toThrow(expected);
    });

    it("Should reject missing countries key", () => {
      expect(() => configure({} as never)).toThrow('"config.countries" must be an object');
    });

    it("Should reject non-uppercase alpha-2 code", () => {
      expect(() =>
        configure({
          countries: {
            us: { patterns: ["/^\\d{5}$/"], example: [], country: "United States" },
          },
        }),
      ).toThrow(/country code must be a 2-letter uppercase string/);
    });

    it("Should reject non-string patterns", () => {
      expect(() =>
        configure({
          countries: {
            XK: { patterns: [123 as unknown as string], example: [], country: "K" },
          },
        }),
      ).toThrow(/must be a regex wrapped in slashes/);
    });

    it("Should reject unwrapped regex strings", () => {
      expect(() =>
        configure({
          countries: {
            XK: { patterns: ["^\\d{5}$"], example: [], country: "K" },
          },
        }),
      ).toThrow(/must be a regex wrapped in slashes/);
    });

    it("Should reject a malformed regex", () => {
      expect(() =>
        configure({
          countries: {
            XK: { patterns: ["/[/"], example: [], country: "K" },
          },
        }),
      ).toThrow(/is not a valid regex/);
    });

    it("Should reject non-array example", () => {
      expect(() =>
        configure({
          countries: {
            XK: {
              patterns: ["/^\\d{5}$/"],
              example: "not-an-array" as unknown as string[],
              country: "K",
            },
          },
        }),
      ).toThrow(/"countries.XK.example" must be an array of strings/);
    });

    it("Should reject empty country name", () => {
      expect(() =>
        configure({
          countries: {
            XK: { patterns: ["/^\\d{5}$/"], example: [], country: "   " },
          },
        }),
      ).toThrow(/"countries.XK.country" must be a non-empty string/);
    });

    it("Should reject a 2-letter alpha3", () => {
      expect(() =>
        configure({
          countries: {
            XK: {
              patterns: ["/^\\d{5}$/"],
              example: [],
              country: "Kosovo",
              alpha3: "XK",
            },
          },
        }),
      ).toThrow(/"countries.XK.alpha3" must be a 3-letter uppercase string/);
    });

    it("Should leave active data unchanged when configure throws", () => {
      const beforeCount = getAllCountries().length;
      expect(() =>
        configure({
          countries: {
            XK: { patterns: ["bad"], example: [], country: "K" },
          },
        }),
      ).toThrow(ConfigurationError);
      expect(getAllCountries().length).toBe(beforeCount);
      expect(getCountryByCode("XK")).toBeNull();
    });
  });

  describe("Patterns array semantics", () => {
    it("Should allow an empty patterns array to declare a country with no postal code system", () => {
      configure({
        countries: {
          XZ: { patterns: [], example: [], country: "Noland" },
        },
      });
      expect(validatePostalCode("XZ", "anything")).toBe(false);
      expect(getAllCountries().find((c) => c.countryCode === "XZ")?.countryName).toBe("Noland");
    });
  });
});
