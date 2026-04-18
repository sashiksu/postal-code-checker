import { COUNTRIES } from "../assets/index";
import { CountryCode } from "../types/CountryCode";
import { validatePostalCode } from "../utils/validatePostalCode";

// Behavior snapshot across every country: the canonical examples that ship
// with the package today must continue to validate after the data swap.
//
// Flat-list construction so Jest reports `VALID  US  "11550"` rather than a
// nested describe tree — makes a failing diff in the data swap PR instantly
// legible.
type Case = { code: string; example: string; country: string };

// v1.1.0 baseline: these examples ship in the asset file but DO NOT match
// their own country's regex today. Locked in so the Google data swap flags
// any change — if Google fixes them (test turns red), update the list.
const KNOWN_FAILING_EXAMPLES: ReadonlyArray<{ code: string; example: string }> = [
  { code: "LC", example: "LC05 201" },
  { code: "TW", example: " 999(-)999" },
];

const isKnownFailing = (code: string, example: string): boolean =>
  KNOWN_FAILING_EXAMPLES.some((kf) => kf.code === code && kf.example === example);

const ALL_CASES: Case[] = Object.entries(COUNTRIES).flatMap(([code, entry]) =>
  entry.example.map((example) => ({ code, example, country: entry.country }))
);

const VALID_CASES: Case[] = ALL_CASES.filter(
  ({ code, example }) => !isKnownFailing(code, example)
);

describe("Country matrix (behavior snapshot)", () => {
  it("Should have at least one example case to validate", () => {
    // If this ever hits zero, the asset file has been emptied — bail loudly
    // rather than silently passing the matrix.
    expect(VALID_CASES.length).toBeGreaterThan(0);
  });

  if (VALID_CASES.length > 0) {
    it.each(VALID_CASES)(
      "VALID  $code ($country) → '$example'",
      ({ code, example }) => {
        expect(validatePostalCode(code as CountryCode, example)).toBe(true);
      }
    );
  }

  it.each(KNOWN_FAILING_EXAMPLES)(
    "KNOWN-FAILING $code → '$example' (baseline — update list if this turns green)",
    ({ code, example }) => {
      expect(validatePostalCode(code as CountryCode, example)).toBe(false);
    }
  );
});

// Exercise every country twice more: once through an obviously-bogus input
// and once through an empty string. These catch over-permissive regexes that
// happen to pass the example but accept anything.
describe("Country matrix (negative sanity)", () => {
  const CODES = Object.keys(COUNTRIES);

  // An empty string should never validate — trimming would leave it empty,
  // and no real postal-code regex matches the empty string.
  it.each(CODES)("%s should reject empty string", (code) => {
    expect(validatePostalCode(code as CountryCode, "")).toBe(false);
  });

  // A 300-char junk string exceeds the generic regex upper bound (255) and
  // every specific pattern we ship today. If a future dataset accepts this,
  // we want to know.
  it.each(CODES)("%s should reject a 300-char junk string", (code) => {
    const junk = "z".repeat(300);
    expect(validatePostalCode(code as CountryCode, junk)).toBe(false);
  });
});
