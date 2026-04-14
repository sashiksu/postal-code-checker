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

## 📦 Installation

```bash
npm install postal-code-checker
```

## 🚀 Usage

### Basic Example

<details open>
  <summary> 📋 Code</summary>

```javascript
// Import according to your requirement, we support both ES6 and CommonJS
import { usePostalCodeValidation, getCountryByCode, getAllCountries, Country, CountryCode } from "postal-code-checker";
// OR
const {
  usePostalCodeValidation,
  getCountryByCode,
  getAllCountries,
  Country,
  CountryCode,
} = require("postal-code-checker");

const { validatePostalCode } = usePostalCodeValidation();

// Validate a postal code
const isValid = validatePostalCode("US", "12345"); // Returns true

// Get country information
const country = getCountryByCode("US");
console.log(country.countryName); // "United States of America"

// Get all available countries
const countries = getAllCountries();
```

</details>

### NodeJS Example

<details>
  <summary> 📋 Expand Code</summary>

```javascript
const { usePostalCodeValidation } = require("postal-code-checker");
const { validatePostalCode } = usePostalCodeValidation();

// Validate a postal code
const isValid = validatePostalCode("US", "12345"); // Returns true

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
import { usePostalCodeValidation, getCountryByCode, getAllCountries, Country, CountryCode } from "postal-code-checker";

const PostalCodeValidator: FC = () => {
  const { validatePostalCode } = usePostalCodeValidation();
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
import { usePostalCodeValidation, getCountryByCode, getAllCountries } from "postal-code-checker";

const PostalCodeValidator = () => {
  const { validatePostalCode } = usePostalCodeValidation();
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

### `usePostalCodeValidation()`

Returns an object with the following methods:

- `validatePostalCode(countryCode: CountryCode, postalCode: string): boolean`

### Util Functions

Returns an object with the following methods:

- `getCountryByCode(countryCode: CountryCode): Country | null`
- `getAllCountries(): Array<{ countryName: string, countryCode: CountryCode }>`

## 🏷️ Types

```typescript
type CountryCode = string; // ISO 3166-1 alpha-2 country code

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
