import { ALPHA3_TO_ALPHA2 as DEFAULT_ALPHA3_MAP } from "../assets/alpha3Map";
import { COUNTRIES as DEFAULT_COUNTRIES } from "../assets/index";
import { PostalCodeData } from "../types/PostalCodeData";

export type ActiveData = {
  countries: PostalCodeData;
  alpha3Map: Record<string, string>;
};

let activeData: ActiveData = {
  countries: DEFAULT_COUNTRIES,
  alpha3Map: DEFAULT_ALPHA3_MAP,
};

/**
 * Returns the current active country dataset — either the bundled defaults
 * or the merged result of the most recent `configure()` call.
 *
 * Internal. Every user-facing utility that reads country data must go through
 * this accessor so that `configure()` overrides flow through uniformly.
 */
export const getActiveData = (): ActiveData => activeData;

/**
 * Replaces the active dataset in one shot. Called by `configure()` with the
 * merged result of (defaults ⊕ user config). Internal.
 */
export const setActiveData = (next: ActiveData): void => {
  activeData = next;
};

/**
 * Restores the active dataset to the bundled defaults. Called by
 * `resetConfig()`. Internal.
 */
export const resetActiveData = (): void => {
  activeData = {
    countries: DEFAULT_COUNTRIES,
    alpha3Map: DEFAULT_ALPHA3_MAP,
  };
};

/**
 * Exposed for internal tests — lets assertions compare against the bundled
 * defaults without reaching into `../assets`.
 */
export const getDefaultData = (): ActiveData => ({
  countries: DEFAULT_COUNTRIES,
  alpha3Map: DEFAULT_ALPHA3_MAP,
});
