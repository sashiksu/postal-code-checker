import { CountryCode } from "./CountryCode";

/**
 * Country code accepted by utilities that can be overridden via `configure()`.
 *
 * Resolves to the known alpha-2 / alpha-3 union **plus** any string, which
 * accommodates country codes added at runtime through `configure()` (for
 * example, `"XK"` for Kosovo). The `(string & {})` intersection is a
 * well-known TypeScript pattern that widens the type to accept any string
 * while preserving autocomplete for the known union members.
 */
export type AnyCountryCode = CountryCode | (string & {});
