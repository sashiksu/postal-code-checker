# 📮 postal-code-checker — Postal Code & ZIP Code Validator for 200+ Countries (TypeScript, ESM/CJS) 📮

[![npm version](https://img.shields.io/npm/v/postal-code-checker.svg)](https://www.npmjs.com/package/postal-code-checker)
[![npm downloads](https://img.shields.io/npm/dm/postal-code-checker.svg)](https://www.npmjs.com/package/postal-code-checker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/postal-code-checker.svg)](https://bundlephobia.com/package/postal-code-checker)
[![types](https://img.shields.io/npm/types/postal-code-checker.svg)](https://www.npmjs.com/package/postal-code-checker)
[![license](https://img.shields.io/npm/l/postal-code-checker.svg)](https://github.com/sashiksu/postal-code-checker/blob/master/LICENSE)

`postal-code-checker` is a lightweight JavaScript / TypeScript library for **postal code and ZIP code validation** across **200+ countries** using ISO 3166-1 country codes. Zero runtime dependencies, ESM + CommonJS, first-class TypeScript types — drop it into any React, Next.js, Vue, Angular, Node.js, or plain-JS form to validate international addresses.

## ✨ Features

- 🌍 Supports postal code validation for over 200 countries
- 🔍 Provides country selection functionality
- 📝 Includes example postal codes for supported countries
- 🚀 TypeScript support with type definitions
- 🪶 Lightweight and easy to integrate

## ✨ What's New in 1.1.0

- 🪄 **New top-level `validatePostalCode` API** — no factory function, no destructuring.
- 🔤 **Case-insensitive and whitespace-tolerant input** — `"k1a 0t6"` and `" K1A 0T6 "` now both validate correctly.
- 🌐 **ISO 3166-1 alpha-3 country codes** — use `"USA"`, `"GBR"`, `"CAN"` interchangeably with 2-letter codes.
- 📦 **Batch validation helper** — validate many postal codes against one country in a single call.
- ⚠️ **`usePostalCodeValidation` is deprecated** — still works and will continue to work until 2.0. See [Migration Guide](#-migration-guide).

## 📦 Installation

```bash
npm install postal-code-checker
```

## 🚀 Usage

### Basic Example

<details open>
  <summary> 📋 Code</summary>

```javascript
// ES6 / TypeScript
import { validatePostalCode, getCountryByCode, getAllCountries } from "postal-code-checker";
// OR CommonJS
const { validatePostalCode, getCountryByCode, getAllCountries } = require("postal-code-checker");

// Validate a postal code
const isValid = validatePostalCode("US", "12345"); // true

// ISO 3166-1 alpha-3 codes also work
validatePostalCode("USA", "12345"); // true

// Input is case-insensitive and whitespace-tolerant
validatePostalCode("CA", "k1a 0t6"); // true
validatePostalCode("CA", "  K1A 0T6 "); // true

// Get country information
const country = getCountryByCode("US");
console.log(country.countryName); // "United States of America"

// Get all available countries
const countries = getAllCountries();
```

</details>

### Batch Validation

<details>
  <summary> 📋 Expand Code</summary>

```javascript
import { validatePostalCodes } from "postal-code-checker";

validatePostalCodes("US", ["12345", "90210", "abc"]);
// → [true, true, false]
```

Useful for CSV imports, address-book uploads, or form arrays where many
codes share the same country.

</details>

### NodeJS Example

<details>
  <summary> 📋 Expand Code</summary>

```javascript
const { validatePostalCode, getCountryByCode, getAllCountries } = require("postal-code-checker");

// Validate a postal code
const isValid = validatePostalCode("US", "12345"); // true

// Get country information
const country = getCountryByCode("US");
console.log(country.countryName); // "United States of America"

// Get all available countries
const countries = getAllCountries();
```

</details>

### React TypeScript Example (TSX)

<details>
  <summary> 📋 Expand Code</summary>

```typescript
import { ChangeEvent, FC, useState } from "react";
import { validatePostalCode, getCountryByCode, getAllCountries, Country, CountryCode } from "postal-code-checker";

const PostalCodeValidator: FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const country = getCountryByCode(e.target.value as CountryCode);
    setSelectedCountry(country);
    setIsValid(null);
    setPostalCode("");
  };

  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setPostalCode(code);
    if (selectedCountry) {
      setIsValid(validatePostalCode(selectedCountry.countryCode, code));
    }
  };

  return (
    <div>
      <select onChange={handleCountryChange}>
        <option value="">Select a country</option>
        {getAllCountries().map((country) => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.countryName}
          </option>
        ))}
      </select>
      <input type="text" value={postalCode} onChange={handlePostalCodeChange} placeholder="Enter postal code" />
      {isValid !== null && <p>{isValid ? "Valid postal code" : "Invalid postal code"}</p>}
    </div>
  );
};

export default PostalCodeValidator;
```

</details>

### React Example (JSX)

<details>
  <summary> 📋 Expand Code</summary>

```javascript
import { useState } from "react";
import { validatePostalCode, getCountryByCode, getAllCountries } from "postal-code-checker";

const PostalCodeValidator = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [isValid, setIsValid] = useState(null);

  const handleCountryChange = (e) => {
    const country = getCountryByCode(e.target.value);
    setSelectedCountry(country);
    setIsValid(null);
    setPostalCode("");
  };

  const handlePostalCodeChange = (e) => {
    const code = e.target.value;
    setPostalCode(code);
    if (selectedCountry) {
      setIsValid(validatePostalCode(selectedCountry.countryCode, code));
    }
  };

  return (
    <div>
      <select onChange={handleCountryChange}>
        <option value="">Select a country</option>
        {getAllCountries().map((country) => (
          <option key={country.countryCode} value={country.countryCode}>
            {country.countryName}
          </option>
        ))}
      </select>
      <input type="text" value={postalCode} onChange={handlePostalCodeChange} placeholder="Enter postal code" />
      {isValid !== null && <p>{isValid ? "Valid postal code" : "Invalid postal code"}</p>}
    </div>
  );
};

export default PostalCodeValidator;
```

</details>

## 🔧 Compatibility

Apart from the usage examples shown above, this package can be seamlessly integrated with any JavaScript framework or library, including but not limited to Angular, Vue.js, Next.js, and many more. The flexible design of `postal-code-checker` ensures it can be easily incorporated into your project, regardless of your chosen tech stack.

## 📚 API Reference

### `validatePostalCode(countryCode, postalCode): boolean`

Validates a single postal code against a country. Accepts both alpha-2 and
alpha-3 ISO 3166-1 codes, and normalizes the postal-code input by trimming
surrounding whitespace and uppercasing letters before matching.

### `validatePostalCodes(countryCode, postalCodes): boolean[]`

Validates an array of postal codes against one country and returns an
index-aligned array of boolean results.

### `getCountryByCode(countryCode): Country | null`

Returns the full country record (regex, example codes, name, 2-letter code)
or `null` if the country is unknown. Accepts alpha-2 or alpha-3 codes.

### `getAllCountries(): CountryOption[]`

Returns an array of `{ countryName, countryCode }` for every supported
country.

### `usePostalCodeValidation()` _(deprecated since 1.1.0)_

Returns an object with a `validatePostalCode` method. Retained for backward
compatibility; delegates to the top-level `validatePostalCode`. Will be
removed in 2.0.

## 🔄 Migration Guide

### From `usePostalCodeValidation` (v1.0.x) → `validatePostalCode` (v1.1.0+)

**Before:**

```js
import { usePostalCodeValidation } from "postal-code-checker";

const { validatePostalCode } = usePostalCodeValidation();
const isValid = validatePostalCode("US", "12345");
```

**After:**

```js
import { validatePostalCode } from "postal-code-checker";

const isValid = validatePostalCode("US", "12345");
```

### Why the change?

The `usePostalCodeValidation` name followed the React hook naming
convention, which confused non-React users and could trigger React's
`react-hooks/rules-of-hooks` lint rule even though the function is not an
actual hook. The new direct API works identically in React, Node.js, Vue,
Angular, Svelte, or plain JavaScript — no hook semantics apply.

### Backward compatibility

`usePostalCodeValidation` still exists in 1.1.0 and delegates to the new
implementation, so existing code keeps working and automatically benefits
from 1.1.0 improvements (case-insensitive input, alpha-3 support). It will
be removed in 2.0, giving you a full major-version window to migrate.

## 🏷️ Types

```typescript
type CountryCode = string; // ISO 3166-1 alpha-2 (e.g. "US") or alpha-3 (e.g. "USA")

type Country = {
  postalCodeRegex: string;
  examplePostalCodes: string[];
  isGenericRegex: boolean;
  countryName: string;
  countryCode: CountryCode;
};
```

## 🗺️ Our Roadmap

### ✅ Shipped

- [x] Add unit tests for all utility functions _(1.1.0)_
- [x] Add batch validation for multiple postal codes _(1.1.0)_
- [x] Case-insensitive and whitespace-tolerant input handling _(1.1.0)_
- [x] ISO 3166-1 alpha-3 country code support _(1.1.0)_

### 🔜 Planned

- [ ] Use regex pattern information to generate examples and drop hard coded examples from resource to reduce package size
- [ ] Move to pure css styles at dev sandbox (live dev playground) & drop antd library usage to reduce package size
- [ ] Implement more specific regex patterns for countries currently using generic patterns
- [ ] Add support for state/province validation for countries
- [ ] Create a demo website with interactive examples
- [ ] Add support for custom regex patterns and country data
- [ ] Optimize package size and performance
- [ ] Add internationalization support for country names
- [ ] Implement reverse lookup functionality (postal code to country/region)
- [ ] Add postal code validation with additional context (city, region)
- [ ] Implement partial matching and suggestion functionality
- [ ] Add historical postal code validation
- [ ] Allow custom error messages for different validation scenarios
- [ ] Implement postal code type identification (residential, commercial, etc.)
- [ ] Accept custom resource as config and override/merge inbuilt resource

## 🤝 Contributing

Pull requests are welcome.

When contributing, please follow these guidelines:

1.  Always start by checking out from the `master` branch:
    <details>
       <summary> 📋 Show More</summary>

    ```
    git checkout master
    git pull
    git checkout -b your-branch-name
    ```

    </details>

2.  Use meaningful names for your branches. Follow these patterns:
    <details>
      <summary> 📋 Show Examples</summary>

    - For bug fixes:

      ```
      bugfix/short-description-of-the-fix
      ```

      Example: `bugfix/fix-null-return-australia-code`

    - For new features or improvements:

      ```
      feature/short-description-of-feature
      ```

      Example: `feature/add-getAllCountries-unit-test`

    </details>

3.  Please make sure to update tests as appropriate.

4.  Ensure your code follows the project's coding standards and conventions.

5.  Write clear, concise commit messages describing your changes.

6.  Update or add unit tests to cover your changes.

We appreciate your contributions to making `postal-code-checker` better!

## 📊 Data Sources

Postal code data used in this project is sourced from the European Central Bank (ECB).

Note : This data has been processed and reformatted for use in this project.

- Source: [\[ECB\]](https://www.ecb.europa.eu/)
- Retrieved on: 4th AUG 2024

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
