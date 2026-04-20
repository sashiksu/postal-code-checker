# Changelog

All notable changes to `postal-code-checker` are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0-alpha.2]

Adds a single-place configuration API that lets you override built-in country data or add brand-new countries at runtime — every utility in the package honors the override. Backward-compatible with 2.1.0-alpha.1 and 2.0; no migration needed.

### Added

- **`configure(config)`** — register a user-supplied country dataset in one call, typically at app boot. Each entry either replaces a built-in country (when the alpha-2 key matches an existing one) or adds a brand-new country. Replace semantics per country — patterns are not merged field-by-field. Runtime validation throws `ConfigurationError` with a field-specific message on bad input (missing keys, malformed regex, non-uppercase codes, etc.). Calls are idempotent: each call starts from the bundled defaults and layers the given overrides on top, so prior calls don't accumulate.
- **`resetConfig()`** — discards any active override and restores the bundled defaults. Designed for test teardown (`afterEach`), scenario switching in demos, and HMR during development.
- **`ConfigurationError`** class — thrown by `configure()` on validation failure. Exported so consumers can `catch (err) { if (err instanceof ConfigurationError) … }`.
- **`PostalCodeConfig`** and **`AnyCountryCode`** types exported from the package barrel. `PostalCodeConfig` describes the shape `configure()` accepts; `AnyCountryCode` is `CountryCode | (string & {})` and preserves autocomplete for known countries while accepting any string for runtime-added codes.
- **Kosovo (XK) as the reference example.** Kosovo is the canonical "country the default dataset doesn't cover" case — it's not in ISO 3166-1, so Google's libaddressinput doesn't ship it, but it has a working 5-digit postal code system and is used as `XK` by most shipping APIs. The docs and demo walk through registering it.

### Changed

- **Every existing utility now reads through a single active-data accessor.** `validatePostalCode`, `validatePostalCodes`, `getCountryByCode`, `getAllCountries`, `guessCountries`, and `format` all see the merged dataset after `configure()` is called. No call-site changes required.
- **Public country-code input type widened to `AnyCountryCode`.** Runtime behavior is unchanged. The narrow `CountryCode` union is still exported for users who want strict typing against known alpha-2 codes. The one theoretical break: code that assigned `getCountryByCode(...).countryCode` back to a `CountryCode`-typed variable now needs either `AnyCountryCode` or a cast.

### SSR / multi-tenant note

`configure()` is a module-level singleton: call it once at app boot and every downstream utility sees the merged dataset without extra wiring. Per-request configuration for SSR or multi-tenant servers isn't supported in this release — if you need it, [open an issue](https://github.com/sashiksu/postal-code-checker/issues/new) describing your use case and we'll consider a `createValidator()` factory for a future release.

### Demo

- New **Configuration** tab with an editable JSON textarea seeded with the Kosovo example, Apply/Reset buttons, and a live validator that updates in place as the config changes.
- The Reset button includes a short note explaining *when* you'd use `resetConfig()` — test teardown, scenario switching, HMR.
- Shareable URL encoding the current config in the page hash, so a config can be linked to colleagues without copy-pasting JSON.

## [2.1.0-alpha.1]

Adds two new public APIs for working with postal codes that are valid across countries. Backward-compatible with 2.0; no migration needed.

### Added

- **`format(countryCode, postalCode)`** — returns the canonical form of a valid code (trimmed, uppercased), ready to store in a database. Returns `null` when the input doesn't match the country's pattern or the country has no postal code system. Accepts alpha-2 and alpha-3 country codes.
- **`guessCountries(postalCode)`** — given a postal code with no country context, returns every country whose pattern accepts the input. Result is `{ countryName, countryCode }[]` sorted alphabetically by `countryName` — ready to render as a picker. Countries with no postal code system are naturally excluded.
- **`CountryOption` type re-exported** from the package barrel. Previously internal; both `getAllCountries` and the new `guessCountries` return `CountryOption[]`, so consumers now have access to the shape.

### Demo

- Interactive `format()` and `guessCountries()` panels in the Playground section.
- New "Format" and "Guess" tabs in the Code Examples.
- Roadmap no longer lists either function as planned; both now ship with 2.1.

## [2.0.1]

Maintenance release. No runtime behavior changes, no public API changes. Focuses on demo polish, legacy playground removal, and a devDependency cleanup.

### Fixed

