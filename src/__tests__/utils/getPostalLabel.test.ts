import { getPostalLabel } from "../../utils/getPostalLabel";

describe("getPostalLabel", () => {
  it("returns the country-specific label where upstream defines one", () => {
    expect(getPostalLabel("US")).toBe("ZIP code");
    expect(getPostalLabel("IN")).toBe("PIN code");
    expect(getPostalLabel("IE")).toBe("Eircode");
  });

  it("falls back to the default where upstream defines none", () => {
    expect(getPostalLabel("DE")).toBe("postal code");
    expect(getPostalLabel("FR")).toBe("postal code");
  });

  it("accepts alpha-3", () => {
    expect(getPostalLabel("USA")).toBe("ZIP code");
  });

  it("returns the default for an unknown country", () => {
    expect(getPostalLabel("ZZ")).toBe("postal code");
  });
});
