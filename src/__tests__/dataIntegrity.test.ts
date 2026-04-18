import { ALPHA3_TO_ALPHA2 } from "../assets/alpha3Map";
import { COUNTRIES } from "../assets/index";

// Pre-compute the entry list once so every `it.each` shares the same iteration.
const ENTRIES = Object.entries(COUNTRIES) as Array<
  [string, { regex: string; example: string[]; isGenericRegex: boolean; country: string }]
>;

describe("COUNTRIES data integrity", () => {
  it("Should contain at least one country", () => {
    expect(ENTRIES.length).toBeGreaterThan(0);
  });

  describe.each(ENTRIES)("%s", (code, entry) => {
    it("Should use an uppercase ISO 3166-1 alpha-2 code as the key", () => {
      expect(code).toMatch(/^[A-Z]{2}$/);
    });

    it("Should define all four required fields", () => {
      expect(entry).toEqual(
        expect.objectContaining({
          regex: expect.any(String),
          example: expect.any(Array),
          isGenericRegex: expect.any(Boolean),
          country: expect.any(String),
        })
      );
    });

    it("Should have a non-empty country name", () => {
      expect(entry.country.trim().length).toBeGreaterThan(0);
    });

    it("Should wrap the regex in slashes", () => {
      expect(entry.regex.startsWith("/")).toBe(true);
      expect(entry.regex.endsWith("/")).toBe(true);
      expect(entry.regex.length).toBeGreaterThan(2);
    });

    it("Should parse as a valid JavaScript RegExp after slash-stripping", () => {
      const pattern = entry.regex.slice(1, -1);
      expect(() => new RegExp(pattern)).not.toThrow();
    });

    it("Should have example entries that are all strings", () => {
      for (const ex of entry.example) {
        expect(typeof ex).toBe("string");
      }
    });
  });
});

describe("ALPHA3_TO_ALPHA2 integrity", () => {
  const alpha3Entries = Object.entries(ALPHA3_TO_ALPHA2);

  // v1.1.0 baseline: these alpha-3 codes map to alpha-2 codes that aren't in
  // COUNTRIES. Means `validatePostalCode(<alpha3>, ...)` returns false for them
  // today. Locked in as a snapshot so the Google data swap flags any change —
  // either it fixes these (turns the test red, update the list) or it doesn't
  // (and we keep current parity).
  const KNOWN_ORPHAN_ALPHA3 = [
    "ALA", "BLM", "ESH", "GLP", "GUF", "MAF", "MCO",
    "MTQ", "MYT", "PRI", "REU", "SJM", "SPM",
  ];

  it("Should contain at least one mapping", () => {
    expect(alpha3Entries.length).toBeGreaterThan(0);
  });

  it.each(alpha3Entries)("Should be well-formed: %s → %s", (alpha3, alpha2) => {
    expect(alpha3).toMatch(/^[A-Z]{3}$/);
    expect(alpha2).toMatch(/^[A-Z]{2}$/);
  });

  it("Should match the known set of orphan alpha-3 entries exactly", () => {
    const orphans = alpha3Entries
      .filter(([, a2]) => !(a2 in COUNTRIES))
      .map(([a3]) => a3)
      .sort();
    expect(orphans).toEqual([...KNOWN_ORPHAN_ALPHA3].sort());
  });

  it("Should have every non-orphan alpha-3 resolve to a COUNTRIES key", () => {
    for (const [a3, a2] of alpha3Entries) {
      if (KNOWN_ORPHAN_ALPHA3.includes(a3)) continue;
      expect(COUNTRIES).toHaveProperty(a2);
    }
  });

  it("Should not contain duplicate alpha-2 values", () => {
    const values = Object.values(ALPHA3_TO_ALPHA2);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe("Generic regex behavior", () => {
  const generics = ENTRIES.filter(([, entry]) => entry.isGenericRegex);

  it("Should contain at least one generic-regex country", () => {
    expect(generics.length).toBeGreaterThan(0);
  });

  it.each(generics)("%s generic regex should accept a single character and reject empty input", (_code, entry) => {
    const regex = new RegExp(entry.regex.slice(1, -1));
    expect(regex.test("X")).toBe(true);
    expect(regex.test("")).toBe(false);
  });
});
