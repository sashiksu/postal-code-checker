# Configuration

`postal-code-checker` ships with built-in data for 249 countries sourced from Google's [`libaddressinput`](https://github.com/google/libaddressinput). For most applications that dataset is enough — `validatePostalCode("US", "90210")` just works.

When it isn't enough, `configure()` lets you layer user-supplied country data on top in one call, and every utility in the package honors the override immediately.

## When to use it

- **A country you operate in isn't in the bundled dataset.** Kosovo (`XK`) is the canonical example — it's not in ISO 3166-1, so the upstream source doesn't ship it, but Kosovo has a working 5-digit postal code system and is used as `XK` by most shipping APIs.
- **Your product needs a different country name.** Upstream spellings like `"Bulgaria (rep.)"` or `"Czech Rep."` may not match your UI copy. Override the entry with your preferred name.
- **You need stricter or looser patterns.** US ZIP codes bundled as `\d{5}(?:-\d{4})?` accept both 5-digit and 5+4. If your product mandates 5+4 only, replace the US entry with a tighter regex.
- **Internal or corporate "country" codes.** Some logistics systems use non-ISO codes like `XI` (Northern Ireland, post-Brexit), `XA`, or custom internal identifiers. Register them with `configure()` and they validate alongside real countries.

## Quick example — adding Kosovo

```ts
import { configure, validatePostalCode, getCountryByCode } from "postal-code-checker";

configure({
  countries: {
    XK: {
      patterns: ["/^(?:[1-7]\\d{4})$/"],
      example: ["10000", "20000"],
      country: "Kosovo",
      alpha3: "XKX",
    },
  },
});

validatePostalCode("XK", "10000");   // → true
validatePostalCode("XK", "99999");   // → false (out of range)
validatePostalCode("XKX", "10000");  // → true (alpha-3 resolves)

getCountryByCode("XK")?.countryName; // → "Kosovo"
```

## How the override interacts with every utility

Once `configure()` is called, all of these read from the merged dataset:

| Utility | Sees the override? |
| --- | --- |
| `validatePostalCode` | ✅ |
| `validatePostalCodes` | ✅ |
| `getCountryByCode` | ✅ |
| `getAllCountries` | ✅ (new countries appear in the list) |
| `guessCountries` | ✅ (custom patterns are matched too) |
| `format` | ✅ |
| `usePostalCodeValidation` (deprecated) | ✅ |

No call-site changes required. If existing code imports `validatePostalCode` from the package, it picks up the override automatically.

## Loading config from a JSON file

The shape accepted by `configure()` is pure JSON — no functions or classes — so you can keep it in a separate file and import it.

```json
// custom-countries.json
{
  "countries": {
    "XK": {
      "patterns": ["/^(?:[1-7]\\d{4})$/"],
      "example": ["10000", "20000"],
      "country": "Kosovo",
      "alpha3": "XKX"
    },
    "US": {
      "patterns": ["/^(?:\\d{5}-\\d{4})$/"],
      "example": ["12345-6789"],
      "country": "United States"
    }
  }
}
```

```ts
// In your app bootstrap, once at startup:
import { configure } from "postal-code-checker";
import customCountries from "./custom-countries.json";

configure(customCountries);
```

## Semantics

### Replace per country

Each entry under `countries` **wholesale replaces** the built-in entry for that alpha-2 code. Fields are not merged. If you provide `US`, your patterns become the *only* US patterns — the default `\d{5}(?:-\d{4})?` is gone until you `resetConfig()` or supply it yourself.

This keeps the semantics predictable: looking at your config file, you always know exactly which patterns are active for a given country.

### Idempotent across calls

```ts
configure({ countries: { XK: kosovoEntry } });
configure({ countries: { YY: ylandEntry } });

// XK is gone. Each call starts from the bundled defaults and layers the
// given overrides on top — calls don't accumulate.
```

If you want multiple overrides active at the same time, pass them all in a single `configure()` call.

### Fail fast

