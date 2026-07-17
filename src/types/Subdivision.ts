/**
 * A country subdivision (state, province, prefecture, …) that a postal code
 * can resolve to.
 */
export type Subdivision = {
  /**
   * The ISO 3166-2 subdivision code **without** the country prefix:
   * `"CA"` for California, `"ON"` for Ontario, `"13"` for Tokyo.
   *
   * Japan's codes are numeric and the US's are alphabetic — this is not an
   * inconsistency. ISO 3166-2 renders them `JP-13` and `US-CA`; upstream
   * supplies the part after the hyphen in both cases, so returning it raw is
   * uniform across every supported country. Compose the full form as
   * `` `${countryCode}-${subdivision.code}` `` if you need it.
   *
   * Do not "fix" Japan to `JP-13` — it would break the other 23 countries.
   */
  code: string;
  /** Human-readable name, Latin script where upstream provides one. */
  name: string;
};
