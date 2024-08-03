# postal-code-checker

`postal-code-checker` is a comprehensive JavaScript/TypeScript package for validating postal codes across multiple countries. It provides an easy-to-use API for country selection and postal code validation, making it ideal for forms and address validation in web applications.

## Features

- Supports postal code validation for over 200 countries
- Provides country selection functionality
- Includes example postal codes for supported countries
- TypeScript support with type definitions
- Lightweight and easy to integrate

## Installation

```bash
npm install postal-code-checker
```

## Usage

### Basic Usage

```typescript
import { usePostalCodeValidation, getCountryByCode, getAllCountries } from "postal-code-checker";

const { validatePostalCode } = usePostalCodeValidation();

// Validate a postal code
const isValid = validatePostalCode("US", "12345"); // Returns true

// Get country information
const country = getCountryByCode("US");
console.log(country.countryName); // "United States of America"

// Get all available countries
const countries = getAllCountries();
```

### React Example

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

## API Reference

`usePostalCodeValidation()`

Returns an object with the following methods:

- `validatePostalCode(countryCode: CountryCode, postalCode: string): boolean`
- `getCountryByCode(countryCode: CountryCode): Country | null`
- `getAllCountries(): Array<{ countryName: string, countryCode: CountryCode }>`

## Types

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

## Our Roadmap

- [ ] Use regex pattern information to generate examples and drop hard coded examples
- [ ] Move to pure css styles at dev sandbox (live dev playground) & drop antd library usage to reduce package size
- [ ] Implement more specific regex patterns for countries currently using generic patterns
- [ ] Add support for state/province validation
- [ ] Create a demo website with interactive examples
- [ ] Implement address formatting for different countries
- [ ] Add support for custom regex patterns and country data
- [ ] Optimize package size and performance
- [ ] Add internationalization support for country names and error messages
- [ ] Implement reverse lookup functionality (postal code to country/region)
- [ ] Integrate geolocation data for postal codes
- [ ] Add postal code validation with additional context (city, region)
- [ ] Implement custom regex support for users
- [ ] Add postal code generation feature for testing
- [ ] Implement partial matching and suggestion functionality
- [ ] Add historical postal code validation
- [ ] Integrate with popular address autocomplete APIs
- [ ] Develop an offline mode with a subset of countries
- [ ] Implement postal code distance calculation
- [ ] Add batch validation for multiple postal codes
- [ ] Allow custom error messages for different validation scenarios
- [ ] Implement postal code type identification (residential, commercial, etc.)
- [ ] Add unit tests for all utility functions

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
