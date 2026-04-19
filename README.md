# 📮 postal-code-checker

**Validate postal codes and ZIP codes for 249 countries. TypeScript-first. Zero dependencies.**

[![npm version](https://img.shields.io/npm/v/postal-code-checker.svg)](https://www.npmjs.com/package/postal-code-checker)
[![npm downloads](https://img.shields.io/npm/dm/postal-code-checker.svg)](https://www.npmjs.com/package/postal-code-checker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/postal-code-checker.svg)](https://bundlephobia.com/package/postal-code-checker)
[![types](https://img.shields.io/npm/types/postal-code-checker.svg)](https://www.npmjs.com/package/postal-code-checker)
[![zero dependencies](https://img.shields.io/badge/dependencies-0-success.svg)](./package.json)
[![license](https://img.shields.io/npm/l/postal-code-checker.svg)](./LICENSE)

<p align="center">
  <img src="https://raw.githubusercontent.com/sashiksu/postal-code-checker/master/docs/hero.gif" alt="Validating postal codes for 249 countries in real time" width="720" />
</p>

Powered by Google's [`libaddressinput`](https://github.com/google/libaddressinput) — the same dataset behind Chromium, Android, and Google Pay address forms.

<details>
<summary><b>Contents</b></summary>

- [Quick start](#-quick-start)
- [Why postal-code-checker?](#-why-postal-code-checker)
- [Use cases](#-use-cases)
- [API Reference](#-api-reference)
- [Types](#️-types)
- [Migration Guide](#-migration-guide)
- [Roadmap](#️-roadmap)
- [Data Sources](#-data-sources)
- [Contributing](#-contributing)
- [License](#-license)

</details>

---

## ⚡ Quick start

```bash
npm install postal-code-checker
```

```ts
import { validatePostalCode, validatePostalCodes } from "postal-code-checker";

validatePostalCode("US", "90210");          // → true
validatePostalCode("CA", "k1a 0t6");         // → true  (case + whitespace tolerant)
validatePostalCode("GBR", "SW1A 1AA");       // → true  (alpha-3 works too)

validatePostalCodes("US", ["12345", "oops"]); // → [true, false]
```

Works in **React, Next.js, Vue, Svelte, Angular, Node.js, Deno, Bun, and plain browser JS** — no framework assumptions.

**Prefer to try before installing?**

👉 **[Live interactive demo](https://sashiksu.github.io/postal-code-checker/)** — browse the dataset, run single + batch validations, edit code in the browser.

[![Try on RunKit](https://img.shields.io/badge/try_on-runkit-491757?style=flat&labelColor=171717)](https://npm.runkit.com/postal-code-checker)
[![Open in StackBlitz](https://img.shields.io/badge/open_in-stackblitz-1389FD?style=flat&labelColor=171717)](https://stackblitz.com/fork/github/sashiksu/postal-code-checker)

RunKit spins up a Node.js REPL with the package preloaded. StackBlitz forks the full repo and opens it in a web IDE — good for exploring the source.

---

## 💡 Why postal-code-checker?

- 🌍 **249 countries** — the full ISO 3166-1 list, sourced live from Google's `libaddressinput`. Regenerated per release so the regexes never drift from upstream.
- 📋 **Batch API** — `validatePostalCodes(country, codes[])` returns an index-aligned `boolean[]`. Designed for CSV imports, bulk address uploads, and form arrays.
- 🔤 **Alpha-2 and alpha-3 both work** — call with `"US"` or `"USA"`, `"GB"` or `"GBR"`. No branching at your call sites.
- ✨ **Forgiving input** — case-insensitive and whitespace-tolerant. `"k1a 0t6"`, `" K1A 0T6 "`, and `"K1A0T6"` all validate equivalently where the country allows it.
- 🪶 **Zero runtime dependencies** — one install, nothing else pulled in. Keeps `node_modules` small and supply-chain surface minimal.
- 🧷 **TypeScript-first** — `.d.ts` bundled. No `@types/*` package to install.
- 📦 **Dual ESM + CommonJS** — modern `import` and legacy `require()` both work out of the box.
- 🌐 **Framework-agnostic** — React, Next.js, Vue, Svelte, Angular, Node.js, Deno, Bun, plain browser JS.

---

## 🧩 Use cases

<details>
<summary><b>Ecommerce checkout — validate ZIP before hitting your address API</b></summary>

```ts
import { validatePostalCode } from "postal-code-checker";

function onZipBlur(country: string, zip: string) {
  if (!validatePostalCode(country, zip)) {
    return "Please check your postal code.";
  }
  // safe to POST to /address-lookup
}
```

</details>

<details>
<summary><b>React Hook Form — drop-in custom validator</b></summary>

```tsx
import { useForm } from "react-hook-form";
import { validatePostalCode } from "postal-code-checker";

const { register } = useForm<{ country: string; postal: string }>();

<input
  {...register("postal", {
    validate: (value, { country }) =>
      validatePostalCode(country, value) || "Invalid postal code",
  })}
/>
```

</details>

<details>
<summary><b>CSV / bulk import sanity check — batch API</b></summary>

```ts
import { validatePostalCodes } from "postal-code-checker";

const rows = await parseCsv("./addresses.csv");
const postals = rows.map((r) => r.postal);
const results = validatePostalCodes("US", postals);

const bad = rows.filter((_, i) => !results[i]);
console.log(`${bad.length} rows need review`);
```

Batch calls avoid N regex compiles — one country lookup, N matches. Index-aligned output so you can zip results back to input rows.

</details>

<details>
<summary><b>Next.js server action — country-aware validation</b></summary>

```ts
"use server";
import { validatePostalCode } from "postal-code-checker";

export async function submitAddress(data: FormData) {
  const country = String(data.get("country"));
  const postal = String(data.get("postal"));
  if (!validatePostalCode(country, postal)) {
    return { error: "Invalid postal code for that country" };
  }
  // persist…
}
```

</details>

<details>
<summary><b>Address autocomplete fallback — when no API is available</b></summary>

```ts
import { getCountryByCode } from "postal-code-checker";

const country = getCountryByCode("DE");
// country.examplePostalCodes → ["10115"]  ← use as placeholder
// country.postalCodePatterns → anchored regex strings, safe to render
```

</details>

---

## 📚 API Reference

### `validatePostalCode(countryCode, postalCode): boolean`

Validates a single postal code against a country. Accepts both alpha-2 and alpha-3 ISO 3166-1 codes. Input is trimmed and uppercased before matching, so `"k1a 0t6"`, `" K1A 0T6 "`, and `"K1A0T6"` all validate equivalently where the country allows it.

### `validatePostalCodes(countryCode, postalCodes): boolean[]`

Validates an array of postal codes against one country and returns an index-aligned array of results. Unique to this package — use it for CSV imports, bulk address uploads, and form arrays.

### `getCountryByCode(countryCode): Country | null`

Returns the full country record (patterns, example codes, name, 2-letter code) or `null` if unknown. Accepts alpha-2 or alpha-3. `postalCodePatterns` is a `string[]` — most countries have one entry, some (e.g. GB with BFPO) have several.

### `getAllCountries(): CountryOption[]`

Returns `{ countryName, countryCode }[]` for every supported country, sorted alphabetically.

### `usePostalCodeValidation()` — _deprecated since 1.1.0_

Retained for backward compatibility; delegates to the top-level `validatePostalCode`. Kept functional in 2.x; scheduled for removal in 3.0. Prefer the top-level exports in new code.

---

## 🏷️ Types

```typescript
type CountryCode = string; // ISO 3166-1 alpha-2 ("US") or alpha-3 ("USA")

type Country = {
  postalCodePatterns: string[];  // regex strings wrapped in slashes, e.g. "/^\\d{5}$/"
  examplePostalCodes: string[];
  isGenericRegex: boolean;
  countryName: string;
  countryCode: CountryCode;
};
```

---

## 🔄 Migration Guide

> **Coming from a different postal-code library?** See [`docs/SWITCHING.md`](./docs/SWITCHING.md) — covers the common one-line equivalents, batch API migration, and the argument-order gotcha that trips most swaps.

### From v1.x → v2.0 (data-shape breaking change)

v2.0 switches to Google's `libaddressinput` dataset and renames the regex field on the `Country` record. The runtime API (`validatePostalCode`, `validatePostalCodes`, `getCountryByCode`, `getAllCountries`) is unchanged — but anything reading `country.postalCodeRegex` directly needs an update.

**Before (v1.x):**

```ts
const country = getCountryByCode("US");
const regex = new RegExp(country.postalCodeRegex.slice(1, -1));
regex.test("12345");
```

**After (v2.0):**

```ts
const country = getCountryByCode("US");
const ok = country.postalCodePatterns.some((wrapped) =>
  new RegExp(wrapped.slice(1, -1)).test("12345")
);
```

If you were only calling `validatePostalCode` / `validatePostalCodes`, nothing changes — normalization and return types are identical.

**Also note:**
- `country.countryName` values follow Google's canonical spelling — e.g. `"United States"` (was `"United States of America"`), `"Russia"` (was `"Russian Federation"`). Update any string pins in tests or UI copy.
- A handful of previously-orphan alpha-3 codes (Åland, Martinique, Réunion, Puerto Rico, etc.) now resolve correctly through `getCountryByCode`.

### From `usePostalCodeValidation` (v1.0.x) → `validatePostalCode` (v1.1.0+)

```js
// Before
import { usePostalCodeValidation } from "postal-code-checker";
const { validatePostalCode } = usePostalCodeValidation();

// After
import { validatePostalCode } from "postal-code-checker";
```

The `usePostalCodeValidation` name followed React's hook naming convention, which confused non-React users and tripped the `react-hooks/rules-of-hooks` lint rule even though it's not an actual hook. The new direct API works identically in React, Node.js, Vue, Angular, Svelte, or plain JavaScript.

`usePostalCodeValidation` still exists in 2.x and delegates to the new implementation. Scheduled for removal in 3.0.

---

## 🗺️ Roadmap

### ✅ Shipped

- Swap data source to Google `libaddressinput` _(2.0.0)_
- Reproducible data pipeline — `sync:data` + `sync:check` guard against upstream drift _(2.0.0)_
- `postalCodePatterns: string[]` — support countries with multiple valid patterns _(2.0.0)_
- Interactive demo site at [sashiksu.github.io/postal-code-checker](https://sashiksu.github.io/postal-code-checker/) _(2.0.0)_
- Full ISO 3166-1 coverage (249 countries, zero generic fallbacks) _(2.0.0)_
- Batch validation (`validatePostalCodes`) _(1.1.0)_
- Case + whitespace tolerant input _(1.1.0)_
- ISO 3166-1 alpha-3 support _(1.1.0)_
- Full unit-test coverage of utility functions _(1.1.0)_

### 🔜 Planned

- Accept user-supplied country data to override / merge the bundled dataset
- Subdivision-level validation (Google's `sub_zips` prefix data)
- Removal of deprecated `usePostalCodeValidation` _(3.0.0)_

---

## 📊 Data Sources

Postal code patterns, country names, and example codes come from Google's [`libaddressinput`](https://github.com/google/libaddressinput) project (Apache-2.0), fetched from `https://chromium-i18n.appspot.com/ssl-aggregate-address/data/<CC>`. The same dataset powers address forms in Chromium, Android, and Google Pay.

`scripts/sync-postal-data.ts` regenerates `src/assets/index.ts` from upstream; `npm run sync:check` runs in CI and in `prepublishOnly` to block releases whose on-disk data has drifted from the script's output.

See [`NOTICE`](./NOTICE) for the upstream Apache-2.0 attribution.

Prior to v2.0.0, data was sourced from the European Central Bank (ECB), retrieved 4 Aug 2024.

---

## 🤝 Contributing

Pull requests welcome. See **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** for local setup, the country-data workflow (upstream-first via `libaddressinput`), and maintainer sync steps.

Quick start:

1. Branch from `master`: `git checkout -b feature/<short-desc>` or `bugfix/<short-desc>`.
2. Add or update tests under `src/__tests__/` for any behavior change.
3. Follow existing style — `npm run prettier` and `npm run lint` ship configs.
4. Open a PR targeting `master`.

Found a bug, missing country, or want to propose a feature? Use the [structured issue templates](./.github/ISSUE_TEMPLATE). For security issues, see [`SECURITY.md`](./SECURITY.md).

---

## 📄 License

[MIT](./LICENSE)
