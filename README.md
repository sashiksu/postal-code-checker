# postal-code-checker

`postal-code-checker` is a JavaScript based postal code validation package.

## Installation

```bash
npm install postal-code-checker
```

## Usage

The `usePostalCodeValidation` hook provides functions for country selection and postal code validation. Here's how to use it:

```typescript
import { usePostalCodeValidation } from "your-package-name";
const YourComponent = () => {
  const { validatePostalCode, getCountryByCode, getAllCountries } = usePostalCodeValidation();

  // Get all countries
  const countries = getAllCountries();

  // Get a specific country by code
  const country = getCountryByCode("US");

  // Validate a postal code
  const isValid = validatePostalCode("US", "12345");
};
```

## Available Functions

1. `getAllCountries()`: Returns an array of all available countries.
2. `getCountryByCode(code: CountryCode)`: Returns a country object for the given country code.
3. `validatePostalCode(countryCode: CountryCode, postalCode: string)`: Validates a postal code for the specified country.

## Example: Country Selection and Postal Code Validation in React

```typescript
const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
const [isPostalCodeValid, setIsPostalCodeValid] = useState<boolean | null>(null);
const [postalCode, setPostalCode] = useState<string>("");

const handleCountryChange = (value: string) => {
  const country = getCountryByCode(value as CountryCode);
  setSelectedCountry(country);
  setIsPostalCodeValid(null);
  setPostalCode("");
};

const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
  const postalCode = e.target.value;
  setPostalCode(postalCode);
  if (selectedCountry) {
    const isValid = validatePostalCode(selectedCountry.code, postalCode);
    setIsPostalCodeValid(isValid);
  }
};
```

This example demonstrates how to use the hook for country selection and real-time postal code validation in a form.

## Roadmap

- [x] Initial release
- [ ] Add unit test for initial release
- [ ] Moving from json file's examples to regex pattern
- [ ] Write unit tests for all functions
- [ ] Add examples
- [ ] Create a GitHub Pages site for documentation
- [ ] Accept custom resource file and override default json file
- [ ] Extend postal codes to state/province
- [ ] Return state/province name from based on regex

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
