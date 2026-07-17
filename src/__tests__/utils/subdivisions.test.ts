import { getSubdivisions, hasSubdivisionData, inferSubdivision } from "../../utils/subdivisions";

describe("hasSubdivisionData", () => {
  it("is true for a country upstream publishes sub_zips for", () => {
    expect(hasSubdivisionData("US")).toBe(true);
  });

  it("is false for a country upstream has no subdivision data for", () => {
    expect(hasSubdivisionData("GB")).toBe(false);
  });

  it("accepts alpha-3", () => {
    expect(hasSubdivisionData("USA")).toBe(true);
  });

  it("is false for an unknown country", () => {
    expect(hasSubdivisionData("ZZ")).toBe(false);
  });
});

describe("getSubdivisions", () => {
  it("returns entries sorted by code", () => {
    const subs = getSubdivisions("US");
    expect(subs.length).toBeGreaterThan(50);
    const codes = subs.map((s) => s.code);
    expect([...codes].sort((a, b) => a.localeCompare(b))).toEqual(codes);
  });

  it("returns the ISO 3166-2 code and a latin name", () => {
    expect(getSubdivisions("US")).toContainEqual({ code: "CA", name: "California" });
  });

  it("uses sub_lnames where sub_names is absent", () => {
    expect(getSubdivisions("JP")).toContainEqual({ code: "13", name: "Tokyo" });
  });

  it("does not leak the internal pattern field", () => {
    expect(Object.keys(getSubdivisions("US")[0])).toEqual(["code", "name"]);
  });

  it("returns [] for a country with no data", () => {
    expect(getSubdivisions("GB")).toEqual([]);
  });
});

describe("inferSubdivision", () => {
  it("resolves a US ZIP to its state", () => {
    expect(inferSubdivision("US", "90210")).toEqual([{ code: "CA", name: "California" }]);
    expect(inferSubdivision("US", "10001")).toEqual([{ code: "NY", name: "New York" }]);
  });

  // REGRESSION: prefix-matching without validating first returns
  // [{code:"AK"}] for this input — a confident wrong answer for a string that
  // is not a valid US ZIP. This test is why the feature is safe.
  it("returns [] for an invalid code that prefix-matches a subdivision", () => {
    expect(inferSubdivision("US", "999999")).toEqual([]);
  });

  // REGRESSION: genuine ambiguity. K1A spans Ontario and Quebec. A
  // single-match API would silently pick one and be wrong.
  it("returns every match when a prefix is ambiguous", () => {
    expect(inferSubdivision("CA", "K1A 0T6")).toEqual([
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" },
    ]);
  });

  it("returns a single match when unambiguous", () => {
    expect(inferSubdivision("CA", "V6B 1A1")).toEqual([{ code: "BC", name: "British Columbia" }]);
  });

  // REGRESSION: sub_keys for IN are names ("Delhi"); sub_isoids are the real
  // ISO codes. Reading the wrong field yields {code:"Delhi"}.
  it("uses the ISO code, not the display key", () => {
    expect(inferSubdivision("IN", "110001")).toEqual([{ code: "DL", name: "Delhi" }]);
  });

  // REGRESSION: JP sub_keys are Japanese script; sub_lnames carry the latin
  // name. Reading the wrong field yields {code:"東京都", name:"東京都"}.
  it("uses the latin name and numeric ISO code for Japan", () => {
    expect(inferSubdivision("JP", "100-0001")).toEqual([{ code: "13", name: "Tokyo" }]);
  });

  it("normalizes input like the validator does", () => {
    expect(inferSubdivision("CA", "  k1a 0t6  ")).toEqual([
      { code: "ON", name: "Ontario" },
      { code: "QC", name: "Quebec" },
    ]);
  });

  it("accepts alpha-3", () => {
    expect(inferSubdivision("USA", "90210")).toEqual([{ code: "CA", name: "California" }]);
  });

  it("returns [] for a country with no subdivision data", () => {
    expect(inferSubdivision("GB", "SW1A 1AA")).toEqual([]);
    expect(hasSubdivisionData("GB")).toBe(false);
  });

  it("returns [] for an unknown country and for empty input", () => {
    expect(inferSubdivision("ZZ", "90210")).toEqual([]);
    expect(inferSubdivision("US", "")).toEqual([]);
  });
});