- **Demo navbar version badge.** The badge on [the live demo](https://sashiksu.github.io/postal-code-checker/) was still showing `v2.0.0-alpha.1`. Now reflects the published version.
- **Demo page `<head>` metadata.** `<title>` is now capability-forward (`"Validate postal codes for 249 countries · postal-code-checker"`); `meta description` and `og:description` updated from "200+ countries" to the accurate "249 countries"; added `og:url`, `og:image`, `twitter:card`, `twitter:image`, and a canonical link so unfurls on Twitter/X, LinkedIn, Slack, and Facebook render the social-preview card.
- **Demo GitHub Pages deploy.** Bumped `@vitejs/plugin-react` from `^4.3.4` to `^6.0.0` in `demo/package.json` to match the Vite 8 peer range. Previously, `npm ci` in the Pages workflow failed with ERESOLVE after Vite was upgraded to 8.x, silently leaving the live demo stale. Clean `npm ci` + build now passes end-to-end.

### Removed

- **Legacy `dev/` playground.** The antd + webpack playground behind `npm start` is gone — the [interactive demo](https://sashiksu.github.io/postal-code-checker/) fully replaces it. Contributors now use `cd demo && npm run dev`.
- **`scripts.start` and `scripts.watch`** from `package.json` (both only served the removed playground).
- **`webpack.config.js` and `.babelrc`** — no longer needed with no local webpack build.
- **16 devDependencies** that only the legacy playground consumed: `@ant-design/icons`, `antd`, `webpack`, `webpack-cli`, `webpack-dev-server`, `ts-loader`, `html-webpack-plugin`, `babel-loader`, `@babel/core`, `@babel/preset-env`, `@babel/preset-typescript`, `nodemon`, `react`, `react-dom`, `@types/react`, `@types/react-dom`. Root `node_modules` shrinks by ~505 packages; contributor `npm install` is noticeably faster and `npm audit` noise drops accordingly.

### Internal

- Root `prettier` script glob simplified from `"{src,tests,example/src}/**/*.{js,ts}"` to `"src/**/*.{js,ts}"` — the `tests/` and `example/src/` paths referenced in the old glob did not exist in this repo.
- Root ESLint ignore list swapped `dev/**` (deleted) for `demo/**`. The demo is a standalone package with its own TypeScript + ESLint setup and should not be linted by the root config.
- `CLAUDE.md` updated to reflect the playground removal, the trimmed workflow list, and the corrected `prettier` glob.

## [2.0.0]

First general-availability release of the v2 line. Swaps the underlying postal-code dataset from the ECB-derived tables used in v1 to [Google's `libaddressinput`](https://github.com/google/libaddressinput) — the same source that powers address forms in Chromium, Android, and Google Pay. Data is now regenerated per release from a reproducible script, with a release-time freshness gate.

The runtime surface is source-compatible for most consumers: `validatePostalCode`, `validatePostalCodes`, `getCountryByCode`, and `getAllCountries` keep the same signatures and return types. The shape of the `Country` record changes, which is the one breaking point — see **Migration** below.

### Added

- **249 countries supported** — the full ISO 3166-1 alpha-2 / alpha-3 list. 13 territories that previously fell back to generic patterns or were missing entirely now resolve through `getCountryByCode` (Åland Islands, Martinique, Réunion, Puerto Rico, Guam, American Samoa, and others).
- **Reproducible data pipeline** — `scripts/sync-postal-data.ts` fetches every country from the `libaddressinput` aggregate endpoint, anchors each regex pattern as `/^(?:…)$/`, title-cases country names, and rewrites `src/assets/index.ts` in place.
  - `npm run sync:data` — refresh the dataset.
  - `npm run sync:check` — compare the on-disk file against the upstream snapshot. Non-zero exit if drifted.
- **Release-time freshness gate** — `npm run release` now chains `prettier → test → sync:check → build → publish`, and `prepublishOnly` re-runs `sync:check` and the test suite as an npm-level safety net. A drifted dataset blocks publish.
- **Multi-pattern country support** — countries with alternations in upstream data (e.g. `GB` with BFPO codes) now store every pattern in `postalCodePatterns` and match if any pattern matches.
- **Countries with no postal-code system** — entries like UAE or Zimbabwe now ship `postalCodePatterns: []`. `validatePostalCode` returns `false` for any input against them, preventing false positives.
- **`NOTICE` file** — upstream Apache-2.0 attribution for `libaddressinput`. Included in the published tarball via the `files` allowlist.
- **Interactive demo app** — `demo/` directory with a Vite + React playground (live validator, batch tool, dataset browser, live code editor). Deployed to GitHub Pages via `.github/workflows/deploy-demo.yml`. `homepage` in `package.json` now links to the deployed demo.
- **Documentation**
  - `docs/SWITCHING.md` — migration guide for users coming from another postal-code library.
  - `CONTRIBUTING.md` — contributor setup, data-contribution workflow, maintainer sync steps.
  - `SECURITY.md` — private vulnerability reporting policy.
  - `.github/ISSUE_TEMPLATE/` — structured forms for bug reports, country-data tracking, and feature requests.
  - README rewrite with table of contents, "Try in your browser" links (RunKit + StackBlitz), and feature-forward messaging.

### Changed

- **BREAKING — `Country` shape.** The single-string `postalCodeRegex` field is replaced by `postalCodePatterns: string[]`. Each entry is a slash-wrapped, anchored regex string (e.g. `"/^(?:\\d{5})$/"`). Consumers only using the `validate*` functions are unaffected; consumers reading `postalCodeRegex` directly need to iterate the array. See the migration section in the README for a one-line swap.
- **BREAKING — country name canonicalization.** Country names now follow Google's canonical spelling — e.g. `"United States"` (was `"United States of America"`), `"Russia"` (was `"Russian Federation"`). Update any string pins in UI copy or tests.
- **Pattern anchoring moved to the sync script.** Patterns are now stored on disk in their anchored form. The validator no longer wraps them at runtime.
- **`isGenericRegex`** is `false` for every country in the shipped dataset. The upstream source covers every ISO 3166-1 entry with either a real pattern or an explicit "no postal code" signal, so the generic fallback is no longer used. The flag remains on the type for shape stability.
- **Node 18 baseline.** Declared via `engines.node`. Aligns with the sync script's reliance on global `fetch`.

### Deprecated

- `usePostalCodeValidation` remains available and delegates to the top-level `validatePostalCode`. Removal is scheduled for 3.0. New code should import `validatePostalCode` directly.

### Removed

- ECB-derived dataset. The prior data source is no longer bundled, fetched, or referenced.

### Fixed

- Orphan alpha-3 codes — previously, several alpha-3 codes resolved to `null` through `getCountryByCode` because their alpha-2 entries were missing from the bundled dataset. The libaddressinput sweep covers the complete ISO 3166-1 set, which eliminates most historical orphans.

### Migration

Upgrading from `1.x` → `2.0`:

```ts
// Before (v1.x)
const country = getCountryByCode("US");
const regex = new RegExp(country.postalCodeRegex.slice(1, -1));
regex.test("12345");

// After (v2.0)
const country = getCountryByCode("US");
const ok = country.postalCodePatterns.some((wrapped) =>
  new RegExp(wrapped.slice(1, -1)).test("12345")
);
```

If you're only calling `validatePostalCode` / `validatePostalCodes`, nothing changes — input normalization and return types are identical.

See [`docs/SWITCHING.md`](./docs/SWITCHING.md) for the broader "coming from another library" guide.

### Internal

- ESLint migrated to flat config (`eslint.config.mjs`).
- `src/assets/index.ts` is auto-generated and prettier-ignored.
- Snapshot date is recorded in the top-of-file comment in `src/assets/index.ts` on every sync.
- Package keywords trimmed from 22 to 15 for higher per-keyword relevance on npm search.
- Playwright added as a devDependency for `npm run gen:social-preview`, which generates `docs/social-preview.png` for the repo's social-card image.

## [1.1.0] — prior release

- Batch validation via `validatePostalCodes(countryCode, codes[])` — returns a `boolean[]` index-aligned to the input.
- Case-insensitive and whitespace-tolerant input: `"k1a 0t6"`, `" K1A 0T6 "`, and `"K1A0T6"` now validate equivalently for countries that allow it.
- ISO 3166-1 alpha-3 support. `validatePostalCode("GBR", "SW1A 1AA")` works the same as `validatePostalCode("GB", "SW1A 1AA")`.
- `usePostalCodeValidation` deprecated in favor of the top-level `validatePostalCode`. The `use` prefix was a historical mistake that triggered React's `react-hooks/rules-of-hooks` lint rule for non-React consumers.
- Full unit-test coverage added under `src/__tests__/utils/`.

Earlier versions are documented in the [GitHub releases](https://github.com/sashiksu/postal-code-checker/releases).

[2.1.0-alpha.1]: https://github.com/sashiksu/postal-code-checker/releases/tag/v2.1.0-alpha.1
[2.0.1]: https://github.com/sashiksu/postal-code-checker/releases/tag/v2.0.1
[2.0.0]: https://github.com/sashiksu/postal-code-checker/releases/tag/v2.0.0
[1.1.0]: https://github.com/sashiksu/postal-code-checker/releases/tag/v1.1.0
