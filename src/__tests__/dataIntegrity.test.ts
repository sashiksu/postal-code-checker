import { ALPHA3_TO_ALPHA2 } from "../assets/alpha3Map";
import { COUNTRIES } from "../assets/index";

// Pre-compute the entry list once so every `it.each` shares the same iteration.
const ENTRIES = Object.entries(COUNTRIES) as Array<
  [string, { patterns: string[]; example: string[]; isGenericRegex: boolean; country: string }]
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
          patterns: expect.any(Array),
          example: expect.any(Array),
          isGenericRegex: expect.any(Boolean),
          country: expect.any(String),
        })
      );
    });

    it("Should have a non-empty country name", () => {
      expect(entry.country.trim().length).toBeGreaterThan(0);
    });

    it("Should wrap every pattern in slashes", () => {
      for (const p of entry.patterns) {
        expect(p.startsWith("/")).toBe(true);
        expect(p.endsWith("/")).toBe(true);
        expect(p.length).toBeGreaterThan(2);
      }
    });

    it("Should have every pattern parse as a valid JavaScript RegExp", () => {
      for (const p of entry.patterns) {
        expect(() => new RegExp(p.slice(1, -1))).not.toThrow();
      }
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

  // v2.0.0: Google's libaddressinput data covers every alpha-3 territory that
  // v1.1.0 lacked (Åland, Martinique, Réunion, Puerto Rico, etc.). Orphan list
  // is empty. If this grows again, something regressed in the sync pipeline.
  const KNOWN_ORPHAN_ALPHA3: string[] = [];

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

  // Generics may go to zero once Google-specific data replaces every ECB
  // fallback. The conditional keeps the suite green in that happy case
  // without hiding the stat.
  it("Should report a generic-regex count for observability", () => {
    // eslint-disable-next-line no-console
    console.log(`isGenericRegex === true for ${generics.length}/${ENTRIES.length} countries`);
    expect(generics.length).toBeGreaterThanOrEqual(0);
  });

  if (generics.length > 0) {
    it.each(generics)(
      "%s generic regex should accept a single character and reject empty input",
      (_code, entry) => {
        const hasEmpty = entry.patterns.some((p) => new RegExp(p.slice(1, -1)).test(""));
        const hasSingleChar = entry.patterns.some((p) => new RegExp(p.slice(1, -1)).test("X"));
        expect(hasSingleChar).toBe(true);
        expect(hasEmpty).toBe(false);
      }
    );
  }
});