`configure()` validates the supplied config synchronously and throws `ConfigurationError` before touching any state. A bad config can't leave the library in a half-configured state.

```ts
import { configure, ConfigurationError } from "postal-code-checker";

try {
  configure(userSuppliedConfig);
} catch (err) {
  if (err instanceof ConfigurationError) {
    // The message names the offending field — surface it to the user
    console.error(err.message);
  } else {
    throw err;
  }
}
```

## `resetConfig()`

```ts
import { resetConfig } from "postal-code-checker";

resetConfig();
```

Discards any active `configure()` override and restores the bundled defaults. Primary use cases:

- **Test teardown.** Keeps configurations from leaking between tests.
  ```ts
  afterEach(() => {
    resetConfig();
  });
  ```
- **Scenario switching.** Dev tools or feature-flag-driven UIs that toggle between datasets at runtime.
- **Hot module reloading.** Reset before re-applying the dev-time config so stale overrides don't accumulate across reloads.

Calling `resetConfig()` without a prior `configure()` is a no-op.

## Runtime validation — what `configure()` checks

Every field is validated and the thrown `ConfigurationError` names the offending field path. Quick reference:

| Rule | Error message |
| --- | --- |
| `config` is an object | `"config" must be an object` |
| `countries` is an object | `"config.countries" must be an object` |
| Keys are 2-letter uppercase | `"countries.<code>": country code must be a 2-letter uppercase string` |
| Each entry is an object | `"countries.<code>" must be an object` |
| `patterns` is an array (empty is allowed — means "no postal code system") | `"countries.<code>.patterns" must be an array of strings` |
| Each pattern is a string wrapped in slashes (`/^…$/`) | `"countries.<code>.patterns[<i>]" must be a regex wrapped in slashes` |
| Each pattern is a valid regex | `"countries.<code>.patterns[<i>]" is not a valid regex: …` |
| `example` is an array of strings | `"countries.<code>.example" must be an array of strings` |
| `country` is a non-empty string | `"countries.<code>.country" must be a non-empty string` |
| `alpha3` (if set) is 3-letter uppercase | `"countries.<code>.alpha3" must be a 3-letter uppercase string` |

## Pattern format

Patterns use the same format as the bundled dataset:

- **Wrapped in slashes**: `"/^\\d{5}$/"` — the surrounding `/` characters are required, as they match the in-memory format the validator iterates internally.
- **Anchored**: start with `^` and end with `$` so the regex matches the entire input, not just a substring.
- **No flags**: just the pattern. Input normalization (trim + uppercase) happens before matching, so you don't need `/i` for case-insensitivity.
- **Escaping**: JSON-escape `\` as `\\`. In TypeScript/JavaScript source files you can use `String.raw` to avoid the double-backslash, or write `"/^\\d{5}$/"` as above.

Example patterns:

| Intent | Pattern |
| --- | --- |
| 5-digit ZIP | `"/^\\d{5}$/"` |
| 5-digit or 5+4 ZIP | `"/^\\d{5}(?:-\\d{4})?$/"` |
| Canadian postal code | `"/^[A-CEGHJKLMNPRSTVXY]\\d[A-Z] ?\\d[A-Z]\\d$/"` |
| Kosovo (5-digit, first digit 1-7) | `"/^[1-7]\\d{4}$/"` |

## SSR / multi-tenant limitation

`configure()` is a module-level singleton. Call it once at app boot and every downstream consumer — utilities, React components, server routes — sees the merged dataset without extra wiring.

Per-request configuration (SSR, multi-tenant servers where each tenant needs its own dataset) is **not supported** in this release. If you need it, [open an issue](https://github.com/sashiksu/postal-code-checker/issues/new) describing your use case. A `createValidator()` factory that returns bound, instance-scoped functions is on the roadmap — we're waiting for real demand before designing it.

## Try it live

The [interactive demo](https://sashiksu.github.io/postal-code-checker/) includes a Configuration tab where you can paste in a JSON config and see every utility update in place. Shareable URL, Apply/Reset, and a live diff against the bundled dataset.
