# Switching to `postal-code-checker`

Already using another postal-code validator? This page is a fast path for swapping — shows what the API looks like, what you gain, and the common one-line equivalents you'll want on day one.

## 30-second swap

```bash
npm uninstall <your-old-package>
npm install postal-code-checker
```

```ts
// Before — typical shape of most postal-code libraries:
// import validate from "<old-package>";
// validate("US", "90210"); // → boolean

// After:
import { validatePostalCode } from "postal-code-checker";
validatePostalCode("US", "90210"); // → true
```

Most existing call sites keep the same argument order — country first, postal code second.

## What you gain

### Batch validation

One call validates a whole array against the same country. Return value is index-aligned, so you can zip results back to input rows cleanly.

```ts
import { validatePostalCodes } from "postal-code-checker";

const codes = ["K1A 0T6", "90210", "oops", "H0H 0H0"];
const results = validatePostalCodes("CA", codes);
// → [true, false, false, true]
```

Typical use: CSV imports, bulk address uploads, form arrays. No regex gets re-compiled per row.

### Alpha-3 ISO codes work interchangeably

```ts
validatePostalCode("GB", "SW1A 1AA");  // → true
validatePostalCode("GBR", "SW1A 1AA"); // → true
validatePostalCode("usa", "90210");    // → true (case-insensitive)
```

If your form emits alpha-3 (`USA`, `GBR`, `DEU`) from a country dropdown, no conversion step needed.

### Forgiving input

Input is trimmed and uppercased before matching:

```ts
validatePostalCode("CA", "k1a 0t6");     // → true
validatePostalCode("CA", "  K1A 0T6  "); // → true
validatePostalCode("CA", "K1A0T6");      // → true
```

No need to `.trim().toUpperCase()` before every call.

### 249 countries — the full ISO 3166-1 list

Including territories other libraries commonly miss: Åland Islands, Martinique, Réunion, Puerto Rico, Guam, American Samoa, and more. The full dataset is regenerated from Google's [`libaddressinput`](https://github.com/google/libaddressinput) on every release, so the regex set stays aligned with the authoritative source.

### Access to country metadata

```ts
import { getCountryByCode, getAllCountries } from "postal-code-checker";

const de = getCountryByCode("DE");
// de.countryName         → "Germany"
// de.postalCodePatterns  → ["/^(?:\\d{5})$/"]
// de.examplePostalCodes  → ["10115"]

const all = getAllCountries(); // → { countryName, countryCode }[]
```

Useful for:

- Showing an example postal code as a form placeholder (`de.examplePostalCodes[0]`)
- Hinting the expected format client-side (`de.postalCodePatterns` are anchored regex strings)
- Populating a country `<select>` (`getAllCountries()` — alphabetized)

### TypeScript out of the box

`.d.ts` files ship inside the package. No separate `@types/*` install.

```ts
import type { Country, CountryCode } from "postal-code-checker";
```

### Zero runtime dependencies

One install, nothing else pulled in. Keeps `node_modules` small and the supply-chain surface minimal.

## One-liner equivalents

Most validators expose a single function. Here's the mapping for typical shapes:

| If your old API looked like… | Swap to |
|---|---|
| `validate(country, postal)` → boolean | `validatePostalCode(country, postal)` |
| `isValid(country, postal)` → boolean | `validatePostalCode(country, postal)` |
| `postalCodes.validate(country, postal)` | `validatePostalCode(country, postal)` |
| `new PostcodeValidator(country).isValid(postal)` | `validatePostalCode(country, postal)` |
| `validator.isPostalCode(postal, country)` | `validatePostalCode(country, postal)` *(argument order reversed)* |

Note the common gotcha: some libraries put the postal code first; this one puts the country first. Country-first tends to read more naturally in form code (`validatePostalCode(selectedCountry, input)`).

## Common migration scenarios

### Form validator (any framework)

```ts
// React Hook Form
<input
  {...register("postal", {
    validate: (value, { country }) =>
      validatePostalCode(country, value) || "Invalid postal code",
  })}
/>

// Zod-style custom refinement
const schema = z.object({
  country: z.string(),
  postal: z.string(),
}).refine(({ country, postal }) => validatePostalCode(country, postal), {
  message: "Invalid postal code",
  path: ["postal"],
});
```

### Backend validation (Node.js, Next.js server actions, API routes)

Same function, same return value, no framework coupling:

```ts
"use server";
import { validatePostalCode } from "postal-code-checker";

export async function submitAddress(data: FormData) {
  const country = String(data.get("country"));
  const postal  = String(data.get("postal"));
  if (!validatePostalCode(country, postal)) {
    return { error: "Invalid postal code" };
  }
}
```

### Bulk / batch processing

Use the batch API instead of looping:

```ts
// Before
const results = rows.map((row) => validate(row.country, row.postal));

// After — fewer allocations, same regex compiled once
const byCountry = new Map<string, number[]>();
rows.forEach((row, i) => {
  if (!byCountry.has(row.country)) byCountry.set(row.country, []);
  byCountry.get(row.country)!.push(i);
});

const results = new Array<boolean>(rows.length);
for (const [country, indexes] of byCountry) {
  const codes = indexes.map((i) => rows[i].postal);
  const batch = validatePostalCodes(country, codes);
  indexes.forEach((rowIndex, batchIndex) => {
    results[rowIndex] = batch[batchIndex];
  });
}
```

For single-country batches, skip the grouping step:

```ts
const results = validatePostalCodes("US", rows.map((r) => r.postal));
```

## Countries with no postal-code system

Some countries don't use postal codes (Ireland historically, UAE, Zimbabwe, etc.). For these, `validatePostalCode` returns `false` for *any* input — which matches how they treat unknown countries and avoids false positives. Use `getCountryByCode(cc)?.postalCodePatterns.length === 0` to detect this case and render a different UI (e.g. hide the postal field).

```ts
const country = getCountryByCode("AE"); // United Arab Emirates
if (!country?.postalCodePatterns.length) {
  // no postal code input needed
}
```

## Migration checklist

- [ ] `npm uninstall <old-package> && npm install postal-code-checker`
- [ ] Replace import(s) with `import { validatePostalCode } from "postal-code-checker";`
- [ ] Check argument order — country first, postal second
- [ ] Remove any manual `.trim().toUpperCase()` from your call sites; the library handles normalization
- [ ] If you were looping to validate N rows, switch to `validatePostalCodes` for the single-country case
- [ ] If you were branching on alpha-2 vs alpha-3 code length, you can delete that branch
- [ ] Run your tests

That's it. If you hit anything unexpected, [open an issue](https://github.com/sashiksu/postal-code-checker/issues/new/choose) — argument-order gotchas are the most common, and if they bite enough people we'll document them here.
