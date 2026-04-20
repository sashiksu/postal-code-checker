import { COUNTRIES } from "../../assets/index";
import { configure } from "../../utils/configure";
import { getAllCountries } from "../../utils/getAllCountries";
import { getCountryByCode } from "../../utils/getCountryByCode";
import { resetConfig } from "../../utils/resetConfig";
import { validatePostalCode } from "../../utils/validatePostalCode";

const KOSOVO = {
  patterns: ["/^(?:[1-7]\\d{4})$/"],
  example: ["10000"],
  country: "Kosovo",
  alpha3: "XKX",
};

describe("resetConfig()", () => {
  afterEach(() => {
    resetConfig();
  });

  it("Should be a no-op when no configure() has been called", () => {
    const beforeCount = Object.keys(COUNTRIES).length;
    resetConfig();
    expect(getAllCountries().length).toBe(beforeCount);
  });

  it("Should discard a previously added custom country", () => {
    configure({ countries: { XK: KOSOVO } });
    expect(getCountryByCode("XK")).not.toBeNull();

    resetConfig();
    expect(getCountryByCode("XK")).toBeNull();
  });

  it("Should restore a replaced country to its bundled pattern", () => {
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

    resetConfig();
    expect(validatePostalCode("US", "12345")).toBe(true);
  });

  it("Should discard a custom alpha-3 mapping", () => {
    configure({ countries: { XK: KOSOVO } });
    expect(getCountryByCode("XKX")?.countryCode).toBe("XK");

    resetConfig();
    expect(getCountryByCode("XKX")).toBeNull();
  });

  it("Should return the country count to the default after reset", () => {
    const baseline = Object.keys(COUNTRIES).length;
    configure({
      countries: {
        XK: KOSOVO,
        YY: {
          patterns: ["/^(?:Y\\d{3})$/"],
          example: ["Y123"],
          country: "Yland",
        },
      },
    });
    expect(getAllCountries().length).toBe(baseline + 2);

    resetConfig();
    expect(getAllCountries().length).toBe(baseline);
  });
});
