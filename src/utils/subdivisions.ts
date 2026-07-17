import { SUBDIVISIONS } from "../assets/subdivisions";
import { AnyCountryCode } from "../types/AnyCountryCode";
import { Subdivision } from "../types/Subdivision";

import { getCountryByCode } from "./getCountryByCode";
import { matchesPostalCode } from "./matchesPostalCode";

/**
 * Resolves the input to the alpha-2 key used by the subdivision asset, or
 * null. Goes through getCountryByCode so alpha-3 and lowercase work exactly
 * as they do everywhere else in the package.
 */
const resolveAlpha2 = (countryCode: AnyCountryCode): string | null =>
  getCountryByCode(countryCode)?.countryCode ?? null;

/**
 * Whether the bundled dataset carries subdivision data for a country.
 *
 * Upstream publishes subdivision postal prefixes for only 24 of 249 countries
 * — `GB`, `DE`, `FR` and `CN` are among those it does not. Use this to tell
 * "no subdivision data exists here" apart from "nothing matched", both of
 * which make `inferSubdivision` return `[]`.
 *
 * @example
 * hasSubdivisionData("US"); // true
 * hasSubdivisionData("GB"); // false — a data limit, not a validation failure
 */
export const hasSubdivisionData = (countryCode: AnyCountryCode): boolean => {
  const alpha2 = resolveAlpha2(countryCode);
  return alpha2 !== null && (SUBDIVISIONS[alpha2]?.length ?? 0) > 0;
};

/**
 * Every subdivision the dataset knows for a country, sorted by code — ready
 * to render as a picker. Returns `[]` when there is no data.
 *
 * @example
 * getSubdivisions("US"); // [{ code: "AK", name: "Alaska" }, …]
 * getSubdivisions("GB"); // []
 */
export const getSubdivisions = (countryCode: AnyCountryCode): Subdivision[] => {
  const alpha2 = resolveAlpha2(countryCode);
  if (alpha2 === null) return [];
  return (SUBDIVISIONS[alpha2] ?? []).map((s) => ({ code: s.code, name: s.name }));
};

/**
 * Given a country and a postal code, returns every subdivision whose postal
 * prefix accepts the code.
 *
 * The code is validated first: `sub_zips` are leading-digit prefixes, so an
 * invalid code can still prefix-match. Without validation
 * `inferSubdivision("US", "999999")` would confidently return Alaska.
 *
 * Always an array, sorted by code — prefixes overlap, and some inputs
 * genuinely belong to more than one subdivision (`CA K1A 0T6` is both Ontario
 * and Quebec). Never assume `[0]` is the answer.
 *
 * Returns `[]` when the code is invalid, the country has no subdivision data
 * (see `hasSubdivisionData`), or nothing matched.
 *
 * @example
 * inferSubdivision("US", "90210");   // [{ code: "CA", name: "California" }]
 * inferSubdivision("CA", "K1A 0T6"); // [{ code: "ON", … }, { code: "QC", … }]
 * inferSubdivision("US", "999999");  // [] — not a valid US ZIP
 * inferSubdivision("GB", "SW1A 1AA");// [] — no upstream subdivision data
 */
export const inferSubdivision = (countryCode: AnyCountryCode, postalCode: string): Subdivision[] => {
  const alpha2 = resolveAlpha2(countryCode);
  if (alpha2 === null) return [];

  const entries = SUBDIVISIONS[alpha2];
  if (!entries || entries.length === 0) return [];

  // Validate BEFORE matching — prefixes accept invalid codes otherwise.
  if (!matchesPostalCode(countryCode, postalCode)) return [];

  const normalized = postalCode.trim().toUpperCase();
  return entries
    .filter((s) => new RegExp(`^(?:${s.pattern})`).test(normalized))
    .map((s) => ({ code: s.code, name: s.name }))
    .sort((a, b) => a.code.localeCompare(b.code));
};
