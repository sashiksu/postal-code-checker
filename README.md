# postal-code-validation

`postal-code-validation` is a JavaScript based postal code validation package.

## Installation

Use the package manager [pip](https://pip.pypa.io/en/stable/) to install foobar.

```bash
npm install postal-code-validation
```

## Usage

```python
import {postalValidation} from 'postal-code-validation'

# destructure from postalValidation
const { countryName, exampleMask } = postalValidation(countryCode);

console.log(countryName, exampleMask)
United States, #####, [#####-####]
```

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