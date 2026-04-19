# Changelog

All notable changes to `postal-code-checker` are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[2.0.0]: https://github.com/sashiksu/postal-code-checker/releases/tag/v2.0.0
[1.1.0]: https://github.com/sashiksu/postal-code-checker/releases/tag/v1.1.0
