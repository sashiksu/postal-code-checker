/** One generated subdivision record. Internal shape of `SUBDIVISIONS`. */
export type SubdivisionEntry = {
  code: string;
  name: string;
  /**
   * Raw upstream `sub_zips` prefix, **unanchored** — e.g. `"9[0-5]|96[01]"`.
   *
   * Unlike `CountryPostalCode.patterns`, which are anchored at generation time
   * as `/^(?:…)$/`, these are anchored at match time as `^(?:…)` with no
   * trailing `$`. The asymmetry is deliberate: these describe leading digits,
   * not whole codes. Anchoring the end here matches nothing.
   */
  pattern: string;
};

export type SubdivisionData = {
  [countryCode: string]: SubdivisionEntry[];
};
